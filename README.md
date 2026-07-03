# FLORE Festival · Site officiel

Site web du **FLORE Festival**, le premier festival musical et culinaire 100 % sans gluten
et sans lactose. Une production de **MG Entertainment**.

🌐 **Production :** https://flore-festival.fr
📍 **Édition 2027 :** samedi 27 mars 2027, à Lagnieu (Ain)

## Stack

Site statique, sans build : HTML/CSS/JS en un seul fichier ([index.html](index.html)).

- Polices : Fraunces + DM Sans (Google Fonts)
- Animations au scroll : [AOS](https://github.com/michalsnik/aos) (CDN)
- Hébergement : GitHub Pages + domaine `flore-festival.fr` (voir [CNAME](CNAME))

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Page unique du site (toutes les sections) |
| `404.html` | Page d'erreur personnalisée |
| `assets/favicon.svg` | Favicon (feuille Flore) |
| `CNAME` | Domaine personnalisé GitHub Pages |
| `robots.txt` | Indexation moteurs de recherche |
| `.nojekyll` | Désactive le traitement Jekyll de GitHub Pages |

## Développement local

Aucune dépendance. Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
python3 -m http.server 8000   # puis http://localhost:8000
```

## Déploiement

Tout push sur la branche `main` est publié automatiquement par GitHub Pages.

- **Dépôt :** https://github.com/thisisit-event/flore-festival
- **URL GitHub :** https://thisisit-event.github.io/flore-festival/
- **Domaine cible :** https://flore-festival.fr

## Connexion du domaine `flore-festival.fr`

Le domaine est géré chez **Infomaniak**. Dans le *Gestionnaire de zone DNS*
d'Infomaniak (Manager > Domaines > flore-festival.fr > Zone DNS) :

1. **Supprimer** l'enregistrement `A` existant de `flore-festival.fr` (`@`)
   qui pointe vers `172.66.0.70`.
2. **Ajouter 4 enregistrements `A`** sur `@` (apex) vers GitHub Pages :
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
3. *(Optionnel, IPv6)* ajouter 4 enregistrements `AAAA` sur `@` :
   ```
   2606:50c0:8000::153
   2606:50c0:8001::153
   2606:50c0:8002::153
   2606:50c0:8003::153
   ```
4. **Sous-domaine `www`** : enregistrement `CNAME`
   `www` → `thisisit-event.github.io.`
5. **Ne pas toucher aux enregistrements `MX`** (`mta-gw.infomaniak.ch`) :
   ils font fonctionner l'email `contact@flore-festival.fr`.

Après propagation DNS (de quelques minutes à 24 h), GitHub vérifie le domaine,
provisionne un certificat HTTPS, puis on active **Enforce HTTPS** dans
*Settings > Pages* du dépôt.

## Guide FLORE · carte interactive

`/guide/` est la carte publique des établissements sans gluten et sans lactose,
en vue « liste + carte » façon Airbnb (Leaflet.js + fond OpenStreetMap, aucune
clé API). Comme le reste du site, c'est **statique, sans backend, sans build**.
Chaque établissement validé a aussi sa propre page HTML (« mini-site »), pour
être indexé individuellement par Google (objectif SEO : chaque fiche est une
porte d'entrée possible sur le site).

**Deux représentations à tenir synchronisées** (pas de build, donc pas de
génération automatique) :
- `assets/data/guide-etablissements.json` → alimente les **pins de la carte**
  (fetch JS).
- Une `.guide-card` écrite à la main dans `/guide/index.html` → alimente la
  **liste** (HTML pur, crawlable même sans JS, et sert aussi de source pour le
  filtrage côté liste via ses attributs `data-*`).

Les deux doivent décrire le même établissement ; le filtrage JS applique les
mêmes règles aux pins (depuis le JSON) et aux cartes (depuis leurs `data-*`),
et les synchronise (survol d'une carte → ouverture du pin correspondant).

### Où sont les données

`assets/data/guide-etablissements.json` — tableau d'objets, un par établissement :

```json
{
  "id": "identifiant-technique",
  "slug": "nom-etablissement-ville",
  "nom": "Nom affiché",
  "type": "Restaurant",
  "lat": 45.123,
  "lng": 5.456,
  "adresse": "Ville · Département",
  "gluten": "dedie",
  "lactose": "options",
  "description": "1-2 phrases, ton FLORE, pas de tiret cadratin.",
  "site": "https://...",
  "instagram": "https://instagram.com/...",
  "boutique_flore": false
}
```

- `type` : une des 6 valeurs du formulaire de candidature (`Restaurant`,
  `Boulangerie / Pâtisserie`, `Épicerie`, `Artisan`, `Marque 100% en ligne`,
  `Producteur`).
- `gluten` / `lactose` : `"dedie"` (100 % dédié, zéro trace), `"options"`
  (cuisine mixte, contamination maîtrisée), ou absent si non concerné.
- `boutique_flore` : `true` si la marque est aussi référencée à la Boutique
  Flore → un bouton apparaît sur sa fiche du Guide vers `/exposants/boutique/`.

### Ajouter un établissement validé par le Comité (4 étapes)

1. **Ajouter l'entrée** dans `assets/data/guide-etablissements.json` (alimente
   le pin sur la carte).
2. **Ajouter une `.guide-card`** dans `<div class="guide-list">` de
   `/guide/index.html` (copier un bloc existant), avec les attributs
   `data-slug` (identique au `slug` du JSON), `data-type`, `data-gluten`,
   `data-lactose` à jour — c'est ce bloc qui est filtré/affiché dans la liste
   et qui est crawlable par Google sans JS.
3. **Créer la fiche** à `/guide/{slug}/index.html` à partir du template
   ci-dessous (title, meta description et JSON-LD uniques → indexation
   individuelle, comme un mini-site pour cet établissement).
4. **Ajouter l'URL de la fiche** dans `sitemap.xml`.

### Template de fiche `/guide/{slug}/index.html`

Reprendre le head standard des pages exposants (fonts, AOS, `flore.css`,
favicon) et remplacer le contenu par :

```html
<title>{{Nom}} · {{Type}} sans gluten et sans lactose à {{Ville}} · Guide FLORE</title>
<meta name="description" content="{{Nom}}, {{type}} {{gluten/lactose en une phrase}} à {{Ville}}. Validé par le Comité FLORE.">
<link rel="canonical" href="https://flore-festival.fr/guide/{{slug}}/">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "{{Restaurant|Bakery|GroceryStore|LocalBusiness}}",
  "name": "{{Nom}}",
  "description": "{{description}}",
  "address": { "@type": "PostalAddress", "addressLocality": "{{Ville}}", "addressCountry": "FR" },
  "geo": { "@type": "GeoCoordinates", "latitude": {{lat}}, "longitude": {{lng}} },
  "url": "https://flore-festival.fr/guide/{{slug}}/",
  "sameAs": ["{{site}}", "{{instagram}}"]
}
</script>
```

Corps de page (voir `/guide/flore-festival-lagnieu/index.html` comme référence
concrète) : un vrai mini-site à sections, pas juste une carte compacte —

1. **Hero** : back-link vers `/guide/`, badge « Validé par le Comité FLORE »,
   H1 avec le nom, tagline, rangée de « facts » (catégorie, ville, date —
   flouter tout ce qui doit l'être, voir [[flore-date-festival]]).
2. **Statut de sécurité** : cartes gluten/lactose (mêmes libellés que le
   popup de la carte).
3. **À propos** : description plus longue que celle du JSON.
4. **Infos pratiques** : petites cards (date, horaires, lieu, catégorie).
5. **Actions** : site web, et si `boutique_flore: true` un bouton vers
   `/exposants/boutique/`, plus un bouton retour carte vers
   `/guide/#{{slug}}` (rouvre le pin correspondant automatiquement).

Même nav/footer que les autres pages `/guide/` et `/exposants/`.

## À compléter / confirmer

- Lieu exact et adresse à Lagnieu
- Programmation artistique (line-up)
- Visuel de partage `og:image` pour les réseaux sociaux
- Lien réel de billetterie (formulaire newsletter actuellement en `mailto:`)
- Liens des réseaux sociaux (Instagram, etc.)
