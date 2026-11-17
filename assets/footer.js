/* FLORE Festival · footer partagé (injecté sur toutes les pages FR principales).
   Une seule source : modifier le footer ici se répercute partout.
   Les pages /guide/ gardent leur propre footer allégé (écosystème à part, cf. nav.js). */
(function () {
  var p = location.pathname;
  if (p.indexOf('/en/') === 0) return; // les pages EN ont leur propre footer (i18n/template.html)
  // écosystème Guide : footer allégé propre à chaque fiche, sauf la page carte /guide/ elle-même (2026-08-11)
  if (p.indexOf('/guide/') === 0 && p !== '/guide/' && p !== '/guide/index.html') return;

  var onHome = (p === '/' || p === '/index.html' || p === '');
  var h = function (id) { return onHome ? '#' + id : '/#' + id; };
  // Le tiroir de don (widget HelloAsso) n'existe en dur que sur l'accueil et
  // sur /sans-gluten-sans-lactose/ : sur ces pages, le bouton du footer
  // l'ouvre directement (0 navigation). Ailleurs, on renvoie vers l'accueil
  // qui ouvre le tiroir automatiquement à l'arrivée (voir script du tiroir
  // dans index.html), plutôt que de scroller vers une section.
  var hasLocalDonDrawer = onHome || p === '/sans-gluten-sans-lactose/' || p === '/sans-gluten-sans-lactose/index.html';
  var ico = {
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-4.6-9.5-9.1C.8 8.4 2.3 5 5.8 5c2 0 3.4 1.1 4.2 2.3C10.8 6.1 12.2 5 14.2 5c3.5 0 5 3.4 3.3 6.9C19 16.4 12 21 12 21z"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>'
  };
  var donBtnHtml = hasLocalDonDrawer
    ? '<button type="button" class="sf-don" data-open-don-drawer>' + ico.heart + 'Faire un don</button>'
    : '<a href="' + h('don') + '" class="sf-don">' + ico.heart + 'Faire un don</a>';
  var lang = function (href, label, name) {
    return '<a href="' + href + '" lang="' + label.toLowerCase() + '" title="' + name + '"' + (href === '/' ? ' aria-current="true"' : '') + '>' + label + '</a>';
  };

  var footer =
    '<footer class="sf">' +
      '<div class="wrap">' +
        '<div class="sf-top">' +
          '<div class="sf-nl-text">' +
            '<h3>Les annonces FLORE <span class="sf-nowrap">en avant-première</span></h3>' +
            '<p>Programmation, billetterie, nouveautés : une newsletter, jamais de spam.</p>' +
          '</div>' +
          '<div class="sf-nl">' +
            '<form id="footerSignupForm" action="https://api.web3forms.com/submit" method="POST">' +
              '<input type="hidden" name="access_key" value="0a67bd04-221b-4244-b5cb-796ec8dca7a9">' +
              '<input type="hidden" name="subject" value="🌼 FLORE Newsletter · Nouvelle inscription (footer)">' +
              '<input type="hidden" name="from_name" value="Footer FLORE">' +
              '<input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">' +
              '<input type="email" name="email" placeholder="ton@email.com" required aria-label="Adresse email">' +
              '<button type="submit">S\'inscrire</button>' +
            '</form>' +
            '<div id="footerSignupSuccess" class="sf-nl-ok" hidden><svg aria-hidden="true" class="daisy"><use href="#daisy"/></svg>Inscrit·e, à bientôt !</div>' +
          '</div>' +
        '</div>' +
        '<div class="sf-main">' +
          '<div class="sf-brand">' +
            '<a href="/" class="sf-logo" aria-label="FLORE Festival, accueil"><img src="/assets/logo-flore-white.png" alt="FLORE" loading="lazy"></a>' +
            '<p>Le premier festival 100 % sans gluten et sans lactose.</p>' +
            '<ul class="sf-event">' +
              '<li>' + ico.cal + 'Samedi 17 avril 2027, de 11h à 22h</li>' +
              '<li>' + ico.pin + 'Ainterexpo, Bourg-en-Bresse</li>' +
            '</ul>' +
            '<div class="sf-social">' +
              '<a href="https://www.instagram.com/flore.festival/" target="_blank" rel="noopener" aria-label="Instagram de FLORE Festival">' + ico.insta + '</a>' +
            '</div>' +
          '</div>' +
          '<nav class="sf-col" aria-label="Le festival">' +
            '<h4>Le festival</h4>' +
            '<ul>' +
              '<li><a href="' + h('festival') + '">Le concept</a></li>' +
              '<li><a href="' + h('espaces') + '">Les espaces</a></li>' +
              '<li><a href="/programme/">Le programme</a></li>' +
              '<li><a href="/partenaires/">Nos partenaires</a></li>' +
              '<li><a href="/a-propos/">Qui sommes-nous</a></li>' +
            '</ul>' +
          '</nav>' +
          '<nav class="sf-col" aria-label="Infos pratiques">' +
            '<h4>Infos pratiques</h4>' +
            '<ul>' +
              '<li><a href="/infos-pratiques/">Préparer sa venue</a></li>' +
              '<li><a href="/sans-gluten-sans-lactose/">Sans gluten &amp; lactose</a></li>' +
              '<li><a href="' + h('faq') + '">FAQ</a></li>' +
              '<li><a href="/guide/">Guide FLORE</a></li>' +
            '</ul>' +
          '</nav>' +
          '<nav class="sf-col" aria-label="Participer">' +
            '<h4>Participer</h4>' +
            '<ul>' +
              '<li><a href="' + h('billetterie') + '">Billetterie</a></li>' +
              '<li><a href="/exposants/">Exposants</a></li>' +
              '<li><a href="/artistes/">Artistes</a></li>' +
              '<li><a href="/partenaires/#devenir-partenaire">Devenir partenaire</a></li>' +
              '<li><a href="/club-flore/">Club FLORE</a></li>' +
            '</ul>' +
          '</nav>' +
          '<div class="sf-col">' +
            '<h4>Contact</h4>' +
            '<ul>' +
              '<li><a class="sf-mail" href="mailto:contact@flore-festival.fr"><span class="sf-mail-full">contact@flore-festival.fr</span><span class="sf-mail-short">Nous écrire</span></a></li>' +
              '<li><a href="/presse/">Espace presse</a></li>' +
            '</ul>' +
            donBtnHtml +
          '</div>' +
        '</div>' +
        '<div class="sf-bottom">' +
          '<p>© <span id="year">2026</span> FLORE Festival · Une production MG Entertainment, association loi 1901</p>' +
          '<div class="sf-legal">' +
            '<button type="button" class="lgl-link" data-legal="mentions">Mentions légales</button>' +
            '<button type="button" class="lgl-link" data-legal="confidentialite">Confidentialité &amp; cookies</button>' +
            '<button type="button" class="lgl-link" data-legal="cgv">CGV</button>' +
          '</div>' +
          '<div class="sf-lang" aria-label="Langue du site">' +
            lang('/', 'FR', 'Français') + lang('/en/', 'EN', 'English') + lang('/italia/', 'IT', 'Italiano') + lang('/deutschland/', 'DE', 'Deutsch') + lang('/espana/', 'ES', 'Español') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</footer>';

  var mount = document.getElementById('site-footer');
  if (mount) mount.outerHTML = footer;
  else document.body.insertAdjacentHTML('beforeend', footer);

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var form = document.getElementById('footerSignupForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      }).then(function (res) { return res.json(); }).then(function (data) {
        if (data.success) {
          form.hidden = true;
          document.getElementById('footerSignupSuccess').hidden = false;
        } else {
          btn.disabled = false;
        }
      }).catch(function () { btn.disabled = false; });
    });
  }
})();
