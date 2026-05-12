// ============================================================
//  DRIVER MANAGEMENT MODULE
// ============================================================

import { state, saveToStorage, addActivity, normalizeDriverSkills } from '../core/state.js';
import { getValue } from '../utils/helpers.js';
import { SKILL_GROUPS } from '../config/constants.js';

let driverPhotoData = null;
let editingDriverSeedKey = null;

export function initDriverForm() {
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
    img.onerror = () => window.showToast('Could not load image from URL', 'info');
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
    
    if (window.renderAll) window.renderAll();
    resetDriverForm();
    window.showToast(`Driver "${driver.first} ${driver.last}" added!`, 'success');
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

export function populateTeamDropdown() {
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

export function editDriver(id) {
  const driver = state.drivers.find(d => d.id === id);
  if (!driver) return;

  window.navigate('drivers');
  populateTeamDropdown();

  document.getElementById('driverFirst').value = driver.first;
  document.getElementById('driverLast').value = driver.last;
  document.getElementById('driverNumber').value = driver.number;
  document.getElementById('driverNationality').value = driver.nationality;
  document.getElementById('driverAge').value = driver.age ?? '';
  document.getElementById('driverTeam').value = driver.teamId ?? '';

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

function resetDriverForm() {
  const form = document.getElementById('driverForm');
  form.reset();

  ['cornering','braking','reactions','accuracy','control','smooth','adaptability','overtaking','defending'].forEach(s => {
    document.getElementById(`val-${s}`).textContent = '75';
  });
  recomputeSkillGroups();
  
  driverPhotoData = null;
  editingDriverSeedKey = null;
  document.getElementById('driverPhotoPreview').src = '';
  document.getElementById('driverPhotoPreviewWrap').classList.remove('visible');
  document.getElementById('driverPhoto').value = '';
  document.getElementById('driverPhotoUrl').value = '';

  document.querySelectorAll('#driverForm .field-error').forEach(e => e.textContent = '');
  document.querySelectorAll('#driverForm input').forEach(e => e.style.borderColor = '');

  const btn = document.querySelector('#driverForm .btn-primary');
  if (btn) btn.textContent = 'Add Driver';
}

// ============================================================
//  SKILL CALCULATIONS
// ============================================================

export function updateSkillSub(subId, value) {
  document.getElementById(`val-${subId}`).textContent = value;
  recomputeSkillGroups();
}

export function recomputeSkillGroups() {
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

  const { tierLabel, tierClass } = window.getRatingTier(overall);
  const tierEl = document.getElementById('computed-tier');
  tierEl.textContent = tierLabel;
  tierEl.className   = `rating-badge ${tierClass}`;
}

export function getComputedSkills(skills) {
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

// Make functions available globally
window.editDriver = editDriver;
window.updateSkillSub = updateSkillSub;
