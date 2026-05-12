// ============================================================
//  UI COMPONENTS (Toast, Modal, Search, etc.)
// ============================================================

import { state, saveToStorage, addActivity } from '../core/state.js';
import { escHtml } from '../utils/helpers.js';

// ============================================================
//  TOAST NOTIFICATIONS
// ============================================================

let toastTimer = null;

export function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ============================================================
//  MODAL (DELETE CONFIRMATION)
// ============================================================

let pendingDelete = null;

export function confirmDelete(type, id) {
  const name = type === 'team'
    ? state.teams.find(t => t.id === id)?.name
    : (() => { const d = state.drivers.find(d => d.id === id); return d ? `${d.first} ${d.last}` : ''; })();

  document.getElementById('modalMessage').textContent = `Delete "${name}"? This cannot be undone.`;
  pendingDelete = { type, id };
  openModal();
}

export function initModal() {
  document.getElementById('modalCancel').addEventListener('click', closeModal);
  
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
    if (window.renderAll) window.renderAll();
    closeModal();
  });

  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
  });
}

function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
}

// ============================================================
//  SEARCH
// ============================================================

export function initSearch() {
  document.getElementById('searchTeams').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = state.teams.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.country.toLowerCase().includes(q) ||
      t.car.toLowerCase().includes(q) ||
      (window.getTeamTag ? window.getTeamTag(t.name, t.shortTag).toLowerCase().includes(q) : false)
    );
    if (window.renderTeams) window.renderTeams(filtered);
  });

  document.getElementById('searchDrivers').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    const filtered = state.drivers.filter(d => {
      const team = state.teams.find(t => String(t.id) === String(d.teamId));
      return (`${d.first} ${d.last}`).toLowerCase().includes(q) ||
        d.nationality.toLowerCase().includes(q) ||
        (team && team.name.toLowerCase().includes(q)) ||
        String(d.number).includes(q);
    });
    if (window.renderDrivers) window.renderDrivers(filtered);
  });
}

// ============================================================
//  COLOR PICKER
// ============================================================

export function initColorPicker() {
  const colorInput   = document.getElementById('teamColor');
  const colorPreview = document.getElementById('colorPreview');
  const colorHex     = document.getElementById('colorHex');

  colorInput.addEventListener('input', () => {
    colorPreview.style.background = colorInput.value;
    colorHex.textContent = colorInput.value;
  });
}

// ============================================================
//  FORM TOGGLES
// ============================================================

export function initFormToggles() {
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

// Make functions available globally
window.showToast = showToast;
window.confirmDelete = confirmDelete;
