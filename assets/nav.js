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

  var nav =
    '<nav class="nav" id="nav"><div class="wrap"><div class="nav-inner">' +
      '<a href="/" class="logo" aria-label="FLORE Festival, accueil"><img class="logo-img logo-light" src="/assets/logo-flore-white.png" alt="FLORE"><img class="logo-img logo-dark" src="/assets/logo-flore-black.png" alt="" aria-hidden="true"></a>' +
      '<div class="nav-links">' +
        '<div class="nav-item"><button class="nav-trigger" aria-expanded="false">Le festival ' + caret + '</button>' +
          '<div class="dropdown mega">' +
            item(h('festival'), '🌱', 'Le concept', 'La promesse, en deux mots') +
            item(h('espaces'), '🎪', 'Les espaces', 'Les 6 mondes du festival') +
            item(h('lineup'), '🎤', 'Le line-up', 'La programmation artistique') +
            item(h('programme'), '🎶', 'Le programme', 'Le déroulé heure par heure') +
            item(h('causeries'), '💬', 'Les causeries', 'Santé, bien-être &amp; échanges') +
            item(h('public'), '🌸', 'Pour qui ?', 'Une fête pour tout le monde') +
            item('/a-propos/', '🌟', 'Qui sommes-nous ?', 'L\'histoire &amp; l\'équipe') +
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
        '<a href="/guide/"' + cur('/guide/') + '>🗺️ Le Guide</a>' +
        '<a href="/en/" class="lang-switch" aria-label="See the site in English">🌐 EN</a>' +
        '<div class="nav-item nav-cta"><a href="/partenaires" class="btn btn-ink">Rejoindre l\'aventure</a>' +
          '<div class="dropdown dd-right">' +
            '<a href="/partenaires">🤝 Devenir partenaire</a>' +
            '<a href="/exposants/">🍽️ Proposer un stand</a>' +
            '<a href="/benevoles/">🌻 Devenir bénévole</a>' +
          '</div></div>' +
        '<a href="' + h('billetterie') + '" class="btn btn-sun">Billetterie</a>' +
      '</div>' +
      '<button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>' +
    '</div></div></nav>' +
    '<div class="mobile-menu" id="mobileMenu">' +
      '<span class="m-label">Le festival</span>' +
      '<a class="m-sub" href="' + h('festival') + '">Le concept</a>' +
      '<a class="m-sub" href="' + h('espaces') + '">Les espaces</a>' +
      '<a class="m-sub" href="' + h('lineup') + '">Le line-up</a>' +
      '<a class="m-sub" href="' + h('programme') + '">Le programme</a>' +
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
      '<a class="m-sub" href="/exposants/">Proposer un stand</a>' +
      '<a class="m-sub" href="/benevoles/">Devenir bénévole</a>' +
      '<a class="m-sub" href="/presse/">Espace presse</a>' +
      '<a href="/en/" class="lang-switch">🌐 English version</a>' +
      '<a href="/partenaires" class="btn btn-ink">Rejoindre l\'aventure</a>' +
      '<a href="' + h('billetterie') + '" class="btn btn-sun">Billetterie</a>' +
    '</div>';

  var mount = document.getElementById('site-nav');
  if (mount) mount.outerHTML = nav;
  else document.body.insertAdjacentHTML('afterbegin', nav);

  // CTA flottant intelligent : apparaît après le hero, se cache près du bas
  var cta = document.createElement('div');
  cta.className = 'sticky-cta';
  cta.innerHTML = '<a class="btn btn-sun" href="' + h('billetterie') + '">🎟️ Réserver ma place</a>';
  function mountCta() { if (document.body && !cta.parentNode) document.body.appendChild(cta); }
  if (document.body) mountCta(); else document.addEventListener('DOMContentLoaded', mountCta);
  var shown = false;
  function onScrollCta() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var nearBottom = (y + window.innerHeight) > (document.documentElement.scrollHeight - 480);
    var show = y > 700 && !nearBottom;
    if (show !== shown) { cta.classList.toggle('show', show); shown = show; }
  }
  window.addEventListener('scroll', onScrollCta, { passive: true });
  window.addEventListener('resize', onScrollCta, { passive: true });
  onScrollCta();
})();
