#!/usr/bin/env python3
"""
update_calendar.py — Met à jour automatiquement le calendrier TOP14 + Pro D2
(saison 2025-2026, à titre de test) à partir des pages officielles de la LNR.

Ne récupère QUE : journée/phase, date, équipe domicile, équipe extérieur,
compétition, et le lieu (stade du club recevant). PAS de scores.

Fonctionnement :
1. Découvre automatiquement la liste des clubs de chaque compétition
   (page /clubs), donc s'adapte aux montées/descentes sans modification.
2. Pour chaque club, ouvre sa page "informations" pour récupérer le nom
   et la ville de son stade.
3. Pour chaque club, ouvre sa page "calendrier-resultats" et extrait
   les matchs (journée, date, équipes).
4. Déduplique les matchs (chaque rencontre apparaît sur les 2 pages club)
   via l'URL "feuille-de-match" qui contient un identifiant unique.
5. Écrit le résultat dans live-calendar.json (à consommer par le site).

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
        "base_url": "https://top14.lnr.fr",
        "label": "TOP 14",
    },
    "prod2": {
        "base_url": "https://prod2.lnr.fr",
        "label": "Pro D2",
    },
}

JOURNEE_RE = re.compile(r'^J(\d+)$|^(Barrage|Demi-Finale|Finale|Accession)$', re.IGNORECASE)
DATE_RE = re.compile(
    r'^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+\d{1,2}\s+'
    r'(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)$',
    re.IGNORECASE,
)
MONTHS = {
    "janvier": "01", "février": "02", "mars": "03", "avril": "04", "mai": "05",
    "juin": "06", "juillet": "07", "août": "08", "septembre": "09",
    "octobre": "10", "novembre": "11", "décembre": "12",
}


def log(msg):
    print(msg, file=sys.stderr)


def accept_cookies(page):
    """Tente de fermer un éventuel bandeau cookies/RGPD qui bloquerait le rendu."""
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


def get_club_list(page, base_url):
    """Récupère la liste des clubs (nom + slug) depuis la page /clubs."""
    page.goto(f"{base_url}/clubs", timeout=30000, wait_until="networkidle")
    accept_cookies(page)
    page.wait_for_timeout(2000)

    # Diagnostics — utiles si la liste revient vide
    log(f"  DEBUG titre de la page : {page.title()}")
    all_links_count = page.eval_on_selector_all("a", "els => els.length")
    log(f"  DEBUG nombre total de liens <a> sur la page : {all_links_count}")
    try:
        page.screenshot(path=f"debug-{base_url.split('//')[1].split('.')[0]}-clubs.png", full_page=True)
        log(f"  DEBUG capture d'écran sauvegardée")
    except Exception as e:
        log(f"  DEBUG impossible de faire une capture : {e}")

    links = page.eval_on_selector_all(
        "a[href*='/club/']",
        "els => els.map(e => ({href: e.getAttribute('href'), text: e.innerText.trim()}))",
    )
    log(f"  DEBUG nombre de liens contenant '/club/' : {len(links)}")
    if len(links) < 5:
        sample = page.eval_on_selector_all(
            "a", "els => els.slice(0, 30).map(e => e.getAttribute('href'))"
        )
        log(f"  DEBUG échantillon de href trouvés sur la page : {sample}")

    clubs = {}
    for link in links:
        href = link["href"] or ""
        m = re.search(r'/club/([a-z0-9-]+)/?$', href)
        if m and link["text"]:
            slug = m.group(1)
            clubs[slug] = link["text"]
    return clubs


def get_stadium_info(page, base_url, slug):
    """Récupère le nom du stade et la ville depuis la page informations du club."""
    try:
        page.goto(f"{base_url}/club/{slug}/informations", timeout=30000)
        page.wait_for_timeout(1000)
        text = page.inner_text("body")
    except Exception as e:
        log(f"  ! Impossible de charger les infos de {slug}: {e}")
        return None, None

    name_match = re.search(r'Nom\s*:\s*(.+)', text)
    address_match = re.search(r'Adresse du stade\s*:\s*(.+)', text)
    stadium_name = name_match.group(1).strip() if name_match else None
    city = None
    if address_match:
        addr = address_match.group(1).strip()
        city_match = re.search(r'\d{5}\s+(.+)$', addr)
        city = city_match.group(1).strip() if city_match else addr
    return stadium_name, city


def parse_calendar_text(text, known_team_names):
    """Parse le texte affiché de la page calendrier-resultats d'un club."""
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    matches = []
    current_label = None
    current_date = None
    current_teams = []

    def flush():
        if current_label and len(current_teams) == 2:
            matches.append({
                "label": current_label,
                "date_text": current_date,
                "home": current_teams[0],
                "away": current_teams[1],
            })

    for line in lines:
        m = JOURNEE_RE.match(line)
        if m:
            flush()
            current_label = line
            current_date = None
            current_teams = []
            continue
        if DATE_RE.match(line):
            current_date = line
            continue
        if line in known_team_names:
            if len(current_teams) < 2:
                current_teams.append(line)
            continue
        if line == "Feuille de match":
            flush()
            current_label = None
            current_date = None
            current_teams = []
    flush()
    return matches


def date_text_to_iso(date_text, season_start_year=2025):
    """Convertit 'samedi 06 septembre' en '2025-09-06' (ou 2026 selon le mois)."""
    if not date_text:
        return None
    m = re.match(
        r'(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s+(\d{1,2})\s+(\w+)',
        date_text, re.IGNORECASE,
    )
    if not m:
        return None
    day, month_fr = m.group(1), m.group(2).lower()
    month = MONTHS.get(month_fr)
    if not month:
        return None
    year = season_start_year if int(month) >= 7 else season_start_year + 1
    return f"{year}-{month}-{day.zfill(2)}"


def scrape_competition(page, comp_key, comp):
    base_url = comp["base_url"]
    log(f"\n=== {comp['label']} ===")
    log("Récupération de la liste des clubs...")
    clubs = get_club_list(page, base_url)
    log(f"{len(clubs)} clubs trouvés : {list(clubs.values())}")

    known_team_names = set(clubs.values())

    stadiums = {}
    for slug, name in clubs.items():
        log(f"  Stade de {name}...")
        stadium_name, city = get_stadium_info(page, base_url, slug)
        stadiums[slug] = {"club": name, "stadium": stadium_name, "city": city}
        time.sleep(0.3)

    seen_match_ids = set()
    matches = []
    for slug, name in clubs.items():
        log(f"  Calendrier de {name}...")
        try:
            page.goto(f"{base_url}/club/{slug}/calendrier-resultats", timeout=30000)
            page.wait_for_timeout(1500)
            text = page.inner_text("body")
        except Exception as e:
            log(f"  ! Erreur sur {slug}: {e}")
            continue

        match_links = page.eval_on_selector_all(
            "a[href*='feuille-de-match']",
            "els => els.map(e => e.getAttribute('href'))",
        )

        parsed = parse_calendar_text(text, known_team_names)

        for i, m in enumerate(parsed):
            match_id = match_links[i] if i < len(match_links) else f"{slug}-{m['label']}-{m['date_text']}"
            if match_id in seen_match_ids:
                continue
            seen_match_ids.add(match_id)
            iso_date = date_text_to_iso(m["date_text"])
            home_slug = next((s for s, n in clubs.items() if n == m["home"]), None)
            venue = stadiums.get(home_slug, {}).get("stadium") if home_slug else None
            venue_city = stadiums.get(home_slug, {}).get("city") if home_slug else None
            matches.append({
                "competition": comp["label"],
                "season": SEASON,
                "round": m["label"],
                "date": iso_date,
                "home": m["home"],
                "away": m["away"],
                "venue": venue,
                "city": venue_city,
            })
        time.sleep(0.3)

    matches.sort(key=lambda m: (m["date"] or "9999"))
    log(f"Total matchs uniques pour {comp['label']} : {len(matches)}")
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
