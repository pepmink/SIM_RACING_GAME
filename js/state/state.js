// ============================================================
//  Application State
// ============================================================

import { SIM_DEFAULT_SPEED, SIM_QUALIFYING_DURATION_SEC, SIM_QUALIFYING_MIN_TIME_SCALE, SIM_SESSION_PHASES } from '../config/constants.js';

export const state = {
  teams: [],
  drivers: [],
  activity: [],
  nextTeamId: 1,
  nextDriverId: 1
};

export const simState = {
  running: false,
  rafId: null,
  startTs: 0,
  lastTickTs: 0,
  finishCounter: 0,
  speed: SIM_DEFAULT_SPEED,
  lapLength: 0,
  turn1Distance: null,
  turn2Distance: null,
  turn4Distance: null,
  turn6Distance: null,
  turn7Distance: null,
  turn8Distance: null,
  turn9Distance: null,
  turn10Distance: null,
  turn11Distance: null,
  startFinishDistance: null,
  drsZones: [],
  drsPickMode: null,
  drsDraftZone: {
    startMarker: null,
    endMarker: null
  },
  teamsOnGrid: [],
  teamRuns: [],
  sessionPhase: SIM_SESSION_PHASES.QUALIFYING_PENDING,
  qualifyingRunning: false,
  qualifyingRafId: null,
  qualifyingStartTs: 0,
  qualifyingLastTickTs: 0,
  qualifyingElapsedSec: 0,
  qualifyingDurationSec: SIM_QUALIFYING_DURATION_SEC,
  qualifyingTimeScale: SIM_QUALIFYING_MIN_TIME_SCALE,
  qualifyingRuns: [],
  qualifyingTotalCars: 0,
  qualifyingFinishedCars: 0,
  qualifyingCompleted: false,
  qualifiedGridSignature: null,
  qualifyingGridOrder: [],
  pitExitDistance: null,
  pitLaneLength: 0
};

// Global variables for form state
export let currentChampionship = null;
export let teamLogoData = null;
export let teamCarPhotoData = null;
export let driverPhotoData = null;
export let editingTeamCarSetup = null;
export let editingTeamSeedKey = null;
export let editingDriverSeedKey = null;

// Setters for global variables
export function setCurrentChampionship(value) {
  currentChampionship = value;
}

export function setTeamLogoData(value) {
  teamLogoData = value;
}

export function setTeamCarPhotoData(value) {
  teamCarPhotoData = value;
}

export function setDriverPhotoData(value) {
  driverPhotoData = value;
}

export function setEditingTeamCarSetup(value) {
  editingTeamCarSetup = value;
}

export function setEditingTeamSeedKey(value) {
  editingTeamSeedKey = value;
}

export function setEditingDriverSeedKey(value) {
  driverSeedKey = value;
}
