/* FLORE Festival · navigation partagée (méga-menu) injectée sur toutes les pages FR.
   Une seule source : modifier le menu ici se répercute partout. */
(function () {
  var p = location.pathname;
  if (p.indexOf('/en/') === 0) return; // les pages EN ont leur propre nav

  var onHome = (p === '/' || p === '/index.html' || p === '');
  var h = function (id) { return onHome ? '#' + id : '/#' + id; };
  var caret = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  var cur = function (href) { return p === href ? ' aria-current="page"' : ''; };

  function item(href, ico, title, desc) {
    return '<a href="' + href + '"' + cur(href) + '><span class="dd-ico">' + ico + '</span>' +
      '<span class="dd-tt"><b>' + title + '</b><em>' + desc + '</em></span></a>';
  }

  var logo = '<a href="/" class="logo" aria-label="FLORE Festival, accueil"><img class="logo-img logo-light" src="/assets/logo-flore-white.png" alt="FLORE"><img class="logo-img logo-dark" src="/assets/logo-flore-black.png" alt="" aria-hidden="true"></a>';

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
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Le Guide FLORE (recherche SG/SL) est pensé comme un outil quasi indépendant :
  // pas de mega-menu festival, juste un pont léger vers le site principal (2026-07-04).
  var isGuideEcosystem = p.indexOf('/guide/') === 0 || p.indexOf('/exposants/carte-guide') === 0;
  if (isGuideEcosystem) {
    var navLite =
      '<nav class="nav" id="nav"><div class="wrap"><div class="nav-inner">' +
        logo +
        '<div class="nav-links">' +
          '<a href="/">🌱 Le Festival FLORE</a>' +
          '<a href="/en/" class="lang-switch" aria-label="See the site in English">🌐 EN</a>' +
          '<a href="' + h('billetterie') + '" class="btn btn-sun">Billetterie</a>' +
        '</div>' +
        '<button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>' +
      '</div></div></nav>' +
      '<div class="mobile-menu" id="mobileMenu">' +
        '<a class="m-sub" href="/">🌱 Le Festival FLORE</a>' +
        '<a href="/en/" class="lang-switch">🌐 English version</a>' +
        '<a href="' + h('billetterie') + '" class="btn btn-sun">Billetterie</a>' +
      '</div>';
    var mountLite = document.getElementById('site-nav');
    if (mountLite) mountLite.outerHTML = navLite;
    else document.body.insertAdjacentHTML('afterbegin', navLite);
    wireMobileToggle();
    return;
  }

  var nav =
    '<nav class="nav" id="nav"><div class="wrap"><div class="nav-inner">' +
      logo +
      '<div class="nav-links">' +
        '<div class="nav-item"><button class="nav-trigger" aria-expanded="false">Le festival ' + caret + '</button>' +
          '<div class="dropdown mega">' +
            item(h('festival'), '🌱', 'Le concept', 'La promesse, en deux mots') +
            item(h('espaces'), '🎪', 'Les espaces', 'Les 6 mondes du festival') +
            item(h('lineup'), '🎤', 'Le line-up', 'La programmation artistique') +
            item(h('causeries'), '💬', 'Les causeries', 'Santé, bien-être &amp; échanges') +
            item(h('public'), '🌸', 'Pour qui ?', 'Une fête pour tout le monde') +
            item('/a-propos/', '🌟', 'Qui sommes-nous ?', 'L\'histoire &amp; l\'équipe') +
            item('/guide/', '🗺️', 'Le Guide FLORE', 'La carte du sans gluten &amp; sans lactose') +
          '</div></div>' +
        '<div class="nav-item"><button class="nav-trigger" aria-expanded="false">Préparer sa venue ' + caret + '</button>' +
          '<div class="dropdown mega">' +
            item('/infos-pratiques/#acces', '🚗', 'Accès &amp; transport', 'Voiture, train, avion, navettes') +
            item('/infos-pratiques/#loger', '🛏️', 'Se loger', 'Hôtels, gîtes, le week-end') +
            item('/infos-pratiques/#sur-place', '🎟️', 'Sur place', 'Horaires, cashless, consignes') +
            item('/infos-pratiques/#accessibilite', '♿', 'Accessibilité', 'PMR &amp; le Cocon') +
            item('/infos-pratiques/#securite', '🛡️', 'Sécurité &amp; prévention', 'Dispositif &amp; écoute') +
            item('/sejour/', '🌿', 'Le week-end', 'Prolonger la fête dans l\'Ain') +
          '</div></div>' +
        '<a href="/sans-gluten-sans-lactose/"' + cur('/sans-gluten-sans-lactose/') + '>Sans gluten &amp; lactose</a>' +
        '<a href="/en/" class="lang-switch" aria-label="See the site in English">🌐 EN</a>' +
        '<a href="' + h('billetterie') + '" class="btn btn-sun">Billetterie</a>' +
      '</div>' +
      '<button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>' +
    '</div></div></nav>' +
    '<div class="mobile-menu" id="mobileMenu">' +
      '<span class="m-label">Le festival</span>' +
      '<a class="m-sub" href="' + h('festival') + '">Le concept</a>' +
      '<a class="m-sub" href="' + h('espaces') + '">Les espaces</a>' +
      '<a class="m-sub" href="' + h('lineup') + '">Le line-up</a>' +
      '<a class="m-sub" href="' + h('causeries') + '">Les causeries</a>' +
      '<a class="m-sub" href="' + h('public') + '">Pour qui ?</a>' +
      '<a class="m-sub" href="/a-propos/">Qui sommes-nous ?</a>' +
      '<span class="m-label">Préparer sa venue</span>' +
      '<a class="m-sub" href="/infos-pratiques/#acces">Accès &amp; transport</a>' +
      '<a class="m-sub" href="/infos-pratiques/#loger">Se loger</a>' +
      '<a class="m-sub" href="/infos-pratiques/#accessibilite">Accessibilité</a>' +
      '<a class="m-sub" href="/infos-pratiques/#securite">Sécurité &amp; prévention</a>' +
      '<a class="m-sub" href="/sejour/">Le week-end</a>' +
      '<span class="m-label">Et aussi</span>' +
      '<a class="m-sub" href="/sans-gluten-sans-lactose/">Sans gluten &amp; lactose</a>' +
      '<a class="m-sub" href="/guide/">🗺️ Le Guide</a>' +
      '<a class="m-sub" href="/presse/">Espace presse</a>' +
      '<a href="/en/" class="lang-switch">🌐 English version</a>' +
      '<a href="' + h('billetterie') + '" class="btn btn-sun">Billetterie</a>' +
    '</div>';

  var mount = document.getElementById('site-nav');
  if (mount) mount.outerHTML = nav;
  else document.body.insertAdjacentHTML('afterbegin', nav);
  wireMobileToggle();
})();
