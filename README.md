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

`assets/data/guide-etablissements.json` est **la base de données du Guide** :
la source de vérité unique pour les infos ET les liens d'images de chaque
fiche (pas seulement ce qui alimente les pins). Choix volontaire (2026-07-04) :
même si le site reste 100 % statique et que ce fichier ne "génère" rien tout
seul (voir plus haut, les cartes/fiches restent écrites à la main), tout doit
être déclaré ici en premier — objectif : pouvoir migrer ce fichier tel quel
vers une vraie base de données le jour où le Guide évolue vers une vraie appli
(voir [[flore-vision-plateforme-marketplace]]), sans avoir à ressortir
l'info d'un tas de fichiers HTML éparpillés.

Tableau d'objets, un par établissement :

```json
{
  "id": "identifiant-technique",
  "slug": "nom-etablissement-ville",
  "nom": "Nom affiché",
  "type": "Restaurant",
  "lat": 45.123,
  "lng": 5.456,
  "adresse": "Ville · Département",
  "ville": "Nom de la ville, sans accent superflu — sert au filtre ville",
  "gluten": "dedie",
  "lactose": "options",
  "description": "1-2 phrases, ton FLORE, pas de tiret cadratin.",
  "site": "https://...",
  "instagram": "https://instagram.com/...",
  "boutique_flore": false,
  "images": {
    "principale": "https://...",
    "secondaires": ["https://...", "https://...", "https://...", "https://..."]
  }
}
```

- `images.principale` : sert à la fois de photo de couverture et de grande
  image dans `.fiche-gallery` (`.fg-main`).
- `images.secondaires` : exactement 4 URLs (voir [[flore-guide-gratuit-confirme]]
  pour la discipline de compression avant upload sur le CDN). Ce sont ces
  mêmes URLs qui doivent être recopiées dans le `<img src>` de la galerie de
  la fiche HTML — le JSON est déclaré en premier, la fiche en est la
  restitution.

- `type` : une des catégories du formulaire de candidature (`Restaurant`,
  `Traiteur`, `Boutique`, `Marque alimentaire`, `Professionnel de santé`,
  `Association`, `Autre`), + `Festival` réservé à la fiche FLORE elle-même.
  Liste volontairement resserrée (2026-07-04, retiré `Boulangerie`,
  `Pâtisserie`, `Café`, `Hôtel`, `Épicerie`, `Producteur`, `Entreprise` —
  trop de catégories pour la taille actuelle du Guide). Doit correspondre
  exactement aux `<option>` du
  filtre catégorie de `/guide/index.html`.
- `gluten` / `lactose` : `"dedie"` (100 % dédié, zéro trace), `"options"`
  (cuisine mixte, contamination maîtrisée), ou absent si non concerné. Piloté
  par les filtres 🌾/🥛 et le toggle "100 % dédié uniquement" de
  `/guide/index.html` (2026-07-04).
- `ville` : optionnel, alimente dynamiquement le `<select>` de filtre ville
  (peuplé au chargement du JSON, pas de liste à maintenir à la main). Ne pas
  renseigner tant que le lieu d'un établissement doit rester flouté (cas de
  la fiche FLORE Festival elle-même, volontairement absent).
- `boutique_flore` : `true` si la marque est aussi référencée à la Boutique
  Flore → un bouton apparaît sur sa fiche du Guide vers `/exposants/boutique/`.

### Formulaire d'inscription pro `/guide/inscription/`

Anciennement `/exposants/carte-guide/`, renommé le 2026-07-04 : « exposants »
évoquait un stand de festival, alors que ce formulaire sert à référencer
n'importe quel établissement (restaurant, boutique, marque, asso...) sur le
Guide, festival ou pas. `/guide/inscription/` colle mieux au Guide dont il
dépend et sonne plus sérieux/durable.

Wizard en 7 écrans (profil, infos générales, activité, sécurité alimentaire,
services, galerie, validation avec aperçu en direct de la fiche) — **toujours
sans compte ni backend** : c'est un long
formulaire côté navigateur, envoyé par email via Web3Forms comme les autres
formulaires du site (voir [[flore-web3forms-key]]). Aucune donnée n'est
stockée automatiquement ; le Comité reçoit l'email et suit ensuite le
processus ci-dessous à la main.

**Pas de demande de certification FLORE dans le formulaire** : retirée
volontairement (2026-07-04). Le badge 🌿 Certifié FLORE n'est pas quelque
chose que le candidat demande à la saisie ; il est attribué plus tard, après
une vérification physique par un membre du Comité. En attendant, toute fiche
est publiée librement, sans certification.

**Pas d'étape Horaires** : retirée volontairement (2026-07-04). Demander des
horaires précis créerait une attente de mise à jour permanente (chaque
changement d'heure → sollicitation du Comité), intenable sur un site géré à
la main. Les horaires restent l'affaire du site/réseaux sociaux du
professionnel (déjà collectés à l'étape 2), pas du Guide.

**Aucun champ fichier dans ce formulaire** (confirmé par un test réel le
2026-07-04 : même un seul fichier renvoie « You are trying to use a Pro
feature » — le compte Web3Forms actif n'inclut aucun upload de fichier, pas
seulement le mode `multiple`). À la place, l'étape 6 (Galerie) demande un
simple champ texte `lien_photos` (URL vers Google Drive, Instagram, le site du
professionnel...), **obligatoire** — sans photos, pas de fiche publiable sur
le Guide. Tout arrive donc en un seul envoi Web3Forms, sans email séparé à
recoller manuellement. Une case à cocher dédiée (`#in-photos-droits`, distincte
du RGPD) fait certifier au candidat qu'il possède les droits sur les photos
transmises (ou l'autorisation de les utiliser) et qu'il autorise FLORE à les
utiliser pour sa fiche — protection minimale contre un litige de droit à
l'image. Le Comité ouvre le
lien, télécharge logo + 1 photo principale + 4 photos secondaires, les
compresse/héberge sur le CDN, puis ajoute les URLs dans
`assets/data/guide-etablissements.json` (`images.principale` /
`images.secondaires`). **Ne jamais réintroduire `<input type="file">` sur ce
formulaire** sans re-vérifier d'abord que le plan Web3Forms le permet.

Depuis le 2026-07-04, l'étape Galerie propose un vrai choix visible entre
deux cases (`.photo-choice`, radio caché derrière un label cliquable comme
`.chip`) : « Ajouter un lien » ou « Envoyer par email » — plutôt qu'un champ
lien marqué d'un simple astérisque. Le mode email retire l'obligation du
champ lien (`validateStep` vérifie `photo_mode` avant d'exiger le lien).

**Validation de l'étape 2 (infos générales) renforcée** (2026-07-04) : un
test réel a montré qu'un champ rempli d'une seule lettre passait la
validation (elle ne vérifiait que `!value.trim()`, pas le format). Ajout
d'une vraie vérification d'email (regex) et de longueurs minimales
raisonnables sur nom/description/adresse/ville. Le formulaire garde
`novalidate` sur la balise `<form>` (UI d'erreur custom plutôt que les
bulles natives du navigateur), donc toute contrainte de format doit être
vérifiée à la main dans `validateStep()` — la validation HTML5 seule
(`type="email"`, `required`) ne suffit pas si `novalidate` est présent.

**Auto-remplissage** (2026-07-04) :
- Attributs `autocomplete` corrects sur tous les champs de l'étape
  Informations générales (`email`, `tel`, `organization`, `street-address`,
  `address-level2`/`1`, `postal-code`, `country-name`, `url`) pour que le
  navigateur propose ses propres suggestions enregistrées.
- **Autocomplétion d'adresse réelle** sur le champ Adresse : appelle
  l'API Adresse du gouvernement français (`api-adresse.data.gouv.fr`,
  gratuite, sans clé, endpoint `/search/`), debounce 250 ms, affiche
  jusqu'à 5 suggestions. Sélectionner une suggestion remplit
  automatiquement Adresse, Ville, Code postal et Région (parsés depuis
  `properties.context`, format "département, nom département, région").
  Si l'API est indisponible, le champ reste utilisable en saisie libre
  (échec silencieux, pas de blocage).

**Traitement des candidatures et demandes de modif par lots, pas en temps
réel** : le même formulaire sert aussi bien pour une nouvelle inscription que
pour une demande de modification ultérieure (pas de formulaire séparé à
maintenir). Le Comité ne traite pas au fil de l'eau — il regroupe les emails
reçus et les applique en une session périodique (hebdomadaire ou toutes les 2
semaines), pour éviter qu'une fiche déjà publiée ne génère des sollicitations
permanentes. Ce délai est annoncé au candidat dans le message de confirmation
(« Le Comité FLORE l'examine et vous répond sous 5 jours ouvrés »).

Volontairement pas de vrai tableau de bord pro (vues, clics, messages) ni de
connexion : ça nécessiterait un backend, hors du cadre de ce site. Voir
[[flore-vision-plateforme-marketplace]] pour la vision long terme et pourquoi
elle est mise de côté pour l'instant.

**Nav allégée sur tout l'écosystème Guide** (`/guide/*`, ce qui inclut
`/guide/inscription/`, 2026-07-04) : `assets/nav.js` détecte ce préfixe
et monte une nav minimale (logo, un seul lien "🌱 Le Festival FLORE", EN,
Billetterie) au lieu du mega-menu complet — le Guide est pensé comme un outil
de recherche quasi indépendant (utile pour du SEO local hors-festival), sans
pour autant couper le pont de découverte vers le festival. Le CTA flottant
"Réserver ma place" est aussi désactivé sur ces pages. Toute la logique vit
dans une seule fonction (`isGuideEcosystem` dans `nav.js`) : pas de fichier
nav dupliqué à maintenir.

Au passage, le clic sur le burger mobile (`#navToggle` → classe `.open` sur
`#mobileMenu`) a été centralisé dans `nav.js` (`wireMobileToggle()`) : il
était auparavant recopié dans le `<script>` de chaque page, et 6 pages
(tout `/guide/*` et `/exposants/*`) ne l'avaient jamais reçu — le burger n'y
faisait donc rien sur mobile. Ne plus dupliquer ce câblage dans une page ;
laisser `nav.js` s'en charger.

### Formulaire de candidature `/exposants/boutique/`

Un seul écran (pas un wizard), envoyé par email via Web3Forms comme les
autres formulaires. Suit les mêmes principes que le formulaire Guide :
- **Aucun champ fichier** : un champ texte facultatif `lien_photos` (URL vers
  Drive, Instagram...) + une note invitant à envoyer les photos par email à
  contact@flore-festival.fr si le candidat n'a pas de lien sous la main.
- **Case dédiée aux droits d'image** (`droits_image`), distincte du RGPD et
  des certifications SG/SL, sur le même modèle que le Guide.
- **Pas de certification FLORE demandée ici non plus** : les cases
  `certif_sg` / `certif_sl` / `etiquetage` sont de l'auto-déclaration du
  candidat, pas une demande de badge FLORE — la vérification physique par le
  Comité reste une étape ultérieure, hors formulaire.

Piège corrigé au passage (2026-07-04) : `.f-field label{text-transform:
uppercase}` s'appliquait par erreur à tous les `<label>` descendants, y
compris les cases à cocher `.f-check` imbriquées dans un `.f-field` — le
texte des engagements s'affichait tout en majuscules avec un espacement de
lettres illisible sur les phrases longues. Corrigé en `.f-field>label`
(enfant direct uniquement).

### Ajouter un établissement validé par le Comité (4 étapes)

1. **Ajouter l'entrée** dans `assets/data/guide-etablissements.json`, **images
   comprises** (`images.principale` + les 4 `images.secondaires`, uploadées au
   préalable sur le CDN, compressées). C'est la base de données de référence :
   tout le reste (carte, fiche) n'en est qu'une restitution HTML.
2. **Ajouter une `.guide-card`** dans `<div class="guide-list">` de
   `/guide/index.html` (copier un bloc existant, **avant** la carte
   `.guide-card-ghost` qui doit rester la dernière — elle n'est pas filtrée et
   sert de CTA permanent « votre établissement ici »), avec les attributs
   `data-slug` (identique au `slug` du JSON), `data-type`, `data-gluten`,
   `data-lactose`, `data-ville` (si renseigné) à jour — c'est ce bloc qui est
   filtré/affiché dans la liste et qui est crawlable par Google sans JS.
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
  "image": "{{images.principale}}",
  "address": { "@type": "PostalAddress", "addressLocality": "{{Ville}}", "addressCountry": "FR" },
  "geo": { "@type": "GeoCoordinates", "latitude": {{lat}}, "longitude": {{lng}} },
  "telephone": "{{telephone, si fourni — sinon omettre le champ}}",
  "url": "https://flore-festival.fr/guide/{{slug}}/",
  "sameAs": ["{{site}}", "{{instagram}}"],
  "isPartOf": { "@id": "https://flore-festival.fr/#website" }
}
</script>
```

`isPartOf` est ce qui fait le pont structuré retour vers FLORE : ça dit
explicitement à Google que cette fiche `LocalBusiness` fait partie du site
flore-festival.fr, pas juste un lien texte. `image` + `telephone` (si connu)
améliorent les chances de rich snippet. Ne jamais omettre `isPartOf` : c'est
la traduction technique du principe « si on les trouve, on trouve FLORE ».

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
     de grandes cards colorées). La section « Statut de sécurité » se
     termine **toujours** par `.fiche-disclaimer` (2026-07-04, obligatoire
     sur toute fiche dupliquée) : précise que l'info est auto-déclarée,
     non vérifiée par FLORE sauf badge 🌿 Certifié FLORE — protection
     légale, à ne jamais retirer.
   - `.fiche-side-col` : `.fiche-card-sticky` avec les infos clés en lignes
     `.fsc-row` (date, horaires, lieu, catégorie) puis les boutons d'action
     (`.btn-fiche.primary/.sun/.ghost`) : site web, plus un retour carte vers
     `/guide/#{{slug}}` (rouvre le pin correspondant automatiquement).
     `boutique_flore` existe toujours dans le JSON mais **n'est plus branché
     à rien** depuis la dépublication de `/exposants/boutique/` (2026-07-04,
     voir [[flore-pages-depubliees-2026-07-04]]) — le champ ne doit pas
     déclencher de lien tant que cette page n'est pas restaurée.
5. **Nav standard au scroll** (`nav.classList.toggle('scrolled', window.scrollY
   > 30)`) : rien de spécial à faire, la fiche garde le ciel bleu FLORE en
   hero donc la nav transparente-puis-scrollée fonctionne normalement, comme
   sur le reste du site.

Même nav/footer (chrome partagé) que les autres pages `/guide/` et
`/exposants/` — nav allégée automatique via `nav.js` (voir plus haut,
section nav Guide).

### Avertissement légal du Guide (2026-07-04)

`.guide-disclaimer` sous la liste/carte de `/guide/index.html` (et son
équivalent `.fiche-disclaimer` sur chaque fiche, voir plus haut) :
rappelle que le référencement est **libre et auto-déclaré**, que FLORE ne
certifie pas les informations gluten/lactose des établissements listés et
ne garantit pas l'absence de contamination croisée, sauf badge 🌿 Certifié
FLORE (vérification physique du Comité). Élément permanent, ne pas
retirer — c'est la protection qui permet de référencer librement sans
engager la responsabilité de FLORE sur des infos qu'elle ne vérifie pas
elle-même à ce stade.

### Fonctionnalités de recherche/carte `/guide/index.html` (2026-07-04)

Ajouts UX sur la page liste/carte, tous vanilla JS (pas de dépendance
nouvelle) :

- **Autocomplétion** : `#guide-suggest`, dropdown sous la barre de recherche
  qui propose jusqu'à 6 correspondances (nom/type/adresse) au fil de la
  frappe, avec surlignage du texte trouvé (`<mark>`), navigation clavier
  (↑/↓/Entrée/Échap) et clic. Sélectionner une suggestion recentre la carte,
  ouvre son marqueur et bascule sur l'onglet Carte en mobile.
- **Case à effacer** (`#search-clear`) dans la barre de recherche.
- **Géolocalisation** (`#btn-locate`) : trie la liste par proximité
  (distance à vol d'oiseau, formule haversine) et pose un marqueur bleu
  "vous êtes ici" ; bouton à bascule (re-clic = désactive le tri).
- **Bascule Liste/Carte** (`#guide-view-toggle`) : visible uniquement en
  dessous de 900px, remplace l'ancien empilement liste-puis-carte qui
  imposait de scroller. Appelle `map.invalidateSize()` en passant sur
  l'onglet Carte (Leaflet calcule mal sa taille tant que son conteneur est
  `display:none`).
- **Bouton "Voir tout"** (`#btn-map-reset`) sur la carte : `fitBounds` sur
  tous les marqueurs visibles (ou recentre sur la France si aucun résultat).
- **Indice de défilement** des pastilles de catégorie sur mobile (dégradé
  qui disparaît en fin de scroll).

Piège rencontré et corrigé : `.gsb-clear{display:flex}` avait la même
spécificité que le sélecteur natif `[hidden]` et gagnait (bouton visible en
permanence) — même famille de bug que `.guide-card`/`.signup-success`
rencontrés plus tôt. Réflexe à avoir : **toute nouvelle classe utilisant
`hidden` comme mécanisme d'affichage doit systématiquement recevoir sa règle
`.ma-classe[hidden]{display:none}`** si elle définit elle-même une valeur de
`display`.

**Filtres ville / gluten / lactose / dédié** (2026-07-04) : ligne
`.guide-refine` avec un `<select>` ville (peuplé dynamiquement depuis le
champ `ville` du JSON, voir plus haut) et trois toggles (🌾/🥛/💯). Logique
dans `passeFiltres()` : `filterGluten`/`filterLactose` montrent tout
établissement ayant le champ renseigné (`"dedie"` ou `"options"`) ;
`filterDedie` restreint alors aux seuls `"dedie"`. "Utiliser ma position"
vit sur la même ligne (même conteneur `.guide-refine`).

**Mode plein écran mobile façon Google Maps** (2026-07-04, sous 900px) :
- Vue par défaut = Carte (`view-map`), pas Liste — la carte est ce qu'on
  priorise. Onglets Carte/Liste déplacés à l'intérieur de
  `.guide-search-panel` (pas un élément flottant séparé) : le bandeau
  cookies (`z-index:9000`, ancré en bas) entrait en conflit avec un
  toggle ancré en bas indépendant.
- En vue Carte, `body.guide-map-full` est posé sur `<body>` : la carte
  passe en `position:fixed;inset:0` plein viewport (coins carrés, plus
  d'ombre), et `.guide-search-panel` devient une carte flottante
  `position:fixed` par-dessus. La nav est forcée en mode `.scrolled`
  (fond blanc) via `onScroll()` — sans ça le logo transparent se mélange
  visuellement à la carte en dessous.
- Le panneau flottant ne montre par défaut que la barre de recherche
  (2026-07-04, révisé après un premier essai encore trop encombrant) : un
  bouton flèche rond (`#btn-panel-expand`) déplie/replie
  `#guide-panel-body`, qui regroupe en un seul niveau la bascule
  Carte/Liste, les catégories et les filtres ville/gluten/lactose/dédié/
  position — plus de double repli imbriqué. `.guide-suggest` (les
  suggestions) reste en dehors de ce conteneur pour s'afficher même
  panneau replié. Sur desktop, le repli est neutralisé
  (`.guide-panel-body[hidden]{display:block}` hors media query mobile) :
  tout reste affiché en permanence, comme avant.
- Contrôles de zoom Leaflet et bouton "Voir tout" décalés vers le bas
  (`top:80-84px`) en plein écran pour ne pas passer sous la nav désormais
  opaque.

## À compléter / confirmer

- Lieu exact et adresse à Lagnieu
- Programmation artistique (line-up)
- Visuel de partage `og:image` pour les réseaux sociaux
- Lien réel de billetterie (formulaire newsletter actuellement en `mailto:`)
- Liens des réseaux sociaux (Instagram, etc.)
