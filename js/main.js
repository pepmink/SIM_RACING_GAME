// ============================================================
//  MAIN APPLICATION ENTRY POINT
// ============================================================

import { initNavigation, navigate, openChampionshipScreen, selectChampionship } from './core/navigation.js';
import { getCurrentChampionship, normalizeCarSetup } from './core/state.js';
import { initTeamForm } from './modules/teams.js';
import { initDriverForm, populateTeamDropdown } from './modules/drivers.js';
import { initCarSetupSection, populateCarSetupTeamDropdown } from './modules/carSetup.js';
import { initSimRacingSection, renderSimRacingPreview } from './modules/simRacing.js';
import { renderAll, initSpeedometer } from './ui/render.js';
import { showToast, initModal, initSearch, initColorPicker, initFormToggles } from './ui/components.js';
import { getRatingTier, getTeamTag } from './utils/helpers.js';

// ============================================================
//  INITIALIZATION
// ============================================================

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
  initModal();
  openChampionshipScreen();
});

// ============================================================
//  NAVIGATION CALLBACK
// ============================================================

window.onNavigate = (sectionId) => {
  // Refresh team dropdown when navigating to drivers
  if (sectionId === 'drivers') populateTeamDropdown();
  
  if (sectionId === 'car-setup') {
    populateCarSetupTeamDropdown();
    if (window.renderCarSetups) window.renderCarSetups();
  }
  
  if (sectionId === 'sim-racing') renderSimRacingPreview();
  
  if (sectionId !== 'sim-racing') {
    // Stop simulation when leaving sim racing section
    const simState = window.simState;
    if (simState && simState.running) {
      if (simState.rafId) cancelAnimationFrame(simState.rafId);
      simState.rafId = null;
      simState.running = false;
      const btn = document.getElementById('btnSimRacing');
      if (btn) btn.textContent = 'Sim Racing';
    }
  }
};

// ============================================================
//  EXPOSE GLOBAL FUNCTIONS
// ============================================================

window.navigate = navigate;
window.selectChampionship = selectChampionship;
window.getCurrentChampionship = getCurrentChampionship;
window.renderSimRacingPreview = renderSimRacingPreview;
window.normalizeCarSetup = normalizeCarSetup;
window.getRatingTier = getRatingTier;
window.getTeamTag = getTeamTag;
