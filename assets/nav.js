/* FLORE Festival · navigation partagée (méga-menu) injectée sur toutes les pages FR.
   Une seule source : modifier le menu ici se répercute partout. */
(function () {
  var p = location.pathname;
  if (p.indexOf('/en/') === 0) return; // les pages EN ont leur propre nav

  var onHome = (p === '/' || p === '/index.html' || p === '');
  var h = function (id) { return onHome ? '#' + id : '/#' + id; };
  var caret = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  var cur = function (href) { return p === href ? ' aria-current="page"' : ''; };
  var flag = function (country) { return '<img class="lang-flag" src="https://enjoylife.b-cdn.net/Flore/picto-flore-' + country + '.png" alt="" loading="lazy">'; };
  var proIco = function (name) { return '<img class="dropdown-ico" src="https://enjoylife.b-cdn.net/Flore/' + name + '" alt="" loading="lazy">'; };

  function item(href, ico, title, desc) {
    var icoHtml = ico.indexOf('http') === 0
      ? '<img class="dd-ico" src="' + ico + '" alt="" loading="lazy">'
      : '<span class="dd-ico">' + ico + '</span>';
    return '<a href="' + href + '"' + cur(href) + '>' + icoHtml +
      '<span class="dd-tt"><b>' + title + '</b><em>' + desc + '</em></span></a>';
  }

  var logo = '<a href="/" class="logo" aria-label="FLORE Festival, accueil"><img class="logo-img logo-light" src="/assets/logo-flore-white.png" alt="FLORE"><img class="logo-img logo-dark" src="/assets/logo-flore-black.png" alt="" aria-hidden="true"></a>';
  // Flèche épurée plutôt qu'un picto bitmap (trop flou à cette petite taille) :
  // même flèche SVG que le bouton "Réserver ma place" du hero, pour rester cohérent.
  var arrowIco = '<svg class="btn-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
  // Sur l'accueil, le bouton Billetterie ouvre directement le tiroir Weezevent
  // (acheteur "chaud", 0 friction) au lieu de scroller vers la section.
  // data-open-drawer est écouté par délégation dans le script du tiroir (index.html).
  // <button> (pas <a href="#billetterie">) pour l'accueil : un ancien script
  // de scroll doux sur tous les a[href^="#"] du site interceptait aussi ce
  // lien et scrollait vers la section en plus d'ouvrir le tiroir (2026-08-11).
  var billetBtn = onHome
    ? '<button type="button" class="btn btn-sun" data-open-drawer>Billetterie' + arrowIco + '</button>'
    : '<a href="' + h('billetterie') + '" class="btn btn-sun">Billetterie' + arrowIco + '</a>';
  // Picto billet flottant à côté du burger, mobile uniquement (voir .nav-ticket-mobile) :
  // accès à la billetterie visible en permanence, même tout en haut de page,
  // sans avoir à ouvrir le menu. Même logique home/autre page que billetBtn.
  var ticketIco = '<img src="https://enjoylife.b-cdn.net/Flore/picto-flore-ticket.png" alt="" aria-hidden="true">';
  var billetIconBtn = onHome
    ? '<button type="button" class="nav-ticket-mobile" data-open-drawer aria-label="Billetterie">' + ticketIco + '</button>'
    : '<a href="' + h('billetterie') + '" class="nav-ticket-mobile" aria-label="Billetterie">' + ticketIco + '</a>';

  // Ouverture/fermeture du menu mobile : centralisé ici (plutôt que dupliqué
  // par page) pour ne plus jamais l'oublier sur une nouvelle page.
  function wireMobileToggle() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('a, button').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Bouton flottant "Billetterie" fixé en bas de l'écran sur mobile, sur
  // toutes les pages : masqué tant que le hero (avec son propre bouton
  // "Réserver ma place") est visible, et masqué à nouveau une fois sur la
  // section #billetterie (widget Weezevent), pour ne jamais faire doublon.
  function addMobileFloatCta() {
    // <button> sur l'accueil (ouvre le tiroir), <a> ailleurs (navigue vers
    // /#billetterie) : même raison que billetBtn plus haut.
    var cta = document.createElement(onHome ? 'button' : 'a');
    if (onHome) cta.setAttribute('type', 'button');
    else cta.href = h('billetterie');
    cta.className = 'mobile-cta-float';
    cta.id = 'mobileCtaFloat';
    cta.innerHTML = 'Réserver ma place' + arrowIco;
    if (onHome) cta.setAttribute('data-open-drawer', '');
    document.body.appendChild(cta);
    // #accueil / #billetterie n'existent pas encore dans le DOM à ce stade
    // (ce script tourne avant que le reste de la page ne soit parsé) :
    // on attend DOMContentLoaded.
    document.addEventListener('DOMContentLoaded', function () {
      var heroTarget = document.getElementById('accueil');
      var billetTarget = document.getElementById('billetterie');
      if (!('IntersectionObserver' in window)) return;
      var heroVisible = !!heroTarget; // avant la 1ère mesure, on suppose le hero visible s'il existe
      var billetVisible = false;
      function update() {
        cta.classList.toggle('is-hidden', heroVisible || billetVisible);
      }
      if (heroTarget) {
        new IntersectionObserver(function (entries) {
          heroVisible = entries[0].isIntersecting;
          update();
        }, { threshold: 0 }).observe(heroTarget);
      }
      if (billetTarget) {
        new IntersectionObserver(function (entries) {
          billetVisible = entries[0].isIntersecting;
          update();
        }, { threshold: 0.15 }).observe(billetTarget);
      }
      update();
    });
  }

  // Le Guide FLORE (recherche SG/SL) est pensé comme un outil quasi indépendant :
  // pas de mega-menu festival, juste un pont léger vers le site principal (2026-07-04).
  // Exception : la page carte /guide/ elle-même reprend le nav complet du site (2026-08-11).
  var isGuideEcosystem = p.indexOf('/guide/') === 0 && p !== '/guide/' && p !== '/guide/index.html';
  if (isGuideEcosystem) {
    var navLite =
      '<nav class="nav" id="nav"><div class="wrap"><div class="nav-inner">' +
        logo +
        '<div class="nav-links">' +
          '<a href="/">🌱 Le Festival FLORE</a>' +
          '<div class="nav-item"><button class="nav-trigger" aria-expanded="false">' + flag('france') + ' FR ' + caret + '</button>' +
            '<div class="dropdown dd-right">' +
              '<a href="/en/">' + flag('angleterre') + ' English</a>' +
              '<a href="/italia/">' + flag('italia') + ' Italiano</a>' +
              '<a href="/deutschland/">' + flag('allemagne') + ' Deutsch</a>' +
              '<a href="/espana/">' + flag('espagne') + ' Español</a>' +
            '</div></div>' +
          billetBtn +
        '</div>' +
        '<div class="nav-mobile-actions">' + billetIconBtn +
          '<button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button></div>' +
      '</div></div></nav>' +
      '<div class="mobile-menu" id="mobileMenu">' +
        billetBtn +
        '<a class="m-sub" href="/">🌱 Le Festival FLORE</a>' +
        '<span class="m-label">Autres langues</span>' +
        '<a class="m-sub" href="/en/">' + flag('angleterre') + ' English</a>' +
        '<a class="m-sub" href="/italia/">' + flag('italia') + ' Italiano</a>' +
        '<a class="m-sub" href="/deutschland/">' + flag('allemagne') + ' Deutsch</a>' +
        '<a class="m-sub" href="/espana/">' + flag('espagne') + ' Español</a>' +
      '</div>';
    var mountLite = document.getElementById('site-nav');
    if (mountLite) mountLite.outerHTML = navLite;
    else document.body.insertAdjacentHTML('afterbegin', navLite);
    wireMobileToggle();
    addMobileFloatCta();
    return;
  }

  var nav =
    '<nav class="nav" id="nav"><div class="wrap"><div class="nav-inner">' +
      logo +
      '<div class="nav-links">' +
        '<div class="nav-item"><a class="nav-trigger" href="' + h('festival') + '">Le festival ' + caret + '</a>' +
          '<div class="dropdown mega">' +
            item(h('festival'), 'https://enjoylife.b-cdn.net/Flore/picto-flore-concept.png', 'Le concept', 'La promesse, en deux mots') +
            item(h('espaces'), 'https://enjoylife.b-cdn.net/Flore/picto-flore-espaces.png', 'Les espaces', 'Les 6 univers du festival') +
            item(h('lineup'), 'https://enjoylife.b-cdn.net/Flore/picto-floor-scene.png', 'Le line-up', 'La programmation artistique') +
            item(h('causeries'), 'https://enjoylife.b-cdn.net/Flore/picto-flore-lescauseries.png', 'Les causeries', 'Santé, bien-être &amp; échanges') +
            item(h('public'), 'https://enjoylife.b-cdn.net/Flore/picto-flore-public.png', 'Pour qui ?', 'Une fête pour tout le monde') +
            item('/a-propos/', 'https://enjoylife.b-cdn.net/Flore/picto-flore-equipe.png', 'Qui sommes-nous ?', 'L\'histoire &amp; l\'équipe') +
          '</div></div>' +
        '<div class="nav-item"><a class="nav-trigger" href="/infos-pratiques/">Préparer sa venue ' + caret + '</a>' +
          '<div class="dropdown mega">' +
            item('/infos-pratiques/#acces', 'https://enjoylife.b-cdn.net/Flore/picto-flore-voiture.png', 'Accès &amp; transport', 'Voiture, train, avion, bus') +
            item('/infos-pratiques/#loger', 'https://enjoylife.b-cdn.net/Flore/picto-flore-loger.png', 'Se loger', 'Hôtels, gîtes, le week-end') +
            item('/infos-pratiques/#sur-place', 'https://enjoylife.b-cdn.net/Flore/picto-flore-surplace.png', 'Sur place', 'Horaires, restauration, services') +
            item('/infos-pratiques/#accessibilite', 'https://enjoylife.b-cdn.net/Flore/picto-flore-accessibilite.png', 'Accessibilité', 'PMR &amp; le Cocon') +
            item('/infos-pratiques/#securite', 'https://enjoylife.b-cdn.net/Flore/picto-flore-medical.png', 'Sécurité &amp; prévention', 'Dispositif &amp; écoute') +
            item('/sejour/', 'https://enjoylife.b-cdn.net/Flore/picto-flore-weekend.png', 'Le week-end', 'Prolonger la fête dans l\'Ain') +
          '</div></div>' +
        '<a href="/sans-gluten-sans-lactose/"' + cur('/sans-gluten-sans-lactose/') + '>Sans gluten &amp; lactose</a>' +
        '<a href="' + h('faq') + '">FAQ</a>' +
        '<div class="nav-item"><button class="nav-trigger" aria-expanded="false">' + flag('france') + ' FR ' + caret + '</button>' +
          '<div class="dropdown dd-right">' +
            '<a href="/en/">' + flag('angleterre') + ' English</a>' +
            '<a href="/italia/">' + flag('italia') + ' Italiano</a>' +
            '<a href="/deutschland/">' + flag('allemagne') + ' Deutsch</a>' +
            '<a href="/espana/">' + flag('espagne') + ' Español</a>' +
          '</div></div>' +
        '<div class="nav-item"><button class="nav-trigger nav-espace-pro" aria-expanded="false">Espace Pro ' + caret + '</button>' +
          '<div class="dropdown dd-right">' +
            '<a href="/partenaires/">' + proIco('picto-flore-engages.png') + 'Devenir partenaire</a>' +
            '<a href="/exposants/">' + proIco('picto-flore-jardin.png') + 'Réserver un stand</a>' +
            '<a href="/artistes/">' + proIco('picto-flore-musique.png') + 'Candidature artiste</a>' +
            '<a href="/club-flore/">' + proIco('picto-flore-bienveillance.png') + 'Rejoindre le club flore</a>' +
          '</div></div>' +
        billetBtn +
      '</div>' +
      '<div class="nav-mobile-actions">' + billetIconBtn +
        '<button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button></div>' +
    '</div></div></nav>' +
    '<div class="mobile-menu" id="mobileMenu">' +
      billetBtn +
      '<span class="m-label">Le festival</span>' +
      '<a class="m-sub" href="' + h('festival') + '">Le concept</a>' +
      '<a class="m-sub" href="' + h('espaces') + '">Les espaces</a>' +
      '<a class="m-sub" href="' + h('lineup') + '">Le line-up</a>' +
      '<a class="m-sub" href="' + h('causeries') + '">Les causeries</a>' +
      '<a class="m-sub" href="' + h('public') + '">Pour qui ?</a>' +
      '<a class="m-sub" href="/a-propos/">Qui sommes-nous ?</a>' +
      '<a class="m-label" href="/infos-pratiques/">Préparer sa venue</a>' +
      '<a class="m-sub" href="/infos-pratiques/#acces">Accès &amp; transport</a>' +
      '<a class="m-sub" href="/infos-pratiques/#loger">Se loger</a>' +
      '<a class="m-sub" href="/infos-pratiques/#accessibilite">Accessibilité</a>' +
      '<a class="m-sub" href="/infos-pratiques/#securite">Sécurité &amp; prévention</a>' +
      '<a class="m-sub" href="/sejour/">Le week-end</a>' +
      '<span class="m-label">Et aussi</span>' +
      '<a class="m-sub" href="/sans-gluten-sans-lactose/">Sans gluten &amp; lactose</a>' +
      '<a class="m-sub" href="/presse/">Espace presse</a>' +
      '<span class="m-label">Autres langues</span>' +
      '<a class="m-sub" href="/en/">' + flag('angleterre') + ' English</a>' +
      '<a class="m-sub" href="/italia/">' + flag('italia') + ' Italiano</a>' +
      '<a class="m-sub" href="/deutschland/">' + flag('allemagne') + ' Deutsch</a>' +
      '<a class="m-sub" href="/espana/">' + flag('espagne') + ' Español</a>' +
      '<span class="m-label">Espace Pro</span>' +
      '<a class="m-sub" href="/partenaires/">' + proIco('picto-flore-engages.png') + 'Devenir partenaire</a>' +
      '<a class="m-sub" href="/exposants/">' + proIco('picto-flore-jardin.png') + 'Réserver un stand</a>' +
      '<a class="m-sub" href="/artistes/">' + proIco('picto-flore-musique.png') + 'Candidature artiste</a>' +
      '<a class="m-sub" href="/club-flore/">' + proIco('picto-flore-bienveillance.png') + 'Rejoindre le club flore</a>' +
    '</div>';

  var mount = document.getElementById('site-nav');
  if (mount) mount.outerHTML = nav;
  else document.body.insertAdjacentHTML('afterbegin', nav);
  wireMobileToggle();
  addMobileFloatCta();
})();
