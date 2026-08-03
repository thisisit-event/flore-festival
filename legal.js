/* ===================================================================
   FLORE Festival · Mentions légales, confidentialité et bandeau cookies
   Fichier autonome : styles, fenêtres modales et bandeau sont injectés
   au chargement. À inclure avec <script src="legal.js" defer></script>.

   Déclencheurs : tout élément avec data-legal="mentions" ou
   data-legal="confidentialite" ouvre la fenêtre correspondante.
   =================================================================== */
(function () {
  'use strict';

  /* ---------- Styles ---------- */
  var CSS = [
    '.lgl-link{background:none;border:none;padding:0;margin:0;font:inherit;color:inherit;cursor:pointer;text-decoration:none;transition:color .2s}',
    '.lgl-link:hover{color:var(--sun,#DAEF52)}',
    '.footer-legal{display:inline-flex;flex-wrap:wrap;gap:8px;align-items:center}',

    '.lgl-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(11,24,50,.55);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease}',
    '.lgl-overlay[hidden]{display:none}',
    '.lgl-overlay.open{opacity:1;visibility:visible}',
    '.lgl-card{position:relative;display:flex;flex-direction:column;background:#fff;width:100%;max-width:640px;max-height:86vh;border-radius:28px;box-shadow:0 40px 90px rgba(11,24,50,.4);transform:translateY(22px) scale(.97);transition:transform .34s cubic-bezier(.34,.1,.2,1)}',
    '.lgl-overlay.open .lgl-card{transform:translateY(0) scale(1)}',
    '.lgl-close{position:absolute;top:14px;right:14px;z-index:2;width:40px;height:40px;border:none;border-radius:50%;background:var(--sky-pale,#E7F4FB);color:var(--ink,#15395B);font-size:1.6rem;line-height:1;cursor:pointer;display:grid;place-items:center;transition:background .2s,transform .2s}',
    '.lgl-close:hover{background:var(--sun,#DAEF52);transform:rotate(90deg)}',
    '.lgl-body{overflow-y:auto;padding:44px 38px 34px;-webkit-overflow-scrolling:touch}',
    '.lgl-kicker{font-family:\'Bricolage Grotesque\',system-ui,sans-serif;font-weight:700;font-size:.74rem;letter-spacing:.12em;text-transform:uppercase;color:var(--sun-deep,#92A824);margin-bottom:10px}',
    '.lgl-body h2{font-family:\'Bricolage Grotesque\',system-ui,sans-serif;font-weight:800;font-size:1.85rem;line-height:1.1;letter-spacing:-.02em;color:var(--ink,#15395B);margin-bottom:12px}',
    '.lgl-body h3{font-family:\'Bricolage Grotesque\',system-ui,sans-serif;font-weight:700;font-size:1.06rem;color:var(--sky-deep,#2E7FB8);margin:22px 0 6px}',
    '.lgl-body p{font-family:\'DM Sans\',system-ui,sans-serif;font-size:.95rem;line-height:1.62;color:var(--ink-soft,#5C7993);margin-bottom:10px}',
    '.lgl-body ul{list-style:none;display:flex;flex-direction:column;gap:8px;margin:6px 0 12px}',
    '.lgl-body li{font-family:\'DM Sans\',system-ui,sans-serif;font-size:.95rem;line-height:1.6;color:var(--ink-soft,#5C7993);padding-left:18px;position:relative}',
    '.lgl-body li::before{content:"";position:absolute;left:0;top:9px;width:6px;height:6px;border-radius:50%;background:var(--sun,#DAEF52)}',
    '.lgl-body strong{color:var(--ink,#15395B);font-weight:700}',
    '.lgl-body a{color:var(--sky-deep,#2E7FB8);text-decoration:underline;font-weight:600}',
    '.lgl-todo{color:#C77B1E;font-style:italic;font-weight:600}',
    '.lgl-updated{margin-top:20px;font-size:.83rem;font-style:italic}',

    '.lgl-cookie{position:fixed;left:22px;bottom:22px;z-index:9000;width:332px;max-width:calc(100vw - 44px);background:#fff;border:1px solid rgba(21,57,91,.08);border-radius:22px;padding:21px 22px 19px;box-shadow:0 24px 60px rgba(11,24,50,.28);transform:translateX(-135%);transition:transform .55s cubic-bezier(.34,.1,.2,1)}',
    '.lgl-cookie.show{transform:translateX(0)}',
    '.lgl-cookie .ck-top{display:flex;align-items:center;gap:9px;margin-bottom:7px}',
    '.lgl-cookie .ck-emoji{font-size:1.45rem;line-height:1}',
    '.lgl-cookie h4{font-family:\'Bricolage Grotesque\',system-ui,sans-serif;font-weight:800;font-size:1.08rem;color:var(--ink,#15395B)}',
    '.lgl-cookie p{font-family:\'DM Sans\',system-ui,sans-serif;font-size:.86rem;line-height:1.55;color:var(--ink-soft,#5C7993);margin-bottom:14px}',
    '.lgl-cookie .ck-row{display:flex;align-items:center;gap:14px;flex-wrap:wrap}',
    '.lgl-cookie .ck-ok{font-family:\'Bricolage Grotesque\',system-ui,sans-serif;font-weight:700;font-size:.9rem;background:var(--sun,#DAEF52);color:var(--ink,#15395B);border:none;cursor:pointer;padding:11px 22px;border-radius:100px;transition:transform .2s,background .2s}',
    '.lgl-cookie .ck-ok:hover{transform:translateY(-2px);background:var(--sun-deep,#92A824)}',
    '.lgl-cookie .ck-decline{font-family:\'Bricolage Grotesque\',system-ui,sans-serif;font-weight:700;font-size:.9rem;background:none;color:var(--ink-soft,#5C7993);border:1px solid rgba(21,57,91,.18);cursor:pointer;padding:10px 18px;border-radius:100px;transition:background .2s}',
    '.lgl-cookie .ck-decline:hover{background:rgba(21,57,91,.06)}',
    '.lgl-cookie .ck-more{font-family:\'DM Sans\',system-ui,sans-serif;font-size:.84rem;font-weight:600;color:var(--sky-deep,#2E7FB8);background:none;border:none;cursor:pointer;text-decoration:underline;width:100%;text-align:center;margin-top:2px}',
    'body.lgl-locked{overflow:hidden}',
    '@media(max-width:480px){.lgl-cookie{left:14px;right:14px;bottom:14px;width:auto}.lgl-body{padding:42px 22px 28px}}',
    '@media(prefers-reduced-motion:reduce){.lgl-overlay,.lgl-card,.lgl-cookie{transition:none}.lgl-close:hover{transform:none}}',
    '.lgl-manage-cookies{font-family:\'Bricolage Grotesque\',system-ui,sans-serif;font-weight:700;font-size:.88rem;background:var(--sun,#DAEF52);color:var(--ink,#15395B);border:none;cursor:pointer;padding:10px 20px;border-radius:100px;transition:transform .2s,background .2s}',
    '.lgl-manage-cookies:hover{transform:translateY(-2px);background:var(--sun-deep,#92A824)}'
  ].join('');

  /* ---------- Mentions légales ---------- */
  var MENTIONS =
    '<div class="lgl-kicker">Informations légales</div>' +
    '<h2 id="lgl-mentions-title">Mentions légales</h2>' +
    '<p>Conformément à la loi pour la confiance dans l\'économie numérique (LCEN), voici les informations relatives à l\'éditeur et à l\'hébergeur du présent site.</p>' +

    '<h3>Éditeur du site</h3>' +
    '<p><strong>MG Entertainment</strong>, association régie par la loi du 1<sup>er</sup> juillet 1901.<br>' +
    'Siège social : 7 rue Pierre Bernin, 01800 Meximieux.<br>' +
    'N° RNA : W012014876.<br>' +
    'E-mail : <a href="mailto:contact@mgentertainment.fr">contact@mgentertainment.fr</a><br>' +
    '</p>' +

    '<h3>Directeur de la publication</h3>' +
    '<p>Morgan Spirli, en qualité de président de l\'association.</p>' +

    '<h3>Hébergeur</h3>' +
    '<p>Le site est hébergé par <strong>GitHub, Inc.</strong> via le service GitHub Pages.<br>' +
    '88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.<br>' +
    '<a href="https://github.com" target="_blank" rel="noopener">github.com</a></p>' +

    '<h3>Propriété intellectuelle</h3>' +
    '<p>L\'ensemble des contenus de ce site (textes, visuels, illustrations, identité graphique « FLORE », mascotte « Florette » et logo) est la propriété exclusive de MG Entertainment, sauf mention contraire. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable, est interdite.</p>' +

    '<h3>Crédits et ressources</h3>' +
    '<p>Polices d\'écriture : Bricolage Grotesque et DM Sans, fournies via Google Fonts. Animations au défilement : bibliothèque AOS (Animate On Scroll). Illustrations originales (mascotte Florette, motifs floraux) : MG Entertainment.</p>' +

    '<h3>Responsabilité</h3>' +
    '<p>MG Entertainment s\'efforce d\'assurer l\'exactitude des informations publiées (lieu, dates, tarifs, programmation). Celles-ci sont données à titre indicatif et susceptibles d\'évoluer ; les informations définitives seront communiquées avant l\'événement.</p>' +

    '<p class="lgl-updated">Pour toute question : <a href="mailto:contact@flore-festival.fr">contact@flore-festival.fr</a></p>';

  /* ---------- Confidentialité et cookies ---------- */
  var CONFID =
    '<div class="lgl-kicker">Vie privée</div>' +
    '<h2 id="lgl-confid-title">Confidentialité et cookies</h2>' +
    '<p>MG Entertainment attache de l\'importance à la protection de vos données. Cette page explique, en toute transparence, ce que le site collecte (très peu) et comment il fonctionne.</p>' +

    '<h3>1. Responsable du traitement</h3>' +
    '<p>MG Entertainment, association loi 1901. Contact : <a href="mailto:contact@flore-festival.fr">contact@flore-festival.fr</a>.</p>' +

    '<h3>2. Données collectées</h3>' +
    '<p>Ce site est volontairement minimaliste et n\'enregistre aucune donnée sur un serveur.</p>' +
    '<ul>' +
      '<li>Formulaire « Être prévenu·e » : il ouvre simplement votre logiciel de messagerie avec un e-mail pré-rempli. Votre adresse ne nous parvient que si vous décidez d\'envoyer cet e-mail.</li>' +
      '<li>Contact direct : si vous nous écrivez, nous conservons votre message le temps nécessaire pour vous répondre.</li>' +
    '</ul>' +

    '<h3>3. Finalité et base légale</h3>' +
    '<p>Vos données servent uniquement à répondre à votre demande ou à vous informer de l\'ouverture de la billetterie, sur la base de votre consentement. Elles ne sont ni vendues, ni cédées, ni transmises à des tiers à des fins commerciales.</p>' +

    '<h3>4. Durée de conservation</h3>' +
    '<p>Les échanges par e-mail sont conservés le temps nécessaire à la relation, puis supprimés. Pour les inscriptions à l\'actualité du festival : jusqu\'à votre demande de désinscription.</p>' +

    '<h3>5. Vos droits</h3>' +
    '<p>Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification, d\'effacement, d\'opposition et de portabilité de vos données. Pour les exercer, écrivez à <a href="mailto:contact@flore-festival.fr">contact@flore-festival.fr</a>. Vous pouvez également saisir la CNIL (<a href="https://www.cnil.fr" target="_blank" rel="noopener">cnil.fr</a>).</p>' +

    '<h3>6. Cookies et traceurs</h3>' +
    '<p>Ce site ne fait aucun profilage à des fins autres que la mesure d\'audience et publicitaire décrites ici, et ne revend jamais vos données. Avec votre consentement, il utilise <strong>Google Analytics</strong> (comprendre de façon anonymisée comment le site est visité : pages consultées, provenance, appareil) et le <strong>Pixel Meta</strong> (Facebook/Instagram), qui mesure l\'efficacité de nos publications et campagnes sur ces réseaux.</p>' +
    '<ul>' +
      '<li><strong>Google Analytics</strong> et <strong>Pixel Meta</strong> : déposés uniquement si vous cliquez « Accepter » sur le bandeau cookies. Vous pouvez refuser sans que cela affecte votre navigation.</li>' +
      '<li><strong>Correspondance avancée (Pixel Meta)</strong> : si vous remplissez un formulaire sur ce site (contact, candidature, inscription), votre e-mail ou numéro de téléphone peut être transmis à Meta sous forme hachée (cryptée), afin de mieux évaluer et cibler nos campagnes publicitaires Facebook/Instagram. Cette transmission ne se produit que si vous avez accepté les cookies.</li>' +
      '<li><strong>Stockage local</strong> : nous mémorisons, sur votre appareil, votre choix (accepté/refusé) pour ne pas vous redemander à chaque visite. Cette donnée reste dans votre navigateur.</li>' +
      '<li><strong>Ressources externes</strong> : les polices d\'écriture (Google Fonts) et la bibliothèque d\'animations (AOS) sont chargées depuis des serveurs tiers, indépendamment de votre choix ci-dessus. Ceux-ci peuvent recevoir votre adresse IP, technique nécessaire pour livrer les fichiers, sans aucun suivi de votre navigation.</li>' +
    '</ul>' +
    '<p><button type="button" class="lgl-manage-cookies">Modifier mon choix sur les cookies</button></p>' +

    '<p class="lgl-updated">Dernière mise à jour : août 2026.</p>';

  /* ---------- Bandeau cookies (traduit, le reste des mentions/confidentialité
     reste en français : contenu juridique d'une entité française, cf. README) ---------- */
  var COOKIE_I18N = {
    fr: { title: 'On reste léger', text: 'Ce site utilise des cookies de mesure d\'audience et publicitaires (Google, Meta). Vous choisissez.', accept: 'Accepter', decline: 'Refuser', more: 'En savoir plus', aria: 'Information cookies' },
    en: { title: 'Keeping it light', text: 'This site uses audience measurement and advertising cookies (Google, Meta). Your choice.', accept: 'Accept', decline: 'Decline', more: 'Learn more', aria: 'Cookie information' },
    it: { title: 'Restiamo leggeri', text: 'Questo sito utilizza cookie di misurazione del pubblico e pubblicitari (Google, Meta). Scegli tu.', accept: 'Accetta', decline: 'Rifiuta', more: 'Scopri di più', aria: 'Informazioni sui cookie' },
    de: { title: 'Wir bleiben leicht', text: 'Diese Website verwendet Cookies zur Reichweitenmessung und für Werbung (Google, Meta). Sie entscheiden.', accept: 'Akzeptieren', decline: 'Ablehnen', more: 'Mehr erfahren', aria: 'Cookie-Informationen' },
    es: { title: 'Mantenemos la ligereza', text: 'Este sitio usa cookies de medición de audiencia y publicidad (Google, Meta). Tú decides.', accept: 'Aceptar', decline: 'Rechazar', more: 'Saber más', aria: 'Información sobre cookies' }
  };
  var cookieLang = (document.documentElement.lang || 'fr').slice(0, 2).toLowerCase();
  var ct = COOKIE_I18N[cookieLang] || COOKIE_I18N.fr;
  var COOKIE =
    '<div class="ck-top">' +
      '<span class="ck-emoji" aria-hidden="true">🍪</span>' +
      '<h4>' + ct.title + '</h4>' +
    '</div>' +
    '<p>' + ct.text + '</p>' +
    '<div class="ck-row">' +
      '<button type="button" class="ck-ok" data-choice="granted">' + ct.accept + '</button>' +
      '<button type="button" class="ck-decline" data-choice="denied">' + ct.decline + '</button>' +
      '<button type="button" class="ck-more" data-legal="confidentialite">' + ct.more + '</button>' +
    '</div>';

  /* Nouvelle clé (v2) : l'ancienne "flore_cookie_notice_v1" ne voulait dire
     que "j'ai vu le bandeau" (aucun tracking n'existait alors) — elle ne peut
     pas être réutilisée comme un vrai consentement à Google Analytics. */
  var STORE_KEY = 'flore_cookie_consent_v2';
  var GA_ID = 'G-PGW3GQF49M';
  var META_PIXEL_ID = '1061377453086854';
  var lastFocus = null;

  /* Charge Google Analytics uniquement après un consentement explicite —
     jamais au chargement de la page tant que l'utilisateur n'a pas cliqué "Accepter". */
  function loadGA() {
    if (window.__floreGaLoaded) return;
    window.__floreGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  /* Charge le Pixel Meta (Facebook/Instagram) uniquement après consentement,
     même logique que loadGA(). Sert à mesurer les campagnes publicitaires Meta. */
  function loadMetaPixel() {
    if (window.__floreMetaLoaded) return;
    window.__floreMetaLoaded = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  function getConsent() {
    try { return localStorage.getItem(STORE_KEY); } catch (err) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(STORE_KEY, value); } catch (err) {}
  }

  function buildModal(id, labelId, html) {
    var ov = document.createElement('div');
    ov.className = 'lgl-overlay';
    ov.id = id;
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-labelledby', labelId);
    ov.hidden = true;
    ov.innerHTML =
      '<div class="lgl-card">' +
        '<button type="button" class="lgl-close" aria-label="Fermer">&times;</button>' +
        '<div class="lgl-body">' + html + '</div>' +
      '</div>';
    document.body.appendChild(ov);
    return ov;
  }

  function openModal(ov) {
    if (!ov) return;
    lastFocus = document.activeElement;
    ov.hidden = false;
    document.body.classList.add('lgl-locked');
    requestAnimationFrame(function () { ov.classList.add('open'); });
    var btn = ov.querySelector('.lgl-close');
    if (btn) btn.focus();
  }

  function closeModal(ov) {
    if (!ov) return;
    ov.classList.remove('open');
    document.body.classList.remove('lgl-locked');
    window.setTimeout(function () { ov.hidden = true; }, 340);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var modals = {
      mentions: buildModal('lgl-ov-mentions', 'lgl-mentions-title', MENTIONS),
      confidentialite: buildModal('lgl-ov-confidentialite', 'lgl-confid-title', CONFID)
    };

    /* Ouverture, fermeture (bouton, fond, touche Échap) */
    document.addEventListener('click', function (e) {
      var manage = e.target.closest('.lgl-manage-cookies');
      if (manage) {
        try { localStorage.removeItem(STORE_KEY); } catch (err) {}
        window.location.reload();
        return;
      }
      var trigger = e.target.closest('[data-legal]');
      if (trigger) {
        e.preventDefault();
        openModal(modals[trigger.getAttribute('data-legal')]);
        return;
      }
      var closer = e.target.closest('.lgl-close');
      if (closer) {
        closeModal(closer.closest('.lgl-overlay'));
        return;
      }
      if (e.target.classList.contains('lgl-overlay')) {
        closeModal(e.target);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = document.querySelector('.lgl-overlay.open');
      if (open) closeModal(open);
    });

    /* Bandeau cookies : choix mémorisé (granted/denied). Un consentement déjà
       donné charge Google Analytics immédiatement, sans réafficher le bandeau. */
    var consent = getConsent();
    if (consent === 'granted') { loadGA(); loadMetaPixel(); return; }
    if (consent === 'denied') return;

    var banner = document.createElement('aside');
    banner.className = 'lgl-cookie';
    banner.setAttribute('aria-label', ct.aria);
    banner.innerHTML = COOKIE;
    document.body.appendChild(banner);
    window.setTimeout(function () { banner.classList.add('show'); }, 700);

    function respond(choice) {
      setConsent(choice);
      if (choice === 'granted') { loadGA(); loadMetaPixel(); }
      banner.classList.remove('show');
      window.setTimeout(function () { banner.remove(); }, 550);
    }

    banner.querySelector('.ck-ok').addEventListener('click', function () { respond('granted'); });
    banner.querySelector('.ck-decline').addEventListener('click', function () { respond('denied'); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
