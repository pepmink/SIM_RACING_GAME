// ============================================================
//  CAR SETUP MODULE
// ============================================================

import { state, saveToStorage, normalizeCarSetup } from '../core/state.js';
import { getValue } from '../utils/helpers.js';
import { CAR_STAT_DEFAULTS } from '../config/constants.js';

export function initCarSetupSection() {
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
    
    if (window.renderCarSetups) window.renderCarSetups();
    window.showToast(`Saved car setup for "${team.name}"`, 'success');
  });
}

export function populateCarSetupTeamDropdown() {
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

export function updateCarStatValue(statKey, value) {
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

export function getCarOverall(setup) {
  const s = normalizeCarSetup(setup);
  return Math.round((s.powerUnit + s.downforce + s.chassis + s.reliability + s.ersDeploy + (100 - s.tyreDegradation)) / 6);
}

function updateCarSetupOverall() {
  const setup = readCarSetupFromInputs();
  const overall = getCarOverall(setup);
  const { tierLabel, tierClass } = window.getRatingTier(overall);

  document.getElementById('carOverall').textContent = overall;
  const tierEl = document.getElementById('carOverallTier');
  tierEl.textContent = tierLabel;
  tierEl.className = `rating-badge ${tierClass}`;
}

// Make function available globally
window.updateCarStatValue = updateCarStatValue;
