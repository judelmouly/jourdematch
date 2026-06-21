# Calendrier automatique TOP14 + Pro D2 — Guide de mise en place

## Ce que fait ce système

Un script (`update_calendar.py`) va chercher, sur les sites officiels de la LNR
(top14.lnr.fr et prod2.lnr.fr), la liste des clubs et leur calendrier complet
de la saison 2025-2026 (journée, date, équipes, lieu — **sans les scores**),
et produit un fichier `live-calendar.json`.

Une tâche planifiée GitHub Actions exécute ce script automatiquement chaque
jour, committe le fichier mis à jour, et republie le site sur GitHub Pages.

## Mise en place (une seule fois)

1. **Créer un dépôt GitHub** (gratuit) et y déposer :
   - les fichiers du site (`index.html`, `style.css`, `app.js`, `data.js`)
   - le dossier `scripts/` contenant `update_calendar.py`
   - le fichier `.github/workflows/update-calendar.yml`

2. **Activer GitHub Pages** :
   - Dans le dépôt → `Settings` → `Pages`
   - Source : `GitHub Actions`

3. **Lancer une première fois manuellement** pour vérifier que tout fonctionne :
   - Onglet `Actions` du dépôt → workflow "Mise à jour du calendrier..." → `Run workflow`
   - Vérifier les logs : si une erreur apparaît (site qui a changé de structure,
     club introuvable, etc.), il faudra ajuster le script.

4. C'est tout. À partir de là, le calendrier se met à jour seul tous les
   jours à 6h UTC, et le site republié automatiquement.

## Important — à savoir avant de te lancer

- **Je n'ai pas pu tester ce script en conditions réelles contre lnr.fr**
  depuis mon environnement (accès réseau restreint à certains domaines).
  J'ai testé séparément :
  - la logique d'extraction des matchs (sur de vraies données déjà récupérées) ✓
  - que Playwright fonctionne techniquement dans un environnement comme le mien ✓
  - mais pas la combinaison des deux contre le vrai site, en direct.

  **Le premier lancement (étape 3) est donc un vrai test.** Si ça ne
  fonctionne pas du premier coup (page qui a changé, sélecteur différent...),
  reviens me montrer le message d'erreur des logs GitHub Actions et je
  corrigerai le script.

- Si jamais lnr.fr changeait la structure de ses pages, le script casserait
  silencieusement (ou renverrait 0 match) — c'est le risque de tout scraping
  d'un site qui n'est pas une API officielle. Pas de solution miracle à ça,
  à part surveiller et corriger au besoin.

- Le fichier produit (`live-calendar.json`) n'est pour l'instant pas branché
  à `data.js` / `app.js` — il faudra une petite adaptation du site pour qu'il
  lise ce fichier au chargement (`fetch('live-calendar.json')`) en plus des
  données déjà intégrées. Dis-moi quand le scraping fonctionne et je fais
  cette connexion.
