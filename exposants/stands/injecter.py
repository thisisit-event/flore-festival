#!/usr/bin/env python3
"""Injecte les 3 stands dans /exposants/ (section « Les 3 stands possibles »).

Sources : les SVG de ce dossier (affiches fournies par Morgan).
On n'en garde que le dessin du stand (groupe id="dessin") et le texte de la légende :
  - le dessin est recadré sur le stand, sans l'en-tête, le titre ni le pied de l'affiche ;
  - le mot « FLORE » de l'enseigne devient le logo du site, la police devient Telegraf ;
  - l'enseigne est réduite (ECHELLE_ENSEIGNE) et les 3 dessins sont mis à la même échelle ;
  - la légende (5 éléments numérotés) devient du vrai texte HTML à côté du dessin ;
  - les pastilles 1 à 5 du dessin deviennent des zones interactives.

Après une mise à jour d'un dessin : python3 exposants/stands/injecter.py
"""
import html
import math
import pathlib
import re

ICI = pathlib.Path(__file__).resolve().parent
PAGE = ICI.parent / "index.html"
LOGO = "/assets/logo-flore-white.png"
RATIO_LOGO = 1800 / 780  # largeur / hauteur de logo-flore-white.png
MARGE = 16  # marge autour du dessin recadré, en unités du dessin
ECHELLE_ENSEIGNE = 0.6  # l'enseigne réelle sera bien plus petite que sur les dessins sources

STANDS = [
    # (clé, fichier, nom, taille, hall, usage, plus grand côté du sol en mètres)
    ("jardin", "FLORE_stand_Jardin_3x3_leger.svg", "Le Jardin des Saveurs", "3 × 3 m", "Hall A", "On mange sur place", 3),
    ("grand", "FLORE_stand_Boutique_3x2_leger.svg", "La Boutique Flore", "Grand stand 3 × 2 m", "Hall B", "Vente à emporter", 3),
    ("petit", "FLORE_stand_Boutique_2x2_leger.svg", "La Boutique Flore", "Stand 2 × 2 m", "Hall B", "Vente à emporter", 2),
]
# Les dessins sources n'ont pas la même échelle (le 2 × 2 est dessiné plus gros).
# Ils sont tous ramenés à l'échelle du premier, dans un cadre identique et posés au même niveau,
# pour que les poteaux et le personnage aient la même taille d'un stand à l'autre.

DEBUT, FIN = "<!-- STANDS:DEBUT (généré par exposants/stands/injecter.py) -->", "<!-- STANDS:FIN -->"
NUM = r"-?[\d.]+"


def pts(s):
    return [tuple(map(float, p.split(","))) for p in s.split()]


def local(points, e, f, a=0.8660, b=0.5):
    """Coordonnées dans le repère incliné matrix(a,b,0,1,e,f) : (u, v)."""
    out = []
    for sx, sy in points:
        u = (sx - e) / a
        out.append((u, sy - f - b * u))
    return out


def cadre(dessin):
    """Boîte englobante du dessin (formes uniquement, les textes sont à l'intérieur)."""
    xs, ys = [], []
    for s in re.findall(r'points="([^"]+)"', dessin):
        for x, y in pts(s):
            xs.append(x); ys.append(y)
    for x1, y1, x2, y2 in re.findall(rf'<line x1="({NUM})" y1="({NUM})" x2="({NUM})" y2="({NUM})"', dessin):
        xs += [float(x1), float(x2)]; ys += [float(y1), float(y2)]
    for cx, cy, r in re.findall(rf'<circle cx="({NUM})" cy="({NUM})" r="({NUM})"', dessin):
        xs += [float(cx) - float(r), float(cx) + float(r)]; ys += [float(cy) - float(r), float(cy) + float(r)]
    for d in re.findall(r'<path d="([^"]+)"', dessin):
        if d.startswith("M") and "l" not in d:  # silhouette (chemins absolus seulement)
            nums = list(map(float, re.findall(NUM, d)))
            xs += nums[0::2]; ys += nums[1::2]
    x0, y0, x1, y1 = min(xs) - MARGE, min(ys) - MARGE, max(xs) + MARGE, max(ys) + MARGE
    return x0, y0, x1 - x0, y1 - y0


def retoucher(n, titre, texte):
    """Textes de la légende ajustés par rapport aux affiches sources."""
    if n == 4:  # puissance électrique : un maximum, pas un forfait
        neuf = re.sub(r"^(\d[\d\u202f\u00a0 ]* W) inclus sur votre stand\.$", r"\1 maximum, pour l'ensemble de vos appareils.", texte)
        assert neuf != texte, texte
        return n, "1 bloc électrique", neuf
    return n, titre, texte


def adapter(svg, metres):
    dessin = re.search(r'<g id="dessin">(.*?)</g>', svg, re.S).group(1)
    sol = pts(re.search(r'<polygon points="([^"]+)" fill="#CFE6F6"', dessin).group(1))
    ppm = max(math.dist(sol[i], sol[(i + 1) % len(sol)]) for i in range(len(sol))) / metres

    # Enseigne : le mot FLORE devient le logo, centré au-dessus du bandeau jaune
    panneau = pts(re.search(r'<polygon points="([^"]+)" fill="#2E6DA3" stroke="#19263E" stroke-width="3"', dessin).group(1))
    bandeau = pts(re.search(r'<polygon points="([^"]+)" fill="#DAEF52" stroke="none"', dessin).group(1))
    m = re.search(r'<text transform="matrix\(([^)]*)\)" font-size="[\d.]+" font-weight="800" fill="#FFFFFF" text-anchor="middle">FLORE</text>', dessin)
    a, b, c, d, e, f = map(float, m.group(1).split(","))
    lp, lb = local(panneau, e, f, a, b), local(bandeau, e, f, a, b)
    haut, bas = min(v for _, v in lp), min(v for _, v in lb)
    largeur_panneau = max(u for u, _ in lp) - min(u for u, _ in lp)
    w = min((bas - haut) * 0.6 * RATIO_LOGO, largeur_panneau * 0.62)
    h = w / RATIO_LOGO
    y = (haut + bas) / 2 - h / 2
    dessin = dessin.replace(m.group(0), (
        f'<image href="{LOGO}" transform="matrix({m.group(1)})" '
        f'x="{-w / 2:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}"/>'
    ))

    # Enseigne réduite autour de son centre : le dessin d'origine la montre bien plus grande
    # que ce qui sera fabriqué. Sa pastille suit le coin le plus proche.
    debut = dessin.index(re.search(r'<polygon points="[^"]+" fill="#2E6DA3" stroke="#19263E" stroke-width="3"', dessin).group(0))
    fin = re.search(r'<text transform="matrix\([^)]*\)" font-size="[\d.]+" font-weight="800" fill="#19263E" '
                    r'text-anchor="middle">NOM DE VOTRE STAND</text>', dessin).end()
    assert dessin[debut:fin].count("<") == 6, dessin[debut:fin]  # panneau, liseré, logo, bandeau, nom (+ fermeture du nom)
    ech = ECHELLE_ENSEIGNE
    cx, cy = sum(x for x, _ in panneau) / len(panneau), sum(y for _, y in panneau) / len(panneau)
    dessin = (dessin[:debut] + f'<g transform="matrix({ech},0,0,{ech},{cx * (1 - ech):.2f},{cy * (1 - ech):.2f})">'
              + dessin[debut:fin] + "</g>" + dessin[fin:])
    p1 = re.search(r'<circle cx="([\d.]+)" cy="([\d.]+)" r="17" fill="#DAEF52" stroke="#19263E" stroke-width="3"/><text[^>]*>1</text>', dessin)
    px, py = float(p1.group(1)), float(p1.group(2))
    coin = min(panneau, key=lambda q: math.dist(q, (px, py)))
    dx, dy = (coin[0] - cx) * (ech - 1), (coin[1] - cy) * (ech - 1)
    dessin = dessin.replace(p1.group(0), f'<g transform="translate({dx:.2f},{dy:.2f})">{p1.group(0)}</g>')

    boite = cadre(dessin)
    pastilles = {int(n): (float(x), float(y)) for x, y, n in re.findall(
        r'<circle cx="([\d.]+)" cy="([\d.]+)" r="17" fill="#DAEF52" stroke="#19263E" stroke-width="3"/><text[^>]*>(\d)</text>', dessin)}
    pastilles[1] = (pastilles[1][0] + dx, pastilles[1][1] + dy)
    legende = [(int(n), t, dsc) for n, t, dsc in re.findall(
        r'<g transform="translate\([\d.]+,872\)">.*?<text[^>]*>(\d)</text><text[^>]*>([^<]+)</text>'
        r'<foreignObject[^>]*><div[^>]*>([^<]+)</div>', svg)]
    legende = [retoucher(n, t, dsc) for n, t, dsc in legende]
    assert len(pastilles) == 5 and len(legende) == 5, (pastilles, legende)
    return dessin, boite, ppm, pastilles, legende


def carte(cle, nom, taille, hall, usage, dessin, boite, k, cadre_commun, pastilles, legende):
    x0, y0, w, h = boite
    W, H = cadre_commun
    vx, vy = (x0 + w / 2) * k - W / 2, (y0 + h) * k - H  # centré, posé sur la même ligne de sol
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx:.1f} {vy:.1f} {W:.1f} {H:.1f}" '
        f'font-family="Telegraf, system-ui, sans-serif" class="stand-svg" role="img" '
        f'aria-label="Dessin du stand {html.escape(nom)}, {html.escape(taille)}">\n'
        f'<g transform="scale({k:.4f})">\n{dessin.strip()}\n</g>\n</svg>'
    )
    hs = {n: ((cx * k - vx) / W * 100, (cy * k - vy) / H * 100) for n, (cx, cy) in pastilles.items()}
    e = lambda s: html.escape(s, quote=False)
    boutons = "\n".join(
        f'          <button type="button" class="stand-hs" style="left:{x:.2f}%;top:{y:.2f}%" data-n="{n}" '
        f'tabindex="-1" aria-hidden="true"></button>'
        for n, (x, y) in sorted(hs.items()))
    items = "\n".join(
        f'          <li data-n="{n}"><span class="n" aria-hidden="true">{n}</span>'
        f'<div><b>{e(t)}</b><p>{e(dsc)}</p></div></li>'
        for n, t, dsc in legende)
    return f"""      <article class="stand-card" id="stand-{cle}" data-stand="{cle}" data-aos="fade-up">
        <div class="stand-fig" style="--k:{k:.3f}">
{svg}
{boutons}
        </div>
        <div class="stand-info">
          <h3>{e(nom)}</h3>
          <ul class="stand-tags">
            <li class="is-size">{e(taille)}</li><li>{e(hall)}</li><li>{e(usage)}</li>
          </ul>
          <ol class="stand-items">
{items}
          </ol>
        </div>
      </article>"""


def main():
    page = PAGE.read_text(encoding="utf-8")
    i, j = page.index(DEBUT), page.index(FIN)
    lus = [(st, adapter((ICI / st[1]).read_text(encoding="utf-8"), st[6])) for st in STANDS]
    ref = lus[0][1][2]  # échelle du premier dessin (px par mètre)
    ks = [ref / a[2] for _, a in lus]
    W = max(a[1][2] * k for (_, a), k in zip(lus, ks))
    H = max(a[1][3] * k for (_, a), k in zip(lus, ks))
    bloc = "\n".join(
        carte(st[0], st[2], st[3], st[4], st[5], a[0], a[1], k, (W, H), a[3], a[4])
        for (st, a), k in zip(lus, ks))
    PAGE.write_text(page[:i] + DEBUT + "\n" + bloc + "\n      " + page[j:], encoding="utf-8")
    print("OK :", ", ".join(s[0] for s in STANDS))


if __name__ == "__main__":
    main()
