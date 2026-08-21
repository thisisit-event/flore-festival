/* FLORE Festival · verrou d'accès temporaire (fenêtre d'avance newsletter)
   =========================================================================
   Sert UNIQUEMENT à décaler la découverte du site entre les abonné·es
   newsletter (mot de passe envoyé par email) et le grand public, le temps
   d'une fenêtre de quelques heures le jour du reveal.

   Ce n'est PAS une vraie sécurité : le mot de passe est visible dans ce
   fichier (donc dans le code source public). C'est juste une barrière
   souple, assumée comme telle.

   Utilisation :
   - GATE_ENABLED = true  -> le verrou est actif, affiché sur toutes les
     pages qui chargent ce script.
   - GATE_ENABLED = false -> le site est complètement ouvert (coupe-circuit
     manuel en cas de besoin, indépendant de l'heure ci-dessous).
   - AUTO_UNLOCK_AT : le verrou se désactive tout seul à partir de cette
     date/heure, sans intervention manuelle (ouverture grand public du
     22 août à 18h). Ne pas compter sur un flip manuel de GATE_ENABLED
     pile à l'heure : ce mécanisme garantit l'ouverture même si personne
     n'est devant un clavier à ce moment précis.
   - PASSWORD : à changer ici avant d'envoyer l'email prévente. Facile à
     modifier, un seul endroit. */
(function () {
  var GATE_ENABLED = true;
  var AUTO_UNLOCK_AT = new Date('2026-08-22T18:00:00+02:00').getTime();
  var PASSWORD = 'flore2027';
  var STORAGE_KEY = 'flore_gate_ok';

  if (!GATE_ENABLED) return;
  if (Date.now() >= AUTO_UNLOCK_AT) return;
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') return;
  } catch (e) {}

  var style = document.createElement('style');
  style.textContent =
    '@keyframes fadeInGate{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}' +
    '@keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}' +
    '#flore-gate{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;' +
    'background:linear-gradient(180deg,#4FA0D2 0%,#3F93C4 45%,#2E7FB8 100%);font-family:"Telegraf",system-ui,sans-serif}' +
    '.fg-card{background:#fff;border-radius:28px;padding:44px 38px;max-width:420px;width:100%;text-align:center;box-shadow:0 40px 100px rgba(11,24,50,.4);animation:fadeInGate .5s ease-out}' +
    '.fg-logo{width:120px;margin:0 auto 24px;display:block}' +
    '.fg-kicker{font-weight:700;font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;color:#92A824;margin:0 0 12px;animation:pulse 2s infinite}' +
    '.fg-card h1{font-size:2.2rem;color:#15395B;margin:0 0 6px;font-weight:800;letter-spacing:-.02em}' +
    '.fg-text{color:#5C7993;font-size:.9rem;line-height:1.5;margin:0 0 30px;letter-spacing:.2px}' +
    '#fg-form{display:flex;gap:10px}' +
    '#fg-input{flex:1;min-width:0;border:2px solid #E1E9F0;border-radius:14px;padding:14px 18px;font:inherit;font-size:.95rem;text-align:center;color:#15395B;background:#fafcfe;transition:all .2s}' +
    '#fg-input:focus{outline:none;border-color:#92A824;background:#fff;box-shadow:0 0 0 3px rgba(146,168,36,.1)}' +
    '#fg-input::placeholder{color:#B0BCC4}' +
    '#fg-form button{background:#DAEF52;color:#15395B;border:none;border-radius:14px;padding:14px 26px;font-family:inherit;font-weight:800;font-size:.95rem;cursor:pointer;white-space:nowrap;transition:all .2s;box-shadow:0 4px 12px rgba(218,239,82,.3)}' +
    '#fg-form button:hover{background:#c8dd3a;transform:translateY(-2px);box-shadow:0 6px 20px rgba(218,239,82,.4)}' +
    '#fg-form button:active{transform:translateY(0)}' +
    '.fg-error{color:#E5484D;font-size:.85rem;margin:12px 0 0;animation:pulse .8s}' +
    '.fg-countdown{color:#92A824;font-weight:700;font-size:.9rem;margin-top:16px;animation:pulse 1s infinite}';
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.id = 'flore-gate';

  function updateCountdown() {
    var now = new Date();
    if (now.getTime() >= AUTO_UNLOCK_AT) {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
      overlay.remove();
      document.body.style.overflow = '';
      return;
    }
    var unlockTime = new Date(AUTO_UNLOCK_AT);
    var timeLeft = AUTO_UNLOCK_AT - now.getTime();
    var hours = Math.floor(timeLeft / 3600000);
    var minutes = Math.floor((timeLeft % 3600000) / 60000);
    var cd = document.getElementById('countdown');
    if (cd) cd.textContent = '🎉 Ouverture grand public dans ' + hours + 'h ' + minutes + 'min';
  }

  overlay.innerHTML =
    '<div class="fg-card">' +
      '<img class="fg-logo" src="/assets/logo-flore-black.png" alt="FLORE">' +
      '<h1>Prêt à éclore ?</h1>' +
      '<p class="fg-kicker">✨ L\'aventure commence maintenant</p>' +
      '<p class="fg-text">Entrez le code prévente reçu pour accéder à la billetterie</p>' +
      '<form id="fg-form">' +
        '<input type="password" id="fg-input" placeholder="Code d\'accès" autocomplete="off">' +
        '<button type="submit">Valider →</button>' +
      '</form>' +
      '<p class="fg-error" id="fg-error" hidden>Code incorrect · Réessaie</p>' +
      '<p class="fg-countdown" id="countdown"></p>' +
    '</div>';
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  updateCountdown();
  setInterval(updateCountdown, 1000);

  var input = document.getElementById('fg-input');
  var errorMsg = document.getElementById('fg-error');
  input.focus();

  document.getElementById('fg-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value.trim().toLowerCase() === PASSWORD.toLowerCase()) {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e2) {}
      overlay.remove();
      document.body.style.overflow = '';
    } else {
      errorMsg.hidden = false;
      input.value = '';
      input.focus();
    }
  });
})();
