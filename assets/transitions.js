/* FLORE Festival · transition de page « bouffée de nuages ».
   Clic sur un lien interne → voile de nuages blancs → la nouvelle page éclôt.
   Robuste : ignore liens externes, ancres, nouveaux onglets, clic modifié ;
   désactivé si l'utilisateur préfère moins d'animations. */
(function () {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var positions = [
    'top:10%;left:5%;width:300px',
    'top:26%;left:58%;width:360px',
    'top:52%;left:14%;width:330px',
    'top:60%;left:64%;width:280px',
    'top:36%;left:36%;width:420px'
  ];
  var clouds = positions.map(function (s) {
    return '<svg class="fx-cloud" aria-hidden="true" style="' + s + '"><use href="#cloud"/></svg>';
  }).join('');

  var veil = document.createElement('div');
  veil.className = 'fx-veil';
  veil.setAttribute('aria-hidden', 'true');
  veil.innerHTML = clouds;

  function mount() { if (document.body && !veil.parentNode) document.body.appendChild(veil); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  // Arrivée : si on vient d'une transition interne, on révèle (le voile se dissipe)
  try {
    if (sessionStorage.getItem('fx-nav') === '1') {
      sessionStorage.removeItem('fx-nav');
      mount();
      veil.classList.add('fx-reveal');
      setTimeout(function () { veil.classList.remove('fx-reveal'); }, 750);
    }
  } catch (e) {}

  // Départ : clic sur un lien interne
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!href) return;
    var c = href.charAt(0);
    if (c === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0) return;
    var url;
    try { url = new URL(href, location.href); } catch (_) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname) return; // même page (ancre) → pas de transition
    e.preventDefault();
    try { sessionStorage.setItem('fx-nav', '1'); } catch (_) {}
    mount();
    veil.classList.add('fx-cover');
    setTimeout(function () { location.href = url.href; }, 470);
  });

  // Retour navigateur (bfcache) : ne jamais rester couvert
  window.addEventListener('pageshow', function (ev) { if (ev.persisted) veil.classList.remove('fx-cover'); });

  // Pollen / pétales qui dérivent en fond (atmosphère vivante)
  function buildPollen() {
    if (document.querySelector('.fx-pollen')) return;
    var layer = document.createElement('div');
    layer.className = 'fx-pollen';
    layer.setAttribute('aria-hidden', 'true');
    var html = '';
    for (var i = 0; i < 12; i++) {
      var left = Math.round((i * 8.3 + (i * i * 13) % 9)) % 100;
      var size = 9 + (i * 7) % 12;
      var dur = 16 + (i * 11) % 16;
      var delay = -(i * 13) % 22;
      html += '<svg class="pl daisy" style="left:' + left + '%;width:' + size + 'px;height:' + size +
        'px;animation-duration:' + dur + 's;animation-delay:' + delay + 's"><use href="#daisy"/></svg>';
    }
    layer.innerHTML = html;
    document.body.appendChild(layer);
  }
  if (document.body) buildPollen(); else document.addEventListener('DOMContentLoaded', buildPollen);

  // Burst de pétales (réutilisable : clic boutons + moments de conversion)
  var PETALS = ['🌼', '🌸', '✿'];
  function burst(x, y, n) {
    n = n || 6;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('span');
      p.className = 'fx-petal';
      p.textContent = PETALS[i % PETALS.length];
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      var ang = (Math.PI * 2 * i) / n + (i * 0.7);
      var dist = 40 + (i * 9) % 60;
      p.style.setProperty('--tx', Math.cos(ang) * dist + 'px');
      p.style.setProperty('--ty', (Math.sin(ang) * dist - 30) + 'px');
      p.style.setProperty('--rot', (i % 2 ? '' : '-') + (120 + i * 40) + 'deg');
      document.body.appendChild(p);
      (function (el) { setTimeout(function () { el.remove(); }, 950); })(p);
    }
  }
  window.floreBurst = burst;

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.btn');
    if (b) burst(e.clientX, e.clientY, 6);
  });
})();
