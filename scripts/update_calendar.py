#!/usr/bin/env python3
import json, re, sys, time, unicodedata
from datetime import date, timedelta
import requests

API_KEY = "123"
BASE_URL = f"https://www.thesportsdb.com/api/v1/json/{API_KEY}"
TODAY = date.today()
START_DATE = TODAY - timedelta(days=30)
END_DATE   = TODAY + timedelta(days=60)
SLEEP = 2.1
SEASON = f"{TODAY.year if TODAY.month >= 7 else TODAY.year-1}-{TODAY.year+1 if TODAY.month >= 7 else TODAY.year}"

FRENCH_COMPETITIONS = {
    "ligue1":    {"league_id": 4334, "label": "Ligue 1"},
    "ligue2":    {"league_id": 4401, "label": "Ligue 2"},
    "national":  {"league_id": 4637, "label": "Championnat National"},
    "top14":     {"league_id": 4430, "label": "TOP 14"},
    "prod2":     {"league_id": 5172, "label": "Pro D2"},
    "starligue": {"league_id": 4536, "label": "Starligue"},
    "betclic":   {"league_id": 4423, "label": "Betclic Élite"},
    "eliteb":    {"league_id": 4577, "label": "Pro B / Élite 2"},
    "lfb":       {"league_id": 5623, "label": "La Boulangère Wonderligue"},
    "marmara":   {"league_id": 4582, "label": "Marmara SpikeLigue"},
    "ligueaf":   {"league_id": 4583, "label": "Ligue AF"},
    "magnus":    {"league_id": 4927, "label": "Ligue Magnus"},
    "arkema":    {"league_id": 5203, "label": "Arkema Première Ligue"},
}

EUROPEAN_COMPETITIONS = {
    "uefacl":    {"league_id": 4480, "label": "UEFA Champions League"},
    "uefael":    {"league_id": 4481, "label": "UEFA Europa League"},
    "uefaconf":  {"league_id": 5071, "label": "UEFA Conference League"},
    "rugbycc":   {"league_id": 4550, "label": "Champions Cup (rugby)"},
    "rugbychall":{"league_id": 5418, "label": "Challenge Cup (rugby)"},
    "euroleague":{"league_id": 4546, "label": "Euroleague (basket)"},
    "eurocup":   {"league_id": 4547, "label": "EuroCup (basket)"},
    "bcl":       {"league_id": 4548, "label": "Basketball Champions League"},
    "chl":       {"league_id": 5277, "label": "Champions Hockey League"},
    "ehfcl":     {"league_id": 4980, "label": "EHF Champions League"},
    "ehfcl_f":   {"league_id": 5274, "label": "EHF Champions League (F)"},
    "cevcl":     {"league_id": 5616, "label": "CEV Champions League (volley)"},
}

NATIONAL_TEAMS = {
    "fra_rugby_h":  {"team_id": 137128, "label": "France Rugby (H)"},
    "fra_rugby_f":  {"team_id": 150800, "label": "France Rugby (F)"},
    "fra_foot_h":   {"team_id": 133913, "label": "France Football (H)"},
    "fra_foot_f":   {"team_id": 136801, "label": "France Football (F)"},
    "fra_hand_h":   {"team_id": 140566, "label": "France Handball (H)"},
    "fra_basket_h": {"team_id": 136725, "label": "France Basketball (H)"},
    "fra_basket_f": {"team_id": 141525, "label": "France Basketball (F)"},
}

FRENCH_TOKENS = ["agen","aigles","ajaccio","alsace","amand","amiens","angers","anglet","auxerre","aviron","bayonnais","bayonne","begles","besancon","beziers","biarritz","bordeaux","boulazac","boulogne","bourg","bourges","brest","bretagne","brive","cannes","carcassonne","castres","cergy","cesson","chalon","chambery","chambray","chamonix","chartres","chaumont","cholet","clermont","colomiers","dijon","dunkerque","etienne","fenix","fleury","grenoble","guingamp","havre","herault","istres","landerneau","landes","lattes","laval","lens","levallois","lille","limoges","lorient","losc","lyon","lyonnais","lyonnes","mans","marcq","marsan","marseille","metz","monaco","montauban","montpellier","mulhouse","nancy","nanterre","nantes","narbonne","nevers","nice","nimes","oyonnax","paloise","perpignan","poitiers","provence","reims","rennais","rennes","roche","rochelais","rochelle","rodez","rouen","sambre","sarthe","section","selestat","sete","sluc","sochaux","strasbourg","tango","terville","toulon","toulousain","toulouse","tourcoing","tours","tremblay","troyes","usam","usdk","valence","vannes","vendee","villeneuve","villeurbanne","volero"]
FRENCH_PHRASES = ["racing 92","racing metro 92"]

def log(m): print(m, file=sys.stderr); sys.stderr.flush()

def normalize(s):
    return unicodedata.normalize("NFD", s or "").encode("ascii","ignore").decode("ascii").lower()

def is_french(name):
    if not name: return False
    n = normalize(name)
    if any(p in n for p in FRENCH_PHRASES): return True
    return any(re.search(rf"\b{re.escape(t)}", n) for t in FRENCH_TOKENS)

def api_call(endpoint, params):
    r = requests.get(f"{BASE_URL}/{endpoint}", params=params, timeout=30)
    r.raise_for_status()
    return r.json()

def fetch_by_day(comp, french_only=False):
    log(f"\n=== {comp['label']} ({START_DATE} -> {END_DATE}) ===")
    matches, skip, days = [], 0, 0
    d = START_DATE
    while d <= END_DATE:
        try:
            data = api_call("eventsday.php", {"d": d.isoformat(), "l": comp["league_id"]})
            events = data.get("events") or []
            if events: days += 1
            for ev in events:
                h, a = ev.get("strHomeTeam"), ev.get("strAwayTeam")
                if french_only and not (is_french(h) or is_french(a)):
                    skip += 1
                    continue
                matches.append({
                    "competition": comp["label"],
                    "season": SEASON,
                    "round": ev.get("intRound"),
                    "date": ev.get("dateEvent") or d.isoformat(),
                    "home": h,
                    "away": a,
                })
        except Exception as e:
            log(f"  ! {d}: {e}")
        time.sleep(SLEEP)
        d += timedelta(days=1)
    if french_only: log(f"  {skip} ignores (non francais)")
    log(f"  {days} jours avec matchs -> {len(matches)} retenus")
    return matches

def fetch_national(team):
    log(f"\n=== {team['label']} ===")
    matches = []
    for ep in ("eventslast.php", "eventsnext.php"):
        try:
            data = api_call(ep, {"id": team["team_id"]})
            for ev in (data.get("results") or data.get("events") or []):
                d = ev.get("dateEvent")
                if d and START_DATE.isoformat() <= d <= END_DATE.isoformat():
                    matches.append({
                        "competition": team["label"],
                        "season": SEASON,
                        "round": ev.get("strLeague") or ev.get("strEvent"),
                        "date": d,
                        "home": ev.get("strHomeTeam"),
                        "away": ev.get("strAwayTeam"),
                        "venue": ev.get("strVenue"),
                    })
        except Exception as e:
            log(f"  ! {ep}: {e}")
        time.sleep(SLEEP)
    log(f"  {len(matches)} matchs dans la periode")
    return matches

def main():
    log(f"Periode : {START_DATE} -> {END_DATE}")
    log(f"Saison : {SEASON}")
    all_matches = []
    for k, c in FRENCH_COMPETITIONS.items():
        all_matches.extend(fetch_by_day(c, french_only=False))
    for k, c in EUROPEAN_COMPETITIONS.items():
        all_matches.extend(fetch_by_day(c, french_only=True))
    for k, t in NATIONAL_TEAMS.items():
        all_matches.extend(fetch_national(t))
    all_matches.sort(key=lambda m: m["date"] or "9999")
    out = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "period": f"{START_DATE} -> {END_DATE}",
        "matches": all_matches,
    }
    with open("live-calendar.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    log(f"\n OK : {len(all_matches)} matchs ecrits dans live-calendar.json")

if __name__ == "__main__":
    main()
