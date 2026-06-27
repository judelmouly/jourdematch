#!/usr/bin/env python3
"""
update_calendar.py — Met à jour le calendrier TOP14 + Pro D2 (saison 2025-2026,
à titre de test) via l'API JSON gratuite de TheSportsDB.com.

Pas de scraping, pas de navigateur : juste des appels HTTP vers une vraie API
JSON. Beaucoup plus simple et beaucoup plus fiable que d'analyser des pages
web (qui changent souvent de structure et peuvent bloquer les robots).

Ne récupère QUE : compétition, journée, date, équipe domicile, équipe
extérieure. PAS de scores (volontairement omis, même si l'API les fournit).

Prérequis : pip install requests
Usage : python3 update_calendar.py

Documentation de l'API : https://www.thesportsdb.com/documentation
Clé gratuite utilisée : 123 (clé de test publique fournie par TheSportsDB)
"""

import json
import sys
import time
import requests

SEASON = "2025-2026"
API_KEY = "123"  # clé de test gratuite publique de TheSportsDB
BASE_URL = f"https://www.thesportsdb.com/api/v1/json/{API_KEY}"

COMPETITIONS = {
    "top14": {"league_id": 4430, "label": "TOP 14"},
    "prod2": {"league_id": 5172, "label": "Pro D2"},
}


def log(msg):
    print(msg, file=sys.stderr)


def fetch_season(league_id, season):
    url = f"{BASE_URL}/eventsseason.php"
    params = {"id": league_id, "s": season}
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    return data.get("events") or []


def scrape_competition(comp_key, comp):
    log(f"\n=== {comp['label']} ===")
    events = fetch_season(comp["league_id"], SEASON)
    log(f"  {len(events)} événements reçus de l'API")

    matches = []
    for ev in events:
        matches.append({
            "competition": comp["label"],
            "season": SEASON,
            "round": ev.get("intRound"),
            "date": ev.get("dateEvent"),
            "home": ev.get("strHomeTeam"),
            "away": ev.get("strAwayTeam"),
        })

    matches.sort(key=lambda m: (m["date"] or "9999"))
    log(f"Total matchs pour {comp['label']} : {len(matches)}")
    return matches


def main():
    all_matches = []
    for comp_key, comp in COMPETITIONS.items():
        try:
            matches = scrape_competition(comp_key, comp)
            all_matches.extend(matches)
        except Exception as e:
            log(f"ERREUR sur {comp['label']}: {e}")
        time.sleep(1)  # respecte le rate limit (30 req/min en gratuit)

    output = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "season": SEASON,
        "matches": all_matches,
    }
    with open("live-calendar.json", "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    log(f"\n✓ Écrit live-calendar.json ({len(all_matches)} matchs au total)")


if __name__ == "__main__":
    main()
