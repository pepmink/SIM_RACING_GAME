// ============================================================
//  NAVIGATION & ROUTING
// ============================================================

import { CHAMPIONSHIPS } from '../config/constants.js';
import { state, setCurrentChampionship, loadFromStorage, saveToStorage } from './state.js';

export function initNavigation() {
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

export function navigate(sectionId) {
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

  // Trigger section-specific updates
  if (window.onNavigate) {
    window.onNavigate(sectionId);
  }
}

// ============================================================
//  CHAMPIONSHIP SELECTION
// ============================================================

export function openChampionshipScreen() {
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

export function selectChampionship(id) {
  setCurrentChampionship(id);
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

  // Trigger render
  if (window.renderAll) {
    window.renderAll();
  }
}

function updateCategoryDropdown() {
  const sel = document.getElementById('teamCategory');
  const champ = CHAMPIONSHIPS[window.getCurrentChampionship()];
  sel.innerHTML = champ.categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

function updateChampionshipUI() {
  const champ = CHAMPIONSHIPS[window.getCurrentChampionship()];

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
