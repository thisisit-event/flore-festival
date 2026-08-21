/*
   FLORE Festival · Statut de lancement commercial
   =================================================
   Point centralisé unique pour savoir si les éléments sous embargo
   (widget Weezevent, dates/lieu/prix publics, SEO Event) peuvent
   s'afficher.

   Ne contient et ne doit JAMAIS contenir aucune donnée sous embargo
   elle-même (pas de date, pas de lieu, pas de prix) : uniquement un
   statut. Ce fichier est public (dépôt GitHub public), donc rien
   ici ne doit être sensible en soi, seul un statut "prelaunch" ou
   "launch" est exposé, ce qui ne révèle rien.

   Bascule STRICTEMENT MANUELLE. Ne jamais programmer une bascule
   automatique à une date fixe (voir brief-8aout.pdf section 6) :
   la date de lancement n'est pas encore validée par MG Entertainment.

   Usage dans une page :
     <script src="/assets/launch-status.js"></script>
     <script>
       if (window.FLORE_LAUNCH.isLive()) {
         // afficher le widget Weezevent, les dates publiques, etc.
       }
     </script>
*/
window.FLORE_LAUNCH = {
  status: 'prelaunch', // 'prelaunch' | 'launch', à changer ici, à la main, une fois validé par MG Entertainment
  isLive: function () {
    return this.status === 'launch';
  }
};
