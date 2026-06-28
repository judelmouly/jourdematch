/* ============================================================
   TABLEAU DE BORD — données
   Sources : LFP (calendrier officiel L1 2026/2027, communiqué du
   10/06/2026), LNR (clubs Top 14, phase finale 2025/2026), sites
   officiels des clubs. Le calendrier détaillé du TOP 14 2026/2027
   n'est pas encore publié par la LNR au moment de la création de
   ce site (oppositions attendues "d'ici juillet 2026").
   ============================================================ */

const STADIUMS = {
  // Ligue 1
  parc_des_princes:   { name: "Parc des Princes",        city: "Paris",       capacity: 47929 },
  velodrome:          { name: "Orange Vélodrome",         city: "Marseille",   capacity: 67394 },
  louis_ii:           { name: "Stade Louis-II",           city: "Monaco",      capacity: 16360 },
  groupama_stadium:   { name: "Groupama Stadium",         city: "Lyon (Décines)", capacity: 59186 },
  pierre_mauroy:      { name: "Stade Pierre-Mauroy",      city: "Villeneuve-d'Ascq (Lille)", capacity: 50186 },
  bollaert:           { name: "Stade Bollaert-Delelis",   city: "Lens",        capacity: 38223 },
  roazhon_park:       { name: "Roazhon Park",             city: "Rennes",      capacity: 29778 },
  meinau:             { name: "Stade de la Meinau",       city: "Strasbourg",  capacity: 26109 },
  allianz_riviera:    { name: "Allianz Riviera",          city: "Nice",        capacity: 35624 },
  stadium_toulouse:   { name: "Stadium de Toulouse",      city: "Toulouse",    capacity: 33150 },
  francis_le_ble:     { name: "Stade Francis-Le Blé",     city: "Brest",       capacity: 15931 },
  moustoir:           { name: "Stade du Moustoir",        city: "Lorient",     capacity: 18890 },
  raymond_kopa:       { name: "Stade Raymond-Kopa",       city: "Angers",      capacity: 18752 },
  stade_oceane:       { name: "Stade Océane",             city: "Le Havre",    capacity: 25178 },
  abbe_deschamps:     { name: "Stade de l'Abbé-Deschamps", city: "Auxerre",    capacity: 12502 },
  jean_bouin:         { name: "Stade Jean-Bouin",         city: "Paris",       capacity: 20000 },
  stade_aube:         { name: "Stade de l'Aube",          city: "Troyes",      capacity: 20400 },
  mmarena:            { name: "MMArena",                  city: "Le Mans",     capacity: 25064 },
  // TOP 14
  ernest_wallon:      { name: "Stade Ernest-Wallon",      city: "Toulouse",    capacity: 19500 },
  chaban_delmas:      { name: "Stade Chaban-Delmas",      city: "Bordeaux",    capacity: 33500 },
  mayol:              { name: "Stade Mayol",              city: "Toulon",      capacity: 18910 },
  paris_la_defense:   { name: "Paris La Défense Arena",   city: "Nanterre",    capacity: 32000, metro: "Paris" },
  marcel_deflandre:   { name: "Stade Marcel-Deflandre",   city: "La Rochelle", capacity: 16000 },
  marcel_michelin:    { name: "Stade Marcel-Michelin",    city: "Clermont-Ferrand", capacity: 19200 },
  pierre_antoine:     { name: "Stade Pierre-Antoine",     city: "Castres",     capacity: 12500 },
  stade_hameau:       { name: "Stade du Hameau",          city: "Pau",         capacity: 13309 },
  gerland:            { name: "Matmut Stadium de Gerland", city: "Lyon",       capacity: 25000 },
  jean_dauger:        { name: "Stade Jean-Dauger",        city: "Bayonne",     capacity: 18000 },
  ggl_stadium:        { name: "GGL Stadium",              city: "Montpellier", capacity: 15697 },
  aime_giral:         { name: "Stade Aimé-Giral",         city: "Perpignan",   capacity: 14593 },
  stade_sapiac:       { name: "Stade Sapiac",              city: "Montauban",   capacity: 12000 },
  stade_de_france:    { name: "Stade de France",          city: "Saint-Denis", capacity: 80698 },
};

const CLUBS = {
  // ---- Ligue 1 (saison 2026/2027) ----
  psg:        { name: "Paris Saint-Germain", short: "PSG",  league: "ligue1", stadium: "parc_des_princes", site: "https://www.psg.fr" },
  om:         { name: "Olympique de Marseille", short: "OM", league: "ligue1", stadium: "velodrome", site: "https://www.om.fr" },
  asm:        { name: "AS Monaco", short: "ASM", league: "ligue1", stadium: "louis_ii", site: "https://www.asmonaco.com" },
  ol:         { name: "Olympique Lyonnais", short: "OL", league: "ligue1", stadium: "groupama_stadium", site: "https://www.ol.fr" },
  losc:       { name: "LOSC Lille", short: "LOSC", league: "ligue1", stadium: "pierre_mauroy", site: "https://www.losc.fr" },
  rcl:        { name: "RC Lens", short: "RCL", league: "ligue1", stadium: "bollaert", site: "https://www.rclens.fr" },
  srfc:       { name: "Stade Rennais FC", short: "Rennes", league: "ligue1", stadium: "roazhon_park", site: "https://www.staderennais.com" },
  rcsa:       { name: "RC Strasbourg Alsace", short: "Strasbourg", league: "ligue1", stadium: "meinau", site: "https://www.rcstrasbourgalsace.fr" },
  ogcn:       { name: "OGC Nice", short: "Nice", league: "ligue1", stadium: "allianz_riviera", site: "https://www.ogcnice.com" },
  tfc:        { name: "Toulouse FC", short: "TFC", league: "ligue1", stadium: "stadium_toulouse", site: "https://www.toulousefc.com" },
  brest:      { name: "Stade Brestois 29", short: "Brest", league: "ligue1", stadium: "francis_le_ble", site: "https://www.stade-brestois29.fr" },
  lorient:    { name: "FC Lorient", short: "Lorient", league: "ligue1", stadium: "moustoir", site: "https://www.fclorient.fr" },
  angers:     { name: "Angers SCO", short: "Angers", league: "ligue1", stadium: "raymond_kopa", site: "https://www.angers-sco.fr" },
  havre:      { name: "Le Havre AC", short: "Le Havre", league: "ligue1", stadium: "stade_oceane", site: "https://www.hac-foot.com" },
  auxerre:    { name: "AJ Auxerre", short: "Auxerre", league: "ligue1", stadium: "abbe_deschamps", site: "https://www.aja.fr" },
  parisfc:    { name: "Paris FC", short: "Paris FC", league: "ligue1", stadium: "jean_bouin", site: "https://www.paris.fc" },
  troyes:     { name: "ESTAC Troyes", short: "Troyes", league: "ligue1", stadium: "stade_aube", site: "https://www.estac.fr" },
  lemans:     { name: "Le Mans FC", short: "Le Mans", league: "ligue1", stadium: "mmarena", site: "https://www.lemansfc.com" },

  // ---- TOP 14 (saison 2026/2027) ----
  toulouse_r: { name: "Stade Toulousain", short: "Toulouse", league: "top14", stadium: "ernest_wallon", site: "https://www.stadetoulousain.fr" },
  ubb:        { name: "Union Bordeaux-Bègles", short: "UBB", league: "top14", stadium: "chaban_delmas", site: "https://www.ubbrugby.com" },
  rct:        { name: "RC Toulon", short: "Toulon", league: "top14", stadium: "mayol", site: "https://www.rctoulon.com" },
  racing92:   { name: "Racing 92", short: "Racing 92", league: "top14", stadium: "paris_la_defense", site: "https://www.racing92.fr" },
  sf:         { name: "Stade Français Paris", short: "Stade Français", league: "top14", stadium: "jean_bouin", site: "https://www.stade.fr" },
  larochelle: { name: "Stade Rochelais", short: "La Rochelle", league: "top14", stadium: "marcel_deflandre", site: "https://www.stade-rochelais.fr" },
  clermont:   { name: "ASM Clermont Auvergne", short: "Clermont", league: "top14", stadium: "marcel_michelin", site: "https://www.asm-rugby.com" },
  castres:    { name: "Castres Olympique", short: "Castres", league: "top14", stadium: "pierre_antoine", site: "https://www.castres-olympique.com" },
  pau:        { name: "Section Paloise", short: "Pau", league: "top14", stadium: "stade_hameau", site: "https://www.sectionpaloise.fr" },
  lou:        { name: "LOU Rugby", short: "Lyon", league: "top14", stadium: "gerland", site: "https://www.lourugby.fr" },
  bayonne:    { name: "Aviron Bayonnais", short: "Bayonne", league: "top14", stadium: "jean_dauger", site: "https://www.avironbayonnais.fr" },
  mhr:        { name: "Montpellier Hérault Rugby", short: "Montpellier", league: "top14", stadium: "ggl_stadium", site: "https://www.montpellier-rugby.com" },
  usap:       { name: "USA Perpignan", short: "Perpignan", league: "top14", stadium: "aime_giral", site: "https://www.usap.fr" },
  montauban:  { name: "US Montauban", short: "Montauban", league: "top14", stadium: "stade_sapiac", site: "https://www.usmontauban.com" },
};

/* Compétitions */
const LEAGUES = {
  ligue1: { name: "Ligue 1 McDonald's", sport: "Football", accent: "var(--accent-foot)", site: "https://ligue1.com/fr" },
  top14:  { name: "TOP 14",             sport: "Rugby à XV", accent: "var(--accent-rugby)", site: "https://top14.lnr.fr" },
};

/* ============================================================
   MATCHS
   status: "upcoming" | "played"
   ============================================================ */
const MATCHES = [
  // ---- Ligue 1 — Journée 1, week-end du 21-23 août 2026 ----
  { id: "l1-j1-1", league: "ligue1", competition: "Ligue 1 — Journée 1", date: "2026-08-22", time: null, home: "psg", away: "srfc", stadium: "parc_des_princes", status: "upcoming", note: "Ouverture de la saison, le PSG champion en titre reçoit Rennes." },
  { id: "l1-j1-2", league: "ligue1", competition: "Ligue 1 — Journée 1", date: "2026-08-22", time: null, home: "om", away: "rcsa", stadium: "velodrome", status: "upcoming" },
  { id: "l1-j1-3", league: "ligue1", competition: "Ligue 1 — Journée 1", date: "2026-08-22", time: null, home: "angers", away: "losc", stadium: "raymond_kopa", status: "upcoming" },
  { id: "l1-j1-4", league: "ligue1", competition: "Ligue 1 — Journée 1", date: "2026-08-22", time: null, home: "havre", away: "asm", stadium: "stade_oceane", status: "upcoming" },
  { id: "l1-j1-5", league: "ligue1", competition: "Ligue 1 — Journée 1", date: "2026-08-22", time: null, home: "lemans", away: "brest", stadium: "mmarena", status: "upcoming", note: "Retour du Mans FC en Ligue 1." },
  { id: "l1-j1-6", league: "ligue1", competition: "Ligue 1 — Journée 1", date: "2026-08-22", time: null, home: "rcl", away: "auxerre", stadium: "bollaert", status: "upcoming" },
  { id: "l1-j1-7", league: "ligue1", competition: "Ligue 1 — Journée 1", date: "2026-08-22", time: null, home: "ogcn", away: "lorient", stadium: "allianz_riviera", status: "upcoming" },
  { id: "l1-j1-8", league: "ligue1", competition: "Ligue 1 — Journée 1", date: "2026-08-22", time: null, home: "tfc", away: "ol", stadium: "stadium_toulouse", status: "upcoming" },
  { id: "l1-j1-9", league: "ligue1", competition: "Ligue 1 — Journée 1", date: "2026-08-22", time: null, home: "troyes", away: "parisfc", stadium: "stade_aube", status: "upcoming", note: "Retour de Troyes en Ligue 1." },

  // ---- Grandes affiches Ligue 1+ (dates et heures confirmées) ----
  { id: "l1-j2", league: "ligue1", competition: "Ligue 1 — Journée 2", date: "2026-08-30", time: "20:45", home: "losc", away: "psg", stadium: "pierre_mauroy", status: "upcoming" },
  { id: "l1-j3", league: "ligue1", competition: "Ligue 1 — Journée 3", date: "2026-09-05", time: null, home: "psg", away: "asm", stadium: "parc_des_princes", status: "upcoming" },
  { id: "l1-j5", league: "ligue1", competition: "Ligue 1 — Journée 5", date: "2026-09-20", time: "20:45", home: "om", away: "psg", stadium: "velodrome", status: "upcoming", note: "Le Classique." },
  { id: "l1-j8", league: "ligue1", competition: "Ligue 1 — Journée 8", date: "2026-10-25", time: "20:45", home: "psg", away: "ol", stadium: "parc_des_princes", status: "upcoming" },
  { id: "l1-j10", league: "ligue1", competition: "Ligue 1 — Journée 10", date: "2026-11-07", time: "20:45", home: "rcl", away: "om", stadium: "bollaert", status: "upcoming" },
  { id: "l1-j13", league: "ligue1", competition: "Ligue 1 — Journée 13", date: "2026-12-05", time: null, home: "om", away: "ogcn", stadium: "velodrome", status: "upcoming", note: "Derby." },
  { id: "l1-j14", league: "ligue1", competition: "Ligue 1 — Journée 14", date: "2026-12-13", time: "20:45", home: "ol", away: "om", stadium: "groupama_stadium", status: "upcoming", note: "Olympico — dernière journée avant la trêve." },
  { id: "l1-j15", league: "ligue1", competition: "Ligue 1 — Journée 15", date: "2027-01-03", time: "20:45", home: "rcl", away: "psg", stadium: "bollaert", status: "upcoming" },

  // ---- TOP 14 — fin de la phase finale 2025/2026 (résultats récents) ----
  { id: "t14-barr-1", league: "top14", competition: "TOP 14 — Barrages", date: "2026-06-13", time: "21:00", home: "pau", away: "racing92", stadium: "stade_hameau", status: "played", score: { home: null, away: null }, note: "Racing 92 qualifié pour la demi-finale." },
  { id: "t14-barr-2", league: "top14", competition: "TOP 14 — Barrages", date: "2026-06-14", time: "21:00", home: "sf", away: "larochelle", stadium: "jean_bouin", status: "played", note: "Issue qualificative pour la demi-finale face à Montpellier." },
  { id: "t14-demi-1", league: "top14", competition: "TOP 14 — Demi-finale", date: "2026-06-19", time: "21:00", home: "toulouse_r", away: "racing92", stadium: "velodrome", status: "played", score: { home: 71, away: 17 }, note: "Toulouse écrase Racing 92 et file en finale pour un 4e Brennus consécutif." },
  { id: "t14-demi-2", league: "top14", competition: "TOP 14 — Demi-finale", date: "2026-06-20", time: "21:00", home: "mhr", away: "sf", stadium: "velodrome", status: "upcoming", note: "Deuxième demi-finale, qualificative pour la finale face à Toulouse." },
  { id: "t14-finale", league: "top14", competition: "TOP 14 — Finale", date: "2026-06-27", time: "21:05", home: "toulouse_r", away: "mhr", stadium: "stade_de_france", status: "upcoming", note: "Finale du Bouclier de Brennus, à guichets fermés." },

  // ---- TOP 14 — saison 2026/2027 (dates générales connues, calendrier détaillé à venir) ----
  { id: "t14-2627-j1", league: "top14", competition: "TOP 14 — Saison 2026/2027", date: "2026-09-05", time: null, home: null, away: null, stadium: null, status: "upcoming", note: "Reprise du championnat le week-end du 5-6 septembre 2026. Les oppositions de chaque journée seront publiées par la LNR à partir de juillet 2026." },
];

/* Petit utilitaire pour retirer les accents lors des recherches */
function normalize(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/* ============================================================
   EXTENSION — autres compétitions françaises
   Sources : LFP (Ligue 2), LNR (Pro D2), LNB (Betclic Élite),
   FFHandball/LNH (Starligue), LNV (Marmara SpikeLigue, Ligue AF),
   FFBB (La Boulangère Wonderligue), LFH (Ligue Butagaz Énergie),
   FFHG (Ligue Magnus). Certaines compétitions (volley féminin,
   handball féminin, hockey) ont des listes de clubs partielles :
   on complètera au fil des prochaines mises à jour.
   ============================================================ */

Object.assign(STADIUMS, {
  // Ligue 2 BKT
  geoffroy_guichard:  { name: "Stade Geoffroy-Guichard",  city: "Saint-Étienne", capacity: 41965 },
  stade_bauer:        { name: "Stade Bauer",              city: "Saint-Ouen",    capacity: 6500, metro: "Paris" },
  paul_lignon:        { name: "Stade Paul-Lignon",        city: "Rodez",         capacity: 6800 },
  auguste_delaune:    { name: "Stade Auguste-Delaune",    city: "Reims",         capacity: 21684 },
  parc_des_sports_annecy: { name: "Parc des Sports",      city: "Annecy",        capacity: 16000 },
  mosson:             { name: "Stade de la Mosson",       city: "Montpellier",   capacity: 32939 },
  nouste_camp:        { name: "Nouste Camp",               city: "Pau",           capacity: 4500 },
  marcel_tribut:      { name: "Stade Marcel-Tribut",      city: "Dunkerque",     capacity: 8000 },
  roudourou:          { name: "Stade de Roudourou",       city: "Guingamp",      capacity: 18000 },
  francis_le_basser:  { name: "Stade Francis-Le Basser",  city: "Laval",         capacity: 15266 },
  marcel_picot:       { name: "Stade Marcel-Picot",       city: "Nancy",         capacity: 20087 },
  stade_liberation:   { name: "Stade de la Libération",   city: "Boulogne-sur-Mer", capacity: 6000 },
  stade_des_alpes:    { name: "Stade des Alpes",          city: "Grenoble",      capacity: 20068 },
  gabriel_montpied:   { name: "Stade Gabriel-Montpied",   city: "Clermont-Ferrand", capacity: 17000 },
  beaujoire:          { name: "Stade de la Beaujoire",    city: "Nantes",        capacity: 37473 },
  saint_symphorien:   { name: "Stade Saint-Symphorien",   city: "Metz",          capacity: 25786 },
  gaston_gerard:      { name: "Stade Gaston-Gérard",      city: "Dijon",         capacity: 15476 },
  auguste_bonal:      { name: "Stade Auguste-Bonal",      city: "Sochaux-Montbéliard", capacity: 20005 },

  // Pro D2
  rabine:             { name: "Stade de la Rabine",       city: "Vannes",        capacity: 9261 },
  michel_bendichou:   { name: "Stade Michel-Bendichou",   city: "Colomiers",     capacity: 11430 },
  maurice_david:      { name: "Stade Maurice-David",      city: "Aix-en-Provence", capacity: 6000 },
  georges_pompidou_valence: { name: "Stade Georges-Pompidou", city: "Valence",   capacity: 8000 },
  charles_mathon:     { name: "Stade Charles-Mathon",     city: "Oyonnax",       capacity: 11500 },
  stadium_brive:      { name: "Stadium de Brive",         city: "Brive-la-Gaillarde", capacity: 14956 },
  armandie:           { name: "Stade Armandie",           city: "Agen",          capacity: 13863 },
  pre_fleuri:         { name: "Stade du Pré-Fleuri",      city: "Nevers",        capacity: 7500 },
  jean_alric:         { name: "Stade Jean-Alric",         city: "Aurillac",      capacity: 9000 },
  stade_chanzy:       { name: "Stade Chanzy",             city: "Angoulême",     capacity: 8000 },
  aguilera:           { name: "Parc des Sports Aguiléra", city: "Biarritz",      capacity: 13500 },
  raoul_barriere:     { name: "Stade Raoul-Barrière",     city: "Béziers",       capacity: 18555 },
  maurice_boyau:      { name: "Stade Maurice-Boyau",      city: "Dax",           capacity: 9500 },
  guy_boniface:       { name: "Stade Guy-Boniface",       city: "Mont-de-Marsan", capacity: 16800 },
  albert_domec:       { name: "Stade Albert-Domec",       city: "Carcassonne",   capacity: 10000 },

  // Betclic Élite (basket)
  arena_cholet:       { name: "Arena Cholet",             city: "Cholet",        capacity: 5700 },
  rhenus_sport:       { name: "Rhénus Sport",              city: "Strasbourg",    capacity: 6500 },
  astroballe:         { name: "Astroballe",                city: "Villeurbanne",  capacity: 5500, metro: "Lyon" },
  jean_weille:        { name: "Palais des Sports Jean-Weille", city: "Nancy",     capacity: 5700 },
  beaublanc:          { name: "Palais des Sports de Beaublanc", city: "Limoges", capacity: 5000 },
  ekinoxe:            { name: "EKINOXE",                   city: "Bourg-en-Bresse", capacity: 5500 },
  jean_michel_geoffroy: { name: "Palais des Sports Jean-Michel Geoffroy", city: "Dijon", capacity: 5700 },
  antares:            { name: "Antarès",                   city: "Le Mans",      capacity: 6200 },
  colisee_chalon:     { name: "Colisée",                   city: "Chalon-sur-Saône", capacity: 5700 },
  maurice_thorez:     { name: "Palais des Sports Maurice-Thorez", city: "Nanterre", capacity: 3200, metro: "Paris" },
  sportica:           { name: "Sportica",                  city: "Dunkerque",    capacity: 3600 },
  adidas_arena:       { name: "Adidas Arena",               city: "Paris",        capacity: 8000 },
  le_chaudron_portel: { name: "Le Chaudron",                city: "Le Portel",    capacity: 3000 },
  gaston_medecin:     { name: "Salle Gaston-Médecin",       city: "Monaco",       capacity: 4500 },
  trois_rivieres:     { name: "Palais des Sports",          city: "Boulazac",     capacity: 2500 },
  palais_sports_sqy:  { name: "Palais des Sports",          city: "Saint-Quentin", capacity: 2500 },

  // Starligue (handball masculin)
  pierre_coubertin:   { name: "Stade Pierre-de-Coubertin", city: "Paris",        capacity: 4500 },
  h_arena:            { name: "H Arena",                   city: "Nantes",       capacity: 5500 },
  le_phare_chambery:  { name: "Le Phare",                   city: "Chambéry",     capacity: 3000 },
  glaz_arena:         { name: "Glaz Arena",                 city: "Cesson-Sévigné", capacity: 4500 },
  andre_brouat:       { name: "Palais des Sports André-Brouat", city: "Toulouse", capacity: 4500 },
  rene_bougnol:       { name: "Palais des Sports René-Bougnol", city: "Montpellier", capacity: 4500 },
  palais_sports_saint_raphael: { name: "Palais des Sports", city: "Saint-Raphaël", capacity: 2500 },
  parnasse:           { name: "Le Parnasse",                city: "Nîmes",        capacity: 5500 },
  roger_vatuone:      { name: "Palais des Sports Roger-Vatuone", city: "Tremblay-en-France", capacity: 1500 },
  arena_aix:          { name: "Arena du Pays d'Aix",        city: "Aix-en-Provence", capacity: 5500 },
  comsia_arena:       { name: "Comsia Arena",                city: "Chartres",     capacity: 2500 },
  ssi_selestat:       { name: "Salle Sportive Intercommunale", city: "Sélestat",  capacity: 1800 },

  // Ligue Magnus (hockey) — 12 clubs officiels
  coliseum_amiens:    { name: "Coliseum",                   city: "Amiens",       capacity: 4000 },
  iceparc_angers:     { name: "Angers ICEPARC",              city: "Angers",       capacity: 3600 },
  meriadeck:          { name: "Patinoire Mériadeck",         city: "Bordeaux",     capacity: 3200 },
  patinoire_chamonix: { name: "Patinoire Richard-Bozon",     city: "Chamonix-Mont-Blanc", capacity: 2000 },
  alpe_arena_gap:     { name: "Alp'Arena",                   city: "Gap",          capacity: 3200 },
  pole_sud_grenoble:  { name: "Pôle Sud",                    city: "Grenoble",     capacity: 3700 },
  patinoire_anglet:   { name: "Patinoire d'Anglet",          city: "Anglet",       capacity: 1750 },
  patinoire_briancon: { name: "Patinoire René-Froger",       city: "Briançon",     capacity: 1700 },
  arenice_cergy:      { name: "Aren'Ice",                    city: "Cergy-Pontoise", capacity: 3500 },
  patinoire_marseille: { name: "Patinoire de Marseille",     city: "Marseille",    capacity: 2500 },
  patinoire_jean_bouin_nice: { name: "Patinoire Jean-Bouin", city: "Nice",         capacity: 3000 },
  ile_lacroix:        { name: "Île Lacroix",                 city: "Rouen",        capacity: 5300 },

  // La Boulangère Wonderligue (basket féminin)
  salle_jean_bouin_angers: { name: "Salle Jean-Bouin",       city: "Angers",       capacity: 3000 },
  francois_mitterrand:     { name: "Salle François-Mitterrand", city: "Mont-de-Marsan", capacity: 3000 },
  prado_bourges:           { name: "Le Prado",               city: "Bourges",      capacity: 4000 },
  carre_bleu:              { name: "Le Carré Bleu",          city: "Charnay-lès-Mâcon", capacity: 1800 },
  vivier_mezieres:         { name: "Salle du Vivier Méziérien", city: "Charleville-Mézières", capacity: 1800 },
  le_forum_landerneau:     { name: "Le Forum",               city: "Landerneau",   capacity: 1500 },
  la_foret_roche_vendee:   { name: "La Forêt",               city: "La Roche-sur-Yon", capacity: 2000 },
  marx_dormoy:             { name: "Salle Marx-Dormoy",       city: "Villeneuve-d'Ascq", capacity: 1800, metro: "Lille" },
  halle_chartres:          { name: "Le COSEC",                city: "Chartres",     capacity: 1500 },

  // Ligue Butagaz Énergie (handball féminin)
  arena_loire:             { name: "Arena Loire",            city: "Trélazé (Metz à confirmer)", capacity: 5500 },
  brest_arena:             { name: "Brest Arena",             city: "Brest",        capacity: 4200 },
  palais_omnisports_dijon: { name: "Palais des Sports Jean-Michel Geoffroy", city: "Dijon", capacity: 3500 },
  les_arenes_metz:         { name: "Les Arènes",               city: "Metz",         capacity: 5000 },
  halle_ehrmann_nice:      { name: "Halle des Sports Charles-Ehrmann", city: "Nice", capacity: 2000 },
  ghani_yalouz:            { name: "Palais des Sports Ghani-Yalouz", city: "Besançon", capacity: 3000 },
  fontaine_blanche:        { name: "Gymnase de la Fontaine Blanche", city: "Chambray-lès-Tours", capacity: 1500 },
  gymnase_ambrosis:        { name: "Gymnase des Ambrosis",     city: "Plan-de-Cuques", capacity: 1000 },
  salle_jean_verdavaine:   { name: "Complexe Jean-Verdavaine", city: "Saint-Amand-les-Eaux", capacity: 1200 },
  salle_toulon_hand:       { name: "Palais des Sports",        city: "Toulon",       capacity: 3000 },
  salle_le_havre_hand:     { name: "Salle omnisports",         city: "Le Havre",     capacity: 1500 },
  salle_saint_maur:        { name: "Salle omnisports",         city: "Saint-Maur-des-Fossés", capacity: 1200 },
  salle_sambre_avesnois:   { name: "Salle omnisports",         city: "Maubeuge",     capacity: 1200 },

  // Marmara SpikeLigue / Ligue AF (volley)
  palais_sports_tours:     { name: "Palais des Sports",       city: "Tours",        capacity: 3000 },
  palais_sports_poitiers:  { name: "Palais des Sports",       city: "Poitiers",     capacity: 3000 },
  salle_coubertin_paris:   { name: "Stade Pierre-de-Coubertin", city: "Paris",      capacity: 4000 },

  // Marmara SpikeLigue (volley masculin) — 14 clubs officiels LNV
  salle_ajaccio_volley: { name: "Salle Multisports",         city: "Ajaccio",      capacity: 1500 },
  espace_omnisports_cannes_h: { name: "Palais des Sports",   city: "Cannes",       capacity: 1500 },
  salle_chaumont:     { name: "Silo",                        city: "Chaumont",     capacity: 1800 },
  palais_sports_chaban_montpellier: { name: "Palais des Sports", city: "Montpellier", capacity: 2000 },
  salle_narbonne_volley: { name: "Le Palais du Travail",     city: "Narbonne",     capacity: 1200 },
  salle_nice_volley:  { name: "Palais des Sports Jean-Bouin", city: "Nice",        capacity: 2000 },
  salle_plessis_robinson: { name: "Espace Sportif Pierre-de-Coubertin", city: "Le Plessis-Robinson", capacity: 1200 },
  salle_sete:         { name: "Salle Léo-Lagrange",          city: "Sète",         capacity: 1500 },
  salle_saint_nazaire: { name: "Salle de l'Alvéole 12",      city: "Saint-Nazaire", capacity: 1500 },
  salle_toulouse_volley: { name: "Le PEC",                  city: "Toulouse",     capacity: 1800 },
  salle_tourcoing:    { name: "Salle Thelu",                 city: "Tourcoing",    capacity: 1500, metro: "Lille" },

  // Saforelle Power 6 / Ligue AF (volley féminin) — 13 clubs officiels LNV
  salle_battendier:        { name: "Salle Albert-Battendier",  city: "Béziers",      capacity: 1200 },
  le_palio:                { name: "Le Palio",                 city: "Bordeaux-Mérignac", capacity: 1000 },
  espace_fischesser:       { name: "Espace André-Fischesser",  city: "Cannes",       capacity: 1500 },
  salle_maneval:           { name: "Salle Maneval",             city: "Chamalières",  capacity: 800 },
  espace_bayard:           { name: "Espace Bayard",             city: "Évreux",       capacity: 1200 },
  salle_le_cannet:         { name: "Salle Pierre-de-Coubertin", city: "Le Cannet",    capacity: 1000 },
  salle_marcel_cerdan:     { name: "Palais des Sports Marcel-Cerdan", city: "Levallois-Perret", capacity: 1500, metro: "Paris" },
  le_phenix_marcq:         { name: "Le Phénix",                 city: "Marcq-en-Barœul", capacity: 1200, metro: "Lille" },
  palais_sports_mulhouse:  { name: "Palais des Sports",         city: "Mulhouse",     capacity: 3000 },
  cosec_saint_die:         { name: "COSEC",                     city: "Saint-Dié-des-Vosges", capacity: 1200 },
  salle_coubertin_terville:{ name: "Salle Pierre-de-Coubertin", city: "Terville",     capacity: 1000 },
  salle_vandoeuvre:        { name: "Salle Omnisports",           city: "Vandœuvre-lès-Nancy", capacity: 1000 },

  // Arkema Première Ligue (foot féminin) — stades spécifiques non partagés
  pierre_bertin:           { name: "Stade Pierre-Bertin",       city: "Fleury-Mérogis", capacity: 1500 },
  leo_lagrange_marseille:  { name: "Stade Léo-Lagrange",         city: "Marseille",    capacity: 2000 },
  camp_des_loges:          { name: "Stade Georges-Lefèvre (Camp des Loges)", city: "Saint-Germain-en-Laye", capacity: 1500, metro: "Paris" },
  groupama_training_center: { name: "Groupama OL Training Center", city: "Décines-Charpieu", capacity: 1500, metro: "Lyon" },
});

Object.assign(CLUBS, {
  // ---- Ligue 2 BKT 2026/2027 ----
  asse:       { name: "AS Saint-Étienne", short: "Saint-Étienne", league: "ligue2", stadium: "geoffroy_guichard", site: "https://www.asse.fr" },
  redstar:    { name: "Red Star FC", short: "Red Star", league: "ligue2", stadium: "stade_bauer", site: "https://www.redstar.fr" },
  rodez:      { name: "Rodez AF", short: "Rodez", league: "ligue2", stadium: "paul_lignon", site: "https://www.rafoot.fr" },
  reims:      { name: "Stade de Reims", short: "Reims", league: "ligue2", stadium: "auguste_delaune", site: "https://www.stade-de-reims.com" },
  annecy:     { name: "FC Annecy", short: "Annecy", league: "ligue2", stadium: "parc_des_sports_annecy", site: "https://www.fcannecy.com" },
  mhsc:       { name: "Montpellier HSC", short: "Montpellier", league: "ligue2", stadium: "mosson", site: "https://www.montpellierhsc.com" },
  paufc:      { name: "Pau FC", short: "Pau", league: "ligue2", stadium: "nouste_camp", site: "https://www.paufc.fr" },
  dunkerque:  { name: "USL Dunkerque", short: "Dunkerque", league: "ligue2", stadium: "marcel_tribut", site: "https://www.usldunkerque.com" },
  guingamp:   { name: "En Avant Guingamp", short: "Guingamp", league: "ligue2", stadium: "roudourou", site: "https://www.eaguingamp.com" },
  laval:      { name: "Stade Lavallois", short: "Laval", league: "ligue2", stadium: "francis_le_basser", site: "https://www.stade-lavallois.fr" },
  nancy:      { name: "AS Nancy-Lorraine", short: "Nancy", league: "ligue2", stadium: "marcel_picot", site: "https://www.asnl.net" },
  boulogne:   { name: "US Boulogne", short: "Boulogne", league: "ligue2", stadium: "stade_liberation", site: "https://www.usboulogne.com" },
  grenoblefoot: { name: "Grenoble Foot 38", short: "Grenoble", league: "ligue2", stadium: "stade_des_alpes", site: "https://www.grenoblefoot38.fr" },
  clermont:   { name: "Clermont Foot 63", short: "Clermont", league: "ligue2", stadium: "gabriel_montpied", site: "https://www.clermontfoot.com" },
  nantes:     { name: "FC Nantes", short: "Nantes", league: "ligue2", stadium: "beaujoire", site: "https://www.fcnantes.com" },
  metz:       { name: "FC Metz", short: "Metz", league: "ligue2", stadium: "saint_symphorien", site: "https://www.fcmetz.com" },
  dijonfco:   { name: "Dijon FCO", short: "Dijon", league: "ligue2", stadium: "gaston_gerard", site: "https://www.dijon-fco.com" },
  sochaux:    { name: "FC Sochaux-Montbéliard", short: "Sochaux", league: "ligue2", stadium: "auguste_bonal", site: "https://www.fcsochaux.fr" },

  // ---- Pro D2 (saison 2025/2026, en attente de la composition 2026/2027) ----
  vannes:     { name: "RC Vannes", short: "Vannes", league: "prod2", stadium: "rabine", site: "https://www.rcvannes.fr" },
  colomiers:  { name: "US Colomiers", short: "Colomiers", league: "prod2", stadium: "michel_bendichou", site: "https://www.uscolomiersrugby.fr" },
  provence:   { name: "Provence Rugby", short: "Provence", league: "prod2", stadium: "maurice_david", site: "https://www.provence-rugby.com" },
  valenceromans: { name: "Valence Romans Drôme Rugby", short: "Valence Romans", league: "prod2", stadium: "georges_pompidou_valence", site: "https://www.vrdrugby.fr" },
  oyonnax:    { name: "Oyonnax Rugby", short: "Oyonnax", league: "prod2", stadium: "charles_mathon", site: "https://www.oyonnaxrugby.com" },
  brive:      { name: "CA Brive Corrèze Limousin", short: "Brive", league: "prod2", stadium: "stadium_brive", site: "https://www.cabrive.com" },
  agen:       { name: "SU Agen", short: "Agen", league: "prod2", stadium: "armandie", site: "https://www.suagenrugby.com" },
  nevers:     { name: "USON Nevers Rugby", short: "Nevers", league: "prod2", stadium: "pre_fleuri", site: "https://www.usonrugby.fr" },
  aurillac:   { name: "Stade Aurillacois", short: "Aurillac", league: "prod2", stadium: "jean_alric", site: "https://www.stadeaurillacois.fr" },
  soyaux:     { name: "Soyaux Angoulême XV", short: "Soyaux Angoulême", league: "prod2", stadium: "stade_chanzy", site: "https://www.saxv.fr" },
  grenoblerugby: { name: "FC Grenoble Rugby", short: "Grenoble", league: "prod2", stadium: "stade_des_alpes", site: "https://www.fcgrugby.com" },
  biarritz:   { name: "Biarritz Olympique", short: "Biarritz", league: "prod2", stadium: "aguilera", site: "https://www.biarritz-olympique.fr" },
  beziers:    { name: "AS Béziers Hérault", short: "Béziers", league: "prod2", stadium: "raoul_barriere", site: "https://www.asbh.fr" },
  dax:        { name: "US Dax Rugby Landes", short: "Dax", league: "prod2", stadium: "maurice_boyau", site: "https://www.usdax.fr" },
  montois:    { name: "Stade Montois Rugby Pro", short: "Mont-de-Marsan", league: "prod2", stadium: "guy_boniface", site: "https://www.stade-montois.com" },
  carcassonne: { name: "US Carcassonne", short: "Carcassonne", league: "prod2", stadium: "albert_domec", site: "https://www.uscarcassonne.com" },

  // ---- Betclic Élite (basket masculin) ----
  cholet:     { name: "Cholet Basket", short: "Cholet", league: "betclic", stadium: "arena_cholet", site: "https://www.choletbasket.com" },
  sig:        { name: "SIG Strasbourg", short: "Strasbourg", league: "betclic", stadium: "rhenus_sport", site: "https://www.sig-basket.fr" },
  asvel:      { name: "ASVEL Lyon-Villeurbanne", short: "ASVEL", league: "betclic", stadium: "astroballe", site: "https://www.asvel.com" },
  slucnancy:  { name: "SLUC Nancy Basket", short: "Nancy", league: "betclic", stadium: "jean_weille", site: "https://www.slucnancybasket.com" },
  limoges:    { name: "Limoges CSP", short: "Limoges", league: "betclic", stadium: "beaublanc", site: "https://www.limogesabc.fr" },
  jlbourg:    { name: "JL Bourg Basket", short: "Bourg-en-Bresse", league: "betclic", stadium: "ekinoxe", site: "https://www.jlbourgbasket.com" },
  jdadijon:   { name: "JDA Dijon Basket", short: "Dijon", league: "betclic", stadium: "jean_michel_geoffroy", site: "https://www.jdadijon.com" },
  lemansbasket: { name: "Le Mans Sarthe Basket", short: "Le Mans", league: "betclic", stadium: "antares", site: "https://www.msbasket.com" },
  elanchalon: { name: "Élan Chalon", short: "Chalon-sur-Saône", league: "betclic", stadium: "colisee_chalon", site: "https://www.elanchalon.com" },
  nanterre92: { name: "Nanterre 92", short: "Nanterre", league: "betclic", stadium: "maurice_thorez", site: "https://www.nanterre92.fr" },
  bcm:        { name: "BCM Gravelines-Dunkerque", short: "Gravelines-Dunkerque", league: "betclic", stadium: "sportica", site: "https://www.bcm-basket.com" },
  parisbasket: { name: "Paris Basketball", short: "Paris", league: "betclic", stadium: "adidas_arena", site: "https://www.parisbasketball.club" },
  leportel:   { name: "ESSM Le Portel", short: "Le Portel", league: "betclic", stadium: "le_chaudron_portel", site: "https://www.essmbasket.com" },
  monacobasket: { name: "AS Monaco Basket", short: "Monaco", league: "betclic", stadium: "gaston_medecin", site: "https://www.asmonaco-basket.com" },
  boulazac:   { name: "Boulazac Basket Dordogne", short: "Boulazac", league: "betclic", stadium: "trois_rivieres", site: "https://www.bbd24.fr" },
  saintquentinbasket: { name: "Champagne Basket (Saint-Quentin)", short: "Saint-Quentin", league: "betclic", stadium: "palais_sports_sqy", site: "https://www.champagne-basket.com" },

  // ---- Starligue (handball masculin) ----
  psghand:    { name: "Paris Saint-Germain Handball", short: "PSG Hand", league: "starligue", stadium: "pierre_coubertin", site: "https://handball.psg.fr" },
  hbcnantes:  { name: "HBC Nantes", short: "Nantes", league: "starligue", stadium: "h_arena", site: "https://www.hbcnantes.fr" },
  chambery:   { name: "Chambéry Savoie Handball", short: "Chambéry", league: "starligue", stadium: "le_phare_chambery", site: "https://www.csmhandball.com" },
  cessonrennes: { name: "Cesson Rennes Métropole HB", short: "Cesson Rennes", league: "starligue", stadium: "glaz_arena", site: "https://www.cessonrennes-mhb.fr" },
  usdk:       { name: "USDK Dunkerque Handball", short: "Dunkerque", league: "starligue", stadium: "marcel_tribut", site: "https://www.usdk.fr" },
  fenixtoulouse: { name: "Fenix Toulouse Handball", short: "Toulouse", league: "starligue", stadium: "andre_brouat", site: "https://www.fenixtoulouse.com" },
  limogeshand: { name: "Limoges Handball", short: "Limoges", league: "starligue", stadium: "beaublanc", site: "https://www.limogeshandball.com" },
  montpellierhb: { name: "Montpellier Handball", short: "Montpellier", league: "starligue", stadium: "rene_bougnol", site: "https://www.montpellierhandball.com" },
  saintraphael: { name: "Saint-Raphaël Var Handball", short: "Saint-Raphaël", league: "starligue", stadium: "palais_sports_saint_raphael", site: "https://www.usrvhandball.com" },
  usamnimes:  { name: "USAM Nîmes", short: "Nîmes", league: "starligue", stadium: "parnasse", site: "https://www.usamhandball.com" },
  tremblay:   { name: "Tremblay-en-France Handball", short: "Tremblay", league: "starligue", stadium: "roger_vatuone", site: "https://www.tremblayhandball.com" },
  pauc:       { name: "PAUC Handball (Aix)", short: "Aix", league: "starligue", stadium: "arena_aix", site: "https://www.pauchandball.fr" },
  chartreshand: { name: "C' Chartres Métropole HB", short: "Chartres", league: "starligue", stadium: "comsia_arena", site: "https://www.chartreshandball.com" },
  selestat:   { name: "Sélestat Alsace Handball", short: "Sélestat", league: "starligue", stadium: "ssi_selestat", site: "https://www.selestat-handball.com" },
  dijonhand:  { name: "Dijon Métropole Handball", short: "Dijon", league: "starligue", stadium: "jean_michel_geoffroy", site: "https://www.dijonhandball.com" },
  istres:     { name: "Istres Provence Handball", short: "Istres", league: "starligue", stadium: "palais_sports_saint_raphael", site: "https://www.istreshandball.com" },

  // ---- Ligue Magnus (hockey sur glace) — 12 clubs officiels ----
  amiens:     { name: "Gothiques d'Amiens", short: "Amiens", league: "magnus", stadium: "coliseum_amiens", site: "https://www.gothiquesdamiens.com" },
  angershockey: { name: "Ducs d'Angers", short: "Angers", league: "magnus", stadium: "iceparc_angers", site: "https://www.hcangers.fr" },
  anglethockey: { name: "Hormadi Anglet", short: "Anglet", league: "magnus", stadium: "patinoire_anglet", site: "https://www.hormadianglet.com" },
  bordeauxhockey: { name: "Boxers de Bordeaux", short: "Bordeaux", league: "magnus", stadium: "meriadeck", site: "https://www.boxers-bordeaux.com" },
  brianconhockey: { name: "Diables Rouges de Briançon", short: "Briançon", league: "magnus", stadium: "patinoire_briancon", site: "https://www.diablesrouges.com" },
  cergyhockey: { name: "Jokers de Cergy-Pontoise", short: "Cergy-Pontoise", league: "magnus", stadium: "arenice_cergy", site: "https://www.jokersdecergy.com" },
  chamonix:   { name: "Chamois de Chamonix", short: "Chamonix", league: "magnus", stadium: "patinoire_chamonix", site: "https://www.chamonixhockey.com" },
  gaphockey:  { name: "Rapaces de Gap", short: "Gap", league: "magnus", stadium: "alpe_arena_gap", site: "https://www.rapaces-gap.fr" },
  grenoblehockey: { name: "Brûleurs de Loups (Grenoble)", short: "Grenoble", league: "magnus", stadium: "pole_sud_grenoble", site: "https://www.gren-hockey.com" },
  marseillehockey: { name: "Spartiates de Marseille", short: "Marseille", league: "magnus", stadium: "patinoire_marseille", site: "https://www.marseillehockey.com" },
  nicehockey: { name: "Aigles de Nice", short: "Nice", league: "magnus", stadium: "patinoire_jean_bouin_nice", site: "https://www.nicehockeyelite.com" },
  rouenhockey: { name: "Dragons de Rouen", short: "Rouen", league: "magnus", stadium: "ile_lacroix", site: "https://www.rouenhockeyelite.com" },

  // ---- La Boulangère Wonderligue (basket féminin) 2025/2026 ----
  angersbasketf: { name: "UF Angers Basket 49", short: "Angers", league: "lfb", stadium: "salle_jean_bouin_angers", site: "https://www.angersbasket.fr" },
  basketlandes: { name: "Basket Landes", short: "Basket Landes", league: "lfb", stadium: "francois_mitterrand", site: "https://www.basketlandes.com" },
  bourgesbasket: { name: "Tango Bourges Basket", short: "Bourges", league: "lfb", stadium: "prado_bourges", site: "https://www.bourgesbasket.com" },
  charnay:    { name: "Charnay Bourgogne Basket Sud", short: "Charnay", league: "lfb", stadium: "carre_bleu", site: "https://www.charnaybbs.com" },
  flammescarolo: { name: "Flammes Carolo Basket Ardenne", short: "Charleville-Mézières", league: "lfb", stadium: "vivier_mezieres", site: "https://www.flammescarolo.com" },
  landerneau: { name: "Landerneau Bretagne Basket", short: "Landerneau", league: "lfb", stadium: "le_forum_landerneau", site: "https://www.landerneaubasket.com" },
  asvelf:     { name: "Lyon ASVEL Féminin", short: "ASVEL Féminin", league: "lfb", stadium: "astroballe", site: "https://www.asvel.com" },
  lattesmontpellier: { name: "Lattes Montpellier Basket", short: "Lattes-Montpellier", league: "lfb", stadium: "rene_bougnol", site: "https://www.lattes-montpellier-basket.com" },
  rochevendee: { name: "Roche Vendée Basket Club", short: "La Roche-sur-Yon", league: "lfb", stadium: "la_foret_roche_vendee", site: "https://www.rvbc.fr" },
  toulousemb: { name: "Toulouse Métropole Basket", short: "Toulouse", league: "lfb", stadium: "andre_brouat", site: "https://www.toulousemetropolebasket.com" },
  esbva:      { name: "ESB Villeneuve d'Ascq", short: "Villeneuve d'Ascq", league: "lfb", stadium: "marx_dormoy", site: "https://www.esbva-lm.com" },
  chartresbf: { name: "C'Chartres Basket Féminin", short: "Chartres", league: "lfb", stadium: "halle_chartres", site: "https://www.chartresbasket.com" },

  // ---- Ligue Butagaz Énergie (handball féminin) — 13 des 14 clubs confirmés 2025/2026 ----
  metzhand:   { name: "Metz Handball", short: "Metz", league: "lfh", stadium: "les_arenes_metz", site: "https://www.metz-handball.com" },
  brestbretagne: { name: "Brest Bretagne Handball", short: "Brest", league: "lfh", stadium: "brest_arena", site: "https://www.brestbretagnehandball.com" },
  dijonhandf: { name: "JDA Bourgogne Dijon Handball", short: "Dijon", league: "lfh", stadium: "palais_omnisports_dijon", site: "https://www.jeannedarcdijonhandball.com" },
  nicehandf:  { name: "OGC Nice Handball", short: "Nice", league: "lfh", stadium: "halle_ehrmann_nice", site: "https://www.ogcnice.com" },
  paris92:    { name: "Paris 92", short: "Paris 92", league: "lfh", stadium: "pierre_coubertin", site: "https://www.paris92handball.fr" },
  toulonhand: { name: "Toulon Saint-Cyr Var Handball", short: "Toulon", league: "lfh", stadium: "salle_toulon_hand", site: "https://www.tscvh.fr" },
  lehavrehand: { name: "Le Havre AC Handball", short: "Le Havre", league: "lfh", stadium: "salle_le_havre_hand", site: "https://www.hac-handball.fr" },
  saintamand: { name: "Saint-Amand Handball", short: "Saint-Amand", league: "lfh", stadium: "salle_jean_verdavaine", site: "https://www.hbc-saintamand.com" },
  chambraytouraine: { name: "Chambray Touraine Handball", short: "Chambray", league: "lfh", stadium: "fontaine_blanche", site: "https://www.chambray-touraine-handball.fr" },
  besanconhandf: { name: "ES Besançon Féminin", short: "Besançon", league: "lfh", stadium: "ghani_yalouz", site: "https://www.esbesanconhandball.com" },
  plandecuques: { name: "Handball Plan-de-Cuques", short: "Plan-de-Cuques", league: "lfh", stadium: "gymnase_ambrosis", site: "https://www.hbpc13.fr" },
  stellasaintmaur: { name: "Stella Saint-Maur Handball", short: "Saint-Maur", league: "lfh", stadium: "salle_saint_maur", site: "https://www.stellahandball.fr" },
  sambreavesnois: { name: "Sambre Avesnois Handball", short: "Sambre Avesnois", league: "lfh", stadium: "salle_sambre_avesnois", site: "https://www.sambreavesnoishandball.fr" },

  // ---- Marmara SpikeLigue (volley masculin) — 14 clubs officiels 2025/2026 ----
  ajacciovolley: { name: "GFC Ajaccio Volley-Ball", short: "Ajaccio", league: "marmara", stadium: "salle_ajaccio_volley", site: "https://www.lnv.fr/lam/equipes/ajaccio-177" },
  canneshvolleym: { name: "AS Cannes Volley-Ball", short: "Cannes", league: "marmara", stadium: "espace_omnisports_cannes_h", site: "https://www.lnv.fr/lam/equipes/cannes-3318" },
  chaumontvb: { name: "Chaumont Volley-Ball 52", short: "Chaumont", league: "marmara", stadium: "salle_chaumont", site: "https://www.lnv.fr/lam/equipes/chaumont-176" },
  montpelliervolley: { name: "Montpellier Volley", short: "Montpellier", league: "marmara", stadium: "palais_sports_chaban_montpellier", site: "https://www.lnv.fr/lam/equipes/montpellier-115" },
  narbonnevolley: { name: "Narbonne Volley", short: "Narbonne", league: "marmara", stadium: "salle_narbonne_volley", site: "https://www.lnv.fr/lam/equipes/narbonne-161" },
  nicevolleym: { name: "Nice Volley-Ball", short: "Nice", league: "marmara", stadium: "salle_nice_volley", site: "https://www.lnv.fr/lam/equipes/nice-179" },
  parisvolley: { name: "Paris Volley", short: "Paris", league: "marmara", stadium: "salle_coubertin_paris", site: "https://www.lnv.fr/lam/equipes/paris-180" },
  plessisrobinson: { name: "Plessis-Robinson Volley", short: "Plessis-Robinson", league: "marmara", stadium: "salle_plessis_robinson", site: "https://www.lnv.fr/lam/equipes/plessis-robinson-3329" },
  poitiersvolley: { name: "Stade Poitevin Volley", short: "Poitiers", league: "marmara", stadium: "palais_sports_poitiers", site: "https://www.lnv.fr/lam/equipes/poitiers-182" },
  setevolley: { name: "Arago de Sète", short: "Sète", league: "marmara", stadium: "salle_sete", site: "https://www.lnv.fr/lam/equipes/sete-173" },
  saintnazairevolley: { name: "Saint-Nazaire Volley-Ball Atlantique", short: "Saint-Nazaire", league: "marmara", stadium: "salle_saint_nazaire", site: "https://www.lnv.fr/lam/equipes/st-nazaire-3331" },
  toulousevolley: { name: "Toulouse Spacer's Volley", short: "Toulouse", league: "marmara", stadium: "salle_toulouse_volley", site: "https://www.lnv.fr/lam/equipes/toulouse-53" },
  tourcoingvolley: { name: "Tourcoing Lille Métropole Volley", short: "Tourcoing", league: "marmara", stadium: "salle_tourcoing", site: "https://www.lnv.fr/lam/equipes/tourcoing-181" },
  toursvb:    { name: "Tours Volley-Ball", short: "Tours", league: "marmara", stadium: "palais_sports_tours", site: "https://www.lnv.fr/lam/equipes/tours-117" },

  // ---- Saforelle Power 6 / Ligue AF (volley féminin) — 13 clubs officiels 2025/2026 ----
  beziersvolleyf: { name: "Béziers Volley", short: "Béziers", league: "ligueaf", stadium: "salle_battendier", site: "https://www.lnv.fr/laf/equipes/beziers-3309" },
  bordeauxmerignac: { name: "Bordeaux Mérignac Volley", short: "Bordeaux-Mérignac", league: "ligueaf", stadium: "le_palio", site: "https://www.lnv.fr/laf/equipes/bordeaux-merignac-12660" },
  canneshvb:  { name: "Racing Club de Cannes", short: "Cannes", league: "ligueaf", stadium: "espace_fischesser", site: "https://www.lnv.fr/laf/equipes/cannes-174" },
  chamalieres: { name: "Chamalières Volley", short: "Chamalières", league: "ligueaf", stadium: "salle_maneval", site: "https://www.lnv.fr/laf/equipes/chamalieres-3310" },
  evreuxvolleyf: { name: "Évreux Volley", short: "Évreux", league: "ligueaf", stadium: "espace_bayard", site: "https://www.lnv.fr/laf/equipes/evreux-7356" },
  franceavenirf: { name: "France Avenir", short: "France Avenir", league: "ligueaf", stadium: "espace_bayard", site: "https://www.lnv.fr/laf/equipes/france-avenir-3311" },
  lecannetvolero: { name: "Volero Le Cannet", short: "Le Cannet", league: "ligueaf", stadium: "salle_le_cannet", site: "https://www.lnv.fr/laf/equipes/le-cannet-3313" },
  levalloisvolley: { name: "Levallois Paris Saint-Cloud", short: "Levallois Paris", league: "ligueaf", stadium: "salle_marcel_cerdan", site: "https://www.lnv.fr/laf/equipes/levallois-paris-3319" },
  marcqenbaroeul: { name: "Marcq-en-Barœul Volley", short: "Marcq-en-Barœul", league: "ligueaf", stadium: "le_phenix_marcq", site: "https://www.lnv.fr/laf/equipes/marcq-en-baroeul-3315" },
  mulhousevolleyf: { name: "Volley-Ball Mulhouse", short: "Mulhouse", league: "ligueaf", stadium: "palais_sports_mulhouse", site: "https://www.lnv.fr/laf/equipes/mulhouse-3308" },
  saintdievolley: { name: "Saint-Dié Volley-Ball", short: "Saint-Dié", league: "ligueaf", stadium: "cosec_saint_die", site: "https://www.lnv.fr/laf/equipes/st-die-13707" },
  tervillevolleyf: { name: "Terville Florange Olympique Club", short: "Terville Florange", league: "ligueaf", stadium: "salle_coubertin_terville", site: "https://www.lnv.fr/laf/equipes/terville-3321" },
  vandoeuvrenancy: { name: "Vandœuvre Nancy Volley", short: "Vandœuvre Nancy", league: "ligueaf", stadium: "salle_vandoeuvre", site: "https://www.lnv.fr/laf/equipes/vandoeuvre-nancy-3334" },

  // ---- Arkema Première Ligue (foot féminin) — 12 clubs officiels 2025/2026 ----
  ollyonnesf: { name: "OL Lyonnes", short: "OL Lyonnes", league: "arkema", stadium: "groupama_training_center", site: "https://www.ol.fr/equipe-feminine" },
  parisfcf:   { name: "Paris FC (Féminines)", short: "Paris FC", league: "arkema", stadium: "jean_bouin", site: "https://www.paris.fc" },
  psgf:       { name: "Paris Saint-Germain (Féminines)", short: "PSG", league: "arkema", stadium: "camp_des_loges", site: "https://www.psg.fr/feminines" },
  nantesf:    { name: "FC Nantes (Féminines)", short: "Nantes", league: "arkema", stadium: "beaujoire", site: "https://www.fcnantes.com" },
  fleury91f:  { name: "FC Fleury 91", short: "Fleury 91", league: "arkema", stadium: "pierre_bertin", site: "https://www.fcfleury91.com" },
  dijonfcof:  { name: "Dijon FCO (Féminines)", short: "Dijon", league: "arkema", stadium: "gaston_gerard", site: "https://www.dijon-fco.com" },
  rcsaf:      { name: "RC Strasbourg Alsace (Féminines)", short: "Strasbourg", league: "arkema", stadium: "meinau", site: "https://www.rcstrasbourgalsace.fr" },
  havreacf:   { name: "Le Havre AC (Féminines)", short: "Le Havre", league: "arkema", stadium: "stade_oceane", site: "https://www.hac-foot.com" },
  omf:        { name: "Olympique de Marseille (Féminines)", short: "OM", league: "arkema", stadium: "leo_lagrange_marseille", site: "https://www.om.fr" },
  mhscf:      { name: "MHSC Féminines", short: "Montpellier", league: "arkema", stadium: "mosson", site: "https://www.montpellierhsc.com" },
  rclensf:    { name: "RC Lens (Féminines)", short: "Lens", league: "arkema", stadium: "bollaert", site: "https://www.rclens.fr" },
  assef:      { name: "AS Saint-Étienne (Féminines)", short: "Saint-Étienne", league: "arkema", stadium: "geoffroy_guichard", site: "https://www.asse.fr" },
});

Object.assign(LEAGUES, {
  ligue2:   { name: "Ligue 2 BKT",             sport: "Football",     accent: "var(--accent-foot)",  site: "https://ligue1.com/fr/competitions/ligue2bkt" },
  prod2:    { name: "Pro D2",                  sport: "Rugby à XV",   accent: "var(--accent-rugby)", site: "https://prod2.lnr.fr" },
  betclic:  { name: "Betclic Élite",           sport: "Basket-ball",  accent: "var(--accent-foot)",  site: "https://www.lnb.fr" },
  starligue:{ name: "Liqui Moly Starligue",    sport: "Handball",     accent: "var(--accent-rugby)", site: "https://www.lnh.fr" },
  magnus:   { name: "Ligue Magnus",            sport: "Hockey sur glace", accent: "var(--accent-foot)", site: "https://www.liguemagnus.com" },
  ehfcl:    { name: "EHF Champions League",    sport: "Handball (Europe)", accent: "var(--accent-rugby)", site: "https://ehfcl.eurohandball.com" },
  lfb:      { name: "La Boulangère Wonderligue", sport: "Basket-ball féminin", accent: "var(--accent-rugby)", site: "https://www.lfb.fr" },
  lfh:      { name: "Ligue Butagaz Énergie",   sport: "Handball féminin", accent: "var(--accent-foot)", site: "https://ligue-feminine-handball.fr" },
  marmara:  { name: "Marmara SpikeLigue",      sport: "Volley-ball",  accent: "var(--accent-rugby)", site: "https://www.lnv.fr" },
  ligueaf:  { name: "Saforelle Power 6 (Ligue AF)", sport: "Volley-ball féminin", accent: "var(--accent-foot)", site: "https://www.lnv.fr/competitions/ligue-a-feminine" },
  arkema:   { name: "Arkema Première Ligue",  sport: "Football féminin", accent: "var(--accent-rugby)", site: "https://epreuves.fff.fr/competition/engagement/436476-arkema-premiere-ligue" },

  // ---- Divisions inférieures ----
  national: { name: "Championnat National",   sport: "Football",    accent: "var(--accent-foot)",  site: "https://www.fff.fr" },
  eliteb:   { name: "Pro B / Élite 2",         sport: "Basket-ball",  accent: "var(--accent-foot)",  site: "https://www.lnb.fr" },
  nationale_rugby: { name: "Nationale",        sport: "Rugby à XV",   accent: "var(--accent-rugby)", site: "https://www.ffr.fr" },

  // ---- Coupes d'Europe (clubs français uniquement) ----
  uefacl:   { name: "UEFA Champions League",   sport: "Football (Europe)", accent: "var(--accent-foot)", site: "https://www.uefa.com/uefachampionsleague/" },
  uefael:   { name: "UEFA Europa League",      sport: "Football (Europe)", accent: "var(--accent-foot)", site: "https://www.uefa.com/uefaeuropaleague/" },
  uefaconf: { name: "UEFA Conference League",  sport: "Football (Europe)", accent: "var(--accent-foot)", site: "https://www.uefa.com/europaconferenceleague/" },
  rugbycc:  { name: "Champions Cup",           sport: "Rugby (Europe)", accent: "var(--accent-rugby)", site: "https://www.epcrugby.com" },
  rugbychall: { name: "Challenge Cup",         sport: "Rugby (Europe)", accent: "var(--accent-rugby)", site: "https://www.epcrugby.com" },
  euroleague: { name: "Euroleague",            sport: "Basket-ball (Europe)", accent: "var(--accent-foot)", site: "https://www.euroleaguebasketball.net" },
  eurocup:  { name: "EuroCup",                 sport: "Basket-ball (Europe)", accent: "var(--accent-foot)", site: "https://www.euroleaguebasketball.net" },
  bcl:      { name: "Basketball Champions League", sport: "Basket-ball (Europe)", accent: "var(--accent-foot)", site: "https://www.championsleague.basketball" },
  chl:      { name: "Champions Hockey League", sport: "Hockey sur glace (Europe)", accent: "var(--accent-rugby)", site: "https://www.championshockeyleague.com" },
  ehfcl_f:  { name: "EHF Champions League (F)", sport: "Handball féminin (Europe)", accent: "var(--accent-rugby)", site: "https://ehfcl.eurohandball.com" },
  ehfel:    { name: "EHF European League",     sport: "Handball (Europe)", accent: "var(--accent-rugby)", site: "https://ehfel.eurohandball.com" },
  cevcl:    { name: "CEV Champions League",    sport: "Volley-ball (Europe)", accent: "var(--accent-rugby)", site: "https://www.cev.eu" },

  // ---- Équipes de France ----
  fra_rugby_h:  { name: "France Rugby (H)",     sport: "Rugby à XV — Équipe de France", accent: "var(--accent-rugby)", site: "https://www.ffr.fr" },
  fra_rugby_f:  { name: "France Rugby (F)",     sport: "Rugby à XV — Équipe de France", accent: "var(--accent-rugby)", site: "https://www.ffr.fr" },
  fra_foot_h:   { name: "France Football (H)",  sport: "Football — Équipe de France",  accent: "var(--accent-foot)",  site: "https://www.fff.fr" },
  fra_foot_f:   { name: "France Football (F)",  sport: "Football — Équipe de France",  accent: "var(--accent-foot)",  site: "https://www.fff.fr" },
  fra_hand_h:   { name: "France Handball (H)",  sport: "Handball — Équipe de France",  accent: "var(--accent-rugby)", site: "https://www.ff-handball.org" },
  fra_basket_h: { name: "France Basketball (H)", sport: "Basket-ball — Équipe de France", accent: "var(--accent-foot)", site: "https://www.ffbb.com" },
  fra_basket_f: { name: "France Basketball (F)", sport: "Basket-ball — Équipe de France", accent: "var(--accent-foot)", site: "https://www.ffbb.com" },
});

MATCHES.push(
  // ---- Ligue 2 BKT — saison 2026/2027 ----
  { id: "l2-2627", league: "ligue2", competition: "Ligue 2 BKT — Saison 2026/2027", date: "2026-08-08", time: null, home: null, away: null, stadium: null, status: "upcoming", note: "Reprise de la Ligue 2 le 8 août 2026. Calendrier détaillé publié par la LFP à l'approche de la saison." },
  { id: "l2-champ2526", league: "ligue2", competition: "Ligue 2 BKT 2025/2026 — Bilan", date: "2026-05-08", time: null, home: "asse", away: null, stadium: "geoffroy_guichard", status: "played", note: "Troyes a été sacré champion de Ligue 2 2025/2026 ; Saint-Étienne a terminé 3e et disputé les barrages d'accession." },

  // ---- Pro D2 — saison 2025/2026 (à compléter pour 2026/2027) ----
  { id: "pd2-2627", league: "prod2", competition: "Pro D2 — Saison 2026/2027", date: "2026-08-28", time: null, home: null, away: null, stadium: null, status: "upcoming", note: "Reprise de Pro D2 le week-end du 28 août 2026. Composition définitive des 16 clubs et calendrier à paraître." },

  // ---- Betclic Élite — repères de saison ----
  { id: "bce-j1", league: "betclic", competition: "Betclic Élite — Journée 1 (2025/2026)", date: "2025-09-27", time: null, home: "parisbasket", away: "bcm", stadium: "adidas_arena", status: "played", note: "Le champion de France 2025, Paris Basketball, ouvrait sa saison à Gravelines-Dunkerque." },
  { id: "bce-finale2025", league: "betclic", competition: "Betclic Élite — Bilan 2024/2025", date: "2025-06-01", time: null, home: "parisbasket", away: null, stadium: "adidas_arena", status: "played", note: "Paris Basketball a remporté le titre de champion de France 2025." },

  // ---- Starligue — repères de saison ----
  { id: "sl-2526", league: "starligue", competition: "Starligue 2025/2026 — Bilan", date: "2026-05-29", time: null, home: "psghand", away: "hbcnantes", stadium: "pierre_coubertin", status: "played", note: "Le PSG a remporté un 13e titre, dont le 12e consécutif, devant le HBC Nantes." },

  // ---- Ligue Magnus — finale 2025/2026 ----
  { id: "magnus-finale2526", league: "magnus", competition: "Ligue Magnus — Finale 2025/2026", date: "2026-04-01", time: null, home: "bordeauxhockey", away: "gaphockey", stadium: "meriadeck", status: "played", score: { home: 5, away: 1 }, note: "Bordeaux a remporté son premier titre de champion de France de hockey sur glace face à Gap, confirmé par la Ligue Magnus." },
  { id: "magnus-2627", league: "magnus", competition: "Ligue Magnus — Saison 2026/2027", date: "2026-09-15", time: null, home: null, away: null, stadium: null, status: "upcoming", note: "Reprise de la Synerglace Ligue Magnus le mardi 15 septembre 2026, pour une 12e saison à 12 clubs." },

  // ---- La Boulangère Wonderligue — bilan 2025/2026 ----
  { id: "lfb-2526", league: "lfb", competition: "La Boulangère Wonderligue — Finale playoffs 2025/2026", date: "2026-05-17", time: null, home: "basketlandes", away: "bourgesbasket", stadium: "francois_mitterrand", status: "played", score: { home: 53, away: 50 }, note: "Basket Landes remporte la finale des playoffs face à Bourges (2 victoires à 1, après une défaite au match 1), décrochant le titre de championne de France 2025/2026." },

  // ---- Ligue Butagaz Énergie — repères ----
  { id: "lfh-2526", league: "lfh", competition: "Ligue Butagaz Énergie 2025/2026", date: "2025-09-03", time: null, home: "metzhand", away: "brestbretagne", stadium: "les_arenes_metz", status: "played", note: "Brest et Metz ont dominé la saison régulière, invaincus l'un comme l'autre sur une grande partie du championnat ; Le Havre et Sambre Avesnois ont terminé aux deux dernières places et sont relégués en Division 2 pour 2026/2027." },

  // ---- Marmara SpikeLigue — finale 2025/2026 ----
  { id: "marmara-finale2526", league: "marmara", competition: "Marmara SpikeLigue — Finale 2025/2026", date: "2026-05-06", time: null, home: "montpelliervolley", away: "poitiersvolley", stadium: "palais_sports_chaban_montpellier", status: "played", note: "Montpellier remporte un 9e titre de champion de France en dominant Poitiers (victoires à l'aller et au retour)." },

  // ---- Saforelle Power 6 (Ligue AF) — finale 2025/2026 ----
  { id: "ligueaf-2526", league: "ligueaf", competition: "Saforelle Power 6 — Finale 2025/2026", date: "2026-04-25", time: null, home: "mulhousevolleyf", away: "levalloisvolley", stadium: "palais_sports_mulhouse", status: "played", note: "Finale inédite entre Mulhouse et Levallois Paris : Mulhouse réalise le triplé (championnat, Coupe de France, Supercoupe) en 2025/2026." },

  // ---- Arkema Première Ligue (foot féminin) — bilan 2025/2026 ----
  { id: "arkema-demi-1", league: "arkema", competition: "Arkema Première Ligue — Demi-finale playoffs", date: "2026-05-17", time: null, home: "ollyonnesf", away: "nantesf", stadium: "groupama_training_center", status: "played", score: { home: 8, away: 0 }, note: "L'OL Lyonnes écrase Nantes et file en finale." },
  { id: "arkema-demi-2", league: "arkema", competition: "Arkema Première Ligue — Demi-finale playoffs", date: "2026-05-17", time: null, home: "parisfcf", away: "psgf", stadium: "jean_bouin", status: "played", score: { home: 1, away: 0 }, note: "Le Paris FC rejoint l'OL Lyonnes en finale aux dépens du Paris Saint-Germain." },
  { id: "arkema-finale2526", league: "arkema", competition: "Arkema Première Ligue — Finale playoffs 2025/2026", date: "2026-05-24", time: null, home: "ollyonnesf", away: "parisfcf", stadium: "groupama_stadium", status: "played", note: "L'OL Lyonnes est sacrée championne de France 2025/2026, devant le Paris FC et le Paris Saint-Germain (3e). La saison régulière (22 journées) avait vu l'OL Lyonnes terminer largement en tête avec 60 points." }
);
// ============================================================
// Ligue 1 2025/2026 — calendrier complet officiel (LFP)
// 34 journées, 306 matchs. Source : PDF calendrier officiel LFP.
// Scores non inclus (non communiqués par cette source officielle).
// ============================================================
const LIGUE1_2526_ROUNDS = [
  { date: "2025-08-17", pairs: [["srfc","om"], ["rcl","ol"], ["ogcn","tfc"], ["auxerre","lorient"], ["brest","losc"], ["angers","parisfc"], ["metz","rcsa"], ["asm","havre"], ["nantes","psg"]] },
  { date: "2025-08-24", pairs: [["om","parisfc"], ["losc","asm"], ["havre","rcl"], ["lorient","srfc"], ["ogcn","auxerre"], ["tfc","brest"], ["ol","metz"], ["rcsa","nantes"], ["psg","angers"]] },
  { date: "2025-08-31", pairs: [["tfc","psg"], ["asm","rcsa"], ["rcl","brest"], ["nantes","auxerre"], ["angers","srfc"], ["parisfc","metz"], ["havre","ogcn"], ["lorient","losc"], ["ol","om"]] },
  { date: "2025-09-14", pairs: [["om","lorient"], ["psg","rcl"], ["auxerre","asm"], ["ogcn","nantes"], ["metz","angers"], ["brest","parisfc"], ["rcsa","havre"], ["losc","tfc"], ["srfc","ol"]] },
  { date: "2025-09-21", pairs: [["rcl","losc"], ["nantes","srfc"], ["parisfc","rcsa"], ["brest","ogcn"], ["auxerre","tfc"], ["havre","lorient"], ["asm","metz"], ["ol","angers"], ["om","psg"]] },
  { date: "2025-09-28", pairs: [["rcsa","om"], ["angers","brest"], ["srfc","rcl"], ["tfc","nantes"], ["metz","havre"], ["ogcn","parisfc"], ["lorient","asm"], ["losc","ol"], ["psg","auxerre"]] },
  { date: "2025-10-05", pairs: [["asm","ogcn"], ["metz","om"], ["ol","tfc"], ["havre","srfc"], ["parisfc","lorient"], ["rcsa","angers"], ["brest","nantes"], ["auxerre","rcl"], ["losc","psg"]] },
  { date: "2025-10-19", pairs: [["om","havre"], ["ogcn","ol"], ["psg","rcsa"], ["tfc","metz"], ["rcl","parisfc"], ["lorient","brest"], ["angers","asm"], ["nantes","losc"], ["srfc","auxerre"]] },
  { date: "2025-10-26", pairs: [["ol","rcsa"], ["angers","lorient"], ["asm","tfc"], ["srfc","ogcn"], ["auxerre","havre"], ["losc","metz"], ["parisfc","nantes"], ["rcl","om"], ["brest","psg"]] },
  { date: "2025-10-29", pairs: [["om","angers"], ["lorient","psg"], ["nantes","asm"], ["rcsa","auxerre"], ["parisfc","ol"], ["havre","brest"], ["tfc","srfc"], ["metz","rcl"], ["ogcn","losc"]] },
  { date: "2025-11-02", pairs: [["psg","ogcn"], ["tfc","havre"], ["losc","angers"], ["srfc","rcsa"], ["rcl","lorient"], ["brest","ol"], ["nantes","metz"], ["asm","parisfc"], ["auxerre","om"]] },
  { date: "2025-11-09", pairs: [["om","brest"], ["ol","psg"], ["metz","ogcn"], ["angers","auxerre"], ["havre","nantes"], ["parisfc","srfc"], ["lorient","tfc"], ["asm","rcl"], ["rcsa","losc"]] },
  { date: "2025-11-23", pairs: [["rcl","rcsa"], ["srfc","asm"], ["nantes","lorient"], ["tfc","angers"], ["brest","metz"], ["losc","parisfc"], ["auxerre","ol"], ["ogcn","om"], ["psg","havre"]] },
  { date: "2025-11-30", pairs: [["ol","nantes"], ["parisfc","auxerre"], ["angers","rcl"], ["havre","losc"], ["metz","srfc"], ["rcsa","brest"], ["lorient","ogcn"], ["asm","psg"], ["om","tfc"]] },
  { date: "2025-12-07", pairs: [["losc","om"], ["havre","parisfc"], ["auxerre","metz"], ["nantes","rcl"], ["ogcn","angers"], ["brest","asm"], ["lorient","ol"], ["tfc","rcsa"], ["psg","srfc"]] },
  { date: "2025-12-14", pairs: [["angers","nantes"], ["parisfc","tfc"], ["auxerre","losc"], ["srfc","brest"], ["ol","havre"], ["rcsa","lorient"], ["metz","psg"], ["rcl","ogcn"], ["om","asm"]] },
  { date: "2026-01-04", pairs: [["ogcn","rcsa"], ["psg","parisfc"], ["asm","ol"], ["losc","srfc"], ["havre","angers"], ["lorient","metz"], ["brest","auxerre"], ["tfc","rcl"], ["om","nantes"]] },
  { date: "2026-01-18", pairs: [["srfc","havre"], ["rcsa","metz"], ["ol","brest"], ["rcl","auxerre"], ["tfc","ogcn"], ["nantes","parisfc"], ["asm","lorient"], ["psg","losc"], ["angers","om"]] },
  { date: "2026-01-25", pairs: [["losc","rcsa"], ["auxerre","psg"], ["brest","tfc"], ["parisfc","angers"], ["srfc","lorient"], ["metz","ol"], ["havre","asm"], ["nantes","ogcn"], ["om","rcl"]] },
  { date: "2026-02-01", pairs: [["parisfc","om"], ["ol","losc"], ["rcsa","psg"], ["tfc","auxerre"], ["lorient","nantes"], ["asm","srfc"], ["rcl","havre"], ["ogcn","brest"], ["angers","metz"]] },
  { date: "2026-02-08", pairs: [["psg","om"], ["ogcn","asm"], ["brest","lorient"], ["havre","rcsa"], ["auxerre","parisfc"], ["nantes","ol"], ["rcl","srfc"], ["angers","tfc"], ["metz","losc"]] },
  { date: "2026-02-15", pairs: [["ol","ogcn"], ["om","rcsa"], ["losc","brest"], ["havre","tfc"], ["metz","auxerre"], ["lorient","angers"], ["asm","nantes"], ["parisfc","rcl"], ["srfc","psg"]] },
  { date: "2026-02-22", pairs: [["rcsa","ol"], ["rcl","asm"], ["psg","metz"], ["brest","om"], ["ogcn","lorient"], ["nantes","havre"], ["tfc","parisfc"], ["angers","losc"], ["auxerre","srfc"]] },
  { date: "2026-03-01", pairs: [["havre","psg"], ["srfc","tfc"], ["asm","angers"], ["lorient","auxerre"], ["metz","brest"], ["losc","nantes"], ["parisfc","ogcn"], ["rcsa","rcl"], ["om","ol"]] },
  { date: "2026-03-08", pairs: [["tfc","om"], ["brest","havre"], ["ogcn","srfc"], ["ol","parisfc"], ["rcl","metz"], ["losc","lorient"], ["auxerre","rcsa"], ["nantes","angers"], ["psg","asm"]] },
  { date: "2026-03-15", pairs: [["psg","nantes"], ["lorient","rcl"], ["havre","ol"], ["rcsa","parisfc"], ["metz","tfc"], ["srfc","losc"], ["angers","ogcn"], ["asm","brest"], ["om","auxerre"]] },
  { date: "2026-03-22", pairs: [["ol","asm"], ["auxerre","brest"], ["srfc","metz"], ["nantes","rcsa"], ["rcl","angers"], ["parisfc","havre"], ["tfc","lorient"], ["ogcn","psg"], ["om","losc"]] },
  { date: "2026-04-05", pairs: [["asm","om"], ["brest","srfc"], ["angers","ol"], ["metz","nantes"], ["havre","auxerre"], ["lorient","parisfc"], ["losc","rcl"], ["psg","tfc"], ["rcsa","ogcn"]] },
  { date: "2026-04-12", pairs: [["om","metz"], ["ol","lorient"], ["srfc","angers"], ["ogcn","havre"], ["brest","rcsa"], ["parisfc","asm"], ["tfc","losc"], ["auxerre","nantes"], ["rcl","psg"]] },
  { date: "2026-04-19", pairs: [["lorient","om"], ["rcsa","srfc"], ["metz","parisfc"], ["rcl","tfc"], ["angers","havre"], ["asm","auxerre"], ["nantes","brest"], ["losc","ogcn"], ["psg","ol"]] },
  { date: "2026-04-26", pairs: [["srfc","nantes"], ["angers","psg"], ["havre","metz"], ["parisfc","losc"], ["lorient","rcsa"], ["ol","auxerre"], ["tfc","asm"], ["brest","rcl"], ["om","ogcn"]] },
  { date: "2026-05-03", pairs: [["psg","lorient"], ["nantes","om"], ["metz","asm"], ["losc","havre"], ["rcsa","tfc"], ["ol","srfc"], ["parisfc","brest"], ["auxerre","angers"], ["ogcn","rcl"]] },
  { date: "2026-05-09", pairs: [["psg","brest"], ["havre","om"], ["tfc","ol"], ["rcl","nantes"], ["auxerre","ogcn"], ["srfc","parisfc"], ["metz","lorient"], ["angers","rcsa"], ["asm","losc"]] },
  { date: "2026-05-16", pairs: [["nantes","tfc"], ["lorient","havre"], ["brest","angers"], ["losc","auxerre"], ["ogcn","metz"], ["parisfc","psg"], ["om","srfc"], ["rcsa","asm"], ["ol","rcl"]] },
];

LIGUE1_2526_ROUNDS.forEach((round, idx) => {
  const journee = idx + 1;
  round.pairs.forEach((pair, i) => {
    const home = pair[0], away = pair[1];
    MATCHES.push({
      id: `l1-2526-j${journee}-${i+1}`,
      league: "ligue1",
      competition: `Ligue 1 2025/2026 — Journée ${journee}`,
      date: round.date,
      time: null,
      home, away,
      stadium: CLUBS[home] ? CLUBS[home].stadium : null,
      status: "played",
    });
  });
});