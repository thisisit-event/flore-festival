/* FLORE Festival · petites touches d'ambiance (pollen dérivant, éclat de
   pétales au clic). Pas de transition de navigation : ça ajoutait un délai
   perceptible avant chaque changement de page. */
(function () {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Pollen / pétales qui dérivent en fond (atmosphère vivante)
  function buildPollen() {
    if (document.querySelector('.fx-pollen')) return;
    var layer = document.createElement('div');
    layer.className = 'fx-pollen';
    layer.setAttribute('aria-hidden', 'true');
    var html = '';
    for (var i = 0; i < 6; i++) {
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
