// ============================================================
//  TEAM MANAGEMENT MODULE
// ============================================================

import { state, saveToStorage, addActivity, normalizeCarSetup } from '../core/state.js';
import { getValue, normalizeTeamTag, getTeamTag } from '../utils/helpers.js';
import { CAR_STAT_DEFAULTS } from '../config/constants.js';

let teamLogoData = null;
let teamCarPhotoData = null;
let editingTeamCarSetup = null;
let editingTeamSeedKey = null;

export function initTeamForm() {
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
    img.onerror = () => window.showToast('Could not load image from URL', 'info');
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
    img.onerror = () => window.showToast('Could not load image from URL', 'info');
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
    
    if (window.renderAll) window.renderAll();
    resetTeamForm();
    window.showToast(`Team "${team.name}" added!`, 'success');
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

export function editTeam(id) {
  const team = state.teams.find(t => t.id === id);
  if (!team) return;

  window.navigate('teams');
  
  document.getElementById('teamName').value = team.name;
  document.getElementById('teamTag').value = team.shortTag || '';
  document.getElementById('teamCountry').value = team.country;
  document.getElementById('teamCar').value = team.car;
  document.getElementById('teamCategory').value = team.category;
  document.getElementById('teamColor').value = team.color;
  document.getElementById('teamBudget').value = team.budget ?? '';

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

function resetTeamForm() {
  const form = document.getElementById('teamForm');
  form.reset();

  document.getElementById('colorPreview').style.background = '#e10600';
  document.getElementById('colorHex').textContent = '#e10600';
  
  teamLogoData = null;
  document.getElementById('teamLogoPreview').src = '';
  document.getElementById('teamLogoPreviewWrap').classList.remove('visible');
  document.getElementById('teamLogo').value = '';
  document.getElementById('teamLogoUrl').value = '';
  
  teamCarPhotoData = null;
  document.getElementById('teamCarPhotoPreview').src = '';
  document.getElementById('teamCarPhotoPreviewWrap').classList.remove('visible');
  document.getElementById('teamCarPhoto').value = '';
  document.getElementById('teamCarPhotoUrl').value = '';
  
  editingTeamCarSetup = null;
  editingTeamSeedKey = null;

  document.querySelectorAll('#teamForm .field-error').forEach(e => e.textContent = '');
  document.querySelectorAll('#teamForm input').forEach(e => e.style.borderColor = '');

  const btn = document.querySelector('#teamForm .btn-primary');
  if (btn) btn.textContent = 'Add Team';
}

// Make editTeam available globally
window.editTeam = editTeam;
