/* ============================================================
   live.js — Calendrier en direct (TEST)
   Charge live-calendar.json (généré automatiquement par
   scripts/update_calendar.py via l'API TheSportsDB) et fusionne
   ses matchs dans MATCHES, en réutilisant les clubs déjà connus
   de data.js quand c'est possible.

   Limitation connue : l'API gratuite plafonne à 15 matchs par
   compétition (sur ~188 pour le TOP14 et ~245 pour le Pro D2) —
   ceci est un test de bout en bout, pas encore le calendrier
   complet en direct.
   ============================================================ */

/* Correspondances connues entre les noms d'équipes de TheSportsDB
   et les identifiants de clubs déjà utilisés dans data.js, pour
   les cas où les noms ne sont pas exactement identiques. */
const LIVE_NAME_ALIASES = {
  "Lyon OU": "lou",
  "Racing Métro 92": "racing92",
  "RC Toulonnais": "rct",
  "Stade Toulousain Rugby": "toulouse_r",
};

const LIVE_LEAGUE_MAP = {
  "TOP 14": "top14",
  "Pro D2": "prod2",
  "Nationale (rugby)": "nationale_rugby",
  "Ligue 1": "ligue1",
  "Ligue 2": "ligue2",
  "Championnat National": "national",
  "Starligue": "starligue",
  "Betclic Élite": "betclic",
  "Pro B / Élite 2": "eliteb",
  "La Boulangère Wonderligue": "lfb",
  "Marmara SpikeLigue": "marmara",
  "Ligue AF": "ligueaf",
  "Ligue Magnus": "magnus",
  "Arkema Première Ligue": "arkema",
  "UEFA Champions League": "uefacl",
  "UEFA Europa League": "uefael",
  "UEFA Conference League": "uefaconf",
  "Champions Cup (rugby)": "rugbycc",
  "Challenge Cup (rugby)": "rugbychall",
  "Euroleague (basket)": "euroleague",
  "EuroCup (basket)": "eurocup",
  "Basketball Champions League": "bcl",
  "Champions Hockey League": "chl",
  "EHF Champions League": "ehfcl",
  "EHF Champions League (F)": "ehfcl_f",
  "EHF European League": "ehfel",
  "CEV Champions League (volley)": "cevcl",
};

/* Les équipes de France sont gérées à part : ce ne sont pas des clubs
   (donc pas de stade fixe — le lieu change à chaque match), et
   l'adversaire est un pays, pas un club de data.js. */
const NATIONAL_TEAM_LEAGUES = {
  "France Rugby (H)": "fra_rugby_h",
  "France Rugby (F)": "fra_rugby_f",
  "France Football (H)": "fra_foot_h",
  "France Football (F)": "fra_foot_f",
  "France Handball (H)": "fra_hand_h",
  "France Basketball (H)": "fra_basket_h",
  "France Basketball (F)": "fra_basket_f",
};

/* Retrouve (ou crée à la volée) l'identifiant de club correspondant
   à un nom d'équipe venant des données en direct, DANS LE CONTEXTE
   d'une ligue précise (pour éviter qu'un nom de club d'un sport ne
   soit confondu avec un club au nom proche d'un autre sport — par
   exemple "AS Monaco" au football et "AS Monaco Basket"). Essaie,
   dans l'ordre :
   1. un alias connu manuellement (cas particuliers déjà repérés)
   2. une correspondance exacte sur le nom complet, dans la même ligue
   3. une correspondance exacte sur le nom court, dans la même ligue
   4. une correspondance "floue" (l'un contient l'autre), toujours
      dans la même ligue uniquement
   Seulement si rien ne marche, on crée une fiche club minimale sans
   stade connu (le match restera affiché, juste sans lieu précis). */
function resolveLiveClubId(name, leagueKey) {
  if (!name) return null;
  if (LIVE_NAME_ALIASES[name]) return LIVE_NAME_ALIASES[name];

  const norm = normalize(name);
  const sameLeague = ([, club]) => !leagueKey || club.league === leagueKey;

  for (const [id, club] of Object.entries(CLUBS).filter(sameLeague)) {
    if (normalize(club.name) === norm) return id;
  }
  for (const [id, club] of Object.entries(CLUBS).filter(sameLeague)) {
    if (club.short && normalize(club.short) === norm) return id;
  }
  if (norm.length >= 5) {
    for (const [id, club] of Object.entries(CLUBS).filter(sameLeague)) {
      const cn = normalize(club.name);
      const cs = club.short ? normalize(club.short) : "";
      if ((cn.length >= 5 && (cn.includes(norm) || norm.includes(cn))) ||
          (cs.length >= 5 && (cs.includes(norm) || norm.includes(cs)))) {
        return id;
      }
    }
  }

  // Aucune correspondance : on crée une entrée minimale à la volée
  // (le site affichera le nom tel quel, sans stade connu pour l'instant).
  const newId = "live-" + norm.replace(/[^a-z0-9]+/g, "-");
  if (!CLUBS[newId]) {
    CLUBS[newId] = { name, short: name, league: leagueKey || null, stadium: null, site: null };
  }
  return newId;
}

/* Crée (si besoin) une fiche minimale pour une équipe qui n'est pas
   un club de data.js — typacalement un pays adverse d'une équipe de
   France. Pas de filtrage par ligue ici : un pays reste le même
   quel que soit le sport. */
function ensureGenericTeam(name) {
  if (!name) return null;
  const norm = normalize(name);
  for (const [id, club] of Object.entries(CLUBS)) {
    if (normalize(club.name) === norm) return id;
  }
  const newId = "live-team-" + norm.replace(/[^a-z0-9]+/g, "-");
  if (!CLUBS[newId]) {
    CLUBS[newId] = { name, short: name, league: null, stadium: null, site: null };
  }
  return newId;
}

/* Crée (si besoin) une fiche stade minimale à partir d'un nom de lieu
   brut renvoyé par l'API (utile pour les matchs internationaux, dont
   le lieu change à chaque rencontre, contrairement à un club). */
function ensureGenericStadium(venueName) {
  if (!venueName) return null;
  const key = "live-stadium-" + normalize(venueName).replace(/[^a-z0-9]+/g, "-");
  if (!STADIUMS[key]) {
    STADIUMS[key] = { name: venueName, city: "", capacity: null };
  }
  return key;
}

function isFutureDate(dateStr) {
  if (!dateStr) return true;
  return new Date(dateStr + "T00:00:00") >= new Date(new Date().toDateString());
}

async function loadLiveCalendar() {
  try {
    const res = await fetch("live-calendar.json");
    if (!res.ok) {
      console.warn("Calendrier en direct indisponible (HTTP " + res.status + ")");
      return;
    }
    const data = await res.json();
    const liveMatches = data.matches || [];

    let added = 0;
    liveMatches.forEach((m, i) => {
      const isNationalTeam = NATIONAL_TEAM_LEAGUES[m.competition];
      const league = isNationalTeam || LIVE_LEAGUE_MAP[m.competition];
      if (!league || !m.date) return;

      let home, away, stadium, note;
      if (isNationalTeam) {
        // Équipe nationale : pas de club de data.js, le lieu varie à chaque match.
        home = ensureGenericTeam(m.home);
        away = ensureGenericTeam(m.away);
        stadium = ensureGenericStadium(m.venue);
        note = "Donnée de test issue du calendrier en direct.";
      } else {
        home = resolveLiveClubId(m.home, league);
        away = resolveLiveClubId(m.away, league);
        stadium = CLUBS[home] ? CLUBS[home].stadium : null;
        note = "Donnée de test issue du calendrier en direct (échantillon limité, voir À propos).";
      }
      if (!home || !away) return;

      MATCHES.push({
        id: `live-${league}-${m.round || "x"}-${i}`,
        league,
        competition: isNationalTeam
          ? `${m.competition}${m.round ? " — " + m.round : ""} (test, calendrier en direct)`
          : `${m.competition} 2025/2026 — Journée ${m.round || "?"} (test, calendrier en direct)`,
        date: m.date,
        time: null,
        home,
        away,
        stadium,
        status: isFutureDate(m.date) ? "upcoming" : "played",
        note,
      });
      added++;
    });

    console.log(`Calendrier en direct : ${added} matchs ajoutés (généré le ${data.generated_at}).`);

    // Si la page est déjà initialisée, on rafraîchit l'affichage.
    if (typeof renderBoard === "function") renderBoard();
    if (typeof renderLeaguesStrip === "function") renderLeaguesStrip();
  } catch (e) {
    console.warn("Impossible de charger le calendrier en direct :", e);
  }
}
