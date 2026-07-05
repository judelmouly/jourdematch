/* ============================================================
   TABLEAU DE BORD — logique
   ============================================================ */

const state = {
  query: "",
  filter: "all",   // all | ligue1 | top14 | upcoming | played
  searchMode: "all", // all | lieu | club | competition
  sportFilter: null,  // null = tous, sinon ex: "foot", "rugby", "basket"...
};

const MONTHS_SHORT = ["JAN","FEV","MAR","AVR","MAI","JUN","JUL","AOU","SEP","OCT","NOV","DEC"];

/* Configuration des sports pour la frise cliquable et les tags colorés */
const SPORTS_CONFIG = [
  { key: "foot",   icon: "⚽", label: "Football",  keywords: ["football","ligue 1","ligue 2","national","arkema","uefa","conference"] },
  { key: "rugby",  icon: "🏉", label: "Rugby",     keywords: ["rugby","top 14","pro d2","nationale","champions cup","challenge cup"] },
  { key: "basket", icon: "🏀", label: "Basket",    keywords: ["basket","betclic","pro b","boulangère","euroleague","eurocup","bcl"] },
  { key: "hand",   icon: "🤾", label: "Handball",  keywords: ["handball","starligue","butagaz","ehf"] },
  { key: "volley", icon: "🏐", label: "Volley",    keywords: ["volley","marmara","ligue af","cev"] },
  { key: "hockey", icon: "🏒", label: "Hockey",    keywords: ["hockey","magnus","chl"] },
  { key: "tennis", icon: "🎾", label: "Tennis",    keywords: ["tennis","roland","paris masters","montpellier open","lyon open"] },
  { key: "france", icon: "🇫🇷", label: "Équipes FR", keywords: ["france rugby","france football","france basket","france handball","france volleyball"] },
];

function getSportKey(leagueKey, leagueName) {
  const n = normalize((leagueName || "") + " " + (leagueKey || ""));
  for (const s of SPORTS_CONFIG) {
    if (s.keywords.some(k => n.includes(normalize(k)))) return s.key;
  }
  return "autre";
}
const MONTHS_LONG = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const DAYS_LONG = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];

function parseDate(d) {
  if (!d) return null;
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function flapParts(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return { day: "—", month: "TBA" };
  return { day: String(d.getDate()).padStart(2, "0"), month: MONTHS_SHORT[d.getMonth()] };
}

function longDate(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return "Date à confirmer";
  return `${DAYS_LONG[d.getDay()]} ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}

function clubName(id) {
  return id && CLUBS[id] ? CLUBS[id].name : "À déterminer";
}
function clubShort(id) {
  return id && CLUBS[id] ? CLUBS[id].short : "—";
}
function stadiumOf(id) {
  return id && STADIUMS[id] ? STADIUMS[id] : null;
}

/* -------------------- recherche -------------------- */
/* Construit 3 champs de recherche séparés pour un même match :
   - lieu : uniquement le VRAI lieu où se joue ce match (le stade du
     club recevant, m.stadium) — pas les stades des deux clubs en
     général, sinon "Toulouse" ressortirait aussi pour un match que
     Toulouse joue à l'extérieur.
   - club : les noms des deux équipes, où qu'elles jouent.
   - competition : le nom de la compétition / sport / ligue. */
function matchSearchFields(m) {
  const venueParts = [];
  // Si le match n'a pas de stade explicite, on se rabat sur le stade
  // habituel du club qui reçoit (cohérent avec l'affichage du tableau).
  const venueId = m.stadium || (m.home && CLUBS[m.home] ? CLUBS[m.home].stadium : null);
  if (venueId && STADIUMS[venueId]) {
    venueParts.push(STADIUMS[venueId].name, STADIUMS[venueId].city);
  }

  const clubParts = [];
  [m.home, m.away].forEach((cid) => {
    if (cid && CLUBS[cid]) {
      clubParts.push(CLUBS[cid].name, CLUBS[cid].short);
    }
  });

  const compParts = [m.competition, LEAGUES[m.league]?.name, LEAGUES[m.league]?.sport];

  return {
    lieu: normalize(venueParts.filter(Boolean).join(" ")),
    club: normalize(clubParts.filter(Boolean).join(" ")),
    competition: normalize(compParts.filter(Boolean).join(" ")),
  };
}

function matchMatchesQuery(m, q, mode) {
  if (!q) return true;
  const fields = matchSearchFields(m);
  if (mode === "lieu") return fields.lieu.includes(q);
  if (mode === "club") return fields.club.includes(q);
  if (mode === "competition") return fields.competition.includes(q);
  // mode "all" : on cherche dans les trois, mais chacun isolément
  // (donc "Toulouse" trouve toujours les matchs JOUÉS à Toulouse,
  // et SÉPARÉMENT les matchs où Toulouse est une des deux équipes —
  // pas un mélange des deux qui ferait remonter de faux résultats).
  return fields.lieu.includes(q) || fields.club.includes(q) || fields.competition.includes(q);
}

function getFilteredMatches() {
  const q = normalize(state.query);
  return MATCHES.filter((m) => {
    if (state.filter === "ligue1" && m.league !== "ligue1") return false;
    if (state.filter === "top14" && m.league !== "top14") return false;
    if (state.filter === "upcoming" && m.status !== "upcoming") return false;
    if (state.filter === "played" && m.status !== "played") return false;
    if (state.sportFilter) {
      const sk = getSportKey(m.league, LEAGUES[m.league]?.name);
      if (sk !== state.sportFilter) return false;
    }
    if (!matchMatchesQuery(m, q, state.searchMode)) return false;
    return true;
  }).sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
}

/* Rendu du tag sport coloré */
function sportTag(leagueKey) {
  const sk = getSportKey(leagueKey, LEAGUES[leagueKey]?.name);
  const cfg = SPORTS_CONFIG.find(s => s.key === sk);
  const label = cfg ? (cfg.label === "Équipes FR" ? "🇫🇷 France" : cfg.icon + " " + cfg.label) : "🏆 Sport";
  return `<span class="tag-sport ${sk}">${label}</span>`;
}

/* -------------------- rendu : tableau (board) -------------------- */
function renderBoard() {
  const board = document.getElementById("board");
  const matches = getFilteredMatches();
  const titleEl = document.getElementById("board-title");
  const countEl = document.getElementById("board-count");

  countEl.textContent = matches.length + (matches.length === 1 ? " match" : " matchs");
  titleEl.textContent = state.query ? `Résultats pour « ${state.query} »` : "Tous les matchs";

  if (matches.length === 0) {
    board.innerHTML = `
      <div class="empty-state">
        <div class="big">Aucun match trouvé</div>
        <p>Essayez une autre ville, un autre stade ou un autre club — ou élargissez les filtres ci-dessus.</p>
      </div>`;
    return;
  }

  const rows = matches.map((m) => {
    const fp = flapParts(m.date);
    const sport = LEAGUES[m.league]?.sport === "Rugby à XV" ? "rugby" : "foot";
    const homeLabel = m.home ? clubShort(m.home) : "À définir";
    const awayLabel = m.away ? clubShort(m.away) : "";
    const stadiumId = m.stadium || (m.home ? CLUBS[m.home]?.stadium : null);
    const st = stadiumOf(stadiumId);
    const venueText = st ? `<b>${st.name}</b> — ${st.city}` : "Lieu à confirmer";

    let statusHtml;
    if (m.status === "played" && m.score && m.score.home != null) {
      statusHtml = `<span class="score">${m.score.home} – ${m.score.away}</span><br><span class="badge played">Joué</span>`;
    } else if (m.status === "played") {
      statusHtml = `<span class="badge played">Joué</span>`;
    } else {
      statusHtml = `<span class="badge upcoming">À venir</span>`;
    }

    return `
      <div class="board-row" data-id="${m.id}" role="button" tabindex="0">
        <div class="flap">${fp.day}<small>${fp.month}${m.time ? " · " + m.time : ""}</small></div>
        <div class="match-info">
          <div class="match-teams">${homeLabel}${awayLabel ? `<span class="vs">vs</span>${awayLabel}` : ""}</div>
          <div class="match-comp">${sportTag(m.league)}${m.competition}</div>
        </div>
        <div class="match-venue">${venueText}</div>
        <div class="match-status">${statusHtml}</div>
      </div>`;
  }).join("");

  board.innerHTML = `
    <div class="board-row-head">
      <div>Date</div><div>Match</div><div>Lieu</div><div style="text-align:right;">Statut</div>
    </div>
    ${rows}`;

  board.querySelectorAll(".board-row").forEach((row) => {
    row.addEventListener("click", () => { location.hash = `#/match/${row.dataset.id}`; });
    row.addEventListener("keypress", (e) => { if (e.key === "Enter") location.hash = `#/match/${row.dataset.id}`; });
  });
}

/* -------------------- rendu : bandeau compétitions -------------------- */
/* ============================================================
   ILLUSTRATIONS LATÉRALES — silhouettes SVG par sport
   ============================================================ */
const SPORT_ILLUS = {
  foot: {
    left: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="fg-l" x1="1" x2="0" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 110 Q80 60 230 90" fill="none" stroke="#4a6055" stroke-width="1.2"/><path d="M-10 118 Q80 68 230 98" fill="none" stroke="#3a4d42" stroke-width="0.6"/><line x1="20" y1="112" x2="15" y2="175" stroke="#3a4d42" stroke-width="0.6"/><line x1="55" y1="100" x2="50" y2="170" stroke="#3a4d42" stroke-width="0.6"/><line x1="95" y1="88" x2="90" y2="162" stroke="#3a4d42" stroke-width="0.6"/><line x1="140" y1="82" x2="138" y2="158" stroke="#3a4d42" stroke-width="0.6"/><path d="M-10 400 L-10 175 Q30 155 80 148 Q140 140 200 148 L230 155 L230 400 Z" fill="#111a15"/><path d="M-10 175 Q30 155 80 148 Q140 140 200 148 L230 155" fill="none" stroke="#4a6055" stroke-width="1"/><line x1="-5" y1="190" x2="225" y2="188" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="210" x2="225" y2="208" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="230" x2="225" y2="229" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="250" x2="225" y2="250" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="270" x2="225" y2="271" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="290" x2="225" y2="292" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="310" x2="225" y2="313" stroke="#25342c" stroke-width="0.5"/><circle cx="20" cy="112" r="3.5" fill="#ffc857" opacity="0.8"/><circle cx="55" cy="100" r="3" fill="#ffc857" opacity="0.6"/><circle cx="95" cy="88" r="2.5" fill="#ffc857" opacity="0.5"/><ellipse cx="110" cy="380" rx="95" ry="14" fill="#152318" opacity="0.6"/><rect width="220" height="400" fill="url(#fg-l)"/></svg>`,
    right: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="fg-r" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 130 Q50 100 110 95 Q170 90 230 105 L230 400 Z" fill="#111a15"/><path d="M-10 130 Q50 100 110 95 Q170 90 230 105" fill="none" stroke="#4a6055" stroke-width="1.2"/><circle cx="150" cy="190" r="42" fill="none" stroke="#3a4d42" stroke-width="1.2"/><path d="M150 148 L165 165 L155 185 L135 185 L125 165 Z" fill="none" stroke="#4a6055" stroke-width="0.8"/><path d="M192 175 L172 168 L165 185 L175 203 L196 200 Z" fill="none" stroke="#4a6055" stroke-width="0.8"/><path d="M174 218 L162 200 L142 200 L132 218 L150 230 Z" fill="none" stroke="#4a6055" stroke-width="0.8"/><rect x="30" y="280" width="60" height="35" fill="none" stroke="#3a4d42" stroke-width="1"/><line x1="30" y1="280" x2="90" y2="280" stroke="#4a6055" stroke-width="1.2"/><line x1="30" y1="285" x2="10" y2="310" stroke="#25342c" stroke-width="0.4"/><line x1="60" y1="280" x2="50" y2="340" stroke="#25342c" stroke-width="0.4"/><line x1="90" y1="285" x2="108" y2="315" stroke="#25342c" stroke-width="0.4"/><line x1="10" y1="318" x2="110" y2="318" stroke="#25342c" stroke-width="0.4"/><rect width="220" height="400" fill="url(#fg-r)"/></svg>`,
  },
  rugby: {
    left: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rg-l" x1="1" x2="0" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><ellipse cx="110" cy="80" rx="130" ry="70" fill="none" stroke="#3a4d42" stroke-width="0.6"/><path d="M-10 400 L-10 200 Q60 165 110 158 Q165 150 230 165 L230 400 Z" fill="#111a15"/><path d="M-10 200 Q60 165 110 158 Q165 150 230 165" fill="none" stroke="#4a6055" stroke-width="1.2"/><line x1="60" y1="50" x2="60" y2="250" stroke="#4a6055" stroke-width="2"/><line x1="90" y1="100" x2="90" y2="250" stroke="#4a6055" stroke-width="2"/><line x1="45" y1="100" x2="105" y2="100" stroke="#4a6055" stroke-width="2"/><line x1="-5" y1="218" x2="225" y2="216" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="238" x2="225" y2="237" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="258" x2="225" y2="258" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="278" x2="225" y2="280" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="298" x2="225" y2="302" stroke="#25342c" stroke-width="0.5"/><line x1="170" y1="60" x2="170" y2="140" stroke="#4a6055" stroke-width="1"/><polygon points="170,60 195,70 170,80" fill="#c4432d" opacity="0.5"/><circle cx="20" cy="160" r="3" fill="#ffc857" opacity="0.7"/><circle cx="195" cy="158" r="3" fill="#ffc857" opacity="0.7"/><rect width="220" height="400" fill="url(#rg-l)"/></svg>`,
    right: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rg-r" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 150 Q50 120 110 115 Q170 110 230 128 L230 400 Z" fill="#111a15"/><path d="M-10 150 Q50 120 110 115 Q170 110 230 128" fill="none" stroke="#4a6055" stroke-width="1.2"/><ellipse cx="130" cy="190" rx="22" ry="35" fill="none" stroke="#4a6055" stroke-width="1.2" transform="rotate(30 130 190)"/><line x1="112" y1="172" x2="148" y2="208" stroke="#3a4d42" stroke-width="0.6" transform="rotate(30 130 190)"/><line x1="50" y1="60" x2="50" y2="270" stroke="#4a6055" stroke-width="2"/><line x1="80" y1="110" x2="80" y2="270" stroke="#4a6055" stroke-width="2"/><line x1="35" y1="110" x2="95" y2="110" stroke="#4a6055" stroke-width="2"/><line x1="-5" y1="170" x2="225" y2="168" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="190" x2="225" y2="188" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="210" x2="225" y2="209" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="230" x2="225" y2="230" stroke="#25342c" stroke-width="0.5"/><rect width="220" height="400" fill="url(#rg-r)"/></svg>`,
  },
  basket: {
    left: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bk-l" x1="1" x2="0" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 180 Q40 120 110 100 Q175 82 230 105 L230 400 Z" fill="#111a15"/><path d="M-10 180 Q40 120 110 100 Q175 82 230 105" fill="none" stroke="#4a6055" stroke-width="1.4"/><path d="M0 165 Q55 118 115 106" fill="none" stroke="#3a4d42" stroke-width="0.7"/><path d="M15 172 Q68 128 128 118" fill="none" stroke="#3a4d42" stroke-width="0.6"/><line x1="-5" y1="205" x2="225" y2="200" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="225" x2="225" y2="222" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="245" x2="225" y2="244" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="265" x2="225" y2="266" stroke="#25342c" stroke-width="0.5"/><line x1="30" y1="160" x2="30" y2="310" stroke="#4a6055" stroke-width="1.5"/><line x1="30" y1="190" x2="75" y2="190" stroke="#4a6055" stroke-width="1"/><rect x="65" y="185" width="20" height="14" fill="none" stroke="#4a6055" stroke-width="0.8"/><ellipse cx="75" cy="202" rx="12" ry="5" fill="none" stroke="#ff8c42" stroke-width="1.2" opacity="0.7"/><circle cx="15" cy="162" r="3" fill="#ffc857" opacity="0.8"/><circle cx="105" cy="100" r="2.5" fill="#ffc857" opacity="0.6"/><rect width="220" height="400" fill="url(#bk-l)"/></svg>`,
    right: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bk-r" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 160 Q50 115 110 108 Q170 100 230 120 L230 400 Z" fill="#111a15"/><path d="M-10 160 Q50 115 110 108 Q170 100 230 120" fill="none" stroke="#4a6055" stroke-width="1.4"/><line x1="165" y1="120" x2="165" y2="310" stroke="#4a6055" stroke-width="1.5"/><line x1="120" y1="170" x2="165" y2="170" stroke="#4a6055" stroke-width="1"/><rect x="100" y="163" width="22" height="15" fill="none" stroke="#4a6055" stroke-width="0.8"/><ellipse cx="111" cy="181" rx="13" ry="5" fill="none" stroke="#ff8c42" stroke-width="1.5" opacity="0.8"/><circle cx="80" cy="240" r="25" fill="none" stroke="#3a4d42" stroke-width="1"/><path d="M57 240 Q80 220 103 240" fill="none" stroke="#4a6055" stroke-width="0.8"/><path d="M57 240 Q80 260 103 240" fill="none" stroke="#4a6055" stroke-width="0.8"/><line x1="80" y1="215" x2="80" y2="265" stroke="#4a6055" stroke-width="0.6"/><line x1="-5" y1="185" x2="225" y2="182" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="205" x2="225" y2="203" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="225" x2="225" y2="224" stroke="#25342c" stroke-width="0.5"/><rect width="220" height="400" fill="url(#bk-r)"/></svg>`,
  },
  hand: {
    left: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hd-l" x1="1" x2="0" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 165 Q50 130 110 122 Q170 115 230 132 L230 400 Z" fill="#111a15"/><path d="M-10 165 Q50 130 110 122 Q170 115 230 132" fill="none" stroke="#4a6055" stroke-width="1.2"/><rect x="20" y="250" width="80" height="55" fill="none" stroke="#4a6055" stroke-width="1.5"/><line x1="20" y1="258" x2="98" y2="262" stroke="#25342c" stroke-width="0.4"/><line x1="20" y1="268" x2="98" y2="272" stroke="#25342c" stroke-width="0.4"/><line x1="20" y1="278" x2="98" y2="283" stroke="#25342c" stroke-width="0.4"/><line x1="20" y1="288" x2="98" y2="294" stroke="#25342c" stroke-width="0.4"/><line x1="30" y1="250" x2="28" y2="305" stroke="#25342c" stroke-width="0.4"/><line x1="45" y1="250" x2="44" y2="305" stroke="#25342c" stroke-width="0.4"/><line x1="60" y1="250" x2="60" y2="305" stroke="#25342c" stroke-width="0.4"/><line x1="75" y1="250" x2="76" y2="305" stroke="#25342c" stroke-width="0.4"/><line x1="88" y1="250" x2="91" y2="305" stroke="#25342c" stroke-width="0.4"/><path d="M20 305 Q60 260 100 305" fill="none" stroke="#3a4d42" stroke-width="0.8" stroke-dasharray="4 3"/><line x1="-5" y1="183" x2="225" y2="180" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="200" x2="225" y2="198" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="217" x2="225" y2="216" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="234" x2="225" y2="234" stroke="#25342c" stroke-width="0.5"/><circle cx="20" cy="130" r="3" fill="#ffc857" opacity="0.7"/><circle cx="190" cy="128" r="3" fill="#ffc857" opacity="0.7"/><rect width="220" height="400" fill="url(#hd-l)"/></svg>`,
    right: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hd-r" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 155 Q50 118 110 110 Q170 102 230 122 L230 400 Z" fill="#111a15"/><path d="M-10 155 Q50 118 110 110 Q170 102 230 122" fill="none" stroke="#4a6055" stroke-width="1.2"/><rect x="115" y="240" width="85" height="58" fill="none" stroke="#4a6055" stroke-width="1.5"/><line x1="115" y1="248" x2="198" y2="252" stroke="#25342c" stroke-width="0.4"/><line x1="115" y1="258" x2="198" y2="262" stroke="#25342c" stroke-width="0.4"/><line x1="115" y1="268" x2="198" y2="273" stroke="#25342c" stroke-width="0.4"/><line x1="128" y1="240" x2="126" y2="298" stroke="#25342c" stroke-width="0.4"/><line x1="143" y1="240" x2="142" y2="298" stroke="#25342c" stroke-width="0.4"/><line x1="158" y1="240" x2="158" y2="298" stroke="#25342c" stroke-width="0.4"/><line x1="173" y1="240" x2="174" y2="298" stroke="#25342c" stroke-width="0.4"/><circle cx="65" cy="200" r="22" fill="none" stroke="#3a4d42" stroke-width="1"/><path d="M47 192 Q65 178 83 192" fill="none" stroke="#4a6055" stroke-width="0.7"/><path d="M47 208 Q65 222 83 208" fill="none" stroke="#4a6055" stroke-width="0.7"/><path d="M52 180 Q45 200 52 220" fill="none" stroke="#4a6055" stroke-width="0.7"/><path d="M78 180 Q85 200 78 220" fill="none" stroke="#4a6055" stroke-width="0.7"/><path d="M115 298 Q157 250 200 298" fill="none" stroke="#3a4d42" stroke-width="0.8" stroke-dasharray="4 3"/><line x1="-5" y1="173" x2="225" y2="170" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="190" x2="225" y2="188" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="207" x2="225" y2="206" stroke="#25342c" stroke-width="0.5"/><rect width="220" height="400" fill="url(#hd-r)"/></svg>`,
  },
  volley: {
    left: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="vl-l" x1="1" x2="0" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 158 Q50 122 110 115 Q170 108 230 126 L230 400 Z" fill="#111a15"/><path d="M-10 158 Q50 122 110 115 Q170 108 230 126" fill="none" stroke="#4a6055" stroke-width="1.2"/><line x1="10" y1="260" x2="210" y2="260" stroke="#4a6055" stroke-width="1.5"/><line x1="10" y1="255" x2="210" y2="255" stroke="#3a4d42" stroke-width="0.6"/><line x1="10" y1="240" x2="10" y2="340" stroke="#4a6055" stroke-width="1.5"/><line x1="210" y1="240" x2="210" y2="340" stroke="#4a6055" stroke-width="1.5"/><line x1="10" y1="264" x2="210" y2="264" stroke="#25342c" stroke-width="0.4"/><line x1="10" y1="270" x2="210" y2="270" stroke="#25342c" stroke-width="0.4"/><line x1="30" y1="255" x2="30" y2="278" stroke="#25342c" stroke-width="0.4"/><line x1="55" y1="255" x2="55" y2="278" stroke="#25342c" stroke-width="0.4"/><line x1="80" y1="255" x2="80" y2="278" stroke="#25342c" stroke-width="0.4"/><line x1="105" y1="255" x2="105" y2="278" stroke="#25342c" stroke-width="0.4"/><line x1="130" y1="255" x2="130" y2="278" stroke="#25342c" stroke-width="0.4"/><line x1="155" y1="255" x2="155" y2="278" stroke="#25342c" stroke-width="0.4"/><line x1="180" y1="255" x2="180" y2="278" stroke="#25342c" stroke-width="0.4"/><circle cx="80" cy="200" r="24" fill="none" stroke="#3a4d42" stroke-width="1"/><path d="M62 190 Q80 174 98 190" fill="none" stroke="#4a6055" stroke-width="0.8"/><path d="M60 208 Q80 224 100 208" fill="none" stroke="#4a6055" stroke-width="0.8"/><line x1="80" y1="176" x2="80" y2="224" stroke="#4a6055" stroke-width="0.6"/><line x1="-5" y1="175" x2="225" y2="173" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="193" x2="225" y2="192" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="211" x2="225" y2="211" stroke="#25342c" stroke-width="0.5"/><rect width="220" height="400" fill="url(#vl-l)"/></svg>`,
    right: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="vl-r" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 150 Q50 112 110 105 Q170 98 230 118 L230 400 Z" fill="#111a15"/><path d="M-10 150 Q50 112 110 105 Q170 98 230 118" fill="none" stroke="#4a6055" stroke-width="1.2"/><line x1="100" y1="240" x2="100" y2="310" stroke="#4a6055" stroke-width="1.5"/><line x1="100" y1="240" x2="220" y2="245" stroke="#4a6055" stroke-width="1.5"/><line x1="100" y1="244" x2="220" y2="249" stroke="#3a4d42" stroke-width="0.5"/><line x1="100" y1="250" x2="220" y2="255" stroke="#25342c" stroke-width="0.4"/><line x1="118" y1="240" x2="118" y2="258" stroke="#25342c" stroke-width="0.4"/><line x1="138" y1="241" x2="138" y2="259" stroke="#25342c" stroke-width="0.4"/><line x1="158" y1="242" x2="158" y2="260" stroke="#25342c" stroke-width="0.4"/><line x1="178" y1="243" x2="178" y2="261" stroke="#25342c" stroke-width="0.4"/><line x1="30" y1="320" x2="190" y2="320" stroke="#3a4d42" stroke-width="0.8"/><line x1="-5" y1="168" x2="225" y2="165" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="186" x2="225" y2="184" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="204" x2="225" y2="203" stroke="#25342c" stroke-width="0.5"/><rect width="220" height="400" fill="url(#vl-r)"/></svg>`,
  },
  hockey: {
    left: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hk-l" x1="1" x2="0" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 152 Q50 110 110 100 Q172 90 230 110 L230 400 Z" fill="#0e1a14"/><path d="M-10 152 Q50 110 110 100 Q172 90 230 110" fill="none" stroke="#4a6055" stroke-width="1.4"/><line x1="0" y1="240" x2="0" y2="340" stroke="#3a5048" stroke-width="1.5"/><line x1="40" y1="238" x2="40" y2="338" stroke="#2a3d34" stroke-width="1"/><line x1="80" y1="236" x2="80" y2="337" stroke="#2a3d34" stroke-width="1"/><line x1="120" y1="235" x2="120" y2="336" stroke="#2a3d34" stroke-width="1"/><line x1="160" y1="234" x2="160" y2="335" stroke="#2a3d34" stroke-width="1"/><line x1="200" y1="234" x2="200" y2="335" stroke="#2a3d34" stroke-width="1"/><path d="M-10 240 Q110 228 230 234" fill="none" stroke="#3a5048" stroke-width="2"/><ellipse cx="110" cy="360" rx="105" ry="22" fill="#0d2028" opacity="0.7"/><line x1="10" y1="348" x2="210" y2="352" stroke="#152530" stroke-width="0.6"/><line x1="10" y1="358" x2="210" y2="362" stroke="#152530" stroke-width="0.5"/><line x1="-5" y1="172" x2="225" y2="168" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="190" x2="225" y2="187" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="208" x2="225" y2="206" stroke="#25342c" stroke-width="0.5"/><circle cx="20" cy="108" r="3" fill="#64b5f6" opacity="0.7"/><circle cx="110" cy="96" r="2.5" fill="#64b5f6" opacity="0.6"/><circle cx="195" cy="108" r="3" fill="#64b5f6" opacity="0.7"/><rect width="220" height="400" fill="url(#hk-l)"/></svg>`,
    right: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="hk-r" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 148 Q50 106 110 96 Q172 86 230 106 L230 400 Z" fill="#0e1a14"/><path d="M-10 148 Q50 106 110 96 Q172 86 230 106" fill="none" stroke="#4a6055" stroke-width="1.4"/><path d="M60 255 L60 310 L130 310 L130 255 Q95 248 60 255 Z" fill="none" stroke="#4a6055" stroke-width="1.5"/><line x1="60" y1="263" x2="130" y2="263" stroke="#25342c" stroke-width="0.4"/><line x1="60" y1="273" x2="130" y2="273" stroke="#25342c" stroke-width="0.4"/><line x1="60" y1="283" x2="130" y2="283" stroke="#25342c" stroke-width="0.4"/><line x1="72" y1="255" x2="70" y2="310" stroke="#25342c" stroke-width="0.4"/><line x1="85" y1="252" x2="84" y2="310" stroke="#25342c" stroke-width="0.4"/><line x1="98" y1="250" x2="98" y2="310" stroke="#25342c" stroke-width="0.4"/><line x1="111" y1="252" x2="112" y2="310" stroke="#25342c" stroke-width="0.4"/><line x1="124" y1="255" x2="126" y2="310" stroke="#25342c" stroke-width="0.4"/><line x1="160" y1="280" x2="145" y2="340" stroke="#4a6055" stroke-width="2"/><path d="M145 335 Q158 340 162 330" fill="none" stroke="#4a6055" stroke-width="2"/><ellipse cx="148" cy="342" rx="8" ry="3" fill="#3a4d42" opacity="0.8"/><ellipse cx="110" cy="370" rx="108" ry="18" fill="#0d2028" opacity="0.7"/><line x1="5" y1="358" x2="215" y2="362" stroke="#152530" stroke-width="0.6"/><line x1="-5" y1="166" x2="225" y2="163" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="184" x2="225" y2="182" stroke="#25342c" stroke-width="0.5"/><rect width="220" height="400" fill="url(#hk-r)"/></svg>`,
  },
  tennis: {
    left: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="tn-l" x1="1" x2="0" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 170 Q50 130 110 120 Q170 110 230 130 L230 400 Z" fill="#111a15"/><path d="M-10 170 Q50 130 110 120 Q170 110 230 130" fill="none" stroke="#4a6055" stroke-width="1.2"/><rect x="20" y="300" width="180" height="70" fill="#1c1a12" opacity="0.5"/><line x1="20" y1="300" x2="200" y2="300" stroke="#3a3828" stroke-width="1"/><line x1="20" y1="370" x2="200" y2="370" stroke="#3a3828" stroke-width="1"/><line x1="20" y1="300" x2="20" y2="370" stroke="#3a3828" stroke-width="0.8"/><line x1="200" y1="300" x2="200" y2="370" stroke="#3a3828" stroke-width="0.8"/><line x1="110" y1="300" x2="110" y2="370" stroke="#2a2820" stroke-width="0.5"/><line x1="20" y1="335" x2="200" y2="335" stroke="#4a6055" stroke-width="1.5"/><ellipse cx="80" cy="220" rx="28" ry="36" fill="none" stroke="#4a6055" stroke-width="1.2"/><line x1="80" y1="184" x2="80" y2="165" stroke="#4a6055" stroke-width="2"/><line x1="52" y1="220" x2="108" y2="220" stroke="#3a4d42" stroke-width="0.6"/><line x1="52" y1="207" x2="108" y2="207" stroke="#3a4d42" stroke-width="0.4"/><line x1="52" y1="233" x2="108" y2="233" stroke="#3a4d42" stroke-width="0.4"/><line x1="65" y1="185" x2="62" y2="256" stroke="#3a4d42" stroke-width="0.4"/><line x1="80" y1="184" x2="80" y2="256" stroke="#3a4d42" stroke-width="0.4"/><line x1="95" y1="185" x2="98" y2="256" stroke="#3a4d42" stroke-width="0.4"/><line x1="-5" y1="188" x2="225" y2="185" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="206" x2="225" y2="204" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="224" x2="225" y2="223" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="242" x2="225" y2="242" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="260" x2="225" y2="261" stroke="#25342c" stroke-width="0.5"/><rect width="220" height="400" fill="url(#tn-l)"/></svg>`,
    right: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="tn-r" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 162 Q50 124 110 115 Q170 106 230 124 L230 400 Z" fill="#111a15"/><path d="M-10 162 Q50 124 110 115 Q170 106 230 124" fill="none" stroke="#4a6055" stroke-width="1.2"/><circle cx="140" cy="200" r="20" fill="none" stroke="#aed581" stroke-width="1" opacity="0.7"/><path d="M125 192 Q140 178 155 192" fill="none" stroke="#8bc34a" stroke-width="0.8" opacity="0.6"/><path d="M125 208 Q140 222 155 208" fill="none" stroke="#8bc34a" stroke-width="0.8" opacity="0.6"/><ellipse cx="70" cy="260" rx="35" ry="45" fill="none" stroke="#4a6055" stroke-width="1.2"/><line x1="70" y1="215" x2="70" y2="185" stroke="#4a6055" stroke-width="2.5"/><line x1="35" y1="260" x2="105" y2="260" stroke="#3a4d42" stroke-width="0.5"/><line x1="36" y1="243" x2="104" y2="243" stroke="#3a4d42" stroke-width="0.5"/><line x1="36" y1="277" x2="104" y2="277" stroke="#3a4d42" stroke-width="0.5"/><line x1="55" y1="217" x2="52" y2="303" stroke="#3a4d42" stroke-width="0.5"/><line x1="70" y1="215" x2="70" y2="305" stroke="#3a4d42" stroke-width="0.5"/><line x1="85" y1="217" x2="88" y2="303" stroke="#3a4d42" stroke-width="0.5"/><line x1="-5" y1="180" x2="225" y2="178" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="198" x2="225" y2="197" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="216" x2="225" y2="216" stroke="#25342c" stroke-width="0.5"/><rect width="220" height="400" fill="url(#tn-r)"/></svg>`,
  },
  france: {
    left: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="fr-l" x1="1" x2="0" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 160 Q50 120 110 108 Q170 96 230 118 L230 400 Z" fill="#111a15"/><path d="M-10 160 Q50 120 110 108 Q170 96 230 118" fill="none" stroke="#4a6055" stroke-width="1.4"/><path d="M-10 130 Q110 70 230 100" fill="none" stroke="#4a6055" stroke-width="1.2"/><path d="M-10 138 Q110 78 230 108" fill="none" stroke="#3a4d42" stroke-width="0.6"/><line x1="20" y1="130" x2="20" y2="400" stroke="#3a4d42" stroke-width="0.8"/><line x1="60" y1="118" x2="60" y2="400" stroke="#3a4d42" stroke-width="0.8"/><line x1="110" y1="108" x2="110" y2="400" stroke="#3a4d42" stroke-width="0.6"/><rect x="0" y="80" width="5" height="40" fill="#002395" opacity="0.5"/><rect x="5" y="80" width="5" height="40" fill="#f0f0f0" opacity="0.3"/><rect x="10" y="80" width="5" height="40" fill="#ed2939" opacity="0.5"/><line x1="-5" y1="178" x2="225" y2="175" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="196" x2="225" y2="194" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="214" x2="225" y2="213" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="232" x2="225" y2="232" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="250" x2="225" y2="251" stroke="#25342c" stroke-width="0.5"/><circle cx="20" cy="130" r="3.5" fill="#ffc857" opacity="0.8"/><circle cx="110" cy="108" r="3" fill="#ffc857" opacity="0.6"/><rect width="220" height="400" fill="url(#fr-l)"/></svg>`,
    right: `<svg viewBox="0 0 220 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="fr-r" x1="0" x2="1" y1="0" y2="0"><stop offset="0%" stop-color="#0c1310" stop-opacity="0.98"/><stop offset="100%" stop-color="#0c1310" stop-opacity="0"/></linearGradient></defs><path d="M-10 400 L-10 155 Q50 115 110 105 Q170 95 230 115 L230 400 Z" fill="#111a15"/><path d="M-10 155 Q50 115 110 105 Q170 95 230 115" fill="none" stroke="#4a6055" stroke-width="1.4"/><polygon points="110,155 116,174 136,174 120,186 127,205 110,193 93,205 100,186 84,174 104,174" fill="none" stroke="#ffc857" stroke-width="1" opacity="0.5"/><line x1="55" y1="160" x2="55" y2="320" stroke="#4a6055" stroke-width="1.2"/><rect x="55" y="163" width="36" height="9" fill="#002395" opacity="0.6"/><rect x="55" y="172" width="36" height="9" fill="#f0f0f0" opacity="0.35"/><rect x="55" y="181" width="36" height="9" fill="#ed2939" opacity="0.6"/><line x1="-5" y1="173" x2="225" y2="170" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="191" x2="225" y2="189" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="209" x2="225" y2="208" stroke="#25342c" stroke-width="0.5"/><line x1="-5" y1="227" x2="225" y2="227" stroke="#25342c" stroke-width="0.5"/><rect width="220" height="400" fill="url(#fr-r)"/></svg>`,
  },
};
SPORT_ILLUS.null  = SPORT_ILLUS.foot;
SPORT_ILLUS.autre = SPORT_ILLUS.foot;

function updateHeroIllus(sportKey, animate) {
  const key = sportKey || "null";
  const config = SPORT_ILLUS[key] || SPORT_ILLUS.null;
  const left  = document.getElementById("illus-left");
  const right = document.getElementById("illus-right");
  if (!left || !right) return;

  if (animate) {
    // Transition douce uniquement pour les changements de sport
    left.classList.remove("visible");
    right.classList.remove("visible");
    setTimeout(() => {
      left.innerHTML  = config.left;
      right.innerHTML = config.right;
      requestAnimationFrame(() => {
        left.classList.add("visible");
        right.classList.add("visible");
      });
    }, 280);
  } else {
    // Premier affichage : injection directe sans délai
    left.innerHTML  = config.left;
    right.innerHTML = config.right;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        left.classList.add("visible");
        right.classList.add("visible");
      });
    });
  }
}

/* -------------------- frise d'icônes sports (cliquables) -------------------- */
function renderSportStrip() {
  const container = document.getElementById("sport-icons-strip");
  if (!container) return;

  const html = [
    `<button class="sport-icon-btn${!state.sportFilter ? " active" : ""}" data-sport="null">
      <span class="icon">🏆</span><span class="icon-label">Tous</span>
    </button>`,
    ...SPORTS_CONFIG.map(s => `
      <button class="sport-icon-btn${state.sportFilter === s.key ? " active" : ""}" data-sport="${s.key}">
        <span class="icon">${s.icon}</span><span class="icon-label">${s.label}</span>
      </button>`)
  ].join("");
  container.innerHTML = html;

  container.querySelectorAll(".sport-icon-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.sport;
      state.sportFilter = val === "null" ? null : val;
      renderSportStrip();
      updateHeroIllus(state.sportFilter, true);
      renderBoard();
    });
  });
}

function renderLeaguesStrip() {
  const html = Object.entries(LEAGUES).map(([id, l]) => {
    const n = MATCHES.filter((m) => m.league === id).length;
    return `
      <div class="league-card" data-league="${id}">
        <div class="sport">${l.sport}</div>
        <h3>${l.name}</h3>
        <div class="sub">${n} match${n > 1 ? "s" : ""} référencés</div>
      </div>`;
  }).join("");
  ["leagues-strip", "leagues-strip-2"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  });
  document.querySelectorAll(".league-card").forEach((card) => {
    card.addEventListener("click", () => {
      state.filter = card.dataset.league;
      state.query = "";
      document.getElementById("search-input").value = "";
      syncChips();
      location.hash = "#/";
      renderBoard();
    });
  });
}

/* -------------------- annuaire des clubs par ville -------------------- */
function getClubsByCity(query) {
  const q = normalize(query);
  if (!q) return [];

  const results = [];
  Object.entries(CLUBS).forEach(([id, club]) => {
    if (!club.stadium || !STADIUMS[club.stadium]) return;
    const st = STADIUMS[club.stadium];
    const cityNorm = normalize(st.city);
    const metroNorm = normalize(st.metro || "");
    if (cityNorm.includes(q) || (metroNorm && metroNorm.includes(q))) {
      results.push({ id, club, stadium: st });
    }
  });

  // Tri : sport, puis nom du club
  results.sort((a, b) => {
    const sa = LEAGUES[a.club.league]?.sport || "";
    const sb = LEAGUES[b.club.league]?.sport || "";
    return sa.localeCompare(sb, "fr") || a.club.name.localeCompare(b.club.name, "fr");
  });
  return results;
}

function renderClubDirectory() {
  const input = document.getElementById("directory-input");
  const container = document.getElementById("directory-results");
  if (!input || !container) return;

  const query = input.value.trim();
  if (!query) {
    container.innerHTML = `<p class="detail-note">Tape le nom d'une ville pour voir tous les clubs qui y sont recensés sur le site, tous sports confondus.</p>`;
    return;
  }

  const results = getClubsByCity(query);
  if (results.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="big">Aucun club trouvé</div><p>Essaie une autre ville, ou vérifie l'orthographe.</p></div>`;
    return;
  }

  container.innerHTML = `
    <div class="board-head" style="margin-bottom:10px;">
      <h2 style="font-size:1rem;">${results.length} club${results.length > 1 ? "s" : ""} trouvé${results.length > 1 ? "s" : ""} pour « ${query} »</h2>
    </div>
    <ul class="competitions-bullets directory-bullets">
      ${results.map((r) => `
        <li>
          <span class="comp-icon" aria-hidden="true">${sportIcon(LEAGUES[r.club.league]?.sport)}</span>
          <span class="comp-name">${r.club.name}</span>
          <span class="comp-sport">${LEAGUES[r.club.league]?.name || ""} — ${r.stadium.name}, ${r.stadium.city}</span>
        </li>`).join("")}
    </ul>`;
}

/* -------------------- liste des compétitions (page Compétitions) -------------------- */
function sportIcon(sport) {
  const s = normalize(sport || "");
  if (s.includes("equipe de france")) return "🇫🇷";
  if (s.includes("foot")) return "⚽";
  if (s.includes("rugby")) return "🏉";
  if (s.includes("basket")) return "🏀";
  if (s.includes("hand")) return "🤾";
  if (s.includes("volley")) return "🏐";
  if (s.includes("hockey")) return "🏒";
  if (s.includes("tennis de table")) return "🏓";
  if (s.includes("badminton")) return "🏸";
  if (s.includes("tennis")) return "🎾";
  if (s.includes("athlet")) return "🏃";
  return "🏆";
}

function renderCompetitionsList() {
  const container = document.getElementById("competitions-list");
  if (!container) return;

  const entries = Object.entries(LEAGUES).sort((a, b) => a[1].name.localeCompare(b[1].name, "fr"));

  container.innerHTML = `<ul class="competitions-bullets">${entries.map(([id, l]) => `
    <li>
      <span class="comp-icon" aria-hidden="true">${sportIcon(l.sport)}</span>
      <span class="comp-name">${l.name}</span>
      <span class="comp-sport">${l.sport}</span>
    </li>`).join("")}
  </ul>`;
}

function syncChips() {
  document.querySelectorAll(".chip").forEach((c) => {
    c.classList.toggle("active", c.dataset.filter === state.filter);
  });
}

/* -------------------- rendu : détail match -------------------- */
function renderMatchDetail(id) {
  const m = MATCHES.find((x) => x.id === id);
  const container = document.getElementById("match-detail-content");
  if (!m) {
    container.innerHTML = `<p>Match introuvable.</p>`;
    return;
  }
  const stadiumId = m.stadium || (m.home ? CLUBS[m.home]?.stadium : null);
  const st = stadiumOf(stadiumId);
  const homeC = m.home ? CLUBS[m.home] : null;
  const awayC = m.away ? CLUBS[m.away] : null;

  container.innerHTML = `
    <div class="detail-comp">${m.competition}</div>
    <h1 class="detail-teams">${homeC ? homeC.name : "À définir"}${awayC ? `<span class="vs">vs</span>${awayC.name}` : ""}</h1>

    <div class="detail-meta">
      <div class="item"><div class="label">Date</div><div class="value">${longDate(m.date)}</div></div>
      <div class="item"><div class="label">Heure</div><div class="value">${m.time ? m.time : "À confirmer"}</div></div>
      <div class="item"><div class="label">Lieu</div><div class="value">${st ? st.name : "À confirmer"}</div></div>
      <div class="item"><div class="label">Ville</div><div class="value">${st ? st.city : "—"}</div></div>
      ${st ? `<div class="item"><div class="label">Capacité</div><div class="value">${st.capacity.toLocaleString("fr-FR")} places</div></div>` : ""}
      <div class="item"><div class="label">Statut</div><div class="value">${m.status === "played" ? (m.score && m.score.home != null ? `Joué — ${m.score.home} – ${m.score.away}` : "Joué") : "À venir"}</div></div>
    </div>

    ${m.note ? `<p class="detail-note">${m.note}</p>` : ""}

    <div class="club-pair">
      ${homeC ? `<div class="club-box"><div class="name">${homeC.name} (domicile)</div><div class="stadium">${st ? st.name + ", " + st.city : ""}</div><a href="${homeC.site}" target="_blank" rel="noopener">Site du club ↗</a></div>` : ""}
      ${awayC ? `<div class="club-box"><div class="name">${awayC.name} (extérieur)</div><div class="stadium">Visiteur</div><a href="${awayC.site}" target="_blank" rel="noopener">Site du club ↗</a></div>` : ""}
    </div>

    <div class="detail-actions">
      ${homeC ? `<a class="btn primary" href="${homeC.site}" target="_blank" rel="noopener">Billetterie ${homeC.short}</a>` : ""}
      <a class="btn ghost" href="${LEAGUES[m.league]?.site}" target="_blank" rel="noopener">Voir sur le site de la compétition ↗</a>
    </div>
  `;
}

/* -------------------- routage -------------------- */
function showView(name) {
  document.querySelectorAll("[data-view]").forEach((v) => v.classList.remove("active"));
  const el = document.querySelector(`[data-view="${name}"]`);
  if (el) el.classList.add("active");
  document.querySelectorAll("nav.site-nav a").forEach((a) => a.classList.remove("active"));
  const navMap = { accueil: "accueil", competitions: "competitions", annuaire: "annuaire", "a-propos": "a-propos" };
  if (navMap[name]) {
    const navEl = document.querySelector(`nav.site-nav a[data-nav="${navMap[name]}"]`);
    if (navEl) navEl.classList.add("active");
  }
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function router() {
  const hash = location.hash || "#/";
  const parts = hash.replace(/^#\//, "").split("/").filter(Boolean);

  if (parts.length === 0) {
    showView("accueil");
    renderBoard();
  } else if (parts[0] === "competitions") {
    showView("competitions");
  } else if (parts[0] === "annuaire") {
    showView("annuaire");
    renderClubDirectory();
  } else if (parts[0] === "a-propos") {
    showView("a-propos");
  } else if (parts[0] === "match" && parts[1]) {
    renderMatchDetail(parts[1]);
    showView("match");
  } else {
    showView("accueil");
    renderBoard();
  }
}

/* -------------------- init -------------------- */
function init() {
  renderLeaguesStrip();
  renderCompetitionsList();
  renderSportStrip();
  renderBoard();

  document.getElementById("search-input").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderBoard();
  });
  document.getElementById("search-btn").addEventListener("click", () => {
    location.hash = "#/";
    renderBoard();
  });
  document.getElementById("search-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") { location.hash = "#/"; renderBoard(); }
  });

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.filter = chip.dataset.filter;
      syncChips();
      location.hash = "#/";
      renderBoard();
    });
  });

  document.querySelectorAll(".search-mode-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.searchMode = btn.dataset.mode;
      document.querySelectorAll(".search-mode-btn").forEach((b) => b.classList.toggle("active", b === btn));
      renderBoard();
    });
  });

  const directoryInput = document.getElementById("directory-input");
  if (directoryInput) {
    directoryInput.addEventListener("input", renderClubDirectory);
  }

  window.addEventListener("hashchange", router);
  router();  // rend la section accueil visible AVANT l'injection des illustrations

  // Injection des illustrations après que la section soit dans le DOM visible
  updateHeroIllus(null, false);

  if (typeof loadLiveCalendar === "function") loadLiveCalendar();
}

document.addEventListener("DOMContentLoaded", init);
