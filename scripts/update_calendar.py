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
    "top14":     {"league_id": 4430, "label": "TOP 14"},
    "prod2":     {"league_id": 5172, "label": "Pro D2"},
    "starligue": {"league_id": 4536, "label": "Starligue"},
    "betclic":   {"league_id": 4423, "label": "Betclic Élite"},
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
