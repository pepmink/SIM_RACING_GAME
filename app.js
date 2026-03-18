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

let currentChampionship = null;

// ---------- Logo data (base64) for current form session ----------
let teamLogoData    = null;
let teamCarPhotoData = null;
let driverPhotoData  = null;
let editingTeamCarSetup = null;

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
const SIM_DOT_GAP = 26;

const simState = {
  running: false,
  rafId: null,
  startTs: 0,
  speed: SIM_DEFAULT_SPEED,
  teamsOnGrid: []
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
    state.teams = state.teams.map(team => ({
      ...team,
      carSetup: normalizeCarSetup(team.carSetup)
    }));
  }
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

  document.getElementById('teamForm').addEventListener('submit', e => {
    e.preventDefault();
    if (!validateTeamForm()) return;

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
      carSetup: normalizeCarSetup(editingTeamCarSetup),
      createdAt: new Date().toISOString()
    };

    state.teams.push(team);
    teamLogoData = null;
    teamCarPhotoData = null;
    editingTeamCarSetup = null;
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
      photo: driverPhotoData,
      createdAt: new Date().toISOString()
    };

    state.drivers.push(driver);
    driverPhotoData = null;
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

  renderSimRacingPreview();
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
    btn.textContent = 'Sim Racing';
    status.textContent = 'At least 2 teams are required to build the Monza grid.';
    markerWrap.innerHTML = '';
    if (raceDots) raceDots.innerHTML = '';
    legend.innerHTML = '<span class="sim-status">Add 2 teams to show colored markers on the track.</span>';
    return;
  }

  if (!simState.running) {
    status.textContent = 'Monza preview is ready. Click Sim Racing to run team dots at 1x speed.';
  }

  const teamsOnGrid = state.teams.slice(0, 2);
  simState.teamsOnGrid = teamsOnGrid;
  btn.textContent = simState.running ? 'Stop Sim' : 'Sim Racing';
  markerWrap.innerHTML = '';
  renderRaceDotsAtDistance(0);

  legend.innerHTML = teamsOnGrid.map((team, idx) => `
    <span class="sim-legend-item">
      <span class="sim-legend-dot" style="background:${team.color}"></span>
      <span>P${idx + 1} · ${escHtml(team.name)}</span>
    </span>
  `).join('');
}

function startSimRacingAnimation() {
  const path = document.getElementById('monzaRaceLine');
  if (!path) return;

  simState.speed = SIM_DEFAULT_SPEED;
  simState.startTs = performance.now();
  simState.running = true;
  simState.teamsOnGrid = state.teams.slice(0, 2);

  const btn = document.getElementById('btnSimRacing');
  if (btn) btn.textContent = 'Stop Sim';

  setSimStatus('Simulation preview running at 1x speed.');
  renderRaceDotsAtDistance(0);

  const lapLength = path.getTotalLength();

  const tick = now => {
    if (!simState.running) return;

    const elapsedSec = (now - simState.startTs) / 1000;
    const traveled = elapsedSec * SIM_BASE_PATH_SPEED * simState.speed;
    renderRaceDotsAtDistance(traveled, lapLength);

    simState.rafId = requestAnimationFrame(tick);
  };

  simState.rafId = requestAnimationFrame(tick);
}

function stopSimRacingAnimation() {
  if (simState.rafId) cancelAnimationFrame(simState.rafId);
  simState.rafId = null;
  simState.running = false;

  const btn = document.getElementById('btnSimRacing');
  if (btn) btn.textContent = 'Sim Racing';
}

function renderRaceDotsAtDistance(distance, cachedLapLength) {
  const path = document.getElementById('monzaRaceLine');
  const dotsLayer = document.getElementById('monzaRaceDots');
  if (!path || !dotsLayer) return;

  const teams = simState.teamsOnGrid.length > 0 ? simState.teamsOnGrid : state.teams.slice(0, 2);
  if (teams.length < 2) {
    dotsLayer.innerHTML = '';
    return;
  }

  const lapLength = cachedLapLength || path.getTotalLength();

  dotsLayer.innerHTML = teams.map((team, idx) => {
    const rawDistance = distance - idx * SIM_DOT_GAP;
    const wrappedDistance = ((rawDistance % lapLength) + lapLength) % lapLength;
    const point = path.getPointAtLength(wrappedDistance);

    return `<circle class="sim-race-dot" cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="7" fill="${team.color}"></circle>`;
  }).join('');
}

function setSimStatus(message) {
  const status = document.getElementById('simStatus');
  if (status) status.textContent = message;
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
      t.car.toLowerCase().includes(q)
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
  }

  // Reset skill display
  if (formId === 'driverForm') {
    ['cornering','braking','reactions','accuracy','control','smooth','adaptability','overtaking','defending'].forEach(s => {
      document.getElementById(`val-${s}`).textContent = '75';
    });
    recomputeSkillGroups();
    // Reset driver photo
    driverPhotoData = null;
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
