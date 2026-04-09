// ============================================================
//  Sim Racing Manager – app.js
// ============================================================

// ---------- Championship Config ----------
const CHAMPIONSHIPS = {
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

const DEFAULT_TEAMS_BY_CHAMP = {
  f1: [
    { seedId: 'alpine', name: 'BWT Alpine F1 Team', country: 'France', car: 'A525', category: 'F1', color: '#0090ff', budget: 470, carSetup: { powerUnit: 78, downforce: 77, chassis: 71, reliability: 75, ersDeploy: 86, tyreDegradation: 41 } },
    { seedId: 'aston-martin', name: 'Aston Martin Aramco F1 Team', country: 'United Kingdom', car: 'AMR25', category: 'F1', color: '#006f62', budget: 520, carSetup: { powerUnit: 82, downforce: 78, chassis: 86, reliability: 81, ersDeploy: 88, tyreDegradation: 27 } },
    { seedId: 'ferrari', name: 'Scuderia Ferrari HP', country: 'Italy', car: 'SF-25', category: 'F1', color: '#e10600', budget: 680, carSetup: { powerUnit: 85, downforce: 83, chassis: 89, reliability: 92, ersDeploy: 90, tyreDegradation: 20 } },
    { seedId: 'haas', name: 'MoneyGram Haas F1 Team', country: 'United States', car: 'VF-25', category: 'F1', color: '#b6babd', budget: 310, carSetup: { powerUnit: 83, downforce: 81, chassis: 77, reliability: 86, ersDeploy: 78, tyreDegradation: 26 } },
    { seedId: 'sauber', name: 'Stake F1 Team Kick Sauber', country: 'Switzerland', car: 'C45', category: 'F1', color: '#00e701', budget: 300, carSetup: { powerUnit: 82, downforce: 78, chassis: 81, reliability: 77, ersDeploy: 82, tyreDegradation: 36 } },
    { seedId: 'mclaren', name: 'McLaren Formula 1 Team', country: 'United Kingdom', car: 'MCL39', category: 'F1', color: '#ff8700', budget: 640, carSetup: { powerUnit: 90, downforce: 95, chassis: 96, reliability: 90, ersDeploy: 85, tyreDegradation: 15 } },
    { seedId: 'mercedes', name: 'Mercedes-AMG Petronas F1 Team', country: 'Germany', car: 'F1 W16', category: 'F1', color: '#00d2be', budget: 630, carSetup: { powerUnit: 95, downforce: 87, chassis: 91, reliability: 97, ersDeploy: 90, tyreDegradation: 35 } },
    { seedId: 'racing-bulls', name: 'Visa Cash App Racing Bulls F1 Team', country: 'Italy', car: 'VCARB 02', category: 'F1', color: '#2b5db7', budget: 360, carSetup: { powerUnit: 86, downforce: 82, chassis: 83, reliability: 90, ersDeploy: 92, tyreDegradation: 35 } },
    { seedId: 'red-bull', name: 'Oracle Red Bull Racing', country: 'Austria', car: 'RB21', category: 'F1', color: '#1e41ff', budget: 700, carSetup: { powerUnit: 93, downforce: 92, chassis: 93, reliability: 95, ersDeploy: 92, tyreDegradation: 25 } },
    { seedId: 'williams', name: 'Atlassian Williams Racing', country: 'United Kingdom', car: 'FW47', category: 'F1', color: '#005aff', budget: 390, carSetup: { powerUnit: 91, downforce: 83, chassis: 86, reliability: 82, ersDeploy: 87, tyreDegradation: 31 } }
  ],
  wec: [
    { seedId: 'titan-hypercar', name: 'Titan Hypercar', country: 'Japan', car: 'TH-01H', category: 'Hypercar', color: '#0066cc', budget: 420 },
    { seedId: 'enduro-proton', name: 'Enduro Proton', country: 'Germany', car: 'EP-LMP2', category: 'LMP2', color: '#1f95ff', budget: 260 },
    { seedId: 'crimson-lemans', name: 'Crimson LeMans', country: 'Italy', car: 'CL-GTE', category: 'GTE Pro', color: '#d7263d', budget: 310 }
  ],
  gt: [
    { seedId: 'night-owl', name: 'Night Owl Motorsport', country: 'Belgium', car: 'NOM GT3', category: 'GT3', color: '#00a651', budget: 180 },
    { seedId: 'velocity-garage', name: 'Velocity Garage', country: 'United States', car: 'VG GT4', category: 'GT4', color: '#19bf6a', budget: 145 },
    { seedId: 'sunset-dynamics', name: 'Sunset Dynamics', country: 'Spain', car: 'SD GT2', category: 'GT2', color: '#f39c12', budget: 170 }
  ]
};

const DEFAULT_DRIVERS_BY_CHAMP = {
  f1: [
    { seedId: 'gasly', first: 'Pierre', last: 'Gasly', number: 10, nationality: 'French', teamSeedId: 'alpine', skills: { cornering: 83, braking: 84, reactions: 85, accuracy: 75, control: 89, smooth: 76, adaptability: 81, overtaking: 87, defending: 82 } },
    { seedId: 'colapinto', first: 'Franco', last: 'Colapinto', number: 7, nationality: 'Australian', teamSeedId: 'alpine', skills: { cornering: 78, braking: 77, reactions: 75, accuracy: 86, control: 81, smooth: 72, adaptability: 85, overtaking: 86, defending: 85 } },

    { seedId: 'alonso', first: 'Fernando', last: 'Alonso', number: 14, nationality: 'Spanish', teamSeedId: 'aston-martin', skills: { cornering: 85, braking: 81, reactions: 80, accuracy: 89, control: 95, smooth: 96, adaptability: 82, overtaking: 83, defending: 95 } },
    { seedId: 'stroll', first: 'Lance', last: 'Stroll', number: 18, nationality: 'Canadian', teamSeedId: 'aston-martin', skills: { cornering: 81, braking: 78, reactions: 77, accuracy: 85, control: 82, smooth: 80, adaptability: 85, overtaking: 78, defending: 77 } },

    { seedId: 'leclerc', first: 'Charles', last: 'Leclerc', number: 16, nationality: 'Monegasque', teamSeedId: 'ferrari', skills: { cornering: 93, braking: 89, reactions: 92, accuracy: 91, control: 90, smooth: 85, adaptability: 90, overtaking: 91, defending: 85 } },
    { seedId: 'hamilton', first: 'Lewis', last: 'Hamilton', number: 44, nationality: 'British', teamSeedId: 'ferrari', skills: { cornering: 87, braking: 93, reactions: 82, accuracy: 95, control: 96, smooth: 88, adaptability: 83, overtaking: 85, defending: 90 } },

    { seedId: 'ocon', first: 'Esteban', last: 'Ocon', number: 31, nationality: 'French', teamSeedId: 'haas', skills: { cornering: 80, braking: 75, reactions: 81, accuracy: 88, control: 82, smooth: 81, adaptability: 73, overtaking: 78, defending: 88 } },
    { seedId: 'bearman', first: 'Oliver', last: 'Bearman', number: 87, nationality: 'British', teamSeedId: 'haas', skills: { cornering: 84, braking: 83, reactions: 78, accuracy: 85, control: 86, smooth: 75, adaptability: 78, overtaking: 89, defending: 81 } },

    { seedId: 'bortoleto', first: 'Gabriel', last: 'Bortoleto', number: 5, nationality: 'Brazilian', teamSeedId: 'sauber', skills: { cornering: 80, braking: 81, reactions: 73, accuracy: 72, control: 88, smooth: 78, adaptability: 79, overtaking: 85, defending: 89 } },
    { seedId: 'hulkenberg', first: 'Nico', last: 'Hulkenberg', number: 27, nationality: 'German', teamSeedId: 'sauber', skills: { cornering: 82, braking: 78, reactions: 85, accuracy: 80, control: 81, smooth: 82, adaptability: 72, overtaking: 76, defending: 93 } },

    { seedId: 'norris', first: 'Lando', last: 'Norris', number: 4, nationality: 'British', teamSeedId: 'mclaren', skills: { cornering: 88, braking: 85, reactions: 92, accuracy: 93, control: 94, smooth: 92, adaptability: 87, overtaking: 91, defending: 93 } },
    { seedId: 'piastri', first: 'Oscar', last: 'Piastri', number: 81, nationality: 'Australian', teamSeedId: 'mclaren', skills: { cornering: 85, braking: 87, reactions: 94, accuracy: 95, control: 90, smooth: 87, adaptability: 83, overtaking: 96, defending: 82 } },

    { seedId: 'antonelli', first: 'Kimi', last: 'Antonelli', number: 12, nationality: 'Italian', teamSeedId: 'mercedes', skills: { cornering: 86, braking: 83, reactions: 86, accuracy: 78, control: 75, smooth: 71, adaptability: 81, overtaking: 92, defending: 82 } },
    { seedId: 'russell', first: 'George', last: 'Russell', number: 63, nationality: 'British', teamSeedId: 'mercedes', skills: { cornering: 88, braking: 89, reactions: 81, accuracy: 92, control: 93, smooth: 90, adaptability: 85, overtaking: 89, defending: 94 } },

    { seedId: 'hadjar', first: 'Isack', last: 'Hadjar', number: 6, nationality: 'French', teamSeedId: 'racing-bulls', skills: { cornering: 87, braking: 81, reactions: 88, accuracy: 76, control: 77, smooth: 73, adaptability: 79, overtaking: 88, defending: 85 } },
    { seedId: 'lawson', first: 'Liam', last: 'Lawson', number: 30, nationality: 'New Zealander', teamSeedId: 'racing-bulls', skills: { cornering: 82, braking: 78, reactions: 83, accuracy: 81, control: 82, smooth: 83, adaptability: 75, overtaking: 82, defending: 88 } },

    { seedId: 'verstappen', first: 'Max', last: 'Verstappen', number: 1, nationality: 'Dutch', teamSeedId: 'red-bull', skills: { cornering: 95, braking: 96, reactions: 90, accuracy: 87, control: 94, smooth: 82, adaptability: 98, overtaking: 96, defending: 93 } },
    { seedId: 'tsunoda', first: 'Yuki', last: 'Tsunoda', number: 22, nationality: 'Japanese', teamSeedId: 'red-bull', skills: { cornering: 85, braking: 80, reactions: 87, accuracy: 75, control: 70, smooth: 87, adaptability: 83, overtaking: 80, defending: 89 } },

    { seedId: 'albon', first: 'Alexander', last: 'Albon', number: 23, nationality: 'Thai', teamSeedId: 'williams', skills: { cornering: 82, braking: 81, reactions: 90, accuracy: 88, control: 82, smooth: 84, adaptability: 80, overtaking: 86, defending: 81 } },
    { seedId: 'sainz', first: 'Carlos', last: 'Sainz Jr.', number: 55, nationality: 'Spanish', teamSeedId: 'williams', skills: { cornering: 90, braking: 85, reactions: 89, accuracy: 85, control: 86, smooth: 96, adaptability: 78, overtaking: 82, defending: 87 } }
  ],
  wec: [],
  gt: []
};

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
const SIM_START_FINISH_MARKER = { x: 600, y: 380.9 };
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
  startFinishDistance: null,
  drsZones: [],
  drsPickMode: null,
  drsDraftZone: {
    startMarker: null,
    endMarker: null
  },
  teamsOnGrid: [],
  teamRuns: []
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
document.addEventListener('DOMContentLoaded', () => {
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
});

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
    defending: 75
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
    defending: Number(src.defending) || fallback.defending
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

    const seededDriver = state.drivers.find(d => d.seedKey === seedKey);
    if (seededDriver) {
      seededDriver.first = driver.first;
      seededDriver.last = driver.last;
      seededDriver.number = Number(driver.number);
      seededDriver.nationality = driver.nationality;
      seededDriver.teamId = String(team.id);
      seededDriver.age = null;
      seededDriver.photo = null;
      seededDriver.skills = normalizeDriverSkills(driver.skills);
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
        skills: normalizeDriverSkills(driver.skills),
        photo: null,
        createdAt: new Date().toISOString(),
        seedKey
      });
      changed = true;
    }
  });

  return changed;
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
        defending:    parseInt(document.getElementById('skillDefending').value)
      },
      seedKey: editingDriverSeedKey,
      photo: driverPhotoData,
      createdAt: new Date().toISOString()
    };

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
  const resetBtn = document.getElementById('btnSimReset');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!canStartSimPreview()) {
      showToast('At least 2 teams are required to preview Monza', 'info');
      return;
    }

    if (simState.running) {
      stopSimRacingAnimation();
      setSimStatus('Simulation paused. Click Sim Racing to run again at 1x speed.');
      return;
    }

    startSimRacingAnimation();
    showToast('Simulation preview started at 1x speed.', 'success');
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      stopSimRacingAnimation();
      setSimResetButtonVisible(false);
      setSimResultsTabVisible(false);
      renderSimRacingPreview();
      setSimStatus('Race reset. Click Sim Racing to start again.');
      showToast('Race has been reset.', 'success');
    });
  }

  initSimDrsCoordinatePicker();
  setSimResetButtonVisible(false);
  setSimResultsTabVisible(false);
  renderSimRacingPreview();
}

function initSimDrsCoordinatePicker() {
  const btnStart = document.getElementById('btnPickDrsStart');
  const btnEnd = document.getElementById('btnPickDrsEnd');
  const btnCopy = document.getElementById('btnCopyDrsCoords');
  const trackSvg = document.querySelector('#section-sim-racing .monza-track');
  if (!btnStart || !btnEnd || !btnCopy || !trackSvg) return;

  btnStart.addEventListener('click', () => {
    simState.drsPickMode = 'start';
    updateSimDrsPickerUI();
    setSimStatus('DRS picker: click on track to set START coordinate.');
  });

  btnEnd.addEventListener('click', () => {
    simState.drsPickMode = 'end';
    updateSimDrsPickerUI();
    setSimStatus('DRS picker: click on track to set END coordinate.');
  });

  btnCopy.addEventListener('click', async () => {
    const start = simState.drsDraftZone.startMarker;
    const end = simState.drsDraftZone.endMarker;
    if (!start || !end) {
      showToast('Pick both START and END coordinates first.', 'info');
      return;
    }

    const configText = `{ id: 'DRS X', startMarker: { x: ${start.x}, y: ${start.y} }, endMarker: { x: ${end.x}, y: ${end.y} } }`;
    try {
      await navigator.clipboard.writeText(configText);
      showToast('DRS coordinates copied to clipboard.', 'success');
    } catch (_error) {
      showToast('Could not copy automatically. Coordinate text is shown below.', 'warning');
    }
    setSimStatus(`DRS config: ${configText}`);
  });

  trackSvg.addEventListener('click', event => {
    if (!simState.drsPickMode) return;
    const picked = getSvgCoordinateFromEvent(trackSvg, event);
    if (!picked) return;

    if (simState.drsPickMode === 'start') {
      simState.drsDraftZone.startMarker = picked;
      showToast(`DRS START set at (${picked.x}, ${picked.y})`, 'success');
    } else {
      simState.drsDraftZone.endMarker = picked;
      showToast(`DRS END set at (${picked.x}, ${picked.y})`, 'success');
    }

    simState.drsPickMode = null;
    updateSimDrsPickerUI();
    renderSimRacingPreview();
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

function updateSimDrsPickerUI() {
  const btnStart = document.getElementById('btnPickDrsStart');
  const btnEnd = document.getElementById('btnPickDrsEnd');
  const coords = document.getElementById('simDrsCoords');
  const trackSvg = document.querySelector('#section-sim-racing .monza-track');

  const start = simState.drsDraftZone.startMarker;
  const end = simState.drsDraftZone.endMarker;
  const startText = start ? `(${start.x}, ${start.y})` : '-';
  const endText = end ? `(${end.x}, ${end.y})` : '-';
  const pickModeText = simState.drsPickMode ? ` | Picking: ${simState.drsPickMode.toUpperCase()}` : '';

  if (coords) coords.textContent = `DRS Start: ${startText} | DRS End: ${endText}${pickModeText}`;
  if (btnStart) btnStart.classList.toggle('is-active', simState.drsPickMode === 'start');
  if (btnEnd) btnEnd.classList.toggle('is-active', simState.drsPickMode === 'end');
  if (trackSvg) trackSvg.classList.toggle('drs-pick-mode', Boolean(simState.drsPickMode));
}

function canStartSimPreview() {
  return state.teams.length >= 2;
}

function renderSimRacingPreview() {
  const btn = document.getElementById('btnSimRacing');
  const status = document.getElementById('simStatus');
  const markerWrap = document.getElementById('monzaMarkers');
  const legend = document.getElementById('simTeamLegend');
  const raceDots = document.getElementById('monzaRaceDots');
  if (!btn || !status || !markerWrap || !legend) return;

  const ready = canStartSimPreview();
  btn.disabled = !ready;

  if (!ready) {
    stopSimRacingAnimation();
    setSimResetButtonVisible(false);
    setSimResultsTabVisible(false);
    btn.textContent = 'Sim Racing';
    status.textContent = 'At least 2 teams are required to build the Monza grid.';
    markerWrap.innerHTML = '';
    if (raceDots) raceDots.innerHTML = '';
    legend.innerHTML = '<span class="sim-status">Add 2 teams to show colored markers on the track.</span>';
    return;
  }

  if (!simState.running) {
    status.textContent = `Monza preview is ready. Speed is based on Power Unit (${SIM_POWER_UNIT_MAX} => ${SIM_MAX_SPEED_KMH} km/h).`;
  }

  if (!simState.running) setSimResetButtonVisible(false);
  if (!simState.running) setSimResultsTabVisible(false);

  const teamsOnGrid = state.teams.slice(0, SIM_MAX_TEAMS_ON_TRACK);
  simState.teamsOnGrid = teamsOnGrid;
  simState.teamRuns = buildSimTeamRuns(teamsOnGrid);

  const path = document.getElementById('monzaRaceLine');
  if (path) {
    simState.lapLength = path.getTotalLength();
    updateSimBrakeDistances(path, simState.lapLength);
    updateSimStartFinishDistance(path, simState.lapLength);
    updateSimDrsZones(path, simState.lapLength);
  }

  btn.textContent = simState.running ? 'Stop Sim' : 'Sim Racing';
  markerWrap.innerHTML = renderSimDrsZoneBadges(simState.drsZones);
  renderRaceDotsAtTime(0);
}

function startSimRacingAnimation() {
  const path = document.getElementById('monzaRaceLine');
  if (!path) return;

  simState.speed = SIM_DEFAULT_SPEED;
  simState.startTs = performance.now();
  simState.lastTickTs = simState.startTs;
  simState.finishCounter = 0;
  simState.running = true;
  simState.teamsOnGrid = state.teams.slice(0, SIM_MAX_TEAMS_ON_TRACK);
  simState.teamRuns = buildSimTeamRuns(simState.teamsOnGrid).map(run => {
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
  if (btn) btn.textContent = 'Stop Sim';
  setSimResetButtonVisible(false);
  setSimResultsTabVisible(false);

  setSimStatus('Simulation preview running. Cars use speed from Power Unit and can overtake.');
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
      setSimResetButtonVisible(true);
      renderSimResultsTab(raceResults, SIM_RACE_TOTAL_LAPS);
      setSimResultsTabVisible(true);
      const podium = raceResults.slice(0, 3);
      const podiumText = podium
        .map((run, idx) => `P${idx + 1} ${run.tag} (${getSimRunDisplayName(run)}) ${Number(run.finishTimeSec || 0).toFixed(3)}s`)
        .join(' · ');
      setSimStatus(`Race finished (${SIM_RACE_TOTAL_LAPS} laps). Podium: ${podiumText}`);
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
  simState.running = false;
  simState.lastTickTs = 0;

  const btn = document.getElementById('btnSimRacing');
  if (btn) btn.textContent = 'Sim Racing';
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

function applyTurnSpeedTarget(baseSpeedKmh, distanceOnLap, turnDistance, turnTargetSpeed, lapLength) {
  if (turnDistance == null || !lapLength) return baseSpeedKmh;

  let target = baseSpeedKmh;
  const forwardToTurn = getForwardDistanceOnLap(distanceOnLap, turnDistance, lapLength);

  // Start braking before the turn and reach entry speed right at the apex marker.
  if (forwardToTurn <= SIM_BRAKE_PREP_DISTANCE) {
    const t = Math.max(0, Math.min(1, forwardToTurn / SIM_BRAKE_PREP_DISTANCE));
    const rampSpeed = turnTargetSpeed + (baseSpeedKmh - turnTargetSpeed) * t;
    target = Math.min(target, rampSpeed);
  }

  // Hold entry speed around the apex to avoid immediate re-acceleration spike.
  if (isDistanceInsideWindow(distanceOnLap, turnDistance, SIM_APEX_HOLD_WINDOW, lapLength)) {
    target = Math.min(target, turnTargetSpeed);
  }

  return target;
}

function getBrakeTargetSpeedKmh(baseSpeedKmh, distanceOnLap, lapLength) {
  let target = baseSpeedKmh;
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn1Distance, SIM_TURN1_ENTRY_KMH, lapLength);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn2Distance, SIM_TURN2_ENTRY_KMH, lapLength);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn4Distance, SIM_TURN4_ENTRY_KMH, lapLength);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn6Distance, SIM_TURN6_ENTRY_KMH, lapLength);
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

function getRequiredBrakeDecelKmhPerSec(currentSpeedKmh, distanceOnLap, currentPathSpeed, lapLength) {
  const constraints = [
    { turnDistance: simState.turn1Distance, targetSpeed: SIM_TURN1_ENTRY_KMH },
    { turnDistance: simState.turn2Distance, targetSpeed: SIM_TURN2_ENTRY_KMH },
    { turnDistance: simState.turn4Distance, targetSpeed: SIM_TURN4_ENTRY_KMH },
    { turnDistance: simState.turn6Distance, targetSpeed: SIM_TURN6_ENTRY_KMH }
  ];

  let requiredDecel = 0;

  constraints.forEach(({ turnDistance, targetSpeed }) => {
    if (turnDistance == null) return;

    const distanceToTurn = getForwardDistanceOnLap(distanceOnLap, turnDistance, lapLength);
    if (distanceToTurn > SIM_BRAKE_PREP_DISTANCE) return;
    if (currentSpeedKmh <= targetSpeed) return;

    const timeToTurn = distanceToTurn / Math.max(currentPathSpeed, 0.05);
    const neededDecel = (currentSpeedKmh - targetSpeed) / Math.max(timeToTurn, 0.05);
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
      currentSpeed >= drsTopSpeedKmh - 0.5;

    const ersBoostKmh = shouldDeployErs ? getErsBoostKmh(ersDeployRating) : 0;
    const baseSpeedWithErs = drsTopSpeedKmh + ersBoostKmh;
    const targetSpeedKmh = getBrakeTargetSpeedKmh(baseSpeedWithErs, wrappedDistance, lapLength);

    const adaptiveDecel = getRequiredBrakeDecelKmhPerSec(currentSpeed, wrappedDistance, referencePathSpeed, lapLength);
    const decelRate = Math.max(SIM_BRAKE_DECEL_KMH_PER_SEC, adaptiveDecel);
    const decelStep = decelRate * dtSec;
    const accelMultiplier =
      (drsActiveForStep ? SIM_DRS_ACCEL_MULTIPLIER : 1) *
      (shouldDeployErs ? SIM_ERS_ACCEL_MULTIPLIER : 1);
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
    const setup = normalizeCarSetup(team.carSetup);
    const pu = Math.min(SIM_POWER_UNIT_MAX, Math.max(1, Number(setup.powerUnit) || CAR_STAT_DEFAULTS.powerUnit));
    const ersDeployRating = normalizeErsDeployRating(setup.ersDeploy);
    const speedKmh = SIM_MAX_SPEED_KMH - (SIM_POWER_UNIT_MAX - pu) * SIM_KMH_DROP_PER_PU;

    return {
      team,
      driver: runObj.driver || null,
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
