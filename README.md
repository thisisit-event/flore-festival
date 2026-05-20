# FLORE Festival — Site officiel

Site web du **FLORE Festival**, le premier festival musical et culinaire 100 % sans gluten
et sans lactose. Une production de l'association **This is it Event**.

🌐 **Production :** https://flore-festival.fr
📍 **Édition 2026 :** Lagnieu (Ain)

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

## À compléter / confirmer

- Lieu exact et adresse à Lagnieu
- Date précise de l'édition 2026
- Programmation artistique (line-up)
- Visuel de partage `og:image` pour les réseaux sociaux
- Lien réel de billetterie (formulaire newsletter actuellement en `mailto:`)
- Liens des réseaux sociaux (Instagram, etc.)
