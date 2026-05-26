// ============================================================
//  Sim Racing Manager – app.js
// ============================================================

// ---------- Championship Config ----------
// CHAMPIONSHIPS now loaded from ES6 modules via main.js
const CHAMPIONSHIPS = window.CHAMPIONSHIPS_DATA || {
  f1: {
    id: 'f1',
    name: 'Formula 1',
    icon: '🏎',
    accentColor: '#e10600',
    categories: ['F1']
  },
  wec: {
    id: 'wec',
    name: 'FIA WEC',
    icon: '⏱',
    accentColor: '#0066cc',
    categories: ['Hypercar', 'LMP2', 'GTE Pro', 'GTE Am']
  },
  gt: {
    id: 'gt',
    name: 'GT Championship',
    icon: '🏁',
    accentColor: '#00a651',
    categories: ['GT3', 'GT4', 'GT2', 'Other']
  }
};

// DEFAULT_TEAMS_BY_CHAMP now loaded from ES6 modules via main.js
const DEFAULT_TEAMS_BY_CHAMP = window.DEFAULT_TEAMS_BY_CHAMP || {
  f1: [],
  wec: [],
  gt: []
};

// DEFAULT_DRIVERS_BY_CHAMP now loaded from ES6 modules via main.js
const DEFAULT_DRIVERS_BY_CHAMP = window.DEFAULT_DRIVERS_BY_CHAMP || {
  f1: [],
  wec: [],
  gt: []
};

// F1_2025_QUALIFYING_BY_SEED now loaded from ES6 modules via main.js
const F1_2025_QUALIFYING_BY_SEED = window.F1_2025_QUALIFYING_BY_SEED || {};

let currentChampionship = null;

// ---------- Logo data (base64) for current form session ----------
let teamLogoData    = null;
let teamCarPhotoData = null;
let driverPhotoData  = null;
let editingTeamCarSetup = null;
let editingTeamSeedKey = null;
let editingDriverSeedKey = null;

const CAR_STAT_DEFAULTS = {
  powerUnit: 75,
  downforce: 75,
  chassis: 75,
  reliability: 75,
  ersDeploy: 75,
  tyreDegradation: 25
};

const SIM_DEFAULT_SPEED = 1;
const SIM_BASE_PATH_SPEED = 90;
const SIM_MAX_SPEED_KMH = 370;
const SIM_POWER_UNIT_MAX = 99;
const SIM_KMH_DROP_PER_PU = 2;
const SIM_MAX_TEAMS_ON_TRACK = 10;
const SIM_LANE_COUNT = 3;
const SIM_LANE_SPACING = 2.4;
const SIM_ROW_GAP = 34;
const SIM_DOT_RADIUS = 2.4;
const SIM_TURN1_ENTRY_KMH = 90;
const SIM_TURN2_ENTRY_KMH = 85;
const SIM_TURN4_ENTRY_KMH = 130;
const SIM_TURN6_ENTRY_KMH = 208;
const SIM_TURN7_ENTRY_KMH = 225;
const SIM_TURN8_ENTRY_KMH = 195;
const SIM_TURN9_ENTRY_KMH = 228;
const SIM_TURN10_ENTRY_KMH = 245;
const SIM_TURN11_ENTRY_KMH = 219;
const SIM_BRAKE_ZONE_WINDOW = 12;
const SIM_BRAKE_PREP_DISTANCE = 64;
const SIM_APEX_HOLD_WINDOW = 8;
const SIM_BRAKE_DECEL_KMH_PER_SEC = 110;
const SIM_ACCEL_REFERENCE_START_KMH = 80;
const SIM_ACCEL_REFERENCE_END_KMH = 330;
const SIM_ACCEL_REFERENCE_TIME_SEC = 10;
const SIM_ACCEL_KMH_PER_SEC =
  (SIM_ACCEL_REFERENCE_END_KMH - SIM_ACCEL_REFERENCE_START_KMH) / SIM_ACCEL_REFERENCE_TIME_SEC;
const SIM_LAUNCH_SPEED_KMH = 0;
const SIM_TURN1_MARKER = { x: 403, y: 405 };
const SIM_TURN2_MARKER = { x: 403, y: 355 };
const SIM_TURN4_MARKER = { x: 205, y: 240 };
const SIM_TURN6_MARKER = { x: 125, y: 105 };
const SIM_TURN7_MARKER = { x: 245, y: 65 };
const SIM_TURN8_MARKER = { x: 455, y: 260 };
const SIM_TURN9_MARKER = { x: 490, y: 250 };
const SIM_TURN10_MARKER = { x: 525, y: 260 };
const SIM_TURN11_MARKER = { x: 785, y: 260 };
const SIM_START_FINISH_MARKER = { x: 600, y: 380.9 };
const SIM_PIT_EXIT_MARKER = { x: 415, y: 378 };
const SIM_PIT_ENTRY_MARKER = { x: 790, y: 380 };
const SIM_PIT_BOX_START = { x: 586.8, y: 368.7 };
const SIM_PIT_BOX_END = { x: 740.3, y: 372 };
const SIM_DRS_OVERLAY_SAMPLE_SPACING = 8;
const SIM_DRS_ZONE_CONFIGS = [
  {
    id: 'DRS 1',
    startMarker: { x: 742.6, y: 380.9 },
    endMarker: { x: 440.6, y: 380 }
  },
  {
    id: 'DRS 2',
    startMarker: { x: 265.8, y: 80.8 },
    endMarker: { x: 438.9, y: 248.7 }
  }
];
const SIM_DRS_ACTIVATION_GAP_SEC = 1;
const SIM_DRS_ACCEL_MULTIPLIER = 1.02;
const SIM_DRS_TOP_SPEED_BOOST_PU_GT_90 = 0.04;
const SIM_DRS_TOP_SPEED_BOOST_PU_85_TO_90 = 0.07;
const SIM_DRS_TOP_SPEED_BOOST_PU_LT_85 = 0.12;
const SIM_RACE_TOTAL_LAPS = 3;
const SIM_ERS_BATTERY_START = 100;
const SIM_ERS_MIN_BATTERY_TO_DEPLOY = 15;
const SIM_ERS_ACCEL_MULTIPLIER = 1.03;
const SIM_ERS_SPEED_BOOST_KMH = 10;
const SIM_ERS_BATTERY_CAPACITY_REFERENCE_DEPLOY = 85;
const SIM_ERS_BATTERY_CAPACITY_STEP_PER_DEPLOY = 2;
const SIM_ERS_DRAIN_PERCENT_PER_SEC = 10;
const SIM_ERS_CHARGE_PERCENT_PER_SEC = 5;
const SIM_RACE_ERS_MIN_SPEED_KMH = 250;
const SIM_RACE_ERS_BASE_ACCEL_BOOST = 0.2;
const SIM_RACE_ERS_BASE_SPEED_BOOST = 0.3;
const SIM_RACE_ERS_REFERENCE_RATING = 95;
const SIM_RACE_ERS_DROP_PER_POINT_95_TO_90 = 0.005;
const SIM_RACE_ERS_DROP_PER_POINT_90_TO_85 = 0.05;
const SIM_RACE_ERS_DROP_PER_POINT_85_TO_80 = 0.02;
const SIM_RACE_ERS_DROP_PER_POINT_80_TO_70 = 0.01;
const SIM_QUALIFYING_DURATION_SEC = 5 * 60;
const SIM_QUALIFYING_MIN_TIME_SCALE = 1;
const SIM_QUALIFYING_MAX_TIME_SCALE = 5;
const SIM_QUALI_PIT_RELEASE_GAP_SEC = 8;
const SIM_QUALI_PIT_SPEED_KMH = 80;
const SIM_QUALI_PIT_TURNAROUND_SEC = 10;
const SIM_RACE_GRID_STAGGER_GAP = 12;
const SIM_RACE_GRID_POLE_LANE = 1;
const SIM_RACE_GRID_SECOND_LANE = 2;
const SIM_QUALI_ERS_MIN_SPEED_KMH = 270;
const SIM_QUALI_ERS_EXTRA_ACCEL_MULTIPLIER = 1.05;
const SIM_SESSION_PHASES = {
  QUALIFYING_PENDING: 'qualifying-pending',
  QUALIFYING_RUNNING: 'qualifying-running',
  RACE_READY: 'race-ready',
  RACE_RUNNING: 'race-running',
  RACE_FINISHED: 'race-finished'
};

const simState = {
  running: false,
  rafId: null,
  startTs: 0,
  lastTickTs: 0,
  finishCounter: 0,
  speed: SIM_DEFAULT_SPEED,
  lapLength: 0,
  turn1Distance: null,
  turn2Distance: null,
  turn4Distance: null,
  turn6Distance: null,
  turn7Distance: null,
  turn8Distance: null,
  turn9Distance: null,
  turn10Distance: null,
  turn11Distance: null,
  startFinishDistance: null,
  drsZones: [],
  drsPickMode: null,
  drsDraftZone: {
    startMarker: null,
    endMarker: null
  },
  teamsOnGrid: [],
  teamRuns: [],
  sessionPhase: SIM_SESSION_PHASES.QUALIFYING_PENDING,
  qualifyingRunning: false,
  qualifyingRafId: null,
  qualifyingStartTs: 0,
  qualifyingLastTickTs: 0,
  qualifyingElapsedSec: 0,
  qualifyingDurationSec: SIM_QUALIFYING_DURATION_SEC,
  qualifyingTimeScale: SIM_QUALIFYING_MIN_TIME_SCALE,
  qualifyingRuns: [],
  qualifyingTotalCars: 0,
  qualifyingFinishedCars: 0,
  qualifyingCompleted: false,
  qualifiedGridSignature: null,
  qualifyingGridOrder: [],
  pitExitDistance: null,
  pitEntryDistance: null,
  pitLaneLength: 0
};

// ---------- State ----------
const state = {
  teams: [],
  drivers: [],
  activity: [],
  nextTeamId: 1,
  nextDriverId: 1
};

// ---------- Init ----------
// Note: DOMContentLoaded already fired when this script loads (loaded by main.js after DOM ready)
// So we call init functions directly instead of waiting for DOMContentLoaded
// MOVED TO END OF FILE to ensure all variables are declared first

// ============================================================
//  CHAMPIONSHIP SELECTION
// ============================================================
function openChampionshipScreen() {
  // Update each card's save summary
  Object.values(CHAMPIONSHIPS).forEach(c => {
    const saved = localStorage.getItem(`simracing_state_${c.id}`);
    const el = document.getElementById(`save-${c.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      const t = (parsed.teams || []).length;
      const d = (parsed.drivers || []).length;
      el.textContent = `${t} team${t !== 1 ? 's' : ''} · ${d} driver${d !== 1 ? 's' : ''}`;
      el.style.color = c.accentColor;
    } else {
      el.textContent = 'No save data';
      el.style.color = '';
    }
  });
  document.getElementById('championshipScreen').classList.add('active');
}

function selectChampionship(id) {
  currentChampionship = id;
  const champ = CHAMPIONSHIPS[id];

  // Reset state then load this championship's save
  Object.assign(state, { teams: [], drivers: [], activity: [], nextTeamId: 1, nextDriverId: 1 });
  loadFromStorage();

  // Update category dropdown options
  updateCategoryDropdown();

  // Update UI chrome
  updateChampionshipUI();

  // Hide selection screen
  document.getElementById('championshipScreen').classList.remove('active');

  renderAll();
}

function updateCategoryDropdown() {
  const sel = document.getElementById('teamCategory');
  const champ = CHAMPIONSHIPS[currentChampionship];
  sel.innerHTML = champ.categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

function updateChampionshipUI() {
  const champ = CHAMPIONSHIPS[currentChampionship];

  // Topbar badge
  document.getElementById('champTopbarIcon').textContent = champ.icon;
  document.getElementById('champTopbarName').textContent = champ.name;
  document.getElementById('champTopbarBadge').style.borderColor = champ.accentColor;
  document.getElementById('champTopbarBadge').style.color = champ.accentColor;

  // Sidebar
  document.getElementById('sidebarChampIcon').textContent = champ.icon;
  document.getElementById('sidebarChampName').textContent = champ.name;

  // CSS accent color override for this championship
  document.documentElement.style.setProperty('--accent', champ.accentColor);
  document.documentElement.style.setProperty('--accent-2', champ.accentColor + 'cc');
}

// ============================================================
//  LOCAL STORAGE
// ============================================================
function saveToStorage() {
  localStorage.setItem(`simracing_state_${currentChampionship}`, JSON.stringify(state));
}

function loadFromStorage() {
  const saved = localStorage.getItem(`simracing_state_${currentChampionship}`);
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
    const defaultTeamSeedPrefix = `default:${currentChampionship}:`;
    const defaultDriverSeedPrefix = `default-driver:${currentChampionship}:`;

    // Keep only seeded defaults and drop web-entered custom records.
    state.teams = state.teams
      .filter(team => typeof team.seedKey === 'string' && team.seedKey.startsWith(defaultTeamSeedPrefix))
      .map(team => ({
        ...team,
        logo: null,
        carPhoto: null,
        shortTag: normalizeTeamTag(team.shortTag) || null,
        carSetup: normalizeCarSetup(team.carSetup)
      }));

    state.drivers = state.drivers
      .filter(driver => typeof driver.seedKey === 'string' && driver.seedKey.startsWith(defaultDriverSeedPrefix))
      .map(driver => ({
        ...driver,
        age: null,
        photo: null,
        skills: normalizeDriverSkills(driver.skills)
      }));

    // Clear activity that came from previous web edits.
    state.activity = [];
  }

  // Ensure IDs continue correctly even if schema changed between code versions.
  const maxTeamId = state.teams.reduce((max, t) => Math.max(max, Number(t.id) || 0), 0);
  const maxDriverId = state.drivers.reduce((max, d) => Math.max(max, Number(d.id) || 0), 0);
  state.nextTeamId = Math.max(Number(state.nextTeamId) || 1, maxTeamId + 1);
  state.nextDriverId = Math.max(Number(state.nextDriverId) || 1, maxDriverId + 1);

  // Seed defaults and keep values aligned with in-code default datasets.
  const teamsSeeded = ensureDefaultTeams();
  const driversSeeded = ensureDefaultDrivers();
  if (teamsSeeded || driversSeeded) saveToStorage();
}

function ensureDefaultTeams() {
  const defaults = DEFAULT_TEAMS_BY_CHAMP[currentChampionship] || [];
  let changed = false;

  // Migrate legacy seeded defaults that used index-based seed keys.
  const legacySeedKeyPattern = new RegExp(`^default:${currentChampionship}:\\d+$`);
  const beforeCount = state.teams.length;
  state.teams = state.teams.filter(t => !(typeof t.seedKey === 'string' && legacySeedKeyPattern.test(t.seedKey)));
  if (state.teams.length !== beforeCount) changed = true;

  defaults.forEach((team, idx) => {
    const fallbackSeedId = String(team.name || `team-${idx}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const seedId = team.seedId || fallbackSeedId || `team-${idx}`;
    const seedKey = `default:${currentChampionship}:${seedId}`;
    const seededTeam = state.teams.find(t => t.seedKey === seedKey);
    if (seededTeam) {
      seededTeam.name = team.name;
      seededTeam.country = team.country;
      seededTeam.car = team.car;
      seededTeam.category = team.category;
      seededTeam.color = team.color;
      seededTeam.budget = team.budget ?? null;
      seededTeam.logo = null;
      seededTeam.carPhoto = null;
      seededTeam.shortTag = normalizeTeamTag(team.shortTag || getTeamTag(team.name)) || null;
      seededTeam.carSetup = normalizeCarSetup(team.carSetup);
      changed = true;
      return;
    }

    const exists = state.teams.some(t =>
      t.seedKey === seedKey ||
      (String(t.name).toLowerCase() === String(team.name).toLowerCase() &&
       String(t.country).toLowerCase() === String(team.country).toLowerCase())
    );

    if (!exists) {
      state.teams.push({
        id: state.nextTeamId++,
        name: team.name,
        country: team.country,
        car: team.car,
        category: team.category,
        color: team.color,
        budget: team.budget ?? null,
        logo: null,
        carPhoto: null,
        shortTag: normalizeTeamTag(team.shortTag || getTeamTag(team.name)) || null,
        carSetup: normalizeCarSetup(team.carSetup),
        createdAt: new Date().toISOString(),
        seedKey
      });
      changed = true;
    }
  });

  return changed;
}

function getDefaultDriverSkills() {
  return {
    cornering: 75,
    braking: 75,
    reactions: 75,
    accuracy: 75,
    control: 75,
    smooth: 75,
    adaptability: 75,
    overtaking: 75,
    defending: 75,
    qualifying: 75
  };
}

function normalizeDriverSkills(skills) {
  const fallback = getDefaultDriverSkills();
  const src = skills || {};
  return {
    cornering: Number(src.cornering) || fallback.cornering,
    braking: Number(src.braking) || fallback.braking,
    reactions: Number(src.reactions) || fallback.reactions,
    accuracy: Number(src.accuracy) || fallback.accuracy,
    control: Number(src.control) || fallback.control,
    smooth: Number(src.smooth) || fallback.smooth,
    adaptability: Number(src.adaptability) || fallback.adaptability,
    overtaking: Number(src.overtaking) || fallback.overtaking,
    defending: Number(src.defending) || fallback.defending,
    qualifying: Number(src.qualifying) || fallback.qualifying
  };
}

function isUntouchedDefaultSkills(skills) {
  const normalized = normalizeDriverSkills(skills);
  return Object.values(normalized).every(v => v === 75);
}

function ensureDefaultDrivers() {
  const defaults = DEFAULT_DRIVERS_BY_CHAMP[currentChampionship] || [];
  let changed = false;

  const legacySeedKeyPattern = new RegExp(`^default-driver:${currentChampionship}:\\d+$`);
  const beforeCount = state.drivers.length;
  state.drivers = state.drivers.filter(d => !(typeof d.seedKey === 'string' && legacySeedKeyPattern.test(d.seedKey)));
  if (state.drivers.length !== beforeCount) changed = true;

  defaults.forEach((driver, idx) => {
    const fallbackSeedId = `${driver.first}-${driver.last}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const seedId = driver.seedId || fallbackSeedId || `driver-${idx}`;
    const seedKey = `default-driver:${currentChampionship}:${seedId}`;
    const teamSeedKey = `default:${currentChampionship}:${driver.teamSeedId}`;
    const team = state.teams.find(t => t.seedKey === teamSeedKey);
    if (!team) return;
    const seededQualifying = Number(driver.skills?.qualifying) || Number(F1_2025_QUALIFYING_BY_SEED[seedId]) || 75;

    const seededDriver = state.drivers.find(d => d.seedKey === seedKey);
    if (seededDriver) {
      seededDriver.first = driver.first;
      seededDriver.last = driver.last;
      seededDriver.number = Number(driver.number);
      seededDriver.nationality = driver.nationality;
      seededDriver.teamId = String(team.id);
      seededDriver.age = null;
      seededDriver.photo = null;
      seededDriver.skills = normalizeDriverSkills({
        ...driver.skills,
        qualifying: seededQualifying
      });
      changed = true;
      return;
    }

    const exists = state.drivers.some(d =>
      d.seedKey === seedKey ||
      (String(d.first).toLowerCase() === String(driver.first).toLowerCase() &&
       String(d.last).toLowerCase() === String(driver.last).toLowerCase() &&
       String(d.teamId) === String(team.id))
    );

    if (!exists) {
      state.drivers.push({
        id: state.nextDriverId++,
        first: driver.first,
        last: driver.last,
        number: Number(driver.number),
        nationality: driver.nationality,
        teamId: String(team.id),
        age: null,
        skills: normalizeDriverSkills({
          ...driver.skills,
          qualifying: seededQualifying
        }),
        photo: null,
        createdAt: new Date().toISOString(),
        seedKey
      });
      changed = true;
    }
  });

  return changed;
}

function inferQualifyingSkill(skills) {
  const normalized = normalizeDriverSkills(skills);
  const inferred = Math.round(
    normalized.cornering * 0.28 +
    normalized.braking * 0.18 +
    normalized.reactions * 0.24 +
    normalized.accuracy * 0.3
  );
  return Math.max(1, Math.min(99, inferred));
}

function getQualifyingPaceMultiplier(qualifyingRating) {
  const rating = Math.max(1, Math.min(99, Number(qualifyingRating) || 75));
  const effectiveness = Math.max(0, Math.min(1, 1 - (99 - rating) * 0.02));
  return effectiveness;
}

function getQualifyingAccelMultiplier(qualifyingRating) {
  return 1 + 0.04 * getQualifyingPaceMultiplier(qualifyingRating);
}

function getQualifyingSpeedBoostKmh(qualifyingRating) {
  return 20 * getQualifyingPaceMultiplier(qualifyingRating);
}

function normalizeCarSetup(setup) {
  return {
    powerUnit: Number(setup?.powerUnit) || CAR_STAT_DEFAULTS.powerUnit,
    downforce: Number(setup?.downforce) || CAR_STAT_DEFAULTS.downforce,
    chassis: Number(setup?.chassis) || CAR_STAT_DEFAULTS.chassis,
    reliability: Number(setup?.reliability) || CAR_STAT_DEFAULTS.reliability,
    ersDeploy: Number(setup?.ersDeploy) || CAR_STAT_DEFAULTS.ersDeploy,
    tyreDegradation: Number(setup?.tyreDegradation) || CAR_STAT_DEFAULTS.tyreDegradation
  };
}

function isUntouchedDefaultCarSetup(setup) {
  const normalized = normalizeCarSetup(setup);
  return (
    normalized.powerUnit === CAR_STAT_DEFAULTS.powerUnit &&
    normalized.downforce === CAR_STAT_DEFAULTS.downforce &&
    normalized.chassis === CAR_STAT_DEFAULTS.chassis &&
    normalized.reliability === CAR_STAT_DEFAULTS.reliability &&
    normalized.ersDeploy === CAR_STAT_DEFAULTS.ersDeploy &&
    normalized.tyreDegradation === CAR_STAT_DEFAULTS.tyreDegradation
  );
}


// ============================================================
//  NAVIGATION
// ============================================================
function initNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      navigate(item.dataset.section);
    });
  });

  // Sidebar toggle
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
  });
}

function navigate(sectionId) {
  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.section === sectionId);
  });

  // Show correct section
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `section-${sectionId}`);
  });

  // Update page title
  const titles = {
    dashboard: 'Dashboard',
    teams: 'Teams',
    'car-setup': 'Car Setup',
    'sim-racing': 'Sim Racing',
    drivers: 'Drivers'
  };
  document.getElementById('pageTitle').textContent = titles[sectionId] || sectionId;

  // Refresh team dropdown when navigating to drivers
  if (sectionId === 'drivers') populateTeamDropdown();
  if (sectionId === 'car-setup') {
    populateCarSetupTeamDropdown();
    renderCarSetups();
  }
  if (sectionId === 'sim-racing') renderSimRacingPreview();
  if (sectionId !== 'sim-racing') stopSimRacingAnimation();
}

// ============================================================
//  TEAM FORM
// ============================================================
function initTeamForm() {
  // Helper to show logo preview
  function showLogoPreview(src) {
    teamLogoData = src;
    const preview = document.getElementById('teamLogoPreview');
    preview.src = src;
    document.getElementById('teamLogoPreviewWrap').classList.add('visible');
  }

  // File upload reader
  document.getElementById('teamLogo').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => showLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  });

  // URL load button
  document.getElementById('teamLogoUrlLoad').addEventListener('click', () => {
    const url = document.getElementById('teamLogoUrl').value.trim();
    if (!url) return;
    const img = new Image();
    img.onload = () => showLogoPreview(url);
    img.onerror = () => showToast('Could not load image from URL', 'info');
    img.src = url;
  });

  // Clear logo button
  document.getElementById('teamLogoClear').addEventListener('click', () => {
    teamLogoData = null;
    document.getElementById('teamLogoPreview').src = '';
    document.getElementById('teamLogoPreviewWrap').classList.remove('visible');
    document.getElementById('teamLogo').value = '';
    document.getElementById('teamLogoUrl').value = '';
  });

  // ---- Car photo upload ----
  function showCarPhotoPreview(src) {
    teamCarPhotoData = src;
    document.getElementById('teamCarPhotoPreview').src = src;
    document.getElementById('teamCarPhotoPreviewWrap').classList.add('visible');
  }
  document.getElementById('teamCarPhoto').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => showCarPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  });
  document.getElementById('teamCarPhotoUrlLoad').addEventListener('click', () => {
    const url = document.getElementById('teamCarPhotoUrl').value.trim();
    if (!url) return;
    const img = new Image();
    img.onload = () => showCarPhotoPreview(url);
    img.onerror = () => showToast('Could not load image from URL', 'info');
    img.src = url;
  });
  document.getElementById('teamCarPhotoClear').addEventListener('click', () => {
    teamCarPhotoData = null;
    document.getElementById('teamCarPhotoPreview').src = '';
    document.getElementById('teamCarPhotoPreviewWrap').classList.remove('visible');
    document.getElementById('teamCarPhoto').value = '';
    document.getElementById('teamCarPhotoUrl').value = '';
  });

  const teamTagInput = document.getElementById('teamTag');
  if (teamTagInput) {
    teamTagInput.addEventListener('input', () => {
      teamTagInput.value = normalizeTeamTag(teamTagInput.value);
    });
  }

  document.getElementById('teamForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validateTeamForm()) return;

    const normalizedTag = normalizeTeamTag(getValue('teamTag'));

    const team = {
      id: state.nextTeamId++,
      name:     getValue('teamName'),
      country:  getValue('teamCountry'),
      car:      getValue('teamCar'),
      category: getValue('teamCategory'),
      color:    getValue('teamColor'),
      budget:   parseFloat(getValue('teamBudget')) || null,
      logo:     teamLogoData,
      carPhoto: teamCarPhotoData,
      shortTag: normalizedTag.length >= 2 ? normalizedTag : null,
      carSetup: normalizeCarSetup(editingTeamCarSetup),
      seedKey:  editingTeamSeedKey,
      createdAt: new Date().toISOString()
    };

    state.teams.push(team);
    teamLogoData = null;
    teamCarPhotoData = null;
    editingTeamCarSetup = null;
    editingTeamSeedKey = null;
    addActivity('team', `Team <strong>${team.name}</strong> added`);
    saveToStorage();
    renderAll();
    resetForm('teamForm');
    showToast(`Team "${team.name}" added!`, 'success');
  });
}

function validateTeamForm() {
  let valid = true;

  const rules = [
    { id: 'teamName',    msg: 'Team name is required' },
    { id: 'teamCountry', msg: 'Country is required' },
    { id: 'teamCar',     msg: 'Car model is required' }
  ];

  rules.forEach(({ id, msg }) => {
    const el = document.getElementById(id);
    const err = document.getElementById('err-' + id);
    if (!el.value.trim()) {
      err.textContent = msg;
      el.style.borderColor = '#ff5252';
      valid = false;
    } else {
      err.textContent = '';
      el.style.borderColor = '';
    }
  });

  const teamTagEl = document.getElementById('teamTag');
  const tagErrEl = document.getElementById('err-teamTag');
  if (teamTagEl && tagErrEl) {
    const rawTag = teamTagEl.value.trim();
    if (rawTag) {
      const normalizedTag = normalizeTeamTag(rawTag);
      if (normalizedTag.length < 2) {
        tagErrEl.textContent = 'Short tag must be 2-5 letters/numbers';
        teamTagEl.style.borderColor = '#ff5252';
        valid = false;
      } else {
        teamTagEl.value = normalizedTag;
        tagErrEl.textContent = '';
        teamTagEl.style.borderColor = '';
      }
    } else {
      tagErrEl.textContent = '';
      teamTagEl.style.borderColor = '';
    }
  }

  return valid;
}

// ============================================================
//  DRIVER FORM
// ============================================================
function initDriverForm() {
  // ---- Driver photo upload ----
  function showDriverPhotoPreview(src) {
    driverPhotoData = src;
    document.getElementById('driverPhotoPreview').src = src;
    document.getElementById('driverPhotoPreviewWrap').classList.add('visible');
  }
  document.getElementById('driverPhoto').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => showDriverPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  });
  document.getElementById('driverPhotoUrlLoad').addEventListener('click', () => {
    const url = document.getElementById('driverPhotoUrl').value.trim();
    if (!url) return;
    const img = new Image();
    img.onload = () => showDriverPhotoPreview(url);
    img.onerror = () => showToast('Could not load image from URL', 'info');
    img.src = url;
  });
  document.getElementById('driverPhotoClear').addEventListener('click', () => {
    driverPhotoData = null;
    document.getElementById('driverPhotoPreview').src = '';
    document.getElementById('driverPhotoPreviewWrap').classList.remove('visible');
    document.getElementById('driverPhoto').value = '';
    document.getElementById('driverPhotoUrl').value = '';
  });

  document.getElementById('driverForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validateDriverForm()) return;

    const driver = {
      id: state.nextDriverId++,
      first:       getValue('driverFirst'),
      last:        getValue('driverLast'),
      number:      parseInt(getValue('driverNumber')),
      nationality: getValue('driverNationality'),
      teamId:      getValue('driverTeam') || null,
      age:         parseInt(getValue('driverAge')) || null,
      skills: {
        cornering:    parseInt(document.getElementById('skillCornering').value),
        braking:      parseInt(document.getElementById('skillBraking').value),
        reactions:    parseInt(document.getElementById('skillReactions').value),
        accuracy:     parseInt(document.getElementById('skillAccuracy').value),
        control:      parseInt(document.getElementById('skillControl').value),
        smooth:       parseInt(document.getElementById('skillSmooth').value),
        adaptability: parseInt(document.getElementById('skillAdaptability').value),
        overtaking:   parseInt(document.getElementById('skillOvertaking').value),
        defending:    parseInt(document.getElementById('skillDefending').value),
        qualifying:   75
      },
      seedKey: editingDriverSeedKey,
      photo: driverPhotoData,
      createdAt: new Date().toISOString()
    };

    driver.skills.qualifying = inferQualifyingSkill(driver.skills);

    state.drivers.push(driver);
    driverPhotoData = null;
    editingDriverSeedKey = null;
    addActivity('driver', `Driver <strong>${driver.first} ${driver.last}</strong> added`);
    saveToStorage();
    renderAll();
    resetForm('driverForm');
    showToast(`Driver "${driver.first} ${driver.last}" added!`, 'success');
  });
}

function validateDriverForm() {
  let valid = true;

  const rules = [
    { id: 'driverFirst',  msg: 'First name is required' },
    { id: 'driverLast',   msg: 'Last name is required' },
    { id: 'driverNumber', msg: 'Car number is required' },
    { id: 'driverNationality', msg: 'Nationality is required' }
  ];

  rules.forEach(({ id, msg }) => {
    const el = document.getElementById(id);
    const err = document.getElementById('err-' + id);
    if (!el.value.trim()) {
      err.textContent = msg;
      el.style.borderColor = '#ff5252';
      valid = false;
    } else {
      err.textContent = '';
      el.style.borderColor = '';
    }
  });

  // Check duplicate car number
  const num = parseInt(getValue('driverNumber'));
  if (num && state.drivers.some(d => d.number === num)) {
    const err = document.getElementById('err-driverNumber');
    const el  = document.getElementById('driverNumber');
    err.textContent = `Car #${num} is already taken`;
    el.style.borderColor = '#ff5252';
    valid = false;
  }

  return valid;
}

function populateTeamDropdown() {
  const sel = document.getElementById('driverTeam');
  const current = sel.value;
  sel.innerHTML = '<option value="">-- No Team (Free Agent) --</option>';
  state.teams.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = `${t.name} (${t.category})`;
    sel.appendChild(opt);
  });
  sel.value = current;
}

// ============================================================
//  RENDER
// ============================================================
function renderAll() {
  renderTeams();
  renderCarSetups();
  renderSimRacingPreview();
  renderDrivers(state.drivers);
  renderStats();
  updateChips();
  renderActivity();
}

function initSimRacingSection() {
  const btn = document.getElementById('btnSimRacing');
  const qualifyingBtn = document.getElementById('btnSimQualifying');
  const qualifyingSpeed = document.getElementById('simQualifyingSpeed');
  const resetBtn = document.getElementById('btnSimReset');
  if (!btn) return;

  if (qualifyingBtn) {
    qualifyingBtn.addEventListener('click', () => {
      if (!canStartSimPreview()) {
        showToast('At least 2 teams are required to run Qualifying.', 'info');
        return;
      }

      if (simState.running) {
        stopSimRacingAnimation();
      }

      if (simState.qualifyingRunning) {
        stopSimQualifyingSession();
        setSimStatus('Qualifying paused. Click Start Qualifying to run again from the beginning.');
        renderSimRacingPreview();
        showToast('Qualifying stopped.', 'info');
        return;
      }

      startSimQualifyingSession();
      showToast('Qualifying session started (15:00).', 'success');
    });
  }

  if (qualifyingSpeed) {
    qualifyingSpeed.addEventListener('change', () => {
      simState.qualifyingTimeScale = readQualifyingSpeedMultiplier();
      updateSimSessionFlowUI();
      if (simState.qualifyingRunning) {
        setSimStatus(`Qualifying running at x${simState.qualifyingTimeScale}.`);
      }
    });
  }

  btn.addEventListener('click', () => {
    if (!canStartSimPreview()) {
      showToast('At least 2 teams are required to start the Race.', 'info');
      return;
    }

    if (simState.qualifyingRunning) {
      showToast('Finish Qualifying first before starting Race.', 'info');
      return;
    }

    const currentRuns = buildSimTeamRuns(state.teams.slice(0, SIM_MAX_TEAMS_ON_TRACK));
    const isRaceUnlocked = canRaceStartWithGridSignature(currentRuns);

    if (!isRaceUnlocked) {
      simState.sessionPhase = SIM_SESSION_PHASES.QUALIFYING_PENDING;
      simState.qualifyingCompleted = false;
      simState.qualifyingTotalCars = currentRuns.length;
      simState.qualifyingFinishedCars = 0;
      simState.qualifiedGridSignature = null;
      simState.qualifyingGridOrder = [];
      setSimStatus('Complete Qualifying for all cars before starting the Race.');
      renderSimRacingPreview();
      showToast('Race is locked. Complete Qualifying first.', 'info');
      return;
    }

    if (simState.running) {
      stopSimRacingAnimation();
      setSimStatus('Race paused. Click Start Race to continue.');
      return;
    }

    startSimRacingAnimation();
    showToast('Race session started at 1x speed.', 'success');
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      stopSimRacingAnimation();
      stopSimQualifyingSession();
      resetSimSessionState();
      setSimResetButtonVisible(false);
      setSimResultsTabVisible(false);
      setSimQualifyingResultsTabVisible(false);
      renderSimRacingPreview();
      setSimStatus('Race reset. Run Qualifying first, then start Race.');
      showToast('Race has been reset.', 'success');
    });
  }

  simState.qualifyingTimeScale = readQualifyingSpeedMultiplier();
  resetSimSessionState();
  initSimDrsCoordinatePicker();
  setSimResetButtonVisible(false);
  setSimResultsTabVisible(false);
  setSimQualifyingResultsTabVisible(false);
  renderSimRacingPreview();
}

function initSimDrsCoordinatePicker() {
  const btnShow = document.getElementById('btnShowCoordinates');
  const btnCopy = document.getElementById('btnCopyCoordinates');
  const trackSvg = document.querySelector('#section-sim-racing .monza-track');
  if (!btnShow || !btnCopy || !trackSvg) return;

  // Toggle coordinate viewing mode
  btnShow.addEventListener('click', () => {
    simState.drsPickMode = simState.drsPickMode === 'view' ? null : 'view';
    updateSimDrsPickerUI();
    if (simState.drsPickMode === 'view') {
      setSimStatus('Coordinate viewer: click anywhere on track to see coordinates.');
    } else {
      setSimStatus('Coordinate viewer disabled.');
    }
  });

  // Copy last clicked coordinate
  btnCopy.addEventListener('click', async () => {
    const lastCoord = simState.drsDraftZone.startMarker;
    if (!lastCoord) {
      showToast('Click on track first to get coordinates.', 'info');
      return;
    }

    const coordText = `{ x: ${lastCoord.x}, y: ${lastCoord.y} }`;
    try {
      await navigator.clipboard.writeText(coordText);
      showToast('Coordinates copied to clipboard.', 'success');
    } catch (_error) {
      showToast('Could not copy automatically. Coordinate text is shown below.', 'warning');
    }
    setSimStatus(`Coordinates: ${coordText}`);
  });

  // Show coordinates on click
  trackSvg.addEventListener('click', event => {
    if (simState.drsPickMode !== 'view') return;
    const picked = getSvgCoordinateFromEvent(trackSvg, event);
    if (!picked) return;

    // Store last clicked coordinate
    simState.drsDraftZone.startMarker = picked;
    
    // Show coordinate in UI
    showToast(`Coordinates: (${picked.x}, ${picked.y})`, 'info');
    updateSimDrsPickerUI();
  });

  updateSimDrsPickerUI();
}

function getSvgCoordinateFromEvent(svg, event) {
  if (!svg || !event || typeof svg.createSVGPoint !== 'function') return null;
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;

  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const transformed = pt.matrixTransform(matrix.inverse());
  return {
    x: Number(transformed.x.toFixed(1)),
    y: Number(transformed.y.toFixed(1))
  };
}

function getPitBoxPositionForTeam(teamIndex, totalTeams) {
  // Calculate position along the line between SIM_PIT_BOX_START and SIM_PIT_BOX_END
  if (totalTeams <= 1) return SIM_PIT_BOX_START;
  
  const ratio = teamIndex / (totalTeams - 1);
  const x = SIM_PIT_BOX_START.x + (SIM_PIT_BOX_END.x - SIM_PIT_BOX_START.x) * ratio;
  const y = SIM_PIT_BOX_START.y + (SIM_PIT_BOX_END.y - SIM_PIT_BOX_START.y) * ratio;
  
  return { x, y };
}

function getPitBoxDistanceOnPath(pitPath, teamIndex, totalTeams) {
  if (!pitPath || typeof pitPath.getTotalLength !== 'function') return 0;
  
  const pitBoxPosition = getPitBoxPositionForTeam(teamIndex, totalTeams);
  const pitLength = pitPath.getTotalLength();
  
  // Find closest point on pit path to the pit box position
  let closestDistance = 0;
  let minDist = Infinity;
  
  for (let d = 0; d <= pitLength; d += 1) {
    const point = pitPath.getPointAtLength(d);
    const dist = Math.sqrt(
      Math.pow(point.x - pitBoxPosition.x, 2) + 
      Math.pow(point.y - pitBoxPosition.y, 2)
    );
    if (dist < minDist) {
      minDist = dist;
      closestDistance = d;
    }
  }
  
  return closestDistance;
}

function updateSimDrsPickerUI() {
  const btnShow = document.getElementById('btnShowCoordinates');
  const coordsDisplay = document.getElementById('simCoordinatesDisplay');
  const trackSvg = document.querySelector('#section-sim-racing .monza-track');

  const lastCoord = simState.drsDraftZone.startMarker;
  const isActive = simState.drsPickMode === 'view';
  
  let displayText = '';
  if (isActive) {
    displayText = lastCoord 
      ? `Last clicked: (${lastCoord.x}, ${lastCoord.y}) - Click on track to update`
      : 'Click on track to see coordinates';
  } else {
    displayText = lastCoord
      ? `Last coordinate: (${lastCoord.x}, ${lastCoord.y})`
      : 'Click "Show Coordinates" then click on track';
  }

  if (coordsDisplay) coordsDisplay.textContent = displayText;
  if (btnShow) {
    btnShow.classList.toggle('is-active', isActive);
    btnShow.textContent = isActive ? 'Hide Coordinates' : 'Show Coordinates';
  }
  if (trackSvg) trackSvg.classList.toggle('drs-pick-mode', isActive);
}

function canStartSimPreview() {
  return state.teams.length >= 2;
}

function getSimRunIdentityKey(run) {
  const teamId = run?.team?.id || 'TEAM';
  const driverId = run?.driver?.id || 'DRIVER';
  const tag = run?.tag || '';
  return `${teamId}:${driverId}:${tag}`;
}

function getSimGridSignature(runs) {
  if (!Array.isArray(runs) || runs.length === 0) return '';
  return runs
    .map(run => getSimRunIdentityKey(run))
    .join('|');
}

function canRaceStartWithGridSignature(currentRuns) {
  const currentSignature = getSimGridSignature(currentRuns);
  return (
    simState.qualifyingCompleted &&
    Boolean(simState.qualifiedGridSignature) &&
    simState.qualifiedGridSignature === currentSignature
  );
}

function readQualifyingSpeedMultiplier() {
  const speedInput = document.getElementById('simQualifyingSpeed');
  const parsed = Number(speedInput?.value);
  const safe = Number.isFinite(parsed) ? parsed : SIM_QUALIFYING_MIN_TIME_SCALE;
  return Math.max(SIM_QUALIFYING_MIN_TIME_SCALE, Math.min(SIM_QUALIFYING_MAX_TIME_SCALE, safe));
}

function getQualifiedRaceRuns(teamsOnGrid) {
  const runs = buildSimTeamRuns(teamsOnGrid);
  const order = Array.isArray(simState.qualifyingGridOrder) ? simState.qualifyingGridOrder : [];
  if (order.length === 0) return assignRaceGridSlots(runs);

  const orderMap = new Map(order.map((key, idx) => [key, idx]));
  const sorted = runs.slice().sort((a, b) => {
    const idxA = orderMap.has(getSimRunIdentityKey(a)) ? orderMap.get(getSimRunIdentityKey(a)) : Number.POSITIVE_INFINITY;
    const idxB = orderMap.has(getSimRunIdentityKey(b)) ? orderMap.get(getSimRunIdentityKey(b)) : Number.POSITIVE_INFINITY;
    if (idxA !== idxB) return idxA - idxB;
    return 0;
  });

  return assignRaceGridSlots(sorted);
}

function assignRaceGridSlots(runs) {
  if (!Array.isArray(runs)) return [];
  const center = (runs.length - 1) / 2;

  return runs.map((run, idx) => {
    const laneIndex = idx % 2 === 0
      ? SIM_RACE_GRID_POLE_LANE
      : SIM_RACE_GRID_SECOND_LANE;

    return {
      ...run,
      laneIndex,
      gridOffset: idx * SIM_RACE_GRID_STAGGER_GAP,
      uniqueLaneNudge: (idx - center) * 0.12
    };
  });
}

function resetSimSessionState() {
  simState.qualifyingRunning = false;
  simState.qualifyingRafId = null;
  simState.qualifyingStartTs = 0;
  simState.qualifyingLastTickTs = 0;
  simState.qualifyingElapsedSec = 0;
  simState.qualifyingRuns = [];
  simState.sessionPhase = SIM_SESSION_PHASES.QUALIFYING_PENDING;
  simState.qualifyingCompleted = false;
  simState.qualifyingTotalCars = 0;
  simState.qualifyingFinishedCars = 0;
  simState.qualifiedGridSignature = null;
  simState.qualifyingGridOrder = [];
  simState.pitExitDistance = null;
  simState.pitLaneLength = 0;
  updateQualifyingTimerUI();
}

function renderSimRacingPreview() {
  const btn = document.getElementById('btnSimRacing');
  const qualifyingBtn = document.getElementById('btnSimQualifying');
  const qualifyingSpeed = document.getElementById('simQualifyingSpeed');
  const status = document.getElementById('simStatus');
  const markerWrap = document.getElementById('monzaMarkers');
  const legend = document.getElementById('simTeamLegend');
  const raceDots = document.getElementById('monzaRaceDots');
  if (!btn || !status || !markerWrap || !legend) return;

  const ready = canStartSimPreview();
  const teamsOnGrid = state.teams.slice(0, SIM_MAX_TEAMS_ON_TRACK);
  const runs = buildSimTeamRuns(teamsOnGrid);
  const currentGridSignature = getSimGridSignature(runs);

  if (
    !simState.running &&
    !simState.qualifyingRunning &&
    simState.qualifyingCompleted &&
    simState.qualifiedGridSignature &&
    simState.qualifiedGridSignature !== currentGridSignature
  ) {
    simState.sessionPhase = SIM_SESSION_PHASES.QUALIFYING_PENDING;
    simState.qualifyingCompleted = false;
    simState.qualifyingFinishedCars = 0;
    simState.qualifiedGridSignature = null;
    simState.qualifyingGridOrder = [];
    setSimQualifyingResultsTabVisible(false);
  }

  if (!simState.running && !simState.qualifyingRunning && !simState.qualifyingCompleted) {
    simState.qualifyingTotalCars = runs.length;
  }

  const raceUnlocked = ready && canRaceStartWithGridSignature(runs);

  if (!simState.running && !simState.qualifyingRunning && raceUnlocked && simState.sessionPhase === SIM_SESSION_PHASES.QUALIFYING_PENDING) {
    simState.sessionPhase = SIM_SESSION_PHASES.RACE_READY;
  }

  btn.disabled = !ready || simState.qualifyingRunning || (!simState.running && !raceUnlocked);

  if (!ready) {
    stopSimRacingAnimation();
    stopSimQualifyingSession();
    resetSimSessionState();
    setSimResetButtonVisible(false);
    setSimResultsTabVisible(false);
    setSimQualifyingResultsTabVisible(false);
    btn.textContent = 'Start Race';
    status.textContent = 'At least 2 teams are required to build the Monza grid.';
    markerWrap.innerHTML = '';
    if (raceDots) raceDots.innerHTML = '';
    legend.innerHTML = '<span class="sim-status">Add 2 teams to show colored markers on the track.</span>';
    updateSimSessionFlowUI();
    return;
  }

  if (qualifyingBtn) {
    const qualifyingBusy = simState.qualifyingRunning;
    qualifyingBtn.disabled = simState.running;
    qualifyingBtn.textContent = qualifyingBusy ? 'Stop Qualifying' : 'Start Qualifying';
  }
  if (qualifyingSpeed) qualifyingSpeed.disabled = false;

  if (!simState.running && !simState.qualifyingRunning) {
    if (simState.sessionPhase === SIM_SESSION_PHASES.QUALIFYING_RUNNING) {
      status.textContent = `Qualifying running at x${simState.qualifyingTimeScale}.`;
    } else if (simState.sessionPhase === SIM_SESSION_PHASES.RACE_READY) {
      status.textContent = 'Qualifying complete. Race session is unlocked.';
    } else if (simState.sessionPhase === SIM_SESSION_PHASES.RACE_FINISHED) {
      status.textContent = 'Race finished. You can reset or run Qualifying again for a new session.';
    } else {
      status.textContent = `Monza grid is ready. Start Qualifying first, then Race (${SIM_POWER_UNIT_MAX} => ${SIM_MAX_SPEED_KMH} km/h).`;
    }
  }

  if (!simState.running && !simState.qualifyingRunning && simState.sessionPhase !== SIM_SESSION_PHASES.RACE_FINISHED) {
    setSimResetButtonVisible(false);
    setSimResultsTabVisible(false);
  }

  simState.teamsOnGrid = teamsOnGrid;
  if (!simState.running && !simState.qualifyingRunning) {
    simState.teamRuns = getQualifiedRaceRuns(teamsOnGrid);
  }

  const racePath = document.getElementById('monzaRaceLine');
  if (racePath) {
    simState.lapLength = racePath.getTotalLength();
    updateSimBrakeDistances(racePath, simState.lapLength);
    updateSimStartFinishDistance(racePath, simState.lapLength);
    updateSimDrsZones(racePath, simState.lapLength);
    simState.pitExitDistance = findClosestDistanceOnPath(
      racePath,
      SIM_PIT_EXIT_MARKER.x,
      SIM_PIT_EXIT_MARKER.y,
      simState.lapLength
    );
    simState.pitEntryDistance = findClosestDistanceOnPath(
      racePath,
      SIM_PIT_ENTRY_MARKER.x,
      SIM_PIT_ENTRY_MARKER.y,
      simState.lapLength
    );
  }

  const pitPath = document.getElementById('monzaPitLaneLine');
  if (pitPath && typeof pitPath.getTotalLength === 'function') {
    simState.pitLaneLength = pitPath.getTotalLength();
  }

  btn.textContent = simState.running ? 'Stop Race' : 'Start Race';
  markerWrap.innerHTML = renderSimDrsZoneBadges(simState.drsZones);
  if (simState.qualifyingRunning) {
    renderQualifyingDotsAtTime(simState.qualifyingElapsedSec, simState.lapLength);
  } else {
    renderRaceDotsAtTime(0);
  }
  updateSimSessionFlowUI();
}

function startSimQualifyingSession() {
  const racePath = document.getElementById('monzaRaceLine');
  const pitPath = document.getElementById('monzaPitLaneLine');
  if (!racePath || !pitPath) {
    showToast('Track path is missing. Cannot start Qualifying.', 'error');
    return;
  }

  stopSimRacingAnimation();
  stopSimQualifyingSession();

  // 🏎️ AUTO-OPTIMIZE WING SETUP FOR MONZA
  if (window.wingSetup && window.wingSetup.calculateOptimalSetupForMonza) {
    console.log('🔧 Auto-optimizing wing setup for Monza...');
    state.teams.forEach(team => {
      const teamDrivers = state.drivers.filter(d => String(d.teamId) === String(team.id));
      if (teamDrivers.length > 0) {
        const driver = teamDrivers[0]; // Use first driver for optimization
        const optimal = window.wingSetup.calculateOptimalSetupForMonza(team, driver);
        team.setup = {
          frontWing: optimal.frontWing,
          rearWing: optimal.rearWing
        };
        console.log(`  ✅ ${team.name}: Front ${optimal.frontWing}, Rear ${optimal.rearWing} (${optimal.confidence}% confidence)`);
      } else {
        // No driver, use default neutral setup
        team.setup = { frontWing: 50, rearWing: 50 };
      }
    });
    saveToStorage(); // Save optimized setups
  }

  simState.qualifyingTimeScale = readQualifyingSpeedMultiplier();
  simState.qualifyingDurationSec = SIM_QUALIFYING_DURATION_SEC;
  simState.qualifyingElapsedSec = 0;
  simState.qualifyingStartTs = performance.now();
  simState.qualifyingLastTickTs = simState.qualifyingStartTs;
  simState.qualifyingRunning = true;
  simState.sessionPhase = SIM_SESSION_PHASES.QUALIFYING_RUNNING;

  simState.lapLength = racePath.getTotalLength();
  simState.pitLaneLength = pitPath.getTotalLength();
  updateSimBrakeDistances(racePath, simState.lapLength);
  updateSimStartFinishDistance(racePath, simState.lapLength);
  updateSimDrsZones(racePath, simState.lapLength);
  simState.pitExitDistance = findClosestDistanceOnPath(
    racePath,
    SIM_PIT_EXIT_MARKER.x,
    SIM_PIT_EXIT_MARKER.y,
    simState.lapLength
  );
  simState.pitEntryDistance = findClosestDistanceOnPath(
    racePath,
    SIM_PIT_ENTRY_MARKER.x,
    SIM_PIT_ENTRY_MARKER.y,
    simState.lapLength
  );

  simState.teamsOnGrid = state.teams.slice(0, SIM_MAX_TEAMS_ON_TRACK);
  const baseRuns = buildSimTeamRuns(simState.teamsOnGrid);
  simState.qualifyingTotalCars = baseRuns.length;
  simState.qualifyingFinishedCars = 0;
  simState.qualifyingCompleted = false;
  simState.qualifiedGridSignature = getSimGridSignature(baseRuns);
  simState.qualifyingGridOrder = [];

  const totalTeams = baseRuns.length;
  
  // Group runs by team to assign same pit box for same team
  const teamPitBoxMap = new Map();
  let uniqueTeamIndex = 0;
  const uniqueTeams = [];
  
  baseRuns.forEach(run => {
    const teamId = run.team?.id || `team-${run.tag}`;
    if (!teamPitBoxMap.has(teamId)) {
      teamPitBoxMap.set(teamId, uniqueTeamIndex);
      uniqueTeams.push(teamId);
      uniqueTeamIndex++;
    }
  });
  
  const totalUniqueTeams = uniqueTeams.length;

  simState.qualifyingRuns = baseRuns.map((run, idx) => {
    const seed = run.driver?.seedId;
    
    // 🏎️ Use modified skills if available (from wing setup)
    const effectiveSkills = run.driver?._modifiedSkills || run.driver?.skills;
    const skillQualifying = effectiveSkills ? inferQualifyingSkill(effectiveSkills) : Number(run.driver?.skills?.qualifying);
    
    const mappedQualifying = seed ? Number(F1_2025_QUALIFYING_BY_SEED[seed]) : NaN;
    const qualifyingRating = Number.isFinite(skillQualifying) && skillQualifying > 0
      ? skillQualifying
      : (Number.isFinite(mappedQualifying) && mappedQualifying > 0 ? mappedQualifying : 75);

    // Calculate pit box position based on team (not individual driver)
    const teamId = run.team?.id || `team-${run.tag}`;
    const teamIndex = teamPitBoxMap.get(teamId);
    const pitBoxDistance = pitPath ? getPitBoxDistanceOnPath(pitPath, teamIndex, totalUniqueTeams) : 0;
    console.log(`🏁 ${run.tag} (Team ${teamId}): Pit box ${teamIndex + 1}/${totalUniqueTeams}, distance = ${pitBoxDistance.toFixed(2)}`);

    return {
    ...run,
    qualifyingRating,
    inPitLane: true,
    pitDistance: pitBoxDistance,
    pitBoxDistance: pitBoxDistance,
    releasedFromPit: false,
    releaseDelaySec: idx * SIM_QUALI_PIT_RELEASE_GAP_SEC,
    nextReleaseSec: idx * SIM_QUALI_PIT_RELEASE_GAP_SEC,
    qualiPhase: 'WAIT_PIT',
    currentDistance: simState.pitExitDistance || 0,
    currentSpeedKmh: SIM_QUALI_PIT_SPEED_KMH,
    currentPathSpeed: 0,
    outLapComplete: false,
    timedLapStartSec: null,
    lapTimesSec: [],
    bestLapSec: null,
    lastLapSec: null,
    hasTimedLap: false,
    ersBattery: getErsBatteryCapacityPercent(normalizeErsDeployRating(run.ersDeployRating)),
    ersActive: false,
    ersBoostKmh: 0,
    drsActive: false,
    drsZoneId: null,
    drsEndDistance: null
  };
  });

  setSimResetButtonVisible(false);
  setSimResultsTabVisible(false);
  setSimQualifyingResultsTabVisible(true);
  setSimStatus(`Qualifying running (15:00) at x${simState.qualifyingTimeScale}. Cars are leaving pit lane.`);
  updateQualifyingTimerUI();
  renderSimQualifyingResultsTab(simState.qualifyingRuns, simState.qualifyingElapsedSec, simState.qualifyingDurationSec);
  renderQualifyingDotsAtTime(simState.qualifyingElapsedSec, simState.lapLength);
  updateSimSessionFlowUI();

  const tick = now => {
    if (!simState.qualifyingRunning) return;

    const dtRealSec = Math.max(0, (now - simState.qualifyingLastTickTs) / 1000);
    simState.qualifyingLastTickTs = now;
    const dtSimSecRaw = dtRealSec * simState.qualifyingTimeScale;

    const remainingSec = Math.max(0, simState.qualifyingDurationSec - simState.qualifyingElapsedSec);
    const dtSimSec = Math.min(dtSimSecRaw, remainingSec);
    if (dtSimSec > 0) {
      const elapsedBefore = simState.qualifyingElapsedSec;
      advanceQualifyingRuns(dtSimSec, simState.lapLength, elapsedBefore);
      simState.qualifyingElapsedSec = elapsedBefore + dtSimSec;
    }

    updateQualifyingTimerUI();
    renderQualifyingDotsAtTime(simState.qualifyingElapsedSec, simState.lapLength);
    renderSimQualifyingResultsTab(simState.qualifyingRuns, simState.qualifyingElapsedSec, simState.qualifyingDurationSec);
    updateSimSessionFlowUI();

    if (simState.qualifyingElapsedSec >= simState.qualifyingDurationSec - 1e-6) {
      completeQualifyingSession();
      return;
    }

    simState.qualifyingRafId = requestAnimationFrame(tick);
  };

  simState.qualifyingRafId = requestAnimationFrame(tick);
}

function stopSimQualifyingSession() {
  if (simState.qualifyingRafId) cancelAnimationFrame(simState.qualifyingRafId);
  simState.qualifyingRafId = null;
  if (simState.qualifyingRunning && simState.sessionPhase === SIM_SESSION_PHASES.QUALIFYING_RUNNING) {
    simState.sessionPhase = SIM_SESSION_PHASES.QUALIFYING_PENDING;
  }
  simState.qualifyingRunning = false;
  simState.qualifyingLastTickTs = 0;
}

function completeQualifyingSession() {
  stopSimQualifyingSession();

  const runs = Array.isArray(simState.qualifyingRuns) ? simState.qualifyingRuns : [];
  const classified = getQualifyingClassification(runs);
  const finishedCount = runs.filter(run => run.hasTimedLap).length;
  simState.qualifyingFinishedCars = finishedCount;

  const allFinished = simState.qualifyingTotalCars > 0 && finishedCount === simState.qualifyingTotalCars;
  simState.qualifyingCompleted = allFinished;

  if (allFinished) {
    simState.qualifyingGridOrder = classified.map(run => getSimRunIdentityKey(run));
    simState.sessionPhase = SIM_SESSION_PHASES.RACE_READY;
    setSimStatus('Qualifying complete. All cars set a timed lap. Race session is unlocked.');
    showToast('Qualifying complete. Race unlocked.', 'success');
  } else {
    simState.qualifyingGridOrder = [];
    simState.qualifiedGridSignature = null;
    simState.sessionPhase = SIM_SESSION_PHASES.QUALIFYING_PENDING;
    setSimStatus('Qualifying ended but not all cars set a timed lap. Run Qualifying again.');
    showToast('Qualifying incomplete. Not all cars have timed laps.', 'warning');
  }

  setSimQualifyingResultsTabVisible(true);
  renderSimQualifyingResultsTab(runs, simState.qualifyingElapsedSec, simState.qualifyingDurationSec);
  renderSimRacingPreview();
}

function updateQualifyingTimerUI() {
  const timer = document.getElementById('simQualifyingTimer');
  if (!timer) return;

  const duration = Math.max(0, Number(simState.qualifyingDurationSec) || SIM_QUALIFYING_DURATION_SEC);
  const elapsed = Math.max(0, Number(simState.qualifyingElapsedSec) || 0);
  const left = Math.max(0, duration - elapsed);
  timer.textContent = `Q time left: ${formatLapTimeSec(left)}`;
}

function startSimRacingAnimation() {
  const path = document.getElementById('monzaRaceLine');
  if (!path) return;

  stopSimQualifyingSession();

  // 🏎️ AUTO-OPTIMIZE WING SETUP FOR MONZA (if not already optimized in qualifying)
  if (window.wingSetup && window.wingSetup.calculateOptimalSetupForMonza) {
    console.log('🔧 Auto-optimizing wing setup for Monza race...');
    state.teams.forEach(team => {
      // Only optimize if setup is still neutral (50/50)
      if (!team.setup || (team.setup.frontWing === 50 && team.setup.rearWing === 50)) {
        const teamDrivers = state.drivers.filter(d => String(d.teamId) === String(team.id));
        if (teamDrivers.length > 0) {
          const driver = teamDrivers[0];
          const optimal = window.wingSetup.calculateOptimalSetupForMonza(team, driver);
          team.setup = {
            frontWing: optimal.frontWing,
            rearWing: optimal.rearWing
          };
          console.log(`  ✅ ${team.name}: Front ${optimal.frontWing}, Rear ${optimal.rearWing} (${optimal.confidence}% confidence)`);
        } else {
          team.setup = { frontWing: 50, rearWing: 50 };
        }
      }
    });
    saveToStorage();
  }

  simState.speed = SIM_DEFAULT_SPEED;
  simState.startTs = performance.now();
  simState.lastTickTs = simState.startTs;
  simState.finishCounter = 0;
  simState.running = true;
  simState.sessionPhase = SIM_SESSION_PHASES.RACE_RUNNING;
  simState.teamsOnGrid = state.teams.slice(0, SIM_MAX_TEAMS_ON_TRACK);
  const qualifiedRuns = getQualifiedRaceRuns(simState.teamsOnGrid);
  simState.teamRuns = qualifiedRuns.map(run => {
    const launchSpeedKmh = Math.min(run.speedKmh, SIM_LAUNCH_SPEED_KMH);
    return {
      ...run,
      currentDistance: -run.gridOffset,
      currentPathSpeed: (launchSpeedKmh / SIM_MAX_SPEED_KMH) * SIM_BASE_PATH_SPEED * simState.speed,
      currentSpeedKmh: launchSpeedKmh,
      ersBattery: run.ersBatteryMax,
      drsActive: false,
      drsZoneId: null,
      drsEndDistance: null,
      drsTopSpeedKmh: run.speedKmh,
      ersActive: false,
      ersBoostKmh: 0,
      gapAheadSec: null,
      lapCrossings: 0,
      distanceTargetReached: false,
      distanceTargetReachedTimeSec: null,
      finishTimeSec: null,
      finishOrder: null,
      finishedRace: false
    };
  });
  simState.lapLength = path.getTotalLength();
  updateSimBrakeDistances(path, simState.lapLength);
  updateSimStartFinishDistance(path, simState.lapLength);
  updateSimDrsZones(path, simState.lapLength);

  const btn = document.getElementById('btnSimRacing');
  if (btn) btn.textContent = 'Stop Race';
  setSimResetButtonVisible(false);
  setSimResultsTabVisible(false);
  updateSimSessionFlowUI();

  setSimStatus('Race running. Cars use speed from Power Unit and can overtake.');
  renderRaceDotsAtTime(0);

  const tick = now => {
    if (!simState.running) return;

    const dtSec = Math.max(0, (now - simState.lastTickTs) / 1000);
    simState.lastTickTs = now;
    advanceSimRuns(dtSec, simState.lapLength);

    const elapsedSec = (now - simState.startTs) / 1000;
    renderRaceDotsAtTime(elapsedSec, simState.lapLength);

    const raceResults = getSimRaceResults(simState.lapLength, SIM_RACE_TOTAL_LAPS);
    if (raceResults) {
      stopSimRacingAnimation();
      simState.sessionPhase = SIM_SESSION_PHASES.RACE_FINISHED;
      setSimResetButtonVisible(true);
      renderSimResultsTab(raceResults, SIM_RACE_TOTAL_LAPS);
      setSimResultsTabVisible(true);
      const podium = raceResults.slice(0, 3);
      const podiumText = podium
        .map((run, idx) => `P${idx + 1} ${run.tag} (${getSimRunDisplayName(run)}) ${Number(run.finishTimeSec || 0).toFixed(3)}s`)
        .join(' · ');
      setSimStatus(`Race finished (${SIM_RACE_TOTAL_LAPS} laps). Podium: ${podiumText}`);
      updateSimSessionFlowUI();
      return;
    }

    if (simState.running) {
      simState.rafId = requestAnimationFrame(tick);
    }
  };

  simState.rafId = requestAnimationFrame(tick);
}

function stopSimRacingAnimation() {
  if (simState.rafId) cancelAnimationFrame(simState.rafId);
  simState.rafId = null;
  if (simState.running && simState.sessionPhase === SIM_SESSION_PHASES.RACE_RUNNING) {
    simState.sessionPhase = SIM_SESSION_PHASES.RACE_READY;
  }
  simState.running = false;
  simState.lastTickTs = 0;

  const btn = document.getElementById('btnSimRacing');
  if (btn) btn.textContent = 'Start Race';
  updateSimSessionFlowUI();
}

function advanceQualifyingRuns(dtSec, lapLength, elapsedBeforeStepSec) {
  if (!dtSec || dtSec <= 0 || !lapLength || !Array.isArray(simState.qualifyingRuns)) return;
  const finishLineDistance = simState.startFinishDistance;

  simState.qualifyingRuns.forEach(run => {
    let activeDt = dtSec;

    if (run.qualiPhase === 'WAIT_PIT') {
      const timeToRelease = (Number(run.nextReleaseSec) || 0) - elapsedBeforeStepSec;
      if (timeToRelease > dtSec) {
        run.currentSpeedKmh = 0;
        run.currentPathSpeed = 0;
        run.ersActive = false;
        run.ersBoostKmh = 0;
        run.drsActive = false;
        run.drsZoneId = null;
        run.drsEndDistance = null;
        return;
      }
      run.releasedFromPit = true;
      run.qualiPhase = 'OUTLAP';
      run.inPitLane = true;
      run.pitDistance = Number(run.pitBoxDistance) || 0;
      run.outLapComplete = false;
      activeDt = Math.max(0, dtSec - Math.max(0, timeToRelease));
    }

    if (activeDt <= 0) return;

    // Handle RETURNING_TO_PIT phase - car drives forward to its pit box
    if (run.qualiPhase === 'RETURNING_TO_PIT' && run.inPitLane) {
      const pitSpeedKmh = SIM_QUALI_PIT_SPEED_KMH;
      const pitPathSpeed = (pitSpeedKmh / SIM_MAX_SPEED_KMH) * SIM_BASE_PATH_SPEED;
      run.currentSpeedKmh = pitSpeedKmh;
      run.currentPathSpeed = pitPathSpeed;
      
      // Drive forward towards pit box
      const targetPitBox = Number(run.pitBoxDistance) || 0;
      const currentPitDist = Number(run.pitDistance) || 0;
      
      if (currentPitDist < targetPitBox) {
        // Still need to go forward to pit box
        run.pitDistance = Math.min(targetPitBox, currentPitDist + pitPathSpeed * activeDt);
      } else {
        // Reached or passed pit box, stop and wait 30 seconds
        run.pitDistance = targetPitBox;
        run.qualiPhase = 'PIT_STOP';
        run.pitStopStartTime = elapsedBeforeStepSec;
        run.pitStopDuration = 30; // 30 seconds pit stop
        run.currentSpeedKmh = 0;
        run.currentPathSpeed = 0;
        console.log(`🏁 ${run.tag} reached pit box at pitDistance=${targetPitBox.toFixed(2)}, starting 30s pit stop`);
      }
      return;
    }

    // Handle PIT_STOP phase - car waits in pit box
    if (run.qualiPhase === 'PIT_STOP' && run.inPitLane) {
      const pitStopElapsed = elapsedBeforeStepSec - (run.pitStopStartTime || 0);
      const pitStopDuration = run.pitStopDuration || 30;
      
      if (pitStopElapsed >= pitStopDuration) {
        // Pit stop complete, ready to release
        run.qualiPhase = 'WAIT_PIT';
        run.outLapComplete = false;
        run.timedLapStartSec = null;
        run.nextReleaseSec = elapsedBeforeStepSec + SIM_QUALI_PIT_RELEASE_GAP_SEC;
        console.log(`🏁 ${run.tag} pit stop complete after ${pitStopElapsed.toFixed(1)}s, will release at ${run.nextReleaseSec.toFixed(1)}s`);
      } else {
        // Still in pit stop, remain stationary
        run.currentSpeedKmh = 0;
        run.currentPathSpeed = 0;
      }
      return;
    }

    if (run.inPitLane) {
      const pitSpeedKmh = SIM_QUALI_PIT_SPEED_KMH;
      const pitPathSpeed = (pitSpeedKmh / SIM_MAX_SPEED_KMH) * SIM_BASE_PATH_SPEED;
      run.currentSpeedKmh = pitSpeedKmh;
      run.currentPathSpeed = pitPathSpeed;
      run.ersActive = false;
      run.ersBoostKmh = 0;
      run.drsActive = false;
      run.drsZoneId = null;
      run.drsEndDistance = null;
      run.pitDistance = Math.min(simState.pitLaneLength, (Number(run.pitDistance) || 0) + pitPathSpeed * activeDt);

      if ((Number(run.pitDistance) || 0) >= simState.pitLaneLength - 1e-6) {
        run.inPitLane = false;
        run.currentDistance = Number(simState.pitExitDistance) || 0;
      }
      return;
    }

    if (typeof run.currentDistance !== 'number') {
      run.currentDistance = Number(simState.pitExitDistance) || 0;
    }

    const previousDistanceOnLap = ((run.currentDistance % lapLength) + lapLength) % lapLength;
    const currentSpeed = Math.max(0, Number(run.currentSpeedKmh) || 0);

    const ersDeployRating = normalizeErsDeployRating(run.ersDeployRating);
    const ersBatteryMax = getErsBatteryCapacityPercent(ersDeployRating);
    const currentBattery = clampSimBattery(run.ersBattery ?? ersBatteryMax, ersBatteryMax);
    const drsActiveForStep = Boolean(run.drsActive);
    const drsTopSpeedMultiplier = drsActiveForStep ? getDrsTopSpeedMultiplier(run.powerUnit) : 1;
    const drsTopSpeedKmh = run.speedKmh * drsTopSpeedMultiplier;
    const qualifyingSpeedBoostKmh = getQualifyingSpeedBoostKmh(run.qualifyingRating);
    const qualifyingAccelMultiplier = getQualifyingAccelMultiplier(run.qualifyingRating);
    const shouldDeployErs =
      run.qualiPhase === 'TIMED' &&
      currentBattery > SIM_ERS_MIN_BATTERY_TO_DEPLOY &&
      currentSpeed > SIM_QUALI_ERS_MIN_SPEED_KMH;

    const ersBoostKmh = shouldDeployErs ? getErsBoostKmh(ersDeployRating) : 0;
    const baseTargetSpeedKmh = drsTopSpeedKmh + ersBoostKmh + qualifyingSpeedBoostKmh;
    const targetSpeedKmh = getBrakeTargetSpeedKmh(baseTargetSpeedKmh, previousDistanceOnLap, lapLength, run);

    const referencePathSpeed = Math.max(run.currentPathSpeed || run.pathSpeed, 0.05);
    const adaptiveDecel = getRequiredBrakeDecelKmhPerSec(currentSpeed, previousDistanceOnLap, referencePathSpeed, lapLength, run);
    const decelRate = Math.max(SIM_BRAKE_DECEL_KMH_PER_SEC, adaptiveDecel);
    const decelStep = decelRate * activeDt;
    const accelMultiplier =
      qualifyingAccelMultiplier +
      (drsActiveForStep ? SIM_DRS_ACCEL_MULTIPLIER : 1) +
      (shouldDeployErs ? (SIM_ERS_ACCEL_MULTIPLIER * SIM_QUALI_ERS_EXTRA_ACCEL_MULTIPLIER) : 1);
    const accelStep = SIM_ACCEL_KMH_PER_SEC * accelMultiplier * activeDt;

    let nextSpeed = currentSpeed;
    if (targetSpeedKmh < currentSpeed) {
      nextSpeed = Math.max(targetSpeedKmh, currentSpeed - decelStep);
    } else if (targetSpeedKmh > currentSpeed) {
      nextSpeed = Math.min(targetSpeedKmh, currentSpeed + accelStep);
    }

    let nextBattery = currentBattery;
    if (shouldDeployErs) {
      nextBattery -= getErsDrainRatePercentPerSec(ersDeployRating) * activeDt;
    } else {
      nextBattery += getErsChargeRatePercentPerSec(ersDeployRating) * activeDt;
    }
    nextBattery = clampSimBattery(nextBattery, ersBatteryMax);

    run.currentSpeedKmh = nextSpeed;
    run.currentPathSpeed = (nextSpeed / SIM_MAX_SPEED_KMH) * SIM_BASE_PATH_SPEED * simState.speed;
    run.currentDistance += run.currentPathSpeed * activeDt;
    run.ersBattery = nextBattery;
    run.ersActive = shouldDeployErs && nextBattery > SIM_ERS_MIN_BATTERY_TO_DEPLOY;
    run.ersBoostKmh = run.ersActive ? ersBoostKmh : 0;
    run.drsTopSpeedKmh = drsTopSpeedKmh;

    const nextDistanceOnLap = ((run.currentDistance % lapLength) + lapLength) % lapLength;

    // Check if car in RETURNING_TO_PIT phase reaches pit entry point
    if (run.qualiPhase === 'RETURNING_TO_PIT' && !run.inPitLane && typeof simState.pitEntryDistance === 'number') {
      const crossedPitEntry = hasCrossedDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, simState.pitEntryDistance, lapLength);
      if (crossedPitEntry) {
        // Car enters pit lane from pit entry
        console.log(`🏁 ${run.tag} crossed pit entry at ${simState.pitEntryDistance.toFixed(2)}, entering pitlane from START (pitDistance=0)`);
        run.inPitLane = true;
        run.pitDistance = 0; // Start from beginning of pit lane (pit entry)
        run.currentSpeedKmh = SIM_QUALI_PIT_SPEED_KMH;
      }
    }

    if (!run.drsActive && Array.isArray(simState.drsZones) && simState.drsZones.length > 0) {
      const activationZone = simState.drsZones.find(zone =>
        hasCrossedDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, zone.startDistance, lapLength)
      ) || null;
      if (activationZone) {
        run.drsActive = true;
        run.drsZoneId = activationZone.id || 'DRS';
        run.drsEndDistance = activationZone.endDistance;
      }
    }

    if (run.drsActive && typeof run.drsEndDistance === 'number') {
      const crossedDrsEnd = hasCrossedDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, run.drsEndDistance, lapLength);
      if (crossedDrsEnd) {
        run.drsActive = false;
        run.drsZoneId = null;
        run.drsEndDistance = null;
      }
    }

    if (typeof finishLineDistance !== 'number') return;

    const crossedFinish = hasCrossedDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, finishLineDistance, lapLength);
    if (!crossedFinish) return;

    const traveledOnLap = Math.max(
      getForwardDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, lapLength),
      1e-6
    );
    const distanceToLine = getForwardDistanceOnLap(previousDistanceOnLap, finishLineDistance, lapLength);
    const crossingFraction = Math.max(0, Math.min(1, distanceToLine / traveledOnLap));
    const crossingTimeSec = elapsedBeforeStepSec + activeDt * crossingFraction;

    if (run.qualiPhase === 'OUTLAP') {
      run.outLapComplete = true;
      run.qualiPhase = 'TIMED';
      run.timedLapStartSec = crossingTimeSec;
      return;
    }

    if (run.qualiPhase !== 'TIMED') return;

    if (!Number.isFinite(run.timedLapStartSec)) {
      run.timedLapStartSec = crossingTimeSec;
      return;
    }

    const lapTimeSec = crossingTimeSec - Number(run.timedLapStartSec);
    if (!(lapTimeSec > 0)) {
      run.timedLapStartSec = crossingTimeSec;
      return;
    }

    run.lapTimesSec.push(lapTimeSec);
    run.lastLapSec = lapTimeSec;
    run.bestLapSec = Number.isFinite(run.bestLapSec)
      ? Math.min(Number(run.bestLapSec), lapTimeSec)
      : lapTimeSec;
    run.timedLapStartSec = null;
    
    // After finishing timed lap, car does cooldown lap on track before entering pit
    run.qualiPhase = 'RETURNING_TO_PIT';
    run.inPitLane = false; // Still on track
    run.drsActive = false;
    run.drsZoneId = null;
    run.drsEndDistance = null;
    run.ersActive = false;
    run.ersBoostKmh = 0;
    
    console.log(`🏁 ${run.tag} finished timed lap, starting cooldown lap. inPitLane=${run.inPitLane}, currentDistance=${run.currentDistance.toFixed(2)}`);
    
    if (!run.hasTimedLap) run.hasTimedLap = true;
  });

  simState.qualifyingFinishedCars = simState.qualifyingRuns.filter(run => run.hasTimedLap).length;
}

function renderQualifyingDotsAtTime(elapsedSec, cachedLapLength) {
  const racePath = document.getElementById('monzaRaceLine');
  const pitPath = document.getElementById('monzaPitLaneLine');
  const dotsLayer = document.getElementById('monzaRaceDots');
  if (!racePath || !pitPath || !dotsLayer) return;

  const lapLength = cachedLapLength || racePath.getTotalLength();
  const pitLength = Math.max(1e-6, Number(simState.pitLaneLength) || pitPath.getTotalLength());
  if (!simState.drsZones.length) {
    updateSimDrsZones(racePath, lapLength);
  }

  const drsZoneMarkup = renderSimDrsZonesMarkup(racePath, lapLength, simState.drsZones);
  const runs = Array.isArray(simState.qualifyingRuns) ? simState.qualifyingRuns : [];
  const laneCenter = (SIM_LANE_COUNT - 1) / 2;

  const markup = runs.map(run => {
    const teamTag = run.tag;
    let point;

    if (run.qualiPhase === 'WAIT_PIT') {
      const pitDistance = Math.max(0, Math.min(pitLength, Number(run.pitBoxDistance) || 0));
      point = pitPath.getPointAtLength(pitDistance);
    } else if (run.inPitLane) {
      const pitDistance = Math.max(0, Math.min(pitLength, Number(run.pitDistance) || 0));
      point = pitPath.getPointAtLength(pitDistance);
    } else {
      const laneOffset = (run.laneIndex - laneCenter) * SIM_LANE_SPACING + run.uniqueLaneNudge;
      const wrappedDistance = ((Number(run.currentDistance) || 0) % lapLength + lapLength) % lapLength;
      point = getPointWithLaneOffset(racePath, wrappedDistance, laneOffset, lapLength);
    }

    const offsetY = (run.laneIndex - laneCenter) * 1.8;
    const x = point.x;
    const y = point.y + offsetY;
    const labelX = x + SIM_DOT_RADIUS + 3;
    const labelY = y - (SIM_DOT_RADIUS + 2);
    const lapCount = Array.isArray(run.lapTimesSec) ? run.lapTimesSec.length : 0;
    const status = run.qualiPhase === 'WAIT_PIT'
      ? 'WAIT PIT'
      : (run.qualiPhase === 'RETURNING_TO_PIT'
        ? 'RETURN PIT'
        : (run.qualiPhase === 'PIT_STOP'
          ? 'PIT STOP'
          : (run.inPitLane
            ? 'PIT OUT'
            : (run.qualiPhase === 'TIMED'
              ? `TIMED (${lapCount})`
              : (run.qualiPhase === 'COOLDOWN' ? 'COOLDOWN' : 'OUTLAP')))));
    const speed = Math.round(Number(run.currentSpeedKmh) || 0);
    const bestText = Number.isFinite(run.bestLapSec) ? formatLapTimeSec(run.bestLapSec) : '--:--.---';

    return `
      <g class="sim-race-marker">
        <title>${escHtml(run.tag)} (${escHtml(run.team.name)}) · ${status} · ${speed} km/h · BEST ${bestText}</title>
        <circle class="sim-race-dot" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${SIM_DOT_RADIUS}" fill="${run.team.color}"></circle>
        <text class="sim-race-tag" x="${labelX.toFixed(2)}" y="${labelY.toFixed(2)}">${escHtml(teamTag)}</text>
      </g>
    `;
  }).join('');

  dotsLayer.innerHTML = `${drsZoneMarkup}${markup}`;
  renderQualifyingDriverTiming(runs, elapsedSec, lapLength);
}

function renderQualifyingDriverTiming(runs, elapsedSec, lapLength) {
  const legend = document.getElementById('simTeamLegend');
  if (!legend) return;

  if (!Array.isArray(runs) || runs.length === 0) {
    legend.innerHTML = '<span class="sim-status">No qualifying run data.</span>';
    return;
  }

  const ordered = getQualifyingClassification(runs);
  legend.innerHTML = ordered.map((run, idx) => {
    const best = Number.isFinite(run.bestLapSec) ? formatLapTimeSec(run.bestLapSec) : '--:--.---';
    const last = Number.isFinite(run.lastLapSec) ? formatLapTimeSec(run.lastLapSec) : '--:--.---';
    const lapCount = Array.isArray(run.lapTimesSec) ? run.lapTimesSec.length : 0;
    const status = run.qualiPhase === 'WAIT_PIT'
      ? 'WAIT PIT'
      : (run.qualiPhase === 'RETURNING_TO_PIT'
        ? 'RETURN PIT'
        : (run.qualiPhase === 'PIT_STOP'
          ? 'PIT STOP'
          : (run.inPitLane
            ? 'PIT OUT'
            : (run.qualiPhase === 'TIMED'
              ? `TIMED (${lapCount})`
              : (run.qualiPhase === 'COOLDOWN' ? 'COOLDOWN' : 'OUTLAP')))));

    return `
      <span class="sim-legend-item">
        <span class="sim-legend-dot" style="background:${run.team.color}"></span>
        <span>P${idx + 1} · ${escHtml(run.tag)} · ${escHtml(getSimRunDisplayName(run))} · ${status} · BEST ${best} · LAST ${last}</span>
      </span>
    `;
  }).join('');
}

function getQualifyingClassification(runs) {
  if (!Array.isArray(runs)) return [];
  return runs.slice().sort((a, b) => {
    const aHasTime = Number.isFinite(a.bestLapSec);
    const bHasTime = Number.isFinite(b.bestLapSec);
    if (aHasTime && bHasTime) {
      const diff = Number(a.bestLapSec) - Number(b.bestLapSec);
      if (Math.abs(diff) > 1e-6) return diff;
      const lastDiff = Number(a.lastLapSec || Number.POSITIVE_INFINITY) - Number(b.lastLapSec || Number.POSITIVE_INFINITY);
      if (Math.abs(lastDiff) > 1e-6) return lastDiff;
      return String(a.tag).localeCompare(String(b.tag));
    }
    if (aHasTime) return -1;
    if (bHasTime) return 1;
    return String(a.tag).localeCompare(String(b.tag));
  });
}

function renderSimQualifyingResultsTab(runs, elapsedSec, durationSec) {
  const body = document.getElementById('simQualifyingBody');
  const meta = document.getElementById('simQualifyingMeta');
  if (!body || !meta) return;

  const list = Array.isArray(runs) ? runs : [];
  if (list.length === 0) {
    body.innerHTML = '<tr class="empty-row"><td colspan="5">No qualifying lap recorded yet.</td></tr>';
    meta.textContent = '';
    return;
  }

  const classified = getQualifyingClassification(list);
  const finished = classified.filter(run => run.hasTimedLap).length;
  const total = classified.length;
  const elapsedText = formatLapTimeSec(Math.max(0, Number(elapsedSec) || 0));
  const durationText = formatLapTimeSec(Math.max(0, Number(durationSec) || SIM_QUALIFYING_DURATION_SEC));
  meta.textContent = `${finished}/${total} cars have timed laps · ${elapsedText} / ${durationText}`;

  body.innerHTML = classified.map((run, idx) => {
    const best = Number.isFinite(run.bestLapSec) ? formatLapTimeSec(run.bestLapSec) : '--:--.---';
    const last = Number.isFinite(run.lastLapSec) ? formatLapTimeSec(run.lastLapSec) : '--:--.---';

    return `
      <tr>
        <td>P${idx + 1}</td>
        <td>${escHtml(run.tag)}</td>
        <td>${escHtml(getSimRunDisplayName(run))}</td>
        <td>${best}</td>
        <td>${last}</td>
      </tr>
    `;
  }).join('');
}

function renderRaceDotsAtTime(elapsedSec, cachedLapLength) {
  const path = document.getElementById('monzaRaceLine');
  const dotsLayer = document.getElementById('monzaRaceDots');
  if (!path || !dotsLayer) return;

  const lapLength = cachedLapLength || path.getTotalLength();
  if (!simState.drsZones.length) {
    updateSimDrsZones(path, lapLength);
  }
  const drsZoneMarkup = renderSimDrsZonesMarkup(path, lapLength, simState.drsZones);

  const runs = simState.teamRuns.length > 0
    ? simState.teamRuns
    : buildSimTeamRuns(state.teams.slice(0, SIM_MAX_TEAMS_ON_TRACK));
  const visibleRuns = runs.filter(run => !run.finishedRace);

  if (visibleRuns.length < 1) {
    dotsLayer.innerHTML = drsZoneMarkup;
    renderSimDriverTiming(runs, elapsedSec, lapLength);
    return;
  }
  const laneCenter = (SIM_LANE_COUNT - 1) / 2;
  const raceDotMarkup = visibleRuns.map(run => {
    const laneOffset = (run.laneIndex - laneCenter) * SIM_LANE_SPACING + run.uniqueLaneNudge;
    const rawDistance = typeof run.currentDistance === 'number'
      ? run.currentDistance
      : (elapsedSec * run.pathSpeed - run.gridOffset);
    const wrappedDistance = ((rawDistance % lapLength) + lapLength) % lapLength;
    const point = getPointWithLaneOffset(path, wrappedDistance, laneOffset, lapLength);
    const teamTag = run.tag;
    const labelX = point.x + SIM_DOT_RADIUS + 3;
    const labelY = point.y - (SIM_DOT_RADIUS + 2);
    const currentSpeed = run.currentSpeedKmh ?? run.speedKmh;
    const batteryMax = Number(run.ersBatteryMax) || SIM_ERS_BATTERY_START;
    const battery = clampSimBattery(run.ersBattery ?? batteryMax, batteryMax);
    const drsState = run.drsActive ? `DRS ON ${run.drsZoneId || ''}`.trim() : 'DRS OFF';
    const ersState = run.ersActive ? `ERS ON +${Math.round(run.ersBoostKmh || 0)} km/h` : 'ERS OFF';

    return `
      <g class="sim-race-marker">
        <title>${escHtml(run.tag)} (${escHtml(run.team.name)}) · ${Math.round(currentSpeed)} km/h · ${drsState} · ${ersState} · BAT ${battery.toFixed(1)}%</title>
        <circle class="sim-race-dot" cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="${SIM_DOT_RADIUS}" fill="${run.team.color}"></circle>
        <text class="sim-race-tag" x="${labelX.toFixed(2)}" y="${labelY.toFixed(2)}">${escHtml(teamTag)}</text>
      </g>
    `;
  }).join('');

  dotsLayer.innerHTML = `${drsZoneMarkup}${raceDotMarkup}`;

  renderSimDriverTiming(runs, elapsedSec, lapLength);
}

function getSimRunDisplayName(run) {
  if (run.driver) return `${run.driver.first} ${run.driver.last}`;
  return `${run.tag} (${run.team.name})`;
}

function renderSimDriverTiming(runs, elapsedSec, lapLength) {
  const legend = document.getElementById('simTeamLegend');
  if (!legend || !Array.isArray(runs) || runs.length === 0 || !lapLength) return;

  const ordered = runs.map(run => {
    const rawDistance = typeof run.currentDistance === 'number'
      ? run.currentDistance
      : (elapsedSec * run.pathSpeed - run.gridOffset);
    return {
      run,
      rawDistance
    };
  }).sort((a, b) => b.rawDistance - a.rawDistance);

  legend.innerHTML = ordered.map((entry, idx) => {
    let timing = 'Leader';
    if (idx > 0) {
      const ahead = ordered[idx - 1];
      const intervalDistance = Math.max(0, ahead.rawDistance - entry.rawDistance);
      const intervalSpeed = Math.max(entry.run.currentPathSpeed || entry.run.pathSpeed, 0.0001);
      const intervalSec = intervalDistance / intervalSpeed;
      timing = `INT +${intervalSec.toFixed(3)}s`;
    }
    const progressDistance = Math.max(0, entry.rawDistance + (Number(entry.run.gridOffset) || 0));
    const lap = Math.max(1, Math.floor(progressDistance / lapLength) + 1);
    const runPathSpeed = Math.max(entry.run.currentPathSpeed || entry.run.pathSpeed, 0.0001);
    const lapTime = lapLength / runPathSpeed;
    const shownSpeed = Math.round(entry.run.currentSpeedKmh || entry.run.speedKmh);
    const ersBatteryMax = Number(entry.run.ersBatteryMax) || SIM_ERS_BATTERY_START;
    const ersBattery = clampSimBattery(entry.run.ersBattery ?? ersBatteryMax, ersBatteryMax);
    const drsLabel = entry.run.drsActive
      ? `DRS ON (${entry.run.drsZoneId || 'ZONE'})`
      : 'DRS OFF';
    const ersLabel = entry.run.ersActive
      ? `ERS ON (+${Math.round(entry.run.ersBoostKmh || 0)})`
      : 'ERS OFF';

    return `
      <span class="sim-legend-item">
        <span class="sim-legend-dot" style="background:${entry.run.team.color}"></span>
        <span>P${idx + 1} · ${escHtml(entry.run.tag)} · ${escHtml(getSimRunDisplayName(entry.run))} · ${timing} · ${shownSpeed} km/h · BAT ${ersBattery.toFixed(1)}% · ${drsLabel} · ${ersLabel} · L${lap} · ${lapTime.toFixed(2)}s/lap</span>
      </span>
    `;
  }).join('');
}

function updateSimBrakeDistances(path, lapLength) {
  if (!path || !lapLength) return;
  simState.turn1Distance = findClosestDistanceOnPath(path, SIM_TURN1_MARKER.x, SIM_TURN1_MARKER.y, lapLength);
  simState.turn2Distance = findClosestDistanceOnPath(path, SIM_TURN2_MARKER.x, SIM_TURN2_MARKER.y, lapLength);
  simState.turn4Distance = findClosestDistanceOnPath(path, SIM_TURN4_MARKER.x, SIM_TURN4_MARKER.y, lapLength);
  simState.turn6Distance = findClosestDistanceOnPath(path, SIM_TURN6_MARKER.x, SIM_TURN6_MARKER.y, lapLength);
  simState.turn7Distance = findClosestDistanceOnPath(path, SIM_TURN7_MARKER.x, SIM_TURN7_MARKER.y, lapLength);
  simState.turn8Distance = findClosestDistanceOnPath(path, SIM_TURN8_MARKER.x, SIM_TURN8_MARKER.y, lapLength);
  simState.turn9Distance = findClosestDistanceOnPath(path, SIM_TURN9_MARKER.x, SIM_TURN9_MARKER.y, lapLength);
  simState.turn10Distance = findClosestDistanceOnPath(path, SIM_TURN10_MARKER.x, SIM_TURN10_MARKER.y, lapLength);
  simState.turn11Distance = findClosestDistanceOnPath(path, SIM_TURN11_MARKER.x, SIM_TURN11_MARKER.y, lapLength);
}

function updateSimStartFinishDistance(path, lapLength) {
  if (!path || !lapLength) {
    simState.startFinishDistance = null;
    return;
  }
  simState.startFinishDistance = findClosestDistanceOnPath(
    path,
    SIM_START_FINISH_MARKER.x,
    SIM_START_FINISH_MARKER.y,
    lapLength
  );
}

function updateSimDrsZones(path, lapLength) {
  if (!path || !lapLength) {
    simState.drsZones = [];
    return;
  }

  const zoneDefs = SIM_DRS_ZONE_CONFIGS.slice();
  if (simState.drsDraftZone.startMarker && simState.drsDraftZone.endMarker) {
    zoneDefs.unshift({
      id: 'DRS DRAFT',
      startMarker: simState.drsDraftZone.startMarker,
      endMarker: simState.drsDraftZone.endMarker
    });
  }

  simState.drsZones = zoneDefs.map(zone => {
    const startDistance = findClosestDistanceOnPath(path, zone.startMarker.x, zone.startMarker.y, lapLength);
    const endDistance = findClosestDistanceOnPath(path, zone.endMarker.x, zone.endMarker.y, lapLength);
    const zoneLength = getForwardDistanceOnLap(startDistance, endDistance, lapLength);
    return {
      ...zone,
      startDistance,
      endDistance,
      zoneLength
    };
  }).filter(zone => zone.zoneLength > 1);
}

function renderSimDrsZoneBadges(zones) {
  if (!Array.isArray(zones) || zones.length === 0) {
    return '<span class="sim-drs-chip">No DRS zone configured</span>';
  }

  return zones.map(zone => {
    const zoneLength = Math.round(Number(zone.zoneLength) || 0);
    return `<span class="sim-drs-chip">${escHtml(zone.id)} ACTIVE · LEN ${zoneLength}</span>`;
  }).join('');
}

function renderSimDrsZonesMarkup(path, lapLength, zones) {
  if (!path || !lapLength || !Array.isArray(zones) || zones.length === 0) return '';

  return zones.map(zone => {
    const startDistance = ((zone.startDistance % lapLength) + lapLength) % lapLength;
    const zoneLength = Math.max(0.1, Number(zone.zoneLength) || 0.1);
    const endDistance = (startDistance + zoneLength) % lapLength;
    const midDistance = (startDistance + zoneLength * 0.5) % lapLength;

    const startPoint = path.getPointAtLength(startDistance);
    const endPoint = path.getPointAtLength(endDistance);
    const labelPoint = path.getPointAtLength(midDistance);
    const polylinePoints = buildPathSegmentPolyline(
      path,
      startDistance,
      zoneLength,
      lapLength,
      SIM_DRS_OVERLAY_SAMPLE_SPACING
    );

    return `
      <g class="sim-drs-zone" aria-label="${escHtml(zone.id)} activation zone">
        <polyline class="sim-drs-zone-line" points="${polylinePoints}"></polyline>
        <circle class="sim-drs-zone-node sim-drs-zone-start" cx="${startPoint.x.toFixed(2)}" cy="${startPoint.y.toFixed(2)}" r="3"></circle>
        <circle class="sim-drs-zone-node sim-drs-zone-end" cx="${endPoint.x.toFixed(2)}" cy="${endPoint.y.toFixed(2)}" r="3"></circle>
        <text class="sim-drs-zone-label" x="${labelPoint.x.toFixed(2)}" y="${(labelPoint.y - 8).toFixed(2)}">${escHtml(zone.id)}</text>
      </g>
    `;
  }).join('');
}

function buildPathSegmentPolyline(path, startDistance, segmentLength, lapLength, stepDistance) {
  const distance = Math.max(0.1, Number(segmentLength) || 0.1);
  const step = Math.max(2, Number(stepDistance) || 8);
  const sampleCount = Math.max(6, Math.ceil(distance / step));
  const points = [];

  for (let i = 0; i <= sampleCount; i++) {
    const traveled = (distance * i) / sampleCount;
    const sampleDistance = (startDistance + traveled) % lapLength;
    const point = path.getPointAtLength(sampleDistance);
    points.push(`${point.x.toFixed(2)},${point.y.toFixed(2)}`);
  }

  return points.join(' ');
}

function findClosestDistanceOnPath(path, targetX, targetY, lapLength) {
  let bestDistance = 0;
  let bestScore = Number.POSITIVE_INFINITY;
  const samples = Math.max(600, Math.floor(lapLength * 2));

  for (let i = 0; i <= samples; i++) {
    const distance = (lapLength * i) / samples;
    const p = path.getPointAtLength(distance);
    const dx = p.x - targetX;
    const dy = p.y - targetY;
    const score = dx * dx + dy * dy;
    if (score < bestScore) {
      bestScore = score;
      bestDistance = distance;
    }
  }

  return bestDistance;
}

function isDistanceInsideWindow(distanceOnLap, centerDistance, halfWindow, lapLength) {
  if (centerDistance == null || !lapLength) return false;
  const diff = Math.abs(distanceOnLap - centerDistance);
  const wrappedDiff = Math.min(diff, lapLength - diff);
  return wrappedDiff <= halfWindow;
}

function getForwardDistanceOnLap(fromDistance, toDistance, lapLength) {
  return ((toDistance - fromDistance) % lapLength + lapLength) % lapLength;
}

function hasCrossedDistanceOnLap(fromDistance, toDistance, targetDistance, lapLength) {
  if (!lapLength) return false;
  const traveled = getForwardDistanceOnLap(fromDistance, toDistance, lapLength);
  const targetAhead = getForwardDistanceOnLap(fromDistance, targetDistance, lapLength);
  const epsilon = 1e-4;
  return targetAhead > epsilon && targetAhead <= traveled + epsilon;
}

function isDrsGapEligible(gapAheadSec) {
  return Number.isFinite(gapAheadSec) && gapAheadSec < SIM_DRS_ACTIVATION_GAP_SEC;
}

function getDrsTopSpeedMultiplier(powerUnit) {
  const pu = Math.max(1, Number(powerUnit) || 1);
  if (pu > 90) return 1 + SIM_DRS_TOP_SPEED_BOOST_PU_GT_90;
  if (pu >= 85) return 1 + SIM_DRS_TOP_SPEED_BOOST_PU_85_TO_90;
  return 1 + SIM_DRS_TOP_SPEED_BOOST_PU_LT_85;
}

function applyTurnSpeedTarget(baseSpeedKmh, distanceOnLap, turnDistance, turnTargetSpeed, lapLength, run) {
  if (turnDistance == null || !lapLength) return baseSpeedKmh;

  // 🏎️ DYNAMIC CORNERING SPEED - Calculate dynamic corner speed if run data available
  let dynamicTurnSpeed = turnTargetSpeed;
  if (run && window.dynamicCorneringSpeed) {
    // Determine which corner this is based on turnDistance
    const cornerIndex = getCornerIndexFromDistance(turnDistance);
    if (cornerIndex !== -1) {
      const carSetup = run.team?.carSetup || {};
      const driverSkills = run.driver?._modifiedSkills || run.driver?.skills || {};
      const wingSetup = run.team?.setup || {};
      
      dynamicTurnSpeed = window.dynamicCorneringSpeed.calculateDynamicCornerSpeed(
        cornerIndex,
        carSetup,
        driverSkills,
        wingSetup
      );
    }
  }

  let target = baseSpeedKmh;
  const forwardToTurn = getForwardDistanceOnLap(distanceOnLap, turnDistance, lapLength);

  // Start braking before the turn and reach entry speed right at the apex marker.
  if (forwardToTurn <= SIM_BRAKE_PREP_DISTANCE) {
    const t = Math.max(0, Math.min(1, forwardToTurn / SIM_BRAKE_PREP_DISTANCE));
    const rampSpeed = dynamicTurnSpeed + (baseSpeedKmh - dynamicTurnSpeed) * t;
    target = Math.min(target, rampSpeed);
  }

  // Hold entry speed around the apex to avoid immediate re-acceleration spike.
  if (isDistanceInsideWindow(distanceOnLap, turnDistance, SIM_APEX_HOLD_WINDOW, lapLength)) {
    target = Math.min(target, dynamicTurnSpeed);
  }

  return target;
}

// Helper function to map turn distance to corner index (0-8)
function getCornerIndexFromDistance(turnDistance) {
  if (turnDistance === simState.turn1Distance) return 0;
  if (turnDistance === simState.turn2Distance) return 1;
  if (turnDistance === simState.turn4Distance) return 2;
  if (turnDistance === simState.turn6Distance) return 3;
  if (turnDistance === simState.turn7Distance) return 4;
  if (turnDistance === simState.turn8Distance) return 5;
  if (turnDistance === simState.turn9Distance) return 6;
  if (turnDistance === simState.turn10Distance) return 7;
  if (turnDistance === simState.turn11Distance) return 8;
  return -1;
}

function getBrakeTargetSpeedKmh(baseSpeedKmh, distanceOnLap, lapLength, run) {
  let target = baseSpeedKmh;
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn1Distance, SIM_TURN1_ENTRY_KMH, lapLength, run);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn2Distance, SIM_TURN2_ENTRY_KMH, lapLength, run);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn4Distance, SIM_TURN4_ENTRY_KMH, lapLength, run);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn6Distance, SIM_TURN6_ENTRY_KMH, lapLength, run);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn7Distance, SIM_TURN7_ENTRY_KMH, lapLength, run);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn8Distance, SIM_TURN8_ENTRY_KMH, lapLength, run);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn9Distance, SIM_TURN9_ENTRY_KMH, lapLength, run);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn10Distance, SIM_TURN10_ENTRY_KMH, lapLength, run);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn11Distance, SIM_TURN11_ENTRY_KMH, lapLength, run);
  return target;
}

function normalizeErsDeployRating(value) {
  const parsed = Number(value);
  const fallback = CAR_STAT_DEFAULTS.ersDeploy;
  const normalized = Number.isFinite(parsed) ? parsed : fallback;
  return Math.min(SIM_POWER_UNIT_MAX, Math.max(1, normalized));
}

function getErsBatteryCapacityPercent(ersDeployRating) {
  const rating = normalizeErsDeployRating(ersDeployRating);
  const capacity = SIM_ERS_BATTERY_START +
    (rating - SIM_ERS_BATTERY_CAPACITY_REFERENCE_DEPLOY) * SIM_ERS_BATTERY_CAPACITY_STEP_PER_DEPLOY;
  return Math.max(1, capacity);
}

function clampSimBattery(value, maxBattery = SIM_ERS_BATTERY_START) {
  return Math.max(0, Math.min(maxBattery, Number(value) || 0));
}

function getErsBoostKmh(ersDeployRating) {
  normalizeErsDeployRating(ersDeployRating);
  return SIM_ERS_SPEED_BOOST_KMH;
}

function getErsDrainRatePercentPerSec(ersDeployRating) {
  normalizeErsDeployRating(ersDeployRating);
  return SIM_ERS_DRAIN_PERCENT_PER_SEC;
}

function getErsChargeRatePercentPerSec(ersDeployRating) {
  normalizeErsDeployRating(ersDeployRating);
  return SIM_ERS_CHARGE_PERCENT_PER_SEC;
}

function getRaceErsEffectiveness(ersDeployRating) {
  const normalized = Math.min(SIM_RACE_ERS_REFERENCE_RATING, normalizeErsDeployRating(ersDeployRating));
  const rating = Math.max(70, normalized);
  let reduction = 0;

  if (rating < 95) {
    reduction += (95 - Math.max(rating, 90)) * SIM_RACE_ERS_DROP_PER_POINT_95_TO_90;
  }
  if (rating < 90) {
    reduction += (90 - Math.max(rating, 85)) * SIM_RACE_ERS_DROP_PER_POINT_90_TO_85;
  }
  if (rating < 85) {
    reduction += (85 - Math.max(rating, 80)) * SIM_RACE_ERS_DROP_PER_POINT_85_TO_80;
  }
  if (rating < 80) {
    reduction += (80 - Math.max(rating, 70)) * SIM_RACE_ERS_DROP_PER_POINT_80_TO_70;
  }

  return Math.max(0, 1 - reduction);
}

function getRaceErsAccelMultiplier(ersDeployRating) {
  return 1 + SIM_RACE_ERS_BASE_ACCEL_BOOST * getRaceErsEffectiveness(ersDeployRating);
}

function getRaceErsSpeedBoostKmh(baseSpeedKmh, ersDeployRating) {
  const baseSpeed = Math.max(0, Number(baseSpeedKmh) || 0);
  return baseSpeed * SIM_RACE_ERS_BASE_SPEED_BOOST * getRaceErsEffectiveness(ersDeployRating);
}

function getRequiredBrakeDecelKmhPerSec(currentSpeedKmh, distanceOnLap, currentPathSpeed, lapLength, run) {
  const constraints = [
    { turnDistance: simState.turn1Distance, targetSpeed: SIM_TURN1_ENTRY_KMH, cornerIndex: 0 },
    { turnDistance: simState.turn2Distance, targetSpeed: SIM_TURN2_ENTRY_KMH, cornerIndex: 1 },
    { turnDistance: simState.turn4Distance, targetSpeed: SIM_TURN4_ENTRY_KMH, cornerIndex: 2 },
    { turnDistance: simState.turn6Distance, targetSpeed: SIM_TURN6_ENTRY_KMH, cornerIndex: 3 },
    { turnDistance: simState.turn7Distance, targetSpeed: SIM_TURN7_ENTRY_KMH, cornerIndex: 4 },
    { turnDistance: simState.turn8Distance, targetSpeed: SIM_TURN8_ENTRY_KMH, cornerIndex: 5 },
    { turnDistance: simState.turn9Distance, targetSpeed: SIM_TURN9_ENTRY_KMH, cornerIndex: 6 },
    { turnDistance: simState.turn10Distance, targetSpeed: SIM_TURN10_ENTRY_KMH, cornerIndex: 7 },
    { turnDistance: simState.turn11Distance, targetSpeed: SIM_TURN11_ENTRY_KMH, cornerIndex: 8 }
  ];

  let requiredDecel = 0;

  constraints.forEach(({ turnDistance, targetSpeed, cornerIndex }) => {
    if (turnDistance == null) return;

    // 🏎️ DYNAMIC CORNERING SPEED - Calculate dynamic corner speed
    let dynamicTargetSpeed = targetSpeed;
    if (run && window.dynamicCorneringSpeed) {
      const carSetup = run.team?.carSetup || {};
      const driverSkills = run.driver?._modifiedSkills || run.driver?.skills || {};
      const wingSetup = run.team?.setup || {};
      
      dynamicTargetSpeed = window.dynamicCorneringSpeed.calculateDynamicCornerSpeed(
        cornerIndex,
        carSetup,
        driverSkills,
        wingSetup
      );
    }

    const distanceToTurn = getForwardDistanceOnLap(distanceOnLap, turnDistance, lapLength);
    if (distanceToTurn > SIM_BRAKE_PREP_DISTANCE) return;
    if (currentSpeedKmh <= dynamicTargetSpeed) return;

    const timeToTurn = distanceToTurn / Math.max(currentPathSpeed, 0.05);
    const neededDecel = (currentSpeedKmh - dynamicTargetSpeed) / Math.max(timeToTurn, 0.05);
    requiredDecel = Math.max(requiredDecel, neededDecel * 1.1);
  });

  return requiredDecel;
}

function advanceSimRuns(dtSec, lapLength) {
  if (!dtSec || dtSec <= 0 || !lapLength || !Array.isArray(simState.teamRuns)) return;

  const elapsedSecNow = simState.startTs > 0 ? (simState.lastTickTs - simState.startTs) / 1000 : 0;
  const elapsedSecAfterStep = elapsedSecNow + dtSec;

  const orderedRuns = simState.teamRuns
    .slice()
    .sort((a, b) => {
      const distA = typeof a.currentDistance === 'number' ? a.currentDistance : -a.gridOffset;
      const distB = typeof b.currentDistance === 'number' ? b.currentDistance : -b.gridOffset;
      return distB - distA;
    });

  const gapAheadSecByRun = new Map();
  orderedRuns.forEach((run, idx) => {
    if (idx === 0) {
      gapAheadSecByRun.set(run, Number.POSITIVE_INFINITY);
      return;
    }

    const ahead = orderedRuns[idx - 1];
    const runDistance = typeof run.currentDistance === 'number' ? run.currentDistance : -run.gridOffset;
    const aheadDistance = typeof ahead.currentDistance === 'number' ? ahead.currentDistance : -ahead.gridOffset;
    const gapDistance = Math.max(0, aheadDistance - runDistance);
    const speedRef = Math.max(run.currentPathSpeed || run.pathSpeed, 0.05);
    gapAheadSecByRun.set(run, gapDistance / speedRef);
  });

  simState.teamRuns.forEach(run => {
    if (run.finishedRace) {
      run.currentSpeedKmh = 0;
      run.currentPathSpeed = 0;
      run.ersActive = false;
      run.ersBoostKmh = 0;
      run.drsActive = false;
      run.drsZoneId = null;
      run.drsEndDistance = null;
      run.gapAheadSec = null;
      return;
    }

    if (typeof run.currentDistance !== 'number') {
      run.currentDistance = -run.gridOffset;
    }

    const previousRaceProgress = getRunRaceProgressDistance(run);
    const wrappedDistance = ((run.currentDistance % lapLength) + lapLength) % lapLength;
    const previousDistanceOnLap = wrappedDistance;
    const referencePathSpeed = Math.max(run.currentPathSpeed || run.pathSpeed, 0.05);

    const ersDeployRating = normalizeErsDeployRating(run.ersDeployRating);
    const ersBatteryMax = getErsBatteryCapacityPercent(ersDeployRating);
    const currentBattery = clampSimBattery(run.ersBattery ?? ersBatteryMax, ersBatteryMax);
    const gapAheadSec = gapAheadSecByRun.get(run);

    const drsGapEligible = isDrsGapEligible(gapAheadSec);
    const drsActiveForStep = Boolean(run.drsActive);
    const drsTopSpeedMultiplier = drsActiveForStep ? getDrsTopSpeedMultiplier(run.powerUnit) : 1;
    const drsTopSpeedKmh = run.speedKmh * drsTopSpeedMultiplier;
    const currentSpeed = typeof run.currentSpeedKmh === 'number' ? run.currentSpeedKmh : run.speedKmh;
    const shouldDeployErs =
      currentBattery > SIM_ERS_MIN_BATTERY_TO_DEPLOY &&
      currentSpeed >= SIM_RACE_ERS_MIN_SPEED_KMH;

    const ersBoostKmh = shouldDeployErs ? getRaceErsSpeedBoostKmh(run.speedKmh, ersDeployRating) : 0;
    const baseSpeedWithErs = drsTopSpeedKmh + ersBoostKmh;
    const targetSpeedKmh = getBrakeTargetSpeedKmh(baseSpeedWithErs, wrappedDistance, lapLength, run);

    const adaptiveDecel = getRequiredBrakeDecelKmhPerSec(currentSpeed, wrappedDistance, referencePathSpeed, lapLength, run);
    const decelRate = Math.max(SIM_BRAKE_DECEL_KMH_PER_SEC, adaptiveDecel);
    const decelStep = decelRate * dtSec;
    const accelMultiplier =
      (drsActiveForStep ? SIM_DRS_ACCEL_MULTIPLIER : 1) *
      (shouldDeployErs ? getRaceErsAccelMultiplier(ersDeployRating) : 1);
    const accelStep = SIM_ACCEL_KMH_PER_SEC * accelMultiplier * dtSec;

    let nextSpeed = currentSpeed;
    if (targetSpeedKmh < currentSpeed) {
      nextSpeed = Math.max(targetSpeedKmh, currentSpeed - decelStep);
    } else if (targetSpeedKmh > currentSpeed) {
      nextSpeed = Math.min(targetSpeedKmh, currentSpeed + accelStep);
    }

    let nextBattery = currentBattery;
    if (shouldDeployErs) {
      nextBattery -= getErsDrainRatePercentPerSec(ersDeployRating) * dtSec;
    } else {
      nextBattery += getErsChargeRatePercentPerSec(ersDeployRating) * dtSec;
    }
    nextBattery = clampSimBattery(nextBattery, ersBatteryMax);

    run.currentSpeedKmh = nextSpeed;
    run.currentPathSpeed = (nextSpeed / SIM_MAX_SPEED_KMH) * SIM_BASE_PATH_SPEED * simState.speed;
    run.currentDistance += run.currentPathSpeed * dtSec;
    const currentRaceProgress = getRunRaceProgressDistance(run);
    const nextDistanceOnLap = ((run.currentDistance % lapLength) + lapLength) % lapLength;

    const finishLineDistance = simState.startFinishDistance;
    const crossedStartFinishLine =
      typeof finishLineDistance === 'number' &&
      hasCrossedDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, finishLineDistance, lapLength);

    let crossingTimeSec = null;
    if (crossedStartFinishLine) {
      const traveledOnLap = Math.max(
        getForwardDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, lapLength),
        1e-6
      );
      const distanceToLine = getForwardDistanceOnLap(previousDistanceOnLap, finishLineDistance, lapLength);
      const crossingFraction = Math.max(0, Math.min(1, distanceToLine / traveledOnLap));
      crossingTimeSec = elapsedSecNow + dtSec * crossingFraction;
      run.lapCrossings = (Number(run.lapCrossings) || 0) + 1;
    }

    const raceTargetDistance = SIM_RACE_TOTAL_LAPS * lapLength;
    if (previousRaceProgress < raceTargetDistance && currentRaceProgress >= raceTargetDistance) {
      const progressedThisStep = Math.max(currentRaceProgress - previousRaceProgress, 1e-6);
      const distanceToTarget = raceTargetDistance - previousRaceProgress;
      const completionFraction = Math.max(0, Math.min(1, distanceToTarget / progressedThisStep));
      run.distanceTargetReached = true;
      run.distanceTargetReachedTimeSec = elapsedSecNow + dtSec * completionFraction;
    } else if (!run.distanceTargetReached && currentRaceProgress >= raceTargetDistance) {
      run.distanceTargetReached = true;
      run.distanceTargetReachedTimeSec = elapsedSecAfterStep;
    }

    const canFinishAtStartLine =
      run.distanceTargetReached &&
      crossedStartFinishLine &&
      Number.isFinite(crossingTimeSec);
    const canFinishWithoutStartLine =
      run.distanceTargetReached &&
      typeof finishLineDistance !== 'number';

    if ((canFinishAtStartLine || canFinishWithoutStartLine) && !run.finishedRace) {
      run.finishedRace = true;
      run.finishTimeSec = canFinishAtStartLine
        ? crossingTimeSec
        : (Number(run.distanceTargetReachedTimeSec) || elapsedSecAfterStep);
      simState.finishCounter += 1;
      run.finishOrder = simState.finishCounter;
      run.currentSpeedKmh = 0;
      run.currentPathSpeed = 0;
    }

    if (!run.drsActive && drsGapEligible && Array.isArray(simState.drsZones) && simState.drsZones.length > 0) {
      const activationZone = simState.drsZones.find(zone =>
        hasCrossedDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, zone.startDistance, lapLength)
      ) || null;
      if (activationZone) {
        run.drsActive = true;
        run.drsZoneId = activationZone.id || 'DRS';
        run.drsEndDistance = activationZone.endDistance;
      }
    }

    if (run.drsActive && typeof run.drsEndDistance === 'number') {
      const crossedDrsEnd = hasCrossedDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, run.drsEndDistance, lapLength);
      if (crossedDrsEnd) {
        run.drsActive = false;
        run.drsZoneId = null;
        run.drsEndDistance = null;
      }
    }

    run.ersBatteryMax = ersBatteryMax;
    run.ersBattery = nextBattery;
    run.ersActive = shouldDeployErs && nextBattery > SIM_ERS_MIN_BATTERY_TO_DEPLOY;
    run.ersBoostKmh = run.ersActive ? ersBoostKmh : 0;
    run.drsTopSpeedKmh = drsTopSpeedKmh;
    run.gapAheadSec = Number.isFinite(gapAheadSec) ? gapAheadSec : null;
  });
}

function buildSimTeamRuns(teamsOnGrid) {
  const list = Array.isArray(teamsOnGrid) ? teamsOnGrid.slice(0, SIM_MAX_TEAMS_ON_TRACK) : [];
  const runs = [];
  list.forEach(team => {
    const teamDrivers = state.drivers.filter(d => String(d.teamId) === String(team.id)).slice(0, 2);
    for (let i = 0; i < 2; i++) {
        let tag = "";
        let d = teamDrivers[i];
        if (d) {
            const baseTag = d.seedId || d.last || d.first || `D${d.id || i}`;
            tag = String(baseTag).substring(0, 3).toUpperCase();
        } else {
            const baseTag = team.seedId || team.name || `T${team.id || i}`;
            tag = String(baseTag).substring(0, 3).toUpperCase() + (i + 1);
        }
        runs.push({ team, driver: d, tag });
    }
  });

  const center = (runs.length - 1) / 2;

  return runs.map((runObj, idx) => {
    const team = runObj.team;
    const driver = runObj.driver;
    const setup = normalizeCarSetup(team.carSetup);
    const pu = Math.min(SIM_POWER_UNIT_MAX, Math.max(1, Number(setup.powerUnit) || CAR_STAT_DEFAULTS.powerUnit));
    const ersDeployRating = normalizeErsDeployRating(setup.ersDeploy);
    const speedKmh = SIM_MAX_SPEED_KMH - (SIM_POWER_UNIT_MAX - pu) * SIM_KMH_DROP_PER_PU;

    // 🏎️ WING SETUP INTEGRATION - Apply wing modifiers to driver skills
    let modifiedSkills = null;
    if (driver && driver.skills && team.setup && window.wingSetup) {
      const baseSkills = normalizeDriverSkills(driver.skills);
      modifiedSkills = window.wingSetup.applyWingSetupToSkills(baseSkills, team.setup);
      // Store modified skills on driver object for simulation use
      driver._modifiedSkills = modifiedSkills;
    }

    return {
      team,
      driver: driver || null,
      tag: runObj.tag,
      powerUnit: pu,
      ersDeployRating,
      ersBatteryMax: getErsBatteryCapacityPercent(ersDeployRating),
      speedKmh,
      pathSpeed: (speedKmh / SIM_MAX_SPEED_KMH) * SIM_BASE_PATH_SPEED * simState.speed,
      laneIndex: idx % SIM_LANE_COUNT,
      gridOffset: Math.floor(idx / SIM_LANE_COUNT) * SIM_ROW_GAP,
      uniqueLaneNudge: (idx - center) * 0.18,
      drsActive: false,
      drsZoneId: null,
      drsEndDistance: null,
      drsTopSpeedKmh: speedKmh
    };
  });
}

function getPointWithLaneOffset(path, distanceOnPath, laneOffset, lapLength) {
  const d1 = ((distanceOnPath % lapLength) + lapLength) % lapLength;
  const d2 = (d1 + 1) % lapLength;
  const p1 = path.getPointAtLength(d1);
  const p2 = path.getPointAtLength(d2);

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;

  const nx = -dy / len;
  const ny = dx / len;

  return {
    x: p1.x + nx * laneOffset,
    y: p1.y + ny * laneOffset
  };
}

function normalizeTeamTag(tag) {
  return String(tag || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 5);
}

function getTeamTag(teamName, customTag) {
  const normalizedCustomTag = normalizeTeamTag(customTag);
  if (normalizedCustomTag.length >= 2) return normalizedCustomTag;
  const words = String(teamName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.replace(/[^a-z0-9]/gi, ''))
    .filter(Boolean);

  const stopWords = new Set(['team', 'f1', 'formula', 'racing', 'motorsport', 'motorsports', 'scuderia']);
  const strongWords = words.filter(w => !stopWords.has(w.toLowerCase()));

  if (strongWords.length >= 2) {
    return strongWords.slice(0, 3).map(w => w[0]).join('').toUpperCase();
  }
  if (strongWords.length === 1) {
    return strongWords[0].slice(0, 3).toUpperCase();
  }
  if (words.length > 0) {
    return words.slice(0, 3).map(w => w[0]).join('').toUpperCase();
  }
  return 'CAR';
}

function setSimStatus(message) {
  const status = document.getElementById('simStatus');
  if (status) status.textContent = message;
}

function setSimResetButtonVisible(visible) {
  const btn = document.getElementById('btnSimReset');
  if (!btn) return;
  btn.style.display = visible ? 'inline-flex' : 'none';
}

function setSimResultsTabVisible(visible) {
  const tab = document.getElementById('simResultsTab');
  if (!tab) return;
  tab.style.display = visible ? 'block' : 'none';
}

function setSimQualifyingResultsTabVisible(visible) {
  const tab = document.getElementById('simQualifyingResultsTab');
  if (!tab) return;
  tab.style.display = visible ? 'block' : 'none';
}

function formatLapTimeSec(sec) {
  if (!Number.isFinite(sec)) return '--:--.---';
  const safe = Math.max(0, Number(sec) || 0);
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  const millis = Math.floor((safe - Math.floor(safe)) * 1000);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}

function updateSimSessionFlowUI() {
  const flowQualifying = document.getElementById('simFlowQualifying');
  const flowRace = document.getElementById('simFlowRace');
  const flowFinished = document.getElementById('simFlowFinished');
  const progress = document.getElementById('simQualifyingProgress');
  const qualifyingControls = document.querySelector('#section-sim-racing .sim-qual-controls');
  const showQualifyingUi =
    simState.sessionPhase === SIM_SESSION_PHASES.QUALIFYING_PENDING ||
    simState.sessionPhase === SIM_SESSION_PHASES.QUALIFYING_RUNNING;

  const totalCars = Math.max(0, Number(simState.qualifyingTotalCars) || 0);
  const finishedCars = Math.max(0, Math.min(totalCars, Number(simState.qualifyingFinishedCars) || 0));
  if (progress) {
    progress.style.display = showQualifyingUi ? 'block' : 'none';
    progress.textContent = `Qualifying progress: ${finishedCars} / ${totalCars} cars have timed laps.`;
  }
  if (qualifyingControls) {
    qualifyingControls.style.display = showQualifyingUi ? 'flex' : 'none';
  }
  if (!showQualifyingUi) {
    setSimQualifyingResultsTabVisible(false);
  }

  [flowQualifying, flowRace, flowFinished].forEach(node => {
    if (!node) return;
    node.classList.remove('is-active', 'is-done');
  });

  if (simState.sessionPhase === SIM_SESSION_PHASES.QUALIFYING_PENDING || simState.sessionPhase === SIM_SESSION_PHASES.QUALIFYING_RUNNING) {
    if (flowQualifying) flowQualifying.classList.add('is-active');
    return;
  }

  if (simState.sessionPhase === SIM_SESSION_PHASES.RACE_READY || simState.sessionPhase === SIM_SESSION_PHASES.RACE_RUNNING) {
    if (flowQualifying) flowQualifying.classList.add('is-done');
    if (flowRace) flowRace.classList.add('is-active');
    return;
  }

  if (flowQualifying) flowQualifying.classList.add('is-done');
  if (flowRace) flowRace.classList.add('is-done');
  if (flowFinished) flowFinished.classList.add('is-active');
}

function getRunRaceProgressDistance(run) {
  const currentDistance = Number(run?.currentDistance) || 0;
  const gridOffset = Number(run?.gridOffset) || 0;
  return currentDistance + gridOffset;
}

function getRunCompletedLaps(run, lapLength) {
  if (!lapLength) return 0;
  return Math.max(0, Math.floor(getRunRaceProgressDistance(run) / lapLength));
}

function getSimRaceResults(lapLength, targetLaps) {
  if (!lapLength || !targetLaps || !Array.isArray(simState.teamRuns) || simState.teamRuns.length === 0) return null;

  const finishedRuns = simState.teamRuns.filter(run => run.finishedRace && Number.isFinite(run.finishTimeSec));
  if (finishedRuns.length !== simState.teamRuns.length) return null;

  return finishedRuns
    .slice()
    .sort((a, b) => {
      const timeDiff = Number(a.finishTimeSec) - Number(b.finishTimeSec);
      if (Math.abs(timeDiff) > 1e-6) return timeDiff;
      const finishOrderDiff = (Number(a.finishOrder) || Number.POSITIVE_INFINITY) - (Number(b.finishOrder) || Number.POSITIVE_INFINITY);
      if (finishOrderDiff !== 0) return finishOrderDiff;
      return getRunRaceProgressDistance(b) - getRunRaceProgressDistance(a);
    });
}

function getSimPodiumOnRaceFinish(lapLength, targetLaps) {
  const results = getSimRaceResults(lapLength, targetLaps);
  if (!results) return null;
  return results.slice(0, 3);
}

function renderSimResultsTab(results, targetLaps) {
  const body = document.getElementById('simResultsBody');
  const meta = document.getElementById('simResultsMeta');
  if (!body || !meta) return;

  if (!Array.isArray(results) || results.length === 0) {
    body.innerHTML = '<tr class="empty-row"><td colspan="6">No race result yet.</td></tr>';
    meta.textContent = '';
    return;
  }

  const leaderTime = Number(results[0]?.finishTimeSec) || 0;
  meta.textContent = `${results.length} drivers classified · ${targetLaps} laps`;

  body.innerHTML = results.map((run, idx) => {
    const finishTime = Number(run.finishTimeSec) || 0;
    const gapSec = Math.max(0, finishTime - leaderTime);
    const gapLabel = idx === 0 ? 'Leader' : `+${gapSec.toFixed(3)}s`;
    return `
      <tr>
        <td>P${idx + 1}</td>
        <td>${escHtml(run.tag)}</td>
        <td>${escHtml(getSimRunDisplayName(run))}</td>
        <td>${escHtml(run.team.name)}</td>
        <td>${finishTime.toFixed(3)}s</td>
        <td>${gapLabel}</td>
      </tr>
    `;
  }).join('');
}

function initCarSetupSection() {
  const teamSelect = document.getElementById('carSetupTeam');
  if (!teamSelect) return;

  populateCarSetupTeamDropdown();
  updateCarSetupOverall();

  teamSelect.addEventListener('change', () => {
    document.getElementById('err-carSetupTeam').textContent = '';
    loadSelectedTeamCarSetup();
  });

  document.getElementById('carSetupForm').addEventListener('submit', e => {
    e.preventDefault();

    const teamId = getValue('carSetupTeam');
    if (!teamId) {
      document.getElementById('err-carSetupTeam').textContent = 'Please select a team';
      return;
    }

    const team = state.teams.find(t => String(t.id) === String(teamId));
    if (!team) return;

    team.carSetup = readCarSetupFromInputs();
    saveToStorage();
    renderCarSetups();
    showToast(`Saved car setup for "${team.name}"`, 'success');
  });
}

function populateCarSetupTeamDropdown() {
  const sel = document.getElementById('carSetupTeam');
  if (!sel) return;

  const current = sel.value;
  sel.innerHTML = '<option value="">-- Select a team --</option>';

  state.teams.forEach(team => {
    const opt = document.createElement('option');
    opt.value = team.id;
    opt.textContent = team.name;
    sel.appendChild(opt);
  });

  if (state.teams.length === 0) {
    setCarSetupInputs(CAR_STAT_DEFAULTS);
    return;
  }

  const stillExists = state.teams.some(t => String(t.id) === String(current));
  sel.value = stillExists ? current : String(state.teams[0].id);
  loadSelectedTeamCarSetup();
}

function loadSelectedTeamCarSetup() {
  const teamId = getValue('carSetupTeam');
  if (!teamId) {
    setCarSetupInputs(CAR_STAT_DEFAULTS);
    return;
  }

  const team = state.teams.find(t => String(t.id) === String(teamId));
  setCarSetupInputs(normalizeCarSetup(team?.carSetup));
}

function updateCarStatValue(statKey, value) {
  const el = document.getElementById(`val-car-${statKey}`);
  if (el) el.textContent = value;
  updateCarSetupOverall();
}

function setCarSetupInputs(setup) {
  const normalized = normalizeCarSetup(setup);
  const ids = {
    powerUnit: 'carPowerUnit',
    downforce: 'carDownforce',
    chassis: 'carChassis',
    reliability: 'carReliability',
    ersDeploy: 'carErsDeploy',
    tyreDegradation: 'carTyreDegradation'
  };

  Object.entries(ids).forEach(([key, inputId]) => {
    document.getElementById(inputId).value = normalized[key];
    document.getElementById(`val-car-${key}`).textContent = normalized[key];
  });

  updateCarSetupOverall();
}

function readCarSetupFromInputs() {
  return {
    powerUnit: parseInt(getValue('carPowerUnit')),
    downforce: parseInt(getValue('carDownforce')),
    chassis: parseInt(getValue('carChassis')),
    reliability: parseInt(getValue('carReliability')),
    ersDeploy: parseInt(getValue('carErsDeploy')),
    tyreDegradation: parseInt(getValue('carTyreDegradation'))
  };
}

function getCarOverall(setup) {
  const s = normalizeCarSetup(setup);
  return Math.round((s.powerUnit + s.downforce + s.chassis + s.reliability + s.ersDeploy + (100 - s.tyreDegradation)) / 6);
}

function updateCarSetupOverall() {
  const setup = readCarSetupFromInputs();
  const overall = getCarOverall(setup);
  const { tierLabel, tierClass } = getRatingTier(overall);

  document.getElementById('carOverall').textContent = overall;
  const tierEl = document.getElementById('carOverallTier');
  tierEl.textContent = tierLabel;
  tierEl.className = `rating-badge ${tierClass}`;
}

function renderCarSetups() {
  const tbody = document.getElementById('carSetupsBody');
  if (!tbody) return;

  if (state.teams.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No teams available yet.</td></tr>';
    return;
  }

  tbody.innerHTML = state.teams.map(team => {
    const setup = normalizeCarSetup(team.carSetup);
    const overall = getCarOverall(setup);
    const { tierLabel, tierClass } = getRatingTier(overall);

    return `
      <tr>
        <td>
          <div class="team-name-cell">
            <span class="team-dot" style="background:${team.color}; box-shadow: 0 0 6px ${team.color}"></span>
            <strong>${escHtml(team.name)}</strong>
          </div>
        </td>
        <td>${setup.powerUnit}</td>
        <td>${setup.downforce}</td>
        <td>${setup.chassis}</td>
        <td>${setup.reliability}</td>
        <td>${setup.ersDeploy}</td>
        <td>${setup.tyreDegradation}</td>
        <td><span class="rating-badge ${tierClass}">${tierLabel} · ${overall}</span></td>
      </tr>
    `;
  }).join('');
}

function renderTeams(list = state.teams) {
  const tbody = document.getElementById('teamsBody');

  if (list.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No teams added yet.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((t, i) => {
    const driverCount = state.drivers.filter(d => String(d.teamId) === String(t.id)).length;
    const budgetText = t.budget != null ? `$${t.budget}M` : '—';
    const shortTag = getTeamTag(t.name, t.shortTag);

    return `
      <tr data-id="${t.id}">
        <td style="color:var(--text-3)">${i + 1}</td>
        <td>
          <div class="team-name-cell">
            ${t.logo
              ? `<img src="${t.logo}" class="team-logo-thumb" alt="${escHtml(t.name)}" />`
              : `<span class="team-dot" style="background:${t.color}; box-shadow: 0 0 6px ${t.color}"></span>`
            }
            <strong>${escHtml(t.name)}</strong>
            <span class="team-short-tag">${escHtml(shortTag)}</span>
          </div>
        </td>
        <td>${escHtml(t.country)}</td>
        <td>
          <div class="car-cell">
            ${t.carPhoto
              ? `<img src="${t.carPhoto}" class="car-photo-thumb" alt="${escHtml(t.car)}" />`
              : ''
            }
            <span>${escHtml(t.car)}</span>
          </div>
        </td>
        <td><span class="rating-badge rating-b">${t.category}</span></td>
        <td style="color:var(--text-2)">${budgetText}</td>
        <td>
          <span class="rating-badge ${driverCount > 0 ? 'rating-a' : 'rating-c'}">${driverCount}</span>
        </td>
        <td>
          <div style="display:flex; gap:6px">
            <button class="btn btn-icon" title="Edit" onclick="editTeam(${t.id})">&#9998;</button>
            <button class="btn btn-icon" title="Delete" style="color:#ff5252" onclick="confirmDelete('team', ${t.id})">&#10005;</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderDrivers(list = state.drivers) {
  const tbody = document.getElementById('driversBody');

  if (list.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No drivers added yet.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((d, i) => {
    const team = state.teams.find(t => String(t.id) === String(d.teamId));
    const teamCell = team
      ? `<span class="team-dot" style="background:${team.color}"></span>${escHtml(team.name)}`
      : '<span style="color:var(--text-3)">Free Agent</span>';

    const { pace, consistency, racecraft, overall } = getComputedSkills(d.skills);
    const { tierLabel: ratingLabel, tierClass: ratingClass } = getRatingTier(overall);

    return `
      <tr data-id="${d.id}">
        <td style="color:var(--text-3)">${i + 1}</td>
        <td><span class="number-badge">${d.number}</span></td>
        <td>
          <div class="driver-name-cell">
            ${d.photo
              ? `<img src="${d.photo}" class="driver-avatar-thumb" alt="${escHtml(d.first)}" />`
              : `<span class="driver-avatar-placeholder">${escHtml(d.first[0])}${escHtml(d.last[0])}</span>`
            }
            <strong>${escHtml(d.first)} ${escHtml(d.last)}</strong>
          </div>
        </td>
        <td>${escHtml(d.nationality)}</td>
        <td style="display:flex; align-items:center; gap:4px; border:none">${teamCell}</td>
        <td>${d.age ?? '—'}</td>
        <td>
          <span class="rating-badge ${ratingClass}" title="Pace:${pace} | Consistency:${consistency} | Racecraft:${racecraft}">
            ${ratingLabel} · ${overall}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:6px">
            <button class="btn btn-icon" title="Edit" onclick="editDriver(${d.id})">&#9998;</button>
            <button class="btn btn-icon" title="Delete" style="color:#ff5252" onclick="confirmDelete('driver', ${d.id})">&#10005;</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderStats() {
  const nations = new Set(state.drivers.map(d => d.nationality.toLowerCase()));

  document.getElementById('stat-teams').textContent   = state.teams.length;
  document.getElementById('stat-drivers').textContent = state.drivers.length;
  document.getElementById('stat-nations').textContent = nations.size;

  const maxT = Math.max(state.teams.length, 10);
  const maxD = Math.max(state.drivers.length, 20);
  const maxN = Math.max(nations.size, 10);

  document.getElementById('bar-teams').style.width   = `${(state.teams.length / maxT) * 100}%`;
  document.getElementById('bar-drivers').style.width = `${(state.drivers.length / maxD) * 100}%`;
  document.getElementById('bar-nations').style.width = `${(nations.size / maxN) * 100}%`;

  // Animate speedometer
  animateSpeedometer(state.drivers.length * 12);
}

function updateChips() {
  document.getElementById('chip-teams').textContent   = state.teams.length;
  document.getElementById('chip-drivers').textContent = state.drivers.length;
}

// ============================================================
//  ACTIVITY FEED
// ============================================================
function addActivity(type, message) {
  state.activity.unshift({ type, message, time: new Date().toISOString() });
  if (state.activity.length > 10) state.activity.pop();
}

function renderActivity() {
  const list = document.getElementById('activityList');
  if (state.activity.length === 0) {
    list.innerHTML = '<div class="activity-empty">No activity yet. Add a team or driver to get started.</div>';
    return;
  }

  list.innerHTML = state.activity.map(a => {
    const ago = timeAgo(a.time);
    return `
      <div class="activity-item">
        <div class="activity-badge badge-${a.type}"></div>
        <div class="activity-text">${a.message}</div>
        <div class="activity-time">${ago}</div>
      </div>
    `;
  }).join('');
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)  return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ============================================================
//  EDIT
// ============================================================
function editTeam(id) {
  const team = state.teams.find(t => t.id === id);
  if (!team) return;

  navigate('teams');
  setValue('teamName',    team.name);
  setValue('teamTag',     team.shortTag || '');
  setValue('teamCountry', team.country);
  setValue('teamCar',     team.car);
  setValue('teamCategory', team.category);
  setValue('teamColor',   team.color);
  setValue('teamBudget',  team.budget ?? '');

  // Update color preview
  document.getElementById('colorPreview').style.background = team.color;
  document.getElementById('colorHex').textContent = team.color;

  // Restore logo preview
  teamLogoData = team.logo || null;
  const logoPreview = document.getElementById('teamLogoPreview');
  const logoWrap = document.getElementById('teamLogoPreviewWrap');
  if (team.logo) {
    logoPreview.src = team.logo;
    logoWrap.classList.add('visible');
  } else {
    logoPreview.src = '';
    logoWrap.classList.remove('visible');
  }

  // Restore car photo preview
  teamCarPhotoData = team.carPhoto || null;
  const carPhotoPreview = document.getElementById('teamCarPhotoPreview');
  const carPhotoWrap = document.getElementById('teamCarPhotoPreviewWrap');
  if (team.carPhoto) {
    carPhotoPreview.src = team.carPhoto;
    carPhotoWrap.classList.add('visible');
  } else {
    carPhotoPreview.src = '';
    carPhotoWrap.classList.remove('visible');
  }

  editingTeamCarSetup = normalizeCarSetup(team.carSetup);
  editingTeamSeedKey = team.seedKey || null;

  // Remove old entry and change button
  state.teams = state.teams.filter(t => t.id !== id);

  const btn = document.querySelector('#teamForm .btn-primary');
  btn.textContent = 'Update Team';

  document.getElementById('teamFormBody').scrollIntoView({ behavior: 'smooth' });
}

function editDriver(id) {
  const driver = state.drivers.find(d => d.id === id);
  if (!driver) return;

  navigate('drivers');
  populateTeamDropdown();

  setValue('driverFirst',       driver.first);
  setValue('driverLast',        driver.last);
  setValue('driverNumber',      driver.number);
  setValue('driverNationality', driver.nationality);
  setValue('driverAge',         driver.age ?? '');
  setValue('driverTeam',        driver.teamId ?? '');

  setSlider('skillCornering',    driver.skills.cornering    || 75);
  setSlider('skillBraking',      driver.skills.braking      || 75);
  setSlider('skillReactions',    driver.skills.reactions    || 75);
  setSlider('skillAccuracy',     driver.skills.accuracy     || 75);
  setSlider('skillControl',      driver.skills.control      || 75);
  setSlider('skillSmooth',       driver.skills.smooth       || 75);
  setSlider('skillAdaptability', driver.skills.adaptability || 75);
  setSlider('skillOvertaking',   driver.skills.overtaking   || 75);
  setSlider('skillDefending',    driver.skills.defending    || 75);
  recomputeSkillGroups();

  // Restore driver photo
  driverPhotoData = driver.photo || null;
  const driverPhotoPreview = document.getElementById('driverPhotoPreview');
  const driverPhotoWrap = document.getElementById('driverPhotoPreviewWrap');
  if (driver.photo) {
    driverPhotoPreview.src = driver.photo;
    driverPhotoWrap.classList.add('visible');
  } else {
    driverPhotoPreview.src = '';
    driverPhotoWrap.classList.remove('visible');
  }

  editingDriverSeedKey = driver.seedKey || null;

  state.drivers = state.drivers.filter(d => d.id !== id);

  const btn = document.querySelector('#driverForm .btn-primary');
  btn.textContent = 'Update Driver';

  document.getElementById('driverFormBody').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
//  DELETE
// ============================================================
let pendingDelete = null;

function confirmDelete(type, id) {
  const name = type === 'team'
    ? state.teams.find(t => t.id === id)?.name
    : (() => { const d = state.drivers.find(d => d.id === id); return d ? `${d.first} ${d.last}` : ''; })();

  document.getElementById('modalMessage').textContent = `Delete "${name}"? This cannot be undone.`;
  pendingDelete = { type, id };
  openModal();
}

document.getElementById('modalConfirm').addEventListener('click', () => {
  if (!pendingDelete) return closeModal();

  const { type, id } = pendingDelete;
  if (type === 'team') {
    const name = state.teams.find(t => t.id === id)?.name;
    state.teams = state.teams.filter(t => t.id !== id);
    // Unassign drivers from this team
    state.drivers.forEach(d => { if (String(d.teamId) === String(id)) d.teamId = null; });
    addActivity('team', `Team <strong>${escHtml(name)}</strong> removed`);
    showToast(`Team "${name}" deleted`, 'info');
  } else {
    const d = state.drivers.find(d => d.id === id);
    const name = d ? `${d.first} ${d.last}` : '';
    state.drivers = state.drivers.filter(d => d.id !== id);
    addActivity('driver', `Driver <strong>${escHtml(name)}</strong> removed`);
    showToast(`Driver "${name}" deleted`, 'info');
  }

  pendingDelete = null;
  saveToStorage();
  renderAll();
  closeModal();
});

function openModal()  { document.getElementById('modalOverlay').classList.add('open'); }
function closeModal() { document.getElementById('modalOverlay').classList.remove('open'); }

document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

// ============================================================
//  SEARCH
// ============================================================
function initSearch() {
  document.getElementById('searchTeams').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderTeams(state.teams.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.country.toLowerCase().includes(q) ||
      t.car.toLowerCase().includes(q) ||
      getTeamTag(t.name, t.shortTag).toLowerCase().includes(q)
    ));
  });

  document.getElementById('searchDrivers').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderDrivers(state.drivers.filter(d => {
      const team = state.teams.find(t => String(t.id) === String(d.teamId));
      return (`${d.first} ${d.last}`).toLowerCase().includes(q) ||
        d.nationality.toLowerCase().includes(q) ||
        (team && team.name.toLowerCase().includes(q)) ||
        String(d.number).includes(q);
    }));
  });
}

// ============================================================
//  COLOR PICKER
// ============================================================
function initColorPicker() {
  const colorInput   = document.getElementById('teamColor');
  const colorPreview = document.getElementById('colorPreview');
  const colorHex     = document.getElementById('colorHex');

  colorInput.addEventListener('input', () => {
    colorPreview.style.background = colorInput.value;
    colorHex.textContent = colorInput.value;
  });
}

// ============================================================
//  SKILL SLIDERS
// ============================================================

// Map sub-skill id → parent group
const SKILL_GROUPS = {
  pace:        ['cornering', 'braking', 'reactions'],
  consistency: ['accuracy', 'control', 'smooth'],
  racecraft:   ['adaptability', 'overtaking', 'defending']
};

function updateSkillSub(subId, value) {
  document.getElementById(`val-${subId}`).textContent = value;
  recomputeSkillGroups();
}

function recomputeSkillGroups() {
  const val = id => parseInt(document.getElementById(`skill${id.charAt(0).toUpperCase() + id.slice(1)}`).value);
  const avg = subs => Math.round(subs.reduce((s, id) => s + val(id), 0) / subs.length);

  const pace        = avg(SKILL_GROUPS.pace);
  const consistency = avg(SKILL_GROUPS.consistency);
  const racecraft   = avg(SKILL_GROUPS.racecraft);
  const overall     = Math.round((pace + consistency + racecraft) / 3);

  document.getElementById('avg-pace').textContent        = pace;
  document.getElementById('avg-consistency').textContent = consistency;
  document.getElementById('avg-racecraft').textContent   = racecraft;
  document.getElementById('computed-overall').textContent = overall;

  const { tierLabel, tierClass } = getRatingTier(overall);
  const tierEl = document.getElementById('computed-tier');
  tierEl.textContent = tierLabel;
  tierEl.className   = `rating-badge ${tierClass}`;
}

function getRatingTier(overall) {
  if (overall >= 90) return { tierLabel: 'S', tierClass: 'rating-s' };
  if (overall >= 85) return { tierLabel: 'A', tierClass: 'rating-a' };
  if (overall >= 70) return { tierLabel: 'B', tierClass: 'rating-b' };
  if (overall >= 55) return { tierLabel: 'C', tierClass: 'rating-c' };
  return { tierLabel: 'D', tierClass: 'rating-d' };
}

// Compute all 3 group averages + overall from a saved skills object
function getComputedSkills(skills) {
  const avg = (...keys) => Math.round(keys.reduce((s, k) => s + (skills[k] || 75), 0) / keys.length);
  const pace        = avg('cornering', 'braking', 'reactions');
  const consistency = avg('accuracy', 'control', 'smooth');
  const racecraft   = avg('adaptability', 'overtaking', 'defending');
  const overall     = Math.round((pace + consistency + racecraft) / 3);
  return { pace, consistency, racecraft, overall };
}

function setSlider(id, value) {
  const el = document.getElementById(id);
  el.value = value;
  const name = id.replace('skill', '').toLowerCase();
  document.getElementById(`val-${name}`).textContent = value;
}

// ============================================================
//  FORM TOGGLES
// ============================================================
function initFormToggles() {
  addFormToggle('toggleTeamForm', 'teamFormBody');
  addFormToggle('toggleDriverForm', 'driverFormBody');
}

function addFormToggle(btnId, bodyId) {
  const btn  = document.getElementById(btnId);
  const body = document.getElementById(bodyId);

  btn.addEventListener('click', () => {
    const isHidden = body.style.display === 'none';
    body.style.display = isHidden ? '' : 'none';
    btn.textContent    = isHidden ? '⌃ Hide' : '⌄ Show';
  });
}

// ============================================================
//  SPEEDOMETER ANIMATION
// ============================================================
let speedInterval = null;

function initSpeedometer() {
  // Auto idle animation
  let rising = true;
  speedInterval = setInterval(() => {
    const needle = document.getElementById('speedNeedle');
    if (!needle) return;
    const current = parseFloat(needle.style.getPropertyValue('--angle') || '-90');
    // Keep idle between -80 and -60 degrees
  }, 500);
}

function animateSpeedometer(targetSpeed) {
  const maxSpeed = 299;
  const clampedSpeed = Math.min(targetSpeed, maxSpeed);
  const angle = -90 + (clampedSpeed / maxSpeed) * 180;

  document.getElementById('speedNeedle').style.transform =
    `translateX(-50%) rotate(${angle}deg)`;

  let current = 0;
  const step = clampedSpeed / 30;
  const el = document.getElementById('speedNum');
  const counter = setInterval(() => {
    current = Math.min(current + step, clampedSpeed);
    el.textContent = Math.round(current);
    if (current >= clampedSpeed) clearInterval(counter);
  }, 20);
}

// ============================================================
//  HELPERS
// ============================================================
function getValue(id) {
  return document.getElementById(id).value;
}

function setValue(id, value) {
  document.getElementById(id).value = value;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function resetForm(formId) {
  document.getElementById(formId).reset();

  // Reset color preview
  if (formId === 'teamForm') {
    document.getElementById('colorPreview').style.background = '#e10600';
    document.getElementById('colorHex').textContent = '#e10600';
    // Reset logo
    teamLogoData = null;
    document.getElementById('teamLogoPreview').src = '';
    document.getElementById('teamLogoPreviewWrap').classList.remove('visible');
    document.getElementById('teamLogo').value = '';
    document.getElementById('teamLogoUrl').value = '';
    // Reset car photo
    teamCarPhotoData = null;
    document.getElementById('teamCarPhotoPreview').src = '';
    document.getElementById('teamCarPhotoPreviewWrap').classList.remove('visible');
    document.getElementById('teamCarPhoto').value = '';
    document.getElementById('teamCarPhotoUrl').value = '';
    editingTeamCarSetup = null;
    editingTeamSeedKey = null;
  }

  // Reset skill display
  if (formId === 'driverForm') {
    ['cornering','braking','reactions','accuracy','control','smooth','adaptability','overtaking','defending'].forEach(s => {
      document.getElementById(`val-${s}`).textContent = '75';
    });
    recomputeSkillGroups();
    // Reset driver photo
    driverPhotoData = null;
    editingDriverSeedKey = null;
    document.getElementById('driverPhotoPreview').src = '';
    document.getElementById('driverPhotoPreviewWrap').classList.remove('visible');
    document.getElementById('driverPhoto').value = '';
    document.getElementById('driverPhotoUrl').value = '';
  }

  // Reset all field errors and borders
  document.querySelectorAll(`#${formId} .field-error`).forEach(e => e.textContent = '');
  document.querySelectorAll(`#${formId} input`).forEach(e => e.style.borderColor = '');

  // Reset button label
  const btn = document.querySelector(`#${formId} .btn-primary`);
  if (btn) btn.textContent = formId === 'teamForm' ? 'Add Team' : 'Add Driver';
}

// ============================================================
//  TOAST
// ============================================================
let toastTimer = null;

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ============================================================
//  INITIALIZE APPLICATION
// ============================================================
// Called immediately after all functions and variables are declared
(function initApp() {
  console.log('🔧 Initializing app.js...');
  
  initNavigation();
  initTeamForm();
  initCarSetupSection();
  initSimRacingSection();
  initDriverForm();
  initSearch();
  initColorPicker();
  initFormToggles();
  initSpeedometer();
  openChampionshipScreen(); // always show on load
  
  console.log('✅ app.js initialization complete');
})();
