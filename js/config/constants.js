// ============================================================
//  Simulation Constants
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
export const SIM_TURN7_ENTRY_KMH = 225;
export const SIM_TURN8_ENTRY_KMH = 195;
export const SIM_TURN9_ENTRY_KMH = 228;
export const SIM_TURN10_ENTRY_KMH = 245;
export const SIM_TURN11_ENTRY_KMH = 219;

// Braking & Acceleration
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
export const SIM_TURN7_MARKER = { x: 245, y: 65 };
export const SIM_TURN8_MARKER = { x: 455, y: 260 };
export const SIM_TURN9_MARKER = { x: 490, y: 250 };
export const SIM_TURN10_MARKER = { x: 525, y: 260 };
export const SIM_TURN11_MARKER = { x: 785, y: 260 };
export const SIM_START_FINISH_MARKER = { x: 600, y: 380.9 };
export const SIM_PIT_EXIT_MARKER = { x: 415, y: 378 };

// DRS Configuration
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

// Race Configuration
export const SIM_RACE_TOTAL_LAPS = 3;
export const SIM_RACE_GRID_STAGGER_GAP = 12;
export const SIM_RACE_GRID_POLE_LANE = 1;
export const SIM_RACE_GRID_SECOND_LANE = 2;

// ERS Configuration
export const SIM_ERS_BATTERY_START = 100;
export const SIM_ERS_MIN_BATTERY_TO_DEPLOY = 15;
export const SIM_ERS_ACCEL_MULTIPLIER = 1.03;
export const SIM_ERS_SPEED_BOOST_KMH = 10;
export const SIM_ERS_BATTERY_CAPACITY_REFERENCE_DEPLOY = 85;
export const SIM_ERS_BATTERY_CAPACITY_STEP_PER_DEPLOY = 2;
export const SIM_ERS_DRAIN_PERCENT_PER_SEC = 10;
export const SIM_ERS_CHARGE_PERCENT_PER_SEC = 5;
export const SIM_RACE_ERS_MIN_SPEED_KMH = 250;
export const SIM_RACE_ERS_BASE_ACCEL_BOOST = 0.2;
export const SIM_RACE_ERS_BASE_SPEED_BOOST = 0.3;
export const SIM_RACE_ERS_REFERENCE_RATING = 95;
export const SIM_RACE_ERS_DROP_PER_POINT_95_TO_90 = 0.005;
export const SIM_RACE_ERS_DROP_PER_POINT_90_TO_85 = 0.05;
export const SIM_RACE_ERS_DROP_PER_POINT_85_TO_80 = 0.02;
export const SIM_RACE_ERS_DROP_PER_POINT_80_TO_70 = 0.01;

// Qualifying Configuration
export const SIM_QUALIFYING_DURATION_SEC = 5 * 60;
export const SIM_QUALIFYING_MIN_TIME_SCALE = 1;
export const SIM_QUALIFYING_MAX_TIME_SCALE = 5;
export const SIM_QUALI_PIT_RELEASE_GAP_SEC = 8;
export const SIM_QUALI_PIT_SPEED_KMH = 80;
export const SIM_QUALI_PIT_TURNAROUND_SEC = 10;
export const SIM_QUALI_ERS_MIN_SPEED_KMH = 270;
export const SIM_QUALI_ERS_EXTRA_ACCEL_MULTIPLIER = 1.05;

// Session Phases
export const SIM_SESSION_PHASES = {
  QUALIFYING_PENDING: 'qualifying-pending',
  QUALIFYING_RUNNING: 'qualifying-running',
  RACE_READY: 'race-ready',
  RACE_RUNNING: 'race-running',
  RACE_FINISHED: 'race-finished'
};
