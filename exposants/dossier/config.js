/* FLORE Festival · config exposants (source unique des prix/textes/flags)
   Statut "provisional" = tarif communiqué mais pas encore confirmé par écrit
   avec Ainterexpo/Lény (voir memory flore-compte-rendu-ainterexpo-technique) :
   affiché avec la mention "tarif indicatif". Statut "hidden" = donnée interne
   uniquement, jamais affichée au public. */
window.FLORE_EXHIBITOR_CONFIG = {
  event: {
    name: 'FLORE Festival',
    edition: 'Édition 1',
    dateLabel: 'Samedi 17 avril 2027',
    venue: 'Ainterexpo',
    city: 'Bourg-en-Bresse',
    halls: 'Halls A & B',
    hoursLabel: '11h00 – 22h00',
    organizer: 'MG Entertainment',
    orgType: 'Association loi 1901 à but non lucratif, équipe 100 % bénévole'
  },

  stats: {
    ticketsSoldLabel: '1 000 billets déjà vendus',
    departmentsRepresented: 59,
    departmentsTotal: 96,
    countriesRepresented: 5,
    instagramFollowersLabel: '+10 000',
    newsletterSubscribers: 2500,
    monthlyImpressionsLabel: '≈ 1 million'
  },

  // Prix publics des espaces nus (hors options techniques).
  basePrices: {
    boutiqueDecouverte: { id: 'boutique-2x2', label: 'Boutique Découverte', size: '2 × 2 m', area: '4 m²', price: 290 },
    boutiqueMarque:     { id: 'boutique-2x4', label: 'Boutique Marque',     size: '2 × 4 m', area: '8 m²', price: 490 },
    jardin:             { id: 'jardin-3x3',   label: 'Jardin des Saveurs', size: '3 × 3 m', area: '9 m²', price: 490 },
    premium:            { id: 'premium',      label: 'Premium',           size: 'Sur mesure', area: null, price: 790, priceLabel: 'à partir de 790 € HT' }
  },

  // Sur sélection uniquement — jamais auto-attribué (voir doc §11/§28).
  accompanimentPrices: {
    boutiqueDecouverte: { publicPrice: 290, price: 190 },
    jardin:              { publicPrice: 490, price: 290, priceLabel: 'à partir de 290 € HT' }
  },

  // Statut attribué exclusivement par FLORE après sélection (doc §13/§22).
  pioneer: {
    boutiqueDecouverte: { publicPrice: 290, price: 0 },
    boutiqueMarque:      { publicPrice: 490, price: 0 },
    jardin:              { publicPrice: 490, price: 0 }
  },

  deposits: {
    pioneerBoutique: 250,
    pioneerJardin: 350,
    animation: 150,
    note: 'Caution remboursable, conditions exactes renvoyées au contrat.'
  },

  // categories : mobilier | mobilierFermob | electricite | eau | standHabillage | manutention | techniqueSpecial
  technicalOptions: [
    { id: 'table-pliante', label: 'Table pliante 1,80 × 0,80 m', category: 'mobilier', price: 14, unit: '€ HT', status: 'provisional', public: true },
    { id: 'chaise-coque', label: 'Chaise coque', category: 'mobilier', price: 4, unit: '€ HT', status: 'provisional', public: true },
    { id: 'pack-duo', label: 'Pack Mobilier Duo (1 table + 2 chaises)', category: 'mobilier', price: 40, unit: '€ HT', status: 'provisional', public: false, notes: 'Tarif supérieur à la somme des éléments séparés — ne pas afficher publiquement tant que la composition exacte n\'est pas confirmée.' },
    { id: 'pack-famille', label: 'Pack Mobilier Famille (2 tables + 4 chaises)', category: 'mobilier', price: 75, unit: '€ HT', status: 'provisional', public: false, notes: 'Même remarque que le Pack Duo.' },
    { id: 'mange-debout', label: 'Mange-debout', category: 'mobilier', price: 50, unit: '€ HT', status: 'provisional', public: true },
    { id: 'tabouret-haut', label: 'Tabouret haut', category: 'mobilier', price: 38, unit: '€ HT', status: 'provisional', public: true },
    { id: 'comptoir-accueil', label: 'Comptoir d\'accueil 1 m', category: 'mobilier', price: 90, unit: '€ HT', status: 'provisional', public: true },
    { id: 'moquette', label: 'Moquette', category: 'mobilier', price: 8, unit: '€ HT/m²', status: 'provisional', public: true },
    { id: 'cloison-suppl', label: 'Cloison supplémentaire', category: 'mobilier', price: 30, unit: '€ HT/ml', status: 'provisional', public: true },
    { id: 'porte-cle', label: 'Porte avec clé (réserve arrière-stand)', category: 'mobilier', price: 71, unit: '€ HT', status: 'provisional', public: true },

    { id: 'table-fermob', label: 'Table Fermob', category: 'mobilierFermob', price: 10, unit: '€ HT', status: 'provisional', public: true, notes: 'Famille distincte du mobilier standard (14€/4€) — les deux grilles coexistent tant que la source du conflit n\'est pas clarifiée avec le prestataire.' },
    { id: 'chaise-fermob', label: 'Chaise Fermob', category: 'mobilierFermob', price: 4.5, unit: '€ HT', status: 'provisional', public: true },

    { id: 'bloc-4kva', label: 'Bloc électrique 4 kVA (3 à 4 prises)', category: 'electricite', price: 162, unit: '€ HT', status: 'provisional', public: true, notes: 'Plafond 20 kW cumulés / espace selon infos actuelles. Toute demande importante fait l\'objet d\'une validation technique spécifique.' },

    { id: 'evier-froide', label: 'Évier eau froide + raccordement', category: 'eau', price: 140, unit: '€ HT', status: 'provisional', public: true },
    { id: 'evier-chaude', label: 'Évier eau chaude + cumulus + raccordement', category: 'eau', price: 217, unit: '€ HT', status: 'provisional', public: true },

    { id: 'structure-stand', label: 'Structure / cloison stand', category: 'standHabillage', price: 15, unit: '€ HT/ml', status: 'provisional', public: true },
    { id: 'raidisseur', label: 'Raidisseur / poteau / bandeau (montage + démontage compris)', category: 'standHabillage', price: 3.75, unit: '€ HT/ml', status: 'provisional', public: true, notes: 'Libellé exact à confirmer avec le prestataire.' },
    { id: 'option-inconnue-350', label: 'À CONFIRMER — option stand 3,50 €', category: 'standHabillage', price: 3.5, unit: '€ HT', status: 'provisional', public: false, notes: 'Intitulé exact non connu — ne jamais afficher publiquement sans libellé confirmé.' },
    { id: 'transport-standiste', label: 'Transport standiste (forfait global)', category: 'standHabillage', price: 400, unit: '€ HT pour l\'ensemble', status: 'provisional', public: false, notes: 'Coût global organisateur/prestataire — ne pas facturer automatiquement à chaque exposant tant que la politique de répartition n\'est pas définie.' },

    { id: 'chariot-elevateur', label: 'Chariot élévateur + conducteur', category: 'manutention', price: 55, unit: '€ HT/15 min', status: 'provisional', public: true },
    { id: 'nacelle', label: 'Nacelle avec conducteur', category: 'manutention', price: 51, unit: '€ HT/15 min', status: 'provisional', public: true },

    { id: 'samia-2x1', label: 'Praticable SAMIA 2×1 (hauteurs 20/40/60/80 cm, charge 250 kg/m²)', category: 'techniqueSpecial', price: 8.5, unit: '€ HT/m²', status: 'provisional', public: true, notes: 'Hauteurs/caractéristiques à confirmer définitivement avec le prestataire avant usage structurel.' },
    { id: 'staco-2x2', label: 'Praticable STACO EasyStage 2×2 (≈1,22/1,50 m, charge 500 kg/m²)', category: 'techniqueSpecial', price: 17, unit: '€ HT/m²', status: 'provisional', public: true, notes: 'Même remarque que SAMIA 2×1.' }
  ],

  sponsorPackages: [
    { id: 'partenaire', label: 'Partenaire', price: 2000 },
    { id: 'officiel', label: 'Partenaire Officiel', price: 4000 },
    { id: 'majeur', label: 'Partenaire Majeur', price: 6000 }
  ],

  setupTimes: {
    fridayLabel: 'Vendredi 16 avril 2027 — après-midi (horaires exacts à confirmer avec Ainterexpo)',
    saturdayPlan: [
      { time: '07h00 – 08h30', label: 'Installation finale / produits frais' },
      { time: '08h30', label: 'Présence obligatoire Jardin des Saveurs' },
      { time: '08h30 – 10h00', label: 'Contrôle Comité FLORE' },
      { time: '10h00 – 10h30', label: 'Corrections' },
      { time: '10h30', label: 'Stands opérationnels' },
      { time: '11h00', label: 'Ouverture au public' }
    ]
  },

  applicationDates: {
    balanceDueLabel: '3 mars 2027',
    j60: '16 février 2027',
    j45: '3 mars 2027',
    j30: '18 mars 2027',
    j15: '2 avril 2027',
    j7: '10 avril 2027',
    setup: '16 avril 2027 (montage)',
    festival: '17 avril 2027 (festival)'
  },

  passport: {
    enabled: false,
    requiredStamps: 10,
    rewardDescription: 'À définir',
    participatingStandCount: 10
  },

  legal: {
    validationDisclaimer: 'Une candidature validée par FLORE ne constitue pas un agrément administratif ou sanitaire.',
    cancellationStatus: 'provisional',
    cancellationNote: 'Conditions définitives précisées dans les CGV.'
  },

  featureFlags: {
    applicationsOpen: true,
    showTechnicalPrices: true,
    showProvisionalPrices: true,
    passportEnabled: false,
    pioneerApplicationsOpen: true,
    sponsorLeadFormEnabled: true
  }
};
