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

- `type` : une des catégories du formulaire de candidature (`Restaurant`,
  `Boulangerie`, `Pâtisserie`, `Café`, `Hôtel`, `Traiteur`, `Boutique`,
  `Épicerie`, `Producteur`, `Marque alimentaire`, `Entreprise`,
  `Professionnel de santé`, `Association`, `Autre`), + `Festival` réservé à
  la fiche FLORE elle-même. Doit correspondre exactement aux `<option>` du
  filtre catégorie de `/guide/index.html`.
- `gluten` / `lactose` : `"dedie"` (100 % dédié, zéro trace), `"options"`
  (cuisine mixte, contamination maîtrisée), ou absent si non concerné.
- `boutique_flore` : `true` si la marque est aussi référencée à la Boutique
  Flore → un bouton apparaît sur sa fiche du Guide vers `/exposants/boutique/`.

### Formulaire d'inscription pro `/exposants/carte-guide/`

Wizard en 7 écrans (profil, infos générales, activité, sécurité alimentaire +
demande de certification FLORE, services, galerie, validation avec aperçu en
direct de la fiche) — **toujours sans compte ni backend** : c'est un long
formulaire côté navigateur, envoyé par email via Web3Forms comme les autres
formulaires du site (voir [[flore-web3forms-key]]). Aucune donnée n'est
stockée automatiquement ; le Comité reçoit l'email et suit ensuite le
processus ci-dessous à la main.

**Pas d'étape Horaires** : retirée volontairement (2026-07-04). Demander des
horaires précis créerait une attente de mise à jour permanente (chaque
changement d'heure → sollicitation du Comité), intenable sur un site géré à
la main. Les horaires restent l'affaire du site/réseaux sociaux du
professionnel (déjà collectés à l'étape 2), pas du Guide.

**Galerie : champs fichier individuels, jamais `multiple`** — le plan
gratuit Web3Forms ne supporte que des fichiers uniques par champ ; l'upload
multiple (plusieurs fichiers dans un seul `<input>`) est une fonctionnalité
PRO payante (voir [docs Web3Forms](https://docs.web3forms.com/getting-started/pro-features/file-attachments)).
D'où les 4 champs séparés `photo_secondaire_1` à `_4` (pas un input
`multiple`), et `justificatif` en single-file. Ne pas réintroduire de champ
`multiple` sur ce formulaire sans vérifier d'abord le plan Web3Forms actif.

Volontairement pas de vrai tableau de bord pro (vues, clics, messages) ni de
connexion : ça nécessiterait un backend, hors du cadre de ce site. Voir
[[flore-vision-plateforme-marketplace]] pour la vision long terme et pourquoi
elle est mise de côté pour l'instant.

### Ajouter un établissement validé par le Comité (4 étapes)

1. **Ajouter l'entrée** dans `assets/data/guide-etablissements.json` (alimente
   le pin sur la carte).
2. **Ajouter une `.guide-card`** dans `<div class="guide-list">` de
   `/guide/index.html` (copier un bloc existant, **avant** la carte
   `.guide-card-ghost` qui doit rester la dernière — elle n'est pas filtrée et
   sert de CTA permanent « votre établissement ici »), avec les attributs
   `data-slug` (identique au `slug` du JSON), `data-type`, `data-gluten`,
   `data-lactose` à jour — c'est ce bloc qui est filtré/affiché dans la liste
   et qui est crawlable par Google sans JS.
3. **Créer la fiche** à `/guide/{slug}/index.html` à partir du template
   ci-dessous (title, meta description et JSON-LD uniques → indexation
   individuelle, comme un mini-site pour cet établissement).
4. **Ajouter l'URL de la fiche** dans `sitemap.xml`.

### Template de fiche `/guide/{slug}/index.html`

**`/guide/flore-festival-lagnieu/index.html` EST le template** — dupliquer ce
fichier à l'identique pour chaque nouvel établissement, ne pas réinventer la
structure à chaque fois. C'est volontairement différent du reste du site :
pas de fond ciel bleu / soleil / marguerites, pas d'AOS. Une fiche est une
page neutre et structurée façon Airbnb (galerie photo + colonne info sticky),
pensée pour qu'on puisse les uniformiser toutes et y mettre de vraies photos
dès qu'un établissement candidate avec ses propres visuels.

Adapter dans le duplicata :

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

Structure du corps (toutes les classes existent déjà dans le fichier de
référence, ne pas en réinventer d'autres) :

1. **`.fiche-back`** : lien retour vers `/guide/`.
2. **`.fiche-title-row`** : badge catégorie (`.fiche-cat-badge`), H1 avec le
   nom, ligne meta (badge « Validé par le Comité FLORE » + ville — flouter
   ce qui doit l'être, voir [[flore-date-festival]]).
3. **`.fiche-gallery`** : grille de 5 images (1 grande + 4 petites). Règle
   fixe, imposée dès le formulaire de candidature (`/exposants/carte-guide/`,
   étapes 2 et 6) : **1 photo principale** (sert aussi d'image de couverture,
   `.fg-main`) + **exactement 4 photos secondaires** (produits, intérieur,
   extérieur, équipe...). Le wizard bloque la validation tant que ce n'est
   pas exactement 4. Tant qu'un établissement n'a pas fourni ses propres
   photos, ne pas inventer de visuel : utiliser au pire les assets de marque
   FLORE existants (voir [[flore-assets-cdn]]), jamais une photo stock.
4. **`.fiche-body`** (grille 2 colonnes, `.fiche-main-col` + `.fiche-side-col`
   sticky) :
   - `.fiche-main-col` : sections `<section>` séparées par une bordure —
     « À propos » (texte), « Statut de sécurité » et « Ce qui vous attend »
     en listes `.fiche-amenities` (icône + titre + description courte, pas
     de grandes cards colorées).
   - `.fiche-side-col` : `.fiche-card-sticky` avec les infos clés en lignes
     `.fsc-row` (date, horaires, lieu, catégorie) puis les boutons d'action
     (`.btn-fiche.primary/.sun/.ghost`) : site web, et si `boutique_flore:
     true` un lien vers `/exposants/boutique/`, plus un retour carte vers
     `/guide/#{{slug}}` (rouvre le pin correspondant automatiquement).
5. **Nav forcée en mode "scrolled"** : la fiche a un fond blanc dès le haut,
   donc script en bas de page `nav.classList.add('scrolled')` — sans ça le
   logo et les liens de la nav sont blancs sur blanc, invisibles.

Même nav/footer (chrome partagé) que les autres pages `/guide/` et
`/exposants/`.

## À compléter / confirmer

- Lieu exact et adresse à Lagnieu
- Programmation artistique (line-up)
- Visuel de partage `og:image` pour les réseaux sociaux
- Lien réel de billetterie (formulaire newsletter actuellement en `mailto:`)
- Liens des réseaux sociaux (Instagram, etc.)
