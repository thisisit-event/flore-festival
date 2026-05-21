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

## À compléter / confirmer

- Lieu exact et adresse à Lagnieu
- Programmation artistique (line-up)
- Visuel de partage `og:image` pour les réseaux sociaux
- Lien réel de billetterie (formulaire newsletter actuellement en `mailto:`)
- Liens des réseaux sociaux (Instagram, etc.)
