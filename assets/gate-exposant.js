/* FLORE Festival · verrou d'accès au dossier exposant détaillé
   =============================================================
   Page réservée aux prospects exposants qui ont eu un échange (rendez-vous,
   call) avec l'équipe FLORE : le code est communiqué oralement/par écrit à
   ce moment-là, pas affiché publiquement. Comme gate.js, ce n'est pas une
   vraie sécurité (le mot de passe est visible dans le code source) : c'est
   une barrière souple assumée comme telle, doublée du noindex sur la page.

   Changer PASSWORD ici pour révoquer/renouveler l'accès à tout moment.
   Pas d'auto-unlock par date (contrairement à gate.js) : cette page reste
   gatée indéfiniment tant que GATE_ENABLED est true. */
(function () {
  var GATE_ENABLED = true;
  var PASSWORD = 'florexpo2027';
  var STORAGE_KEY = 'flore_gate_exposant_ok';

  if (!GATE_ENABLED) return;
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') return;
  } catch (e) {}

  var style = document.createElement('style');
  style.textContent =
    '@keyframes fadeInGate{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}' +
    '@keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}' +
    '#flore-gate-exp{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;' +
    'background:linear-gradient(180deg,#4FA0D2 0%,#3F93C4 45%,#2E7FB8 100%);font-family:"Telegraf",system-ui,sans-serif}' +
    '.fge-card{background:#fff;border-radius:28px;padding:44px 38px;max-width:420px;width:100%;text-align:center;box-shadow:0 40px 100px rgba(11,24,50,.4);animation:fadeInGate .5s ease-out}' +
    '.fge-logo{width:120px;margin:0 auto 24px;display:block}' +
    '.fge-kicker{font-weight:700;font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;color:#92A824;margin:0 0 12px}' +
    '.fge-card h1{font-size:1.9rem;color:#15395B;margin:0 0 6px;font-weight:800;letter-spacing:-.02em}' +
    '.fge-text{color:#5C7993;font-size:.9rem;line-height:1.5;margin:0 0 30px;letter-spacing:.2px}' +
    '#fge-form{display:flex;gap:10px}' +
    '#fge-input{flex:1;min-width:0;border:2px solid #E1E9F0;border-radius:14px;padding:14px 18px;font:inherit;font-size:.95rem;text-align:center;color:#15395B;background:#fafcfe;transition:all .2s}' +
    '#fge-input:focus{outline:none;border-color:#92A824;background:#fff;box-shadow:0 0 0 3px rgba(146,168,36,.1)}' +
    '#fge-input::placeholder{color:#B0BCC4}' +
    '#fge-form button{background:#DAEF52;color:#15395B;border:none;border-radius:14px;padding:14px 26px;font-family:inherit;font-weight:800;font-size:.95rem;cursor:pointer;white-space:nowrap;transition:all .2s;box-shadow:0 4px 12px rgba(218,239,82,.3)}' +
    '#fge-form button:hover{background:#c8dd3a;transform:translateY(-2px);box-shadow:0 6px 20px rgba(218,239,82,.4)}' +
    '#fge-form button:active{transform:translateY(0)}' +
    '.fge-error{color:#E5484D;font-size:.85rem;margin:12px 0 0;animation:pulse .8s}';
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.id = 'flore-gate-exp';
  overlay.innerHTML =
    '<div class="fge-card">' +
      '<img class="fge-logo" src="/assets/logo-flore-black.png" alt="FLORE">' +
      '<p class="fge-kicker">Dossier exposant</p>' +
      '<h1>Accès réservé</h1>' +
      '<p class="fge-text">Cette page détaille l\'offre exposant FLORE. Entrez le code qui vous a été communiqué lors de votre échange avec l\'équipe.</p>' +
      '<form id="fge-form">' +
        '<input type="password" id="fge-input" placeholder="Code d\'accès" autocomplete="off">' +
        '<button type="submit">Accéder →</button>' +
      '</form>' +
      '<p class="fge-error" id="fge-error" hidden>Code incorrect · Réessayez</p>' +
    '</div>';
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  var input = document.getElementById('fge-input');
  var errorMsg = document.getElementById('fge-error');
  input.focus();

  document.getElementById('fge-form').addEventListener('submit', function (e) {
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
