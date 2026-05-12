// ============================================================
//  STATE MANAGEMENT & LOCAL STORAGE
// ============================================================

import { DEFAULT_TEAMS_BY_CHAMP, DEFAULT_DRIVERS_BY_CHAMP } from '../config/defaults.js';
import { CAR_STAT_DEFAULTS } from '../config/constants.js';
import { normalizeTeamTag, getTeamTag } from '../utils/helpers.js';

export const state = {
  teams: [],
  drivers: [],
  activity: [],
  nextTeamId: 1,
  nextDriverId: 1
};

export let currentChampionship = null;

export function setCurrentChampionship(id) {
  currentChampionship = id;
}

export function getCurrentChampionship() {
  return currentChampionship;
}

// ============================================================
//  LOCAL STORAGE
// ============================================================

export function saveToStorage() {
  localStorage.setItem(`simracing_state_${currentChampionship}`, JSON.stringify(state));
}

export function loadFromStorage() {
  const saved = localStorage.getItem(`simracing_state_${currentChampionship}`);
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
    const defaultTeamSeedPrefix = `default:${currentChampionship}:`;
    const defaultDriverSeedPrefix = `default-driver:${currentChampionship}:`;

    // Keep only seeded defaults and drop web-entered custom records.
    state.teams = state.teams
      .filter(team => typeof team.seedKey === 'string' && team.seedKey.startsWith(defaultTeamSeedPrefix))
      .map(team => ({
        ...team,
        logo: null,
        carPhoto: null,
        shortTag: normalizeTeamTag(team.shortTag) || null,
        carSetup: normalizeCarSetup(team.carSetup)
      }));

    state.drivers = state.drivers
      .filter(driver => typeof driver.seedKey === 'string' && driver.seedKey.startsWith(defaultDriverSeedPrefix))
      .map(driver => ({
        ...driver,
        age: null,
        photo: null,
        skills: normalizeDriverSkills(driver.skills)
      }));

    // Clear activity that came from previous web edits.
    state.activity = [];
  }

  // Ensure IDs continue correctly even if schema changed between code versions.
  const maxTeamId = state.teams.reduce((max, t) => Math.max(max, Number(t.id) || 0), 0);
  const maxDriverId = state.drivers.reduce((max, d) => Math.max(max, Number(d.id) || 0), 0);
  state.nextTeamId = Math.max(Number(state.nextTeamId) || 1, maxTeamId + 1);
  state.nextDriverId = Math.max(Number(state.nextDriverId) || 1, maxDriverId + 1);

  // Seed defaults and keep values aligned with in-code default datasets.
  const teamsSeeded = ensureDefaultTeams();
  const driversSeeded = ensureDefaultDrivers();
  if (teamsSeeded || driversSeeded) saveToStorage();
}

// ============================================================
//  DEFAULT DATA SEEDING
// ============================================================

function ensureDefaultTeams() {
  const defaults = DEFAULT_TEAMS_BY_CHAMP[currentChampionship] || [];
  let changed = false;

  // Migrate legacy seeded defaults that used index-based seed keys.
  const legacySeedKeyPattern = new RegExp(`^default:${currentChampionship}:\\d+$`);
  const beforeCount = state.teams.length;
  state.teams = state.teams.filter(t => !(typeof t.seedKey === 'string' && legacySeedKeyPattern.test(t.seedKey)));
  if (state.teams.length !== beforeCount) changed = true;

  defaults.forEach((team, idx) => {
    const fallbackSeedId = String(team.name || `team-${idx}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const seedId = team.seedId || fallbackSeedId || `team-${idx}`;
    const seedKey = `default:${currentChampionship}:${seedId}`;
    const seededTeam = state.teams.find(t => t.seedKey === seedKey);
    
    if (seededTeam) {
      seededTeam.name = team.name;
      seededTeam.country = team.country;
      seededTeam.car = team.car;
      seededTeam.category = team.category;
      seededTeam.color = team.color;
      seededTeam.budget = team.budget ?? null;
      seededTeam.logo = null;
      seededTeam.carPhoto = null;
      seededTeam.shortTag = normalizeTeamTag(team.shortTag || getTeamTag(team.name)) || null;
      seededTeam.carSetup = normalizeCarSetup(team.carSetup);
      changed = true;
      return;
    }

    const exists = state.teams.some(t =>
      t.seedKey === seedKey ||
      (String(t.name).toLowerCase() === String(team.name).toLowerCase() &&
       String(t.country).toLowerCase() === String(team.country).toLowerCase())
    );

    if (!exists) {
      state.teams.push({
        id: state.nextTeamId++,
        name: team.name,
        country: team.country,
        car: team.car,
        category: team.category,
        color: team.color,
        budget: team.budget ?? null,
        logo: null,
        carPhoto: null,
        shortTag: normalizeTeamTag(team.shortTag || getTeamTag(team.name)) || null,
        carSetup: normalizeCarSetup(team.carSetup),
        createdAt: new Date().toISOString(),
        seedKey
      });
      changed = true;
    }
  });

  return changed;
}

function ensureDefaultDrivers() {
  const defaults = DEFAULT_DRIVERS_BY_CHAMP[currentChampionship] || [];
  let changed = false;

  const legacySeedKeyPattern = new RegExp(`^default-driver:${currentChampionship}:\\d+$`);
  const beforeCount = state.drivers.length;
  state.drivers = state.drivers.filter(d => !(typeof d.seedKey === 'string' && legacySeedKeyPattern.test(d.seedKey)));
  if (state.drivers.length !== beforeCount) changed = true;

  defaults.forEach((driver, idx) => {
    const fallbackSeedId = `${driver.first}-${driver.last}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const seedId = driver.seedId || fallbackSeedId || `driver-${idx}`;
    const seedKey = `default-driver:${currentChampionship}:${seedId}`;
    const teamSeedKey = `default:${currentChampionship}:${driver.teamSeedId}`;
    const team = state.teams.find(t => t.seedKey === teamSeedKey);
    if (!team) return;

    const seededDriver = state.drivers.find(d => d.seedKey === seedKey);
    if (seededDriver) {
      seededDriver.first = driver.first;
      seededDriver.last = driver.last;
      seededDriver.number = Number(driver.number);
      seededDriver.nationality = driver.nationality;
      seededDriver.teamId = String(team.id);
      seededDriver.age = null;
      seededDriver.photo = null;
      seededDriver.skills = normalizeDriverSkills(driver.skills);
      changed = true;
      return;
    }

    const exists = state.drivers.some(d =>
      d.seedKey === seedKey ||
      (String(d.first).toLowerCase() === String(driver.first).toLowerCase() &&
       String(d.last).toLowerCase() === String(driver.last).toLowerCase() &&
       String(d.teamId) === String(team.id))
    );

    if (!exists) {
      state.drivers.push({
        id: state.nextDriverId++,
        first: driver.first,
        last: driver.last,
        number: Number(driver.number),
        nationality: driver.nationality,
        teamId: String(team.id),
        age: null,
        skills: normalizeDriverSkills(driver.skills),
        photo: null,
        createdAt: new Date().toISOString(),
        seedKey
      });
      changed = true;
    }
  });

  return changed;
}

// ============================================================
//  NORMALIZATION HELPERS
// ============================================================

export function normalizeCarSetup(setup) {
  return {
    powerUnit: Number(setup?.powerUnit) || CAR_STAT_DEFAULTS.powerUnit,
    downforce: Number(setup?.downforce) || CAR_STAT_DEFAULTS.downforce,
    chassis: Number(setup?.chassis) || CAR_STAT_DEFAULTS.chassis,
    reliability: Number(setup?.reliability) || CAR_STAT_DEFAULTS.reliability,
    ersDeploy: Number(setup?.ersDeploy) || CAR_STAT_DEFAULTS.ersDeploy,
    tyreDegradation: Number(setup?.tyreDegradation) || CAR_STAT_DEFAULTS.tyreDegradation
  };
}

export function isUntouchedDefaultCarSetup(setup) {
  const normalized = normalizeCarSetup(setup);
  return (
    normalized.powerUnit === CAR_STAT_DEFAULTS.powerUnit &&
    normalized.downforce === CAR_STAT_DEFAULTS.downforce &&
    normalized.chassis === CAR_STAT_DEFAULTS.chassis &&
    normalized.reliability === CAR_STAT_DEFAULTS.reliability &&
    normalized.ersDeploy === CAR_STAT_DEFAULTS.ersDeploy &&
    normalized.tyreDegradation === CAR_STAT_DEFAULTS.tyreDegradation
  );
}

export function getDefaultDriverSkills() {
  return {
    cornering: 75,
    braking: 75,
    reactions: 75,
    accuracy: 75,
    control: 75,
    smooth: 75,
    adaptability: 75,
    overtaking: 75,
    defending: 75
  };
}

export function normalizeDriverSkills(skills) {
  const fallback = getDefaultDriverSkills();
  const src = skills || {};
  return {
    cornering: Number(src.cornering) || fallback.cornering,
    braking: Number(src.braking) || fallback.braking,
    reactions: Number(src.reactions) || fallback.reactions,
    accuracy: Number(src.accuracy) || fallback.accuracy,
    control: Number(src.control) || fallback.control,
    smooth: Number(src.smooth) || fallback.smooth,
    adaptability: Number(src.adaptability) || fallback.adaptability,
    overtaking: Number(src.overtaking) || fallback.overtaking,
    defending: Number(src.defending) || fallback.defending
  };
}

export function isUntouchedDefaultSkills(skills) {
  const normalized = normalizeDriverSkills(skills);
  return Object.values(normalized).every(v => v === 75);
}

// ============================================================
//  ACTIVITY FEED
// ============================================================

export function addActivity(type, message) {
  state.activity.unshift({ type, message, time: new Date().toISOString() });
  if (state.activity.length > 10) state.activity.pop();
}
