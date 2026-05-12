// ============================================================
//  CHAMPIONSHIP CONFIGURATION
// ============================================================

export const CHAMPIONSHIPS = {
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

// ============================================================
//  CAR SETUP DEFAULTS
// ============================================================

export const CAR_STAT_DEFAULTS = {
  powerUnit: 75,
  downforce: 75,
  chassis: 75,
  reliability: 75,
  ersDeploy: 75,
  tyreDegradation: 25
};

// ============================================================
//  SIMULATION CONSTANTS
// ============================================================

export const SIM_DEFAULT_SPEED = 1;
export const SIM_BASE_PATH_SPEED = 90;
export const SIM_MAX_SPEED_KMH = 370;
export const SIM_POWER_UNIT_MAX = 99;
export const SIM_KMH_DROP_PER_PU = 2;
export const SIM_MAX_TEAMS_ON_TRACK = 10;
export const SIM_LANE_COUNT = 3;
export const SIM_LANE_SPACING = 2.4;
export const SIM_ROW_GAP = 34;
export const SIM_DOT_RADIUS = 2.4;

// Turn entry speeds
export const SIM_TURN1_ENTRY_KMH = 90;
export const SIM_TURN2_ENTRY_KMH = 85;
export const SIM_TURN4_ENTRY_KMH = 130;
export const SIM_TURN6_ENTRY_KMH = 208;

// Braking & acceleration
export const SIM_BRAKE_ZONE_WINDOW = 12;
export const SIM_BRAKE_PREP_DISTANCE = 64;
export const SIM_APEX_HOLD_WINDOW = 8;
export const SIM_BRAKE_DECEL_KMH_PER_SEC = 110;
export const SIM_ACCEL_REFERENCE_START_KMH = 80;
export const SIM_ACCEL_REFERENCE_END_KMH = 330;
export const SIM_ACCEL_REFERENCE_TIME_SEC = 10;
export const SIM_ACCEL_KMH_PER_SEC =
  (SIM_ACCEL_REFERENCE_END_KMH - SIM_ACCEL_REFERENCE_START_KMH) / SIM_ACCEL_REFERENCE_TIME_SEC;
export const SIM_LAUNCH_SPEED_KMH = 0;

// Track markers
export const SIM_TURN1_MARKER = { x: 403, y: 405 };
export const SIM_TURN2_MARKER = { x: 403, y: 355 };
export const SIM_TURN4_MARKER = { x: 205, y: 240 };
export const SIM_TURN6_MARKER = { x: 125, y: 105 };
export const SIM_START_FINISH_MARKER = { x: 600, y: 380.9 };

// DRS system
export const SIM_DRS_OVERLAY_SAMPLE_SPACING = 8;
export const SIM_DRS_ZONE_CONFIGS = [
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
export const SIM_DRS_ACTIVATION_GAP_SEC = 1;
export const SIM_DRS_ACCEL_MULTIPLIER = 1.02;
export const SIM_DRS_TOP_SPEED_BOOST_PU_GT_90 = 0.04;
export const SIM_DRS_TOP_SPEED_BOOST_PU_85_TO_90 = 0.07;
export const SIM_DRS_TOP_SPEED_BOOST_PU_LT_85 = 0.12;

// Race settings
export const SIM_RACE_TOTAL_LAPS = 3;

// ERS system
export const SIM_ERS_BATTERY_START = 100;
export const SIM_ERS_MIN_BATTERY_TO_DEPLOY = 15;
export const SIM_ERS_ACCEL_MULTIPLIER = 1.03;
export const SIM_ERS_SPEED_BOOST_KMH = 10;
export const SIM_ERS_BATTERY_CAPACITY_REFERENCE_DEPLOY = 85;
export const SIM_ERS_BATTERY_CAPACITY_STEP_PER_DEPLOY = 2;
export const SIM_ERS_DRAIN_PERCENT_PER_SEC = 10;
export const SIM_ERS_CHARGE_PERCENT_PER_SEC = 5;

// ============================================================
//  SKILL GROUPS
// ============================================================

export const SKILL_GROUPS = {
  pace:        ['cornering', 'braking', 'reactions'],
  consistency: ['accuracy', 'control', 'smooth'],
  racecraft:   ['adaptability', 'overtaking', 'defending']
};
