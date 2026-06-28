#!/usr/bin/env python3
"""
update_calendar.py — Calendrier mai-juin 2026, toutes compétitions, via
l'API JSON gratuite de TheSportsDB.com.

Pourquoi jour par jour plutôt que saison entière : l'endpoint "saison
complète" (eventsseason.php) est plafonné à 15 résultats sur le compte
gratuit, ce qui renvoie les tout premiers matchs de la saison (souvent
août/septembre) et jamais mai-juin. L'endpoint "un jour précis"
(eventsday.php) n'a pas cette limite par saison : on l'appelle donc une
fois par jour et par compétition sur la période voulue.

Ne récupère QUE : compétition, date, équipe domicile, équipe extérieure.
PAS de scores.

Pour les compétitions européennes, seuls les matchs impliquant au moins
un club français sont conservés.

Pour les équipes de France (rugby, foot, hand, basket — H et F), on
utilise un endpoint différent (derniers/prochains matchs de l'équipe),
plus simple, puis on filtre nous-mêmes sur la période mai-juin.

Prérequis : pip install requests
Usage : python3 update_calendar.py

Documentation API : https://www.thesportsdb.com/documentation
Clé gratuite : 123
"""

import json
import re
import sys
import time
import unicodedata
from datetime import date, timedelta
import requests

API_KEY = "123"
BASE_URL = f"https://www.thesportsdb.com/api/v1/json/{API_KEY}"

START_DATE = date(2026, 5, 1)
END_DATE = date(2026, 6, 30)
SLEEP_BETWEEN_CALLS = 2.1  # reste sous 30 requêtes/minute (limite gratuite)

# ============================================================
# Compétitions françaises (championnats/cups par équipes)
# ============================================================
FRENCH_COMPETITIONS = {
    "ligue1": {"league_id": 4334, "label": "Ligue 1"},
    "ligue2": {"league_id": 4401, "label": "Ligue 2"},
    "national": {"league_id": 4637, "label": "Championnat National"},
    "top14": {"league_id": 4430, "label": "TOP 14"},
    "prod2": {"league_id": 5172, "label": "Pro D2"},
    "nationale_rugby": {"league_id": 5558, "label": "Nationale (rugby)"},
    "starligue": {"league_id": 4536, "label": "Starligue"},
    "betclic": {"league_id": 4423, "label": "Betclic Élite"},
    "eliteb": {"league_id": 4577, "label": "Pro B / Élite 2"},
    "lfb": {"league_id": 5623, "label": "La Boulangère Wonderligue"},
    "marmara": {"league_id": 4582, "label": "Marmara SpikeLigue"},
    "ligueaf": {"league_id": 4583, "label": "Ligue AF"},
    "magnus": {"league_id": 4927, "label": "Ligue Magnus"},
    "arkema": {"league_id": 5203, "label": "Arkema Première Ligue"},
}

# ============================================================
# Coupes d'Europe — uniquement les matchs avec au moins un club français
# ============================================================
EUROPEAN_COMPETITIONS = {
    "uefacl": {"league_id": 4480, "label": "UEFA Champions League"},
    "uefael": {"league_id": 4481, "label": "UEFA Europa League"},
    "uefaconf": {"league_id": 5071, "label": "UEFA Conference League"},
    "rugbycc": {"league_id": 4550, "label": "Champions Cup (rugby)"},
    "rugbychall": {"league_id": 5418, "label": "Challenge Cup (rugby)"},
    "euroleague": {"league_id": 4546, "label": "Euroleague (basket)"},
    "eurocup": {"league_id": 4547, "label": "EuroCup (basket)"},
    "bcl": {"league_id": 4548, "label": "Basketball Champions League"},
    "chl": {"league_id": 5277, "label": "Champions Hockey League"},
    "ehfcl": {"league_id": 4980, "label": "EHF Champions League"},
    "ehfcl_f": {"league_id": 5274, "label": "EHF Champions League (F)"},
    "ehfel": {"league_id": 5275, "label": "EHF European League"},
    "cevcl": {"league_id": 5616, "label": "CEV Champions League (volley)"},
}

# ============================================================
# Équipes de France — endpoint dédié (pas de boucle par jour)
# ============================================================
NATIONAL_TEAMS = {
    "fra_rugby_h": {"team_id": 137128, "label": "France Rugby (H)"},
    "fra_rugby_f": {"team_id": 150800, "label": "France Rugby (F)"},
    "fra_foot_h": {"team_id": 133913, "label": "France Football (H)"},
    "fra_foot_f": {"team_id": 136801, "label": "France Football (F)"},
    "fra_hand_h": {"team_id": 140566, "label": "France Handball (H)"},
    "fra_basket_h": {"team_id": 136725, "label": "France Basketball (H)"},
    "fra_basket_f": {"team_id": 141525, "label": "France Basketball (F)"},
}

# Mots-clés extraits des noms de clubs français déjà connus du site
# (voir data.js), utilisés pour repérer les clubs français dans les
# compétitions européennes.
FRENCH_TOKENS = ["agen", "aigles", "ajaccio", "alsace", "amand", "amiens", "angers", "anglet", "angouleme", "annecy", "arago", "ardenne", "ascq", "asvel", "atlantique", "aurillac", "aurillacois", "auxerre", "avant", "avenir", "avesnois", "aviron", "ball", "barul", "bayonnais", "bayonne", "begles", "besancon", "beziers", "biarritz", "bordeaux", "boulazac", "boulogne", "bourg", "bourges", "bourgogne", "boxers", "bresse", "brest", "brestois", "bretagne", "briancon", "brive", "bruleurs", "cannes", "cannet", "carcassonne", "carolo", "castres", "cergy", "cesson", "chalon", "chamalieres", "chambery", "chambray", "chamois", "chamonix", "champagne", "charleville", "charnay", "chartres", "chaumont", "cholet", "clermont", "cloud", "colomiers", "correze", "cuques", "diables", "dijon", "dordogne", "dragons", "drome", "ducs", "dunkerque", "elan", "essm", "estac", "etienne", "evreux", "feminines", "fenix", "flammes", "fleury", "florange", "foot", "germain", "gothiques", "gravelines", "grenoble", "guingamp", "havre", "herault", "hormadi", "istres", "jokers", "landerneau", "landes", "lattes", "laval", "lavallois", "lens", "levallois", "lille", "limoges", "limousin", "lorient", "lorraine", "losc", "loups", "lyon", "lyonnais", "lyonnes", "mans", "marcq", "marsan", "marseille", "maur", "merignac", "metz", "mezieres", "mhsc", "monaco", "mont", "montauban", "montbeliard", "montois", "montpellier", "mulhouse", "nancy", "nanterre", "nantes", "narbonne", "nazaire", "nevers", "nice", "nimes", "oyonnax", "paloise", "pauc", "perpignan", "plan", "plessis", "poitevin", "poitiers", "pontoise", "portel", "provence", "quentin", "rapaces", "raphael", "reims", "rennais", "rennes", "robinson", "roche", "rochelais", "rochelle", "rodez", "romans", "rouen", "rouges", "sambre", "saone", "sarthe", "savoie", "section", "selestat", "sete", "sluc", "sochaux", "soyaux", "spacer", "spartiates", "star", "stella", "strasbourg", "tango", "terville", "toulon", "toulousain", "toulouse", "touraine", "tourcoing", "tours", "tremblay", "troyes", "usam", "usdk", "uson", "valence", "vanduvre", "vannes", "vendee", "villeneuve", "villeurbanne", "volero"]
FRENCH_PHRASES = ["racing 92", "racing metro 92"]


def log(msg):
    print(msg, file=sys.stderr)
    sys.stderr.flush()


def normalize(s):
    s = unicodedata.normalize("NFD", s or "").encode("ascii", "ignore").decode("ascii")
    return s.lower()


def is_french_club(name):
    if not name:
        return False
    n = normalize(name)
    if any(phrase in n for phrase in FRENCH_PHRASES):
        return True
    return any(re.search(rf"\b{re.escape(tok)}", n) for tok in FRENCH_TOKENS)


def api_get(endpoint, params):
    url = f"{BASE_URL}/{endpoint}"
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def daterange(start, end):
    d = start
    while d <= end:
        yield d
        d += timedelta(days=1)


def fetch_competition_by_day(comp, require_french=False):
    label = comp["label"]
    league_id = comp["league_id"]
    log(f"\n=== {label} (jour par jour, {START_DATE} -> {END_DATE}) ===")

    matches = []
    skipped_foreign = 0
    days_with_matches = 0

    for d in daterange(START_DATE, END_DATE):
        try:
            data = api_get("eventsday.php", {"d": d.isoformat(), "l": league_id})
        except Exception as e:
            log(f"  ! Erreur le {d}: {e}")
            time.sleep(SLEEP_BETWEEN_CALLS)
            continue

        events = data.get("events") or []
        if events:
            days_with_matches += 1
        for ev in events:
            home, away = ev.get("strHomeTeam"), ev.get("strAwayTeam")
            if require_french and not (is_french_club(home) or is_french_club(away)):
                skipped_foreign += 1
                continue
            matches.append({
                "competition": label,
                "round": ev.get("intRound"),
                "date": ev.get("dateEvent") or d.isoformat(),
                "home": home,
                "away": away,
            })
        time.sleep(SLEEP_BETWEEN_CALLS)

    if require_french:
        log(f"  {skipped_foreign} matchs ignorés (aucun club français)")
    log(f"  {days_with_matches} jours avec au moins un match")
    log(f"Total matchs retenus pour {label} : {len(matches)}")
    return matches


def fetch_national_team(team):
    label = team["label"]
    team_id = team["team_id"]
    log(f"\n=== {label} ===")
    matches = []
    for endpoint in ("eventslast.php", "eventsnext.php"):
        try:
            data = api_get(endpoint, {"id": team_id})
        except Exception as e:
            log(f"  ! Erreur ({endpoint}): {e}")
            time.sleep(SLEEP_BETWEEN_CALLS)
            continue
        events = data.get("results") or data.get("events") or []
        for ev in events:
            d = ev.get("dateEvent")
            if not d or not (START_DATE.isoformat() <= d <= END_DATE.isoformat()):
                continue
            matches.append({
                "competition": label,
                "round": ev.get("strLeague") or ev.get("strEvent"),
                "date": d,
                "home": ev.get("strHomeTeam"),
                "away": ev.get("strAwayTeam"),
                "venue": ev.get("strVenue"),
            })
        time.sleep(SLEEP_BETWEEN_CALLS)
    log(f"Total matchs retenus pour {label} (mai-juin) : {len(matches)}")
    return matches


def main():
    all_matches = []
    total_competitions = len(FRENCH_COMPETITIONS) + len(EUROPEAN_COMPETITIONS)
    done = 0

    for key, comp in FRENCH_COMPETITIONS.items():
        done += 1
        log(f"\n[{done}/{total_competitions} compétitions équipes]")
        all_matches.extend(fetch_competition_by_day(comp, require_french=False))

    for key, comp in EUROPEAN_COMPETITIONS.items():
        done += 1
        log(f"\n[{done}/{total_competitions} compétitions équipes]")
        all_matches.extend(fetch_competition_by_day(comp, require_french=True))

    for key, team in NATIONAL_TEAMS.items():
        all_matches.extend(fetch_national_team(team))

    all_matches.sort(key=lambda m: (m["date"] or "9999"))

    output = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "period": f"{START_DATE.isoformat()} -> {END_DATE.isoformat()}",
        "matches": all_matches,
    }
    with open("live-calendar.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    log(f"\n✓ Écrit live-calendar.json ({len(all_matches)} matchs au total)")


if __name__ == "__main__":
    main()
