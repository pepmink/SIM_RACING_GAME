// ============================================================
//  Main Entry Point - ES6 Module Version
// ============================================================

// Import configurations
import { 
  CHAMPIONSHIPS, 
  DEFAULT_TEAMS_BY_CHAMP, 
  DEFAULT_DRIVERS_BY_CHAMP,
  F1_2025_QUALIFYING_BY_SEED 
} from './config/championships.js';
import * as CONSTANTS from './config/constants.js';
import { CAR_STAT_DEFAULTS, getDefaultDriverSkills } from './config/defaults.js';

// Import utilities
import {
  calculateOptimalSetupForMonza,
  applyWingSetupToSkills,
  getFrontWingModifiers,
  getRearWingModifiers
} from './utils/wingSetup.js';

// Import state management
import { state, simState } from './state/state.js';

// ============================================================
//  Global State
// ============================================================
// Note: state and simState are imported from state.js
// currentChampionship is managed in app.js

// Wing setup utilities - expose globally for app.js compatibility
window.wingSetup = {
  calculateOptimalSetupForMonza,
  applyWingSetupToSkills,
  getFrontWingModifiers,
  getRearWingModifiers
};

// Expose constants globally for app.js compatibility
window.WING_CONSTANTS = {
  WING_SETUP_MIN: CONSTANTS.WING_SETUP_MIN,
  WING_SETUP_MAX: CONSTANTS.WING_SETUP_MAX,
  WING_SETUP_NEUTRAL_POINT: CONSTANTS.WING_SETUP_NEUTRAL_POINT,
  FRONT_WING_OVERTAKING_MAX_BONUS: CONSTANTS.FRONT_WING_OVERTAKING_MAX_BONUS,
  FRONT_WING_DEFENDING_MAX_BONUS: CONSTANTS.FRONT_WING_DEFENDING_MAX_BONUS,
  FRONT_WING_CORNERING_MAX_BONUS: CONSTANTS.FRONT_WING_CORNERING_MAX_BONUS,
  FRONT_WING_CONTROL_MAX_BONUS: CONSTANTS.FRONT_WING_CONTROL_MAX_BONUS,
  REAR_WING_BRAKING_MAX_BONUS: CONSTANTS.REAR_WING_BRAKING_MAX_BONUS,
  REAR_WING_SMOOTH_MAX_BONUS: CONSTANTS.REAR_WING_SMOOTH_MAX_BONUS,
  MONZA_TRACK_PROFILE: CONSTANTS.MONZA_TRACK_PROFILE,
  MONZA_OPTIMAL_SETUP: CONSTANTS.MONZA_OPTIMAL_SETUP,
  MONZA_SETUP_WEIGHTS: CONSTANTS.MONZA_SETUP_WEIGHTS
};

// Expose CHAMPIONSHIPS and data globally for app.js compatibility
window.CHAMPIONSHIPS_DATA = CHAMPIONSHIPS;
window.DEFAULT_TEAMS_BY_CHAMP = DEFAULT_TEAMS_BY_CHAMP;
window.DEFAULT_DRIVERS_BY_CHAMP = DEFAULT_DRIVERS_BY_CHAMP;
window.F1_2025_QUALIFYING_BY_SEED = F1_2025_QUALIFYING_BY_SEED;

// ============================================================
//  Initialize Application
// ============================================================
console.log('✅ ES6 Modules loaded successfully');
console.log('📦 Wing Setup System: ACTIVE');
console.log('🏎️ Championships loaded:', Object.keys(CHAMPIONSHIPS));
console.log('🏁 F1 Teams with setup:', DEFAULT_TEAMS_BY_CHAMP.f1.length);

// Add loading overlay to championship screen
const champScreen = document.getElementById('championshipScreen');
if (champScreen) {
  // Disable interactions
  champScreen.style.pointerEvents = 'none';
  champScreen.style.filter = 'blur(2px)';
  
  // Add loading overlay
  const loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'loading-overlay';
  loadingOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    font-family: 'Barlow', Arial, sans-serif;
    color: white;
  `;
  loadingOverlay.innerHTML = `
    <div style="text-align: center;">
      <div style="font-size: 48px; margin-bottom: 20px;">🏎️</div>
      <div style="font-size: 24px; font-weight: 600; margin-bottom: 10px;">Loading Application...</div>
      <div style="font-size: 14px; opacity: 0.7;">Initializing race systems</div>
    </div>
  `;
  document.body.appendChild(loadingOverlay);
  
  console.log('⏳ Waiting for app.js to load...');
}

// Wait for DOM to be ready before loading app.js
function loadAppJS() {
  const script = document.createElement('script');
  script.src = 'app.js';
  script.onload = () => {
    console.log('✅ app.js loaded');
    
    // Remove loading overlay and enable championship screen
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.transition = 'opacity 0.3s';
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
    
    if (champScreen) {
      champScreen.style.pointerEvents = '';
      champScreen.style.filter = '';
      console.log('✅ Championship screen ready');
    }
    
    console.log('🚀 Application ready - You can now select a championship');
  };
  script.onerror = (error) => {
    console.error('❌ Failed to load app.js', error);
    
    // Show error in overlay
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.innerHTML = `
        <div style="text-align: center; max-width: 600px; padding: 40px;">
          <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
          <div style="font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #ff4444;">
            Failed to Load Application
          </div>
          <div style="font-size: 14px; line-height: 1.6; opacity: 0.9; margin-bottom: 20px;">
            <p>Please check the browser console (F12) for errors.</p>
            <p>Make sure you're running via web server:</p>
            <code style="background: rgba(255,255,255,0.1); padding: 10px; display: block; margin: 10px 0; border-radius: 4px;">
              python -m http.server 8000
            </code>
            <p>URL should be:</p>
            <code style="background: rgba(255,255,255,0.1); padding: 10px; display: block; margin: 10px 0; border-radius: 4px;">
              http://localhost:8000/index.html
            </code>
          </div>
          <button onclick="location.reload()" style="
            background: #e10600;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
          ">
            Reload Page
          </button>
        </div>
      `;
    }
  };
  document.head.appendChild(script);
}

// Load app.js after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAppJS);
} else {
  // DOM already loaded
  loadAppJS();
}
