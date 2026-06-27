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
};

/* Retrouve (ou crée à la volée) l'identifiant de club correspondant
   à un nom d'équipe venant des données en direct. */
function resolveLiveClubId(name) {
  if (!name) return null;
  if (LIVE_NAME_ALIASES[name]) return LIVE_NAME_ALIASES[name];

  const norm = normalize(name);
  for (const [id, club] of Object.entries(CLUBS)) {
    if (normalize(club.name) === norm) return id;
  }

  // Aucune correspondance : on crée une entrée minimale à la volée
  // (le site affichera le nom tel quel, sans stade connu pour l'instant).
  const newId = "live-" + norm.replace(/[^a-z0-9]+/g, "-");
  if (!CLUBS[newId]) {
    CLUBS[newId] = { name, short: name, league: null, stadium: null, site: null };
  }
  return newId;
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
      const league = LIVE_LEAGUE_MAP[m.competition];
      if (!league) return;
      const home = resolveLiveClubId(m.home);
      const away = resolveLiveClubId(m.away);
      if (!home || !away || !m.date) return;

      MATCHES.push({
        id: `live-${league}-${m.round || "x"}-${i}`,
        league,
        competition: `${m.competition} 2025/2026 — Journée ${m.round || "?"} (test, calendrier en direct)`,
        date: m.date,
        time: null,
        home,
        away,
        stadium: CLUBS[home] ? CLUBS[home].stadium : null,
        status: isFutureDate(m.date) ? "upcoming" : "played",
        note: "Donnée de test issue du calendrier en direct (échantillon limité, voir À propos).",
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
