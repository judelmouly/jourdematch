#!/usr/bin/env python3
"""
update_calendar.py — Met à jour le calendrier TOP14 + Pro D2 (saison 2025-2026,
à titre de test) à partir d'allrugby.com, qui publie le calendrier complet de
chaque compétition sur UNE seule page (bien plus simple et fiable que de
parcourir les pages individuelles de chaque club sur le site officiel LNR).

Ne récupère QUE : compétition, journée/phase, date, équipe domicile, équipe
extérieure. PAS de scores. Le lieu (stade) n'est pas récupéré ici : le site
le retrouve lui-même via sa propre table clubs -> stade (data.js), à partir
du nom de l'équipe à domicile.

Prérequis : pip install playwright && playwright install chromium
Usage : python3 update_calendar.py
"""

import json
import re
import sys
import time
from playwright.sync_api import sync_playwright

SEASON = "2025-2026"

COMPETITIONS = {
    "top14": {
        "url": "https://www.allrugby.com/competitions/top-14/calendrier.html",
        "label": "TOP 14",
    },
    "prod2": {
        "url": "https://www.allrugby.com/competitions/pro-d2/calendrier.html",
        "label": "Pro D2",
    },
}

ROUND_RE = re.compile(
    r'^(J\d+|Barrages?|1/2 finale|Demi-Finale|Finale|Access Match)$', re.IGNORECASE
)
MONTHS = {
    "janvier": "01", "février": "02", "mars": "03", "avril": "04", "mai": "05",
    "juin": "06", "juillet": "07", "août": "08", "septembre": "09",
    "octobre": "10", "novembre": "11", "décembre": "12",
}
DATE_RE = re.compile(
    r'^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+'
    r'(\d{1,2})(?:er)?\s+(\w+)\s+(\d{4})$',
    re.IGNORECASE,
)


def log(msg):
    print(msg, file=sys.stderr)


def parse_date(line):
    m = DATE_RE.match(line.strip())
    if not m:
        return None
    day, month_fr, year = m.group(2), m.group(3).lower(), m.group(4)
    month = MONTHS.get(month_fr)
    if not month:
        return None
    return f"{year}-{month}-{day.zfill(2)}"


def accept_cookies(page):
    """Tente de fermer un éventuel bandeau cookies/RGPD."""
    selectors = [
        "button:has-text('Accepter')",
        "button:has-text('Tout accepter')",
        "#didomi-notice-agree-button",
        "button[id*='accept']",
        "button[class*='accept']",
    ]
    for sel in selectors:
        try:
            btn = page.locator(sel).first
            if btn.is_visible(timeout=2000):
                btn.click(timeout=2000)
                page.wait_for_timeout(500)
                log(f"  (bandeau cookies fermé via: {sel})")
                return
        except Exception:
            continue


def parse_calendar_lines(text):
    """Repère, dans l'ordre, le (round, date) de chaque ligne de match
    ('... détails'). Retourne une liste parallèle aux liens 'Feuille de match'."""
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    items = []
    current_round = None
    current_date = None
    for line in lines:
        if ROUND_RE.match(line):
            current_round = line
            current_date = None
            continue
        d = parse_date(line)
        if d:
            current_date = d
            continue
        if line.endswith("détails"):
            items.append({"round": current_round, "date": current_date})
    return items


def scrape_competition(page, comp_key, comp):
    log(f"\n=== {comp['label']} ===")
    page.goto(comp["url"], timeout=30000, wait_until="networkidle")
    accept_cookies(page)
    page.wait_for_timeout(1500)

    log(f"  DEBUG titre de la page : {page.title()}")

    text = page.inner_text("body")
    items = parse_calendar_lines(text)
    log(f"  DEBUG lignes de match repérées (round/date) : {len(items)}")

    links = page.eval_on_selector_all(
        "a[title*='Feuille de match']",
        "els => els.map(e => ({title: e.getAttribute('title'), href: e.getAttribute('href')}))",
    )
    log(f"  DEBUG liens 'Feuille de match' trouvés : {len(links)}")

    if len(items) != len(links):
        log(f"  ! ATTENTION : décalage entre le nombre de lignes ({len(items)}) "
            f"et le nombre de liens ({len(links)}) — les données peuvent être "
            f"mal associées.")

    matches = []
    seen = set()
    for item, link in zip(items, links):
        title = link["title"] or ""
        m = re.search(r'Feuille de match\s*:\s*(.+?)\s+vs\s+(.+)$', title)
        if not m:
            log(f"  ! Titre inattendu, ignoré : {title!r}")
            continue
        home, away = m.group(1).strip(), m.group(2).strip()
        key = (item["date"], frozenset([home, away]))
        if key in seen:
            continue
        seen.add(key)
        matches.append({
            "competition": comp["label"],
            "season": SEASON,
            "round": item["round"],
            "date": item["date"],
            "home": home,
            "away": away,
            "source": link["href"],
        })

    matches.sort(key=lambda m: (m["date"] or "9999"))
    log(f"Total matchs pour {comp['label']} : {len(matches)}")
    return matches


def main():
    all_matches = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        for comp_key, comp in COMPETITIONS.items():
            try:
                matches = scrape_competition(page, comp_key, comp)
                all_matches.extend(matches)
            except Exception as e:
                log(f"ERREUR sur {comp['label']}: {e}")
        browser.close()

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
