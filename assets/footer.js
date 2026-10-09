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
  var donBtnHtml = hasLocalDonDrawer
    ? '<button type="button" class="footer-donate-btn" data-open-don-drawer><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-4.6-9.5-9.1C.8 8.4 2.3 5 5.8 5c2 0 3.4 1.1 4.2 2.3C10.8 6.1 12.2 5 14.2 5c3.5 0 5 3.4 3.3 6.9C19 16.4 12 21 12 21z"/></svg>Faire un don</button>'
    : '<a href="' + h('don') + '" class="footer-donate-btn"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-4.6-9.5-9.1C.8 8.4 2.3 5 5.8 5c2 0 3.4 1.1 4.2 2.3C10.8 6.1 12.2 5 14.2 5c3.5 0 5 3.4 3.3 6.9C19 16.4 12 21 12 21z"/></svg>Faire un don</a>';

  var footer =
    '<footer class="footer">' +
      '<div class="f-stars"></div>' +
      '<div class="wrap">' +
        '<div class="footer-grid cols-4">' +
          '<div>' +
            '<div class="logo"><img class="logo-img" src="/assets/logo-flore-white.png" alt="FLORE" loading="lazy"></div>' +
            '<p class="about">Le premier festival 100 % sans gluten et sans lactose. Une production de MG Entertainment, parce que la fête doit être accessible à tous.</p>' +
            '<div class="socials">' +
              '<a href="https://www.instagram.com/flore.festival/" target="_blank" rel="noopener" aria-label="Instagram">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none"/></svg>' +
              '</a>' +
              donBtnHtml +
            '</div>' +
          '</div>' +
          '<div>' +
            '<h5>Le festival</h5>' +
            '<ul>' +
              '<li><a href="' + h('festival') + '">Le concept</a></li>' +
              '<li><a href="' + h('espaces') + '">Les espaces</a></li>' +
              '<li><a href="' + h('florette') + '">Florette</a></li>' +
              '<li><a href="/a-propos/">Qui sommes-nous</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h5>Infos</h5>' +
            '<ul>' +
              '<li><a href="/sans-gluten-sans-lactose/">Sans gluten &amp; lactose</a></li>' +
              '<li><a href="/infos-pratiques/">Préparer sa venue</a></li>' +
              '<li><a href="/presse/">Espace presse</a></li>' +
              '<li><a href="/guide/">Guide FLORE</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h5>Nous rejoindre</h5>' +
            '<ul>' +
              '<li><a href="/artistes/">Artistes</a></li>' +
              '<li><a href="/exposants/">Exposants</a></li>' +
              '<li><a href="/partenaires/">Partenaires</a></li>' +
              '<li><a href="' + h('billetterie') + '">Billetterie</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-newsletter-row">' +
          '<span class="fnr-label"><svg aria-hidden="true" class="daisy"><use href="#daisy"/></svg>Reste informé·e des annonces FLORE</span>' +
          '<form id="footerSignupForm" action="https://api.web3forms.com/submit" method="POST">' +
            '<input type="hidden" name="access_key" value="0a67bd04-221b-4244-b5cb-796ec8dca7a9">' +
            '<input type="hidden" name="subject" value="🌼 FLORE Newsletter · Nouvelle inscription (footer)">' +
            '<input type="hidden" name="from_name" value="Footer FLORE">' +
            '<input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off">' +
            '<input type="email" name="email" placeholder="ton@email.com" required aria-label="Adresse email">' +
            '<button type="submit">S\'inscrire</button>' +
          '</form>' +
          '<div id="footerSignupSuccess" class="signup-success-mini" hidden><svg aria-hidden="true" class="daisy"><use href="#daisy"/></svg>Inscrit·e, à bientôt !</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<div class="footer-bottom-copy">' +
            '<span>© <span id="year">2026</span> Flore Festival · Une production MG Entertainment.</span>' +
          '</div>' +
          '<div class="footer-legal-mini">' +
            '<button type="button" class="lgl-link" data-legal="mentions">Mentions légales</button>' +
            '<button type="button" class="lgl-link" data-legal="confidentialite">Confidentialité &amp; cookies</button>' +
            '<button type="button" class="lgl-link" data-legal="cgv">CGV</button>' +
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
