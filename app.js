/* ============================================================
   TABLEAU DE BORD — logique
   ============================================================ */

const state = {
  query: "",
  filter: "all", // all | ligue1 | top14 | upcoming | played
  searchMode: "all", // all | lieu | club | competition
};

const MONTHS_SHORT = ["JAN","FEV","MAR","AVR","MAI","JUN","JUL","AOU","SEP","OCT","NOV","DEC"];
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
  if (m.stadium && STADIUMS[m.stadium]) {
    venueParts.push(STADIUMS[m.stadium].name, STADIUMS[m.stadium].city);
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
    if (!matchMatchesQuery(m, q, state.searchMode)) return false;
    return true;
  }).sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
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
          <div class="match-comp"><span class="tag-sport ${sport}">${LEAGUES[m.league]?.sport || ""}</span>${m.competition}</div>
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
  const navMap = { accueil: "accueil", competitions: "competitions", "a-propos": "a-propos" };
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

  window.addEventListener("hashchange", router);
  router();

  if (typeof loadLiveCalendar === "function") loadLiveCalendar();
}

document.addEventListener("DOMContentLoaded", init);
