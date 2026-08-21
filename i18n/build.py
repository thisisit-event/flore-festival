#!/usr/bin/env python3
"""
Génère les pages langue FLORE (EN, IT, DE, ES) à partir d'un template
HTML partagé + un fichier de contenu JSON par langue.

Usage : python3 i18n/build.py   (à lancer depuis la racine du repo)

Pourquoi ce mécanisme : le site reste 100% statique (pas de build en
production, GitHub Pages sert du HTML pré-généré tel quel) — ce script
tourne uniquement en local/en session, jamais côté serveur. Il garantit
que les 4 pages langue restent structurellement identiques (mêmes
sections, même nav, même hreflang réciproque) même quand on ajoute une
langue ou qu'on change une section commune : on ne modifie qu'une seule
fois (template.html ou un .json), jamais 4 fichiers HTML à la main.

Pour ajouter une langue : dupliquer un content/xx.json, l'adapter, et
ajouter son entrée dans LANGUAGES ci-dessous.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
I18N = Path(__file__).resolve().parent
TEMPLATE = (I18N / "template.html").read_text(encoding="utf-8")

DOMAIN = "https://flore-festival.fr"

# slug -> (répertoire de sortie, hreflang)
LANGUAGES = {
    "en": "en",
    "it": "it",
    "de": "de",
    "es": "es",
}

# Utilisé pour le sélecteur de langue (menu déroulant) sur chaque page,
# y compris pour lister les langues sœurs. "fr" = page d'accueil FR,
# pas générée par ce script, mais qui doit apparaître dans le sélecteur
# de chaque page langue.
LANGUAGE_LABELS = {
    "fr": ("france", "Français", "/"),
    "en": ("angleterre", "English", "/en/"),
    "it": ("italia", "Italiano", "/italia/"),
    "de": ("allemagne", "Deutsch", "/deutschland/"),
    "es": ("espagne", "Español", "/espana/"),
}

# Locale du widget Weezevent (paramètre ?locale= de l'iframe billetterie).
# Vérifié en direct le 09/08 : les 5 valeurs fonctionnent, y compris de-DE
# (non documenté explicitement par Weezevent mais confirmé par test réel :
# l'iframe et les noms de billets se traduisent bien, ex. "TAGESTICKETS").
WEEZEVENT_LOCALES = {
    "en": "en-GB",
    "it": "it-IT",
    "de": "de-DE",
    "es": "es-ES",
}


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def flag_img(country):
    return f'<img class="lang-flag" src="https://enjoylife.b-cdn.net/Flore/picto-flore-{country}.png" alt="" loading="lazy">'


def build_lang_dropdown_html(current_code):
    items = []
    for code in ["fr"] + list(LANGUAGES.keys()):
        if code == current_code:
            continue
        country, name, path = LANGUAGE_LABELS[code]
        items.append(f'            <a href="{path}">{flag_img(country)} {name}</a>')
    return "\n".join(items)


def build_mobile_lang_links_html(current_code):
    items = []
    for code in ["fr"] + list(LANGUAGES.keys()):
        if code == current_code:
            continue
        country, name, path = LANGUAGE_LABELS[code]
        items.append(f'  <a class="m-sub" href="{path}">{flag_img(country)} {name}</a>')
    return "\n".join(items)


def build_hreflang_block(all_content):
    lines = []
    for code, content in all_content.items():
        lines.append(f'<link rel="alternate" hreflang="{content["html_lang"]}" href="{DOMAIN}{content["url_path"]}">')
    lines.append(f'<link rel="alternate" hreflang="fr" href="{DOMAIN}/">')
    lines.append(f'<link rel="alternate" hreflang="x-default" href="{DOMAIN}/">')
    return "\n".join(lines)


def build_cards_html(cards):
    blocks = []
    for i, card in enumerate(cards):
        delay = f' data-aos-delay="{i * 80}"' if i else ""
        blocks.append(
            f'      <div class="value-card" data-aos="fade-up"{delay}>\n'
            f'        <div class="v-ic" style="background:{card["bg"]}">{card["icon"]}</div>\n'
            f'        <h3>{esc(card["title"])}</h3>\n'
            f'        <p>{esc(card["text"])}</p>\n'
            f'      </div>'
        )
    return "\n".join(blocks)


def build_geo_chips_html(chips):
    items = "\n".join(
        f'      <span class="geo-chip"><span class="gc-ic">{c["icon"]}</span>{esc(c["label"])}</span>'
        for c in chips
    )
    return f'    <div class="geo-chips" data-aos="fade-up">\n{items}\n    </div>'


def build_faq_items_html(items):
    blocks = []
    for item in items:
        blocks.append(
            '      <div class="faq-item" data-aos="fade-up">\n'
            f'        <h3>{esc(item["q"])}</h3>\n'
            f'        <p>{esc(item["a"])}</p>\n'
            '      </div>'
        )
    return "\n".join(blocks)


def build_faq_schema(items, html_lang):
    entities = [
        {
            "@type": "Question",
            "name": item["q"],
            "acceptedAnswer": {"@type": "Answer", "text": item["a"]},
        }
        for item in items
    ]
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": entities,
    }
    return (
        '<script type="application/ld+json">\n'
        + json.dumps(schema, ensure_ascii=False, indent=2)
        + "\n</script>"
    )


def render(content, hreflang_block):
    html = TEMPLATE
    replacements = {
        "{{HTML_LANG}}": content["html_lang"],
        "{{META_TITLE}}": esc(content["meta"]["title"]),
        "{{META_DESCRIPTION}}": esc(content["meta"]["description"]),
        "{{META_KEYWORDS}}": esc(content["meta"]["keywords"]),
        "{{CANONICAL_URL}}": DOMAIN + content["url_path"],
        "{{HREFLANG_BLOCK}}": hreflang_block,
        "{{OG_LOCALE}}": content["og_locale"],
        "{{OG_TITLE}}": esc(content["meta"]["og_title"]),
        "{{OG_DESCRIPTION}}": esc(content["meta"]["og_description"]),
        "{{OG_IMAGE_ALT}}": esc(content["meta"]["og_image_alt"]),
        "{{JSONLD_DESCRIPTION}}": content["meta"]["jsonld_description"].replace('"', '\\"'),
        "{{FAQ_SCHEMA_BLOCK}}": build_faq_schema(content["faq"]["items"], content["html_lang"]),
        "{{URL_PATH}}": content["url_path"],
        "{{NAV_FESTIVAL}}": esc(content["nav"]["festival"]),
        "{{NAV_GLUTEN}}": esc(content["nav"]["gluten"]),
        "{{NAV_VISIT}}": esc(content["nav"]["visit"]),
        "{{NAV_FAQ}}": esc(content["nav"]["faq"]),
        "{{NAV_TICKETS}}": esc(content["nav"]["tickets"]),
        "{{NAV_MENU_LABEL}}": esc(content["nav"]["menu_label"]),
        "{{NAV_OTHER_LANGUAGES_LABEL}}": esc(content["nav"]["other_languages_label"]),
        "{{LANG_DROPDOWN_HTML}}": build_lang_dropdown_html(content["lang_code"]),
        "{{MOBILE_LANG_LINKS_HTML}}": build_mobile_lang_links_html(content["lang_code"]),
        "{{CURRENT_LANG_FLAG_HTML}}": flag_img(LANGUAGE_LABELS[content["lang_code"]][0]),
        "{{WEEZEVENT_LOCALE}}": WEEZEVENT_LOCALES[content["lang_code"]],
        "{{HERO_TAG}}": esc(content["hero"]["tag"]),
        "{{HERO_SR_TITLE}}": esc(content["hero"]["sr_title"]),
        "{{HERO_TAGLINE}}": esc(content["hero"]["tagline"]),
        "{{HERO_LEDE}}": esc(content["hero"]["lede"]),
        "{{HERO_COUNTDOWN_INTRO}}": esc(content["hero"]["countdown_intro"]),
        "{{HERO_CTA_PRIMARY}}": esc(content["hero"]["cta_primary"]),
        "{{HERO_CTA_SECONDARY}}": esc(content["hero"]["cta_secondary"]),
        "{{HERO_FLORETTE_ALT}}": esc(content["hero"]["florette_alt"]),
        "{{CONCEPT_KICKER}}": esc(content["concept"]["kicker"]),
        "{{CONCEPT_TITLE_PRE}}": esc(content["concept"]["title_pre"]),
        "{{CONCEPT_TITLE_HL}}": esc(content["concept"]["title_hl"]),
        "{{CONCEPT_INTRO}}": esc(content["concept"]["intro"]),
        "{{CONCEPT_CARDS_HTML}}": build_cards_html(content["concept"]["cards"]),
        "{{MANIFESTO_TAG}}": esc(content["manifesto"]["tag"]),
        "{{MANIFESTO_QUOTE}}": esc(content["manifesto"]["quote"]),
        "{{GEO_KICKER}}": esc(content["geo"]["kicker"]),
        "{{GEO_TITLE_PRE}}": esc(content["geo"]["title_pre"]),
        "{{GEO_TITLE_HL}}": esc(content["geo"]["title_hl"]),
        "{{GEO_TEXT}}": esc(content["geo"]["text"]),
        "{{GEO_CHIPS_HTML}}": build_geo_chips_html(content["geo"]["chips"]),
        "{{VISIT_KICKER}}": esc(content["visit"]["kicker"]),
        "{{VISIT_TITLE_PRE}}": esc(content["visit"]["title_pre"]),
        "{{VISIT_TITLE_HL}}": esc(content["visit"]["title_hl"]),
        "{{VISIT_TEXT}}": esc(content["visit"]["text"]),
        "{{FAQ_KICKER}}": esc(content["faq"]["kicker"]),
        "{{FAQ_TITLE}}": esc(content["faq"]["title"]),
        "{{FAQ_ITEMS_HTML}}": build_faq_items_html(content["faq"]["items"]),
        "{{TICKETS_KICKER}}": esc(content["tickets"]["kicker"]),
        "{{TICKETS_TITLE_PRE}}": esc(content["tickets"]["title_pre"]),
        "{{TICKETS_TITLE_EM}}": esc(content["tickets"]["title_em"]),
        "{{TICKETS_TEXT}}": esc(content["tickets"]["text"]),
        "{{TICKETS_SUBMIT}}": esc(content["tickets"]["submit"]),
        "{{TICKETS_SMALLNOTE}}": esc(content["tickets"]["smallnote"]),
        "{{PASS_DAY_LABEL}}": esc(content["tickets"]["pass_day"]),
        "{{PASS_EVENING_LABEL}}": esc(content["tickets"]["pass_evening"]),
        "{{PASS_DAY_TIME}}": esc(content["tickets"]["pass_day_time"]),
        "{{PASS_DAY_DESC}}": esc(content["tickets"]["pass_day_desc"]),
        "{{PASS_DAY_PRICE_OLD}}": esc(content["tickets"]["pass_day_price_old"]),
        "{{PASS_DAY_PRICE}}": esc(content["tickets"]["pass_day_price"]),
        "{{PASS_EVENING_TIME}}": esc(content["tickets"]["pass_evening_time"]),
        "{{PASS_EVENING_DESC}}": esc(content["tickets"]["pass_evening_desc"]),
        "{{PASS_EVENING_PRICE}}": esc(content["tickets"]["pass_evening_price"]),
        "{{PASS_CARD_CTA}}": esc(content["tickets"]["card_cta"]),
        "{{PASS_KIDS_TAG}}": esc(content["tickets"]["pass_kids_tag"]),
        "{{PASS_INFANT_TAG}}": esc(content["tickets"]["pass_infant_tag"]),
        "{{DRAWER_CLOSE_LABEL}}": esc(content["tickets"]["drawer_close"]),
        "{{PRO_TITLE}}": esc(content["pro"]["title"]),
        "{{PRO_TEXT}}": esc(content["pro"]["text"]),
        "{{LANG_CODE_UPPER}}": content["lang_code"].upper(),
        "{{FOOTER_ABOUT}}": esc(content["footer"]["about"]),
        "{{FOOTER_CONTACT_HEADING}}": esc(content["footer"]["contact_heading"]),
        "{{FOOTER_LANG_SWITCH}}": esc(content["footer"]["lang_switch"]),
        "{{FOOTER_PRODUCTION_LABEL}}": esc(content["footer"]["production_label"]),
        "{{FOOTER_COUNTRY_LABEL}}": esc(content["footer"]["country_label"]),
        "{{FOOTER_NEWSLETTER_LABEL}}": esc(content["footer"]["newsletter_label"]),
        "{{FOOTER_NEWSLETTER_PLACEHOLDER}}": esc(content["footer"]["newsletter_placeholder"]),
        "{{FOOTER_NEWSLETTER_SUBMIT}}": esc(content["footer"]["newsletter_submit"]),
        "{{FOOTER_NEWSLETTER_SUCCESS}}": esc(content["footer"]["newsletter_success"]),
        "{{FOOTER_LEGAL_MENTIONS}}": esc(content["footer"]["legal_mentions"]),
        "{{FOOTER_LEGAL_PRIVACY}}": esc(content["footer"]["legal_privacy"]),
        "{{FOOTER_LEGAL_CGV}}": esc(content["footer"]["legal_cgv"]),
    }
    for token, value in replacements.items():
        html = html.replace(token, value)

    leftover = re.findall(r"\{\{[A-Z_]+\}\}", html)
    if leftover:
        raise SystemExit(f"Tokens non remplacés dans le rendu {content['lang_code']}: {sorted(set(leftover))}")
    return html


def main():
    all_content = {}
    for code, filename in LANGUAGES.items():
        path = I18N / "content" / f"{filename}.json"
        all_content[code] = json.loads(path.read_text(encoding="utf-8"))

    hreflang_block = build_hreflang_block(all_content)

    for code, content in all_content.items():
        html = render(content, hreflang_block)
        out_dir = ROOT / content["url_path"].strip("/")
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / "index.html"
        out_path.write_text(html, encoding="utf-8")
        print(f"✅ {content['url_path']:15s} -> {out_path.relative_to(ROOT)}")

    print("\nCes 3 points restent manuels (hors du scope de ce script), uniquement si tu AJOUTES ou RETIRES une langue :")
    print("  - hreflang de la page FR (index.html)")
    print("  - sitemap.xml (bloc hreflang réciproque sur les 5 URLs : /, /en/, /italia/, /deutschland/, /espana/)")
    print("  - LANGUAGES + LANGUAGE_LABELS en haut de ce script")
    print("Si tu changes juste le CONTENU d'une langue existante (texte, FAQ...), relancer ce script suffit.")


if __name__ == "__main__":
    main()
