// ============================================================
//  SIM RACING MODULE
// ============================================================

import { state, normalizeCarSetup } from '../core/state.js';
import { escHtml } from '../utils/helpers.js';
import {
  SIM_DEFAULT_SPEED, SIM_BASE_PATH_SPEED, SIM_MAX_SPEED_KMH, SIM_POWER_UNIT_MAX,
  SIM_KMH_DROP_PER_PU, SIM_MAX_TEAMS_ON_TRACK, SIM_LANE_COUNT, SIM_LANE_SPACING,
  SIM_ROW_GAP, SIM_DOT_RADIUS, SIM_TURN1_ENTRY_KMH, SIM_TURN2_ENTRY_KMH,
  SIM_TURN4_ENTRY_KMH, SIM_TURN6_ENTRY_KMH, SIM_BRAKE_PREP_DISTANCE,
  SIM_APEX_HOLD_WINDOW, SIM_BRAKE_DECEL_KMH_PER_SEC, SIM_ACCEL_KMH_PER_SEC,
  SIM_LAUNCH_SPEED_KMH, SIM_TURN1_MARKER, SIM_TURN2_MARKER, SIM_TURN4_MARKER,
  SIM_TURN6_MARKER, SIM_START_FINISH_MARKER, SIM_DRS_OVERLAY_SAMPLE_SPACING,
  SIM_DRS_ZONE_CONFIGS, SIM_DRS_ACTIVATION_GAP_SEC, SIM_DRS_ACCEL_MULTIPLIER,
  SIM_DRS_TOP_SPEED_BOOST_PU_GT_90, SIM_DRS_TOP_SPEED_BOOST_PU_85_TO_90,
  SIM_DRS_TOP_SPEED_BOOST_PU_LT_85, SIM_RACE_TOTAL_LAPS, SIM_ERS_BATTERY_START,
  SIM_ERS_MIN_BATTERY_TO_DEPLOY, SIM_ERS_ACCEL_MULTIPLIER, SIM_ERS_SPEED_BOOST_KMH,
  SIM_ERS_BATTERY_CAPACITY_REFERENCE_DEPLOY, SIM_ERS_BATTERY_CAPACITY_STEP_PER_DEPLOY,
  SIM_ERS_DRAIN_PERCENT_PER_SEC, SIM_ERS_CHARGE_PERCENT_PER_SEC, CAR_STAT_DEFAULTS
} from '../config/constants.js';

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
  startFinishDistance: null,
  drsZones: [],
  drsPickMode: null,
  drsDraftZone: {
    startMarker: null,
    endMarker: null
  },
  teamsOnGrid: [],
  teamRuns: []
};

export function initSimRacingSection() {
  const btn = document.getElementById('btnSimRacing');
  const resetBtn = document.getElementById('btnSimReset');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!canStartSimPreview()) {
      window.showToast('At least 2 teams are required to preview Monza', 'info');
      return;
    }

    if (simState.running) {
      stopSimRacingAnimation();
      setSimStatus('Simulation paused. Click Sim Racing to run again at 1x speed.');
      return;
    }

    startSimRacingAnimation();
    window.showToast('Simulation preview started at 1x speed.', 'success');
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      stopSimRacingAnimation();
      setSimResetButtonVisible(false);
      setSimResultsTabVisible(false);
      renderSimRacingPreview();
      setSimStatus('Race reset. Click Sim Racing to start again.');
      window.showToast('Race has been reset.', 'success');
    });
  }

  initSimDrsCoordinatePicker();
  setSimResetButtonVisible(false);
  setSimResultsTabVisible(false);
  renderSimRacingPreview();
}

function initSimDrsCoordinatePicker() {
  const btnStart = document.getElementById('btnPickDrsStart');
  const btnEnd = document.getElementById('btnPickDrsEnd');
  const btnCopy = document.getElementById('btnCopyDrsCoords');
  const trackSvg = document.querySelector('#section-sim-racing .monza-track');
  if (!btnStart || !btnEnd || !btnCopy || !trackSvg) return;

  btnStart.addEventListener('click', () => {
    simState.drsPickMode = 'start';
    updateSimDrsPickerUI();
    setSimStatus('DRS picker: click on track to set START coordinate.');
  });

  btnEnd.addEventListener('click', () => {
    simState.drsPickMode = 'end';
    updateSimDrsPickerUI();
    setSimStatus('DRS picker: click on track to set END coordinate.');
  });

  btnCopy.addEventListener('click', async () => {
    const start = simState.drsDraftZone.startMarker;
    const end = simState.drsDraftZone.endMarker;
    if (!start || !end) {
      window.showToast('Pick both START and END coordinates first.', 'info');
      return;
    }

    const configText = `{ id: 'DRS X', startMarker: { x: ${start.x}, y: ${start.y} }, endMarker: { x: ${end.x}, y: ${end.y} } }`;
    try {
      await navigator.clipboard.writeText(configText);
      window.showToast('DRS coordinates copied to clipboard.', 'success');
    } catch (_error) {
      window.showToast('Could not copy automatically. Coordinate text is shown below.', 'warning');
    }
    setSimStatus(`DRS config: ${configText}`);
  });

  trackSvg.addEventListener('click', event => {
    if (!simState.drsPickMode) return;
    const picked = getSvgCoordinateFromEvent(trackSvg, event);
    if (!picked) return;

    if (simState.drsPickMode === 'start') {
      simState.drsDraftZone.startMarker = picked;
      window.showToast(`DRS START set at (${picked.x}, ${picked.y})`, 'success');
    } else {
      simState.drsDraftZone.endMarker = picked;
      window.showToast(`DRS END set at (${picked.x}, ${picked.y})`, 'success');
    }

    simState.drsPickMode = null;
    updateSimDrsPickerUI();
    renderSimRacingPreview();
  });

  updateSimDrsPickerUI();
}

function getSvgCoordinateFromEvent(svg, event) {
  if (!svg || !event || typeof svg.createSVGPoint !== 'function') return null;
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;

  const pt = svg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const transformed = pt.matrixTransform(matrix.inverse());
  return {
    x: Number(transformed.x.toFixed(1)),
    y: Number(transformed.y.toFixed(1))
  };
}

function updateSimDrsPickerUI() {
  const btnStart = document.getElementById('btnPickDrsStart');
  const btnEnd = document.getElementById('btnPickDrsEnd');
  const coords = document.getElementById('simDrsCoords');
  const trackSvg = document.querySelector('#section-sim-racing .monza-track');

  const start = simState.drsDraftZone.startMarker;
  const end = simState.drsDraftZone.endMarker;
  const startText = start ? `(${start.x}, ${start.y})` : '-';
  const endText = end ? `(${end.x}, ${end.y})` : '-';
  const pickModeText = simState.drsPickMode ? ` | Picking: ${simState.drsPickMode.toUpperCase()}` : '';

  if (coords) coords.textContent = `DRS Start: ${startText} | DRS End: ${endText}${pickModeText}`;
  if (btnStart) btnStart.classList.toggle('is-active', simState.drsPickMode === 'start');
  if (btnEnd) btnEnd.classList.toggle('is-active', simState.drsPickMode === 'end');
  if (trackSvg) trackSvg.classList.toggle('drs-pick-mode', Boolean(simState.drsPickMode));
}

function canStartSimPreview() {
  return state.teams.length >= 2;
}

export function renderSimRacingPreview() {
  const btn = document.getElementById('btnSimRacing');
  const status = document.getElementById('simStatus');
  const markerWrap = document.getElementById('monzaMarkers');
  const legend = document.getElementById('simTeamLegend');
  const raceDots = document.getElementById('monzaRaceDots');
  if (!btn || !status || !markerWrap || !legend) return;

  const ready = canStartSimPreview();
  btn.disabled = !ready;

  if (!ready) {
    stopSimRacingAnimation();
    setSimResetButtonVisible(false);
    setSimResultsTabVisible(false);
    btn.textContent = 'Sim Racing';
    status.textContent = 'At least 2 teams are required to build the Monza grid.';
    markerWrap.innerHTML = '';
    if (raceDots) raceDots.innerHTML = '';
    legend.innerHTML = '<span class="sim-status">Add 2 teams to show colored markers on the track.</span>';
    return;
  }

  if (!simState.running) {
    status.textContent = `Monza preview is ready. Speed is based on Power Unit (${SIM_POWER_UNIT_MAX} => ${SIM_MAX_SPEED_KMH} km/h).`;
  }

  if (!simState.running) setSimResetButtonVisible(false);
  if (!simState.running) setSimResultsTabVisible(false);

  const teamsOnGrid = state.teams.slice(0, SIM_MAX_TEAMS_ON_TRACK);
  simState.teamsOnGrid = teamsOnGrid;
  simState.teamRuns = buildSimTeamRuns(teamsOnGrid);

  const path = document.getElementById('monzaRaceLine');
  if (path) {
    simState.lapLength = path.getTotalLength();
    updateSimBrakeDistances(path, simState.lapLength);
    updateSimStartFinishDistance(path, simState.lapLength);
    updateSimDrsZones(path, simState.lapLength);
  }

  btn.textContent = simState.running ? 'Stop Sim' : 'Sim Racing';
  markerWrap.innerHTML = renderSimDrsZoneBadges(simState.drsZones);
  renderRaceDotsAtTime(0);
}

function startSimRacingAnimation() {
  const path = document.getElementById('monzaRaceLine');
  if (!path) return;

  simState.speed = SIM_DEFAULT_SPEED;
  simState.startTs = performance.now();
  simState.lastTickTs = simState.startTs;
  simState.finishCounter = 0;
  simState.running = true;
  simState.teamsOnGrid = state.teams.slice(0, SIM_MAX_TEAMS_ON_TRACK);
  simState.teamRuns = buildSimTeamRuns(simState.teamsOnGrid).map(run => {
    const launchSpeedKmh = Math.min(run.speedKmh, SIM_LAUNCH_SPEED_KMH);
    return {
      ...run,
      currentDistance: -run.gridOffset,
      currentPathSpeed: (launchSpeedKmh / SIM_MAX_SPEED_KMH) * SIM_BASE_PATH_SPEED * simState.speed,
      currentSpeedKmh: launchSpeedKmh,
      ersBattery: run.ersBatteryMax,
      drsActive: false,
      drsZoneId: null,
      drsEndDistance: null,
      drsTopSpeedKmh: run.speedKmh,
      ersActive: false,
      ersBoostKmh: 0,
      gapAheadSec: null,
      lapCrossings: 0,
      distanceTargetReached: false,
      distanceTargetReachedTimeSec: null,
      finishTimeSec: null,
      finishOrder: null,
      finishedRace: false
    };
  });
  simState.lapLength = path.getTotalLength();
  updateSimBrakeDistances(path, simState.lapLength);
  updateSimStartFinishDistance(path, simState.lapLength);
  updateSimDrsZones(path, simState.lapLength);

  const btn = document.getElementById('btnSimRacing');
  if (btn) btn.textContent = 'Stop Sim';
  setSimResetButtonVisible(false);
  setSimResultsTabVisible(false);

  setSimStatus('Simulation preview running. Cars use speed from Power Unit and can overtake.');
  renderRaceDotsAtTime(0);

  const tick = now => {
    if (!simState.running) return;

    const dtSec = Math.max(0, (now - simState.lastTickTs) / 1000);
    simState.lastTickTs = now;
    advanceSimRuns(dtSec, simState.lapLength);

    const elapsedSec = (now - simState.startTs) / 1000;
    renderRaceDotsAtTime(elapsedSec, simState.lapLength);

    const raceResults = getSimRaceResults(simState.lapLength, SIM_RACE_TOTAL_LAPS);
    if (raceResults) {
      stopSimRacingAnimation();
      setSimResetButtonVisible(true);
      renderSimResultsTab(raceResults, SIM_RACE_TOTAL_LAPS);
      setSimResultsTabVisible(true);
      const podium = raceResults.slice(0, 3);
      const podiumText = podium
        .map((run, idx) => `P${idx + 1} ${run.tag} (${getSimRunDisplayName(run)}) ${Number(run.finishTimeSec || 0).toFixed(3)}s`)
        .join(' · ');
      setSimStatus(`Race finished (${SIM_RACE_TOTAL_LAPS} laps). Podium: ${podiumText}`);
      return;
    }

    if (simState.running) {
      simState.rafId = requestAnimationFrame(tick);
    }
  };

  simState.rafId = requestAnimationFrame(tick);
}

function stopSimRacingAnimation() {
  if (simState.rafId) cancelAnimationFrame(simState.rafId);
  simState.rafId = null;
  simState.running = false;
  simState.lastTickTs = 0;

  const btn = document.getElementById('btnSimRacing');
  if (btn) btn.textContent = 'Sim Racing';
}

function renderRaceDotsAtTime(elapsedSec, cachedLapLength) {
  const path = document.getElementById('monzaRaceLine');
  const dotsLayer = document.getElementById('monzaRaceDots');
  if (!path || !dotsLayer) return;

  const lapLength = cachedLapLength || path.getTotalLength();
  if (!simState.drsZones.length) {
    updateSimDrsZones(path, lapLength);
  }
  const drsZoneMarkup = renderSimDrsZonesMarkup(path, lapLength, simState.drsZones);

  const runs = simState.teamRuns.length > 0
    ? simState.teamRuns
    : buildSimTeamRuns(state.teams.slice(0, SIM_MAX_TEAMS_ON_TRACK));
  const visibleRuns = runs.filter(run => !run.finishedRace);

  if (visibleRuns.length < 1) {
    dotsLayer.innerHTML = drsZoneMarkup;
    renderSimDriverTiming(runs, elapsedSec, lapLength);
    return;
  }
  
  const laneCenter = (SIM_LANE_COUNT - 1) / 2;
  const raceDotMarkup = visibleRuns.map(run => {
    const laneOffset = (run.laneIndex - laneCenter) * SIM_LANE_SPACING + run.uniqueLaneNudge;
    const rawDistance = typeof run.currentDistance === 'number'
      ? run.currentDistance
      : (elapsedSec * run.pathSpeed - run.gridOffset);
    const wrappedDistance = ((rawDistance % lapLength) + lapLength) % lapLength;
    const point = getPointWithLaneOffset(path, wrappedDistance, laneOffset, lapLength);
    const teamTag = run.tag;
    const labelX = point.x + SIM_DOT_RADIUS + 3;
    const labelY = point.y - (SIM_DOT_RADIUS + 2);
    const currentSpeed = run.currentSpeedKmh ?? run.speedKmh;
    const batteryMax = Number(run.ersBatteryMax) || SIM_ERS_BATTERY_START;
    const battery = clampSimBattery(run.ersBattery ?? batteryMax, batteryMax);
    const drsState = run.drsActive ? `DRS ON ${run.drsZoneId || ''}`.trim() : 'DRS OFF';
    const ersState = run.ersActive ? `ERS ON +${Math.round(run.ersBoostKmh || 0)} km/h` : 'ERS OFF';

    return `
      <g class="sim-race-marker">
        <title>${escHtml(run.tag)} (${escHtml(run.team.name)}) · ${Math.round(currentSpeed)} km/h · ${drsState} · ${ersState} · BAT ${battery.toFixed(1)}%</title>
        <circle class="sim-race-dot" cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="${SIM_DOT_RADIUS}" fill="${run.team.color}"></circle>
        <text class="sim-race-tag" x="${labelX.toFixed(2)}" y="${labelY.toFixed(2)}">${escHtml(teamTag)}</text>
      </g>
    `;
  }).join('');

  dotsLayer.innerHTML = `${drsZoneMarkup}${raceDotMarkup}`;

  renderSimDriverTiming(runs, elapsedSec, lapLength);
}

function getSimRunDisplayName(run) {
  if (run.driver) return `${run.driver.first} ${run.driver.last}`;
  return `${run.tag} (${run.team.name})`;
}

function renderSimDriverTiming(runs, elapsedSec, lapLength) {
  const legend = document.getElementById('simTeamLegend');
  if (!legend || !Array.isArray(runs) || runs.length === 0 || !lapLength) return;

  const ordered = runs.map(run => {
    const rawDistance = typeof run.currentDistance === 'number'
      ? run.currentDistance
      : (elapsedSec * run.pathSpeed - run.gridOffset);
    return {
      run,
      rawDistance
    };
  }).sort((a, b) => b.rawDistance - a.rawDistance);

  legend.innerHTML = ordered.map((entry, idx) => {
    let timing = 'Leader';
    if (idx > 0) {
      const ahead = ordered[idx - 1];
      const intervalDistance = Math.max(0, ahead.rawDistance - entry.rawDistance);
      const intervalSpeed = Math.max(entry.run.currentPathSpeed || entry.run.pathSpeed, 0.0001);
      const intervalSec = intervalDistance / intervalSpeed;
      timing = `INT +${intervalSec.toFixed(3)}s`;
    }
    const progressDistance = Math.max(0, entry.rawDistance + (Number(entry.run.gridOffset) || 0));
    const lap = Math.max(1, Math.floor(progressDistance / lapLength) + 1);
    const runPathSpeed = Math.max(entry.run.currentPathSpeed || entry.run.pathSpeed, 0.0001);
    const lapTime = lapLength / runPathSpeed;
    const shownSpeed = Math.round(entry.run.currentSpeedKmh || entry.run.speedKmh);
    const ersBatteryMax = Number(entry.run.ersBatteryMax) || SIM_ERS_BATTERY_START;
    const ersBattery = clampSimBattery(entry.run.ersBattery ?? ersBatteryMax, ersBatteryMax);
    const drsLabel = entry.run.drsActive
      ? `DRS ON (${entry.run.drsZoneId || 'ZONE'})`
      : 'DRS OFF';
    const ersLabel = entry.run.ersActive
      ? `ERS ON (+${Math.round(entry.run.ersBoostKmh || 0)})`
      : 'ERS OFF';

    return `
      <span class="sim-legend-item">
        <span class="sim-legend-dot" style="background:${entry.run.team.color}"></span>
        <span>P${idx + 1} · ${escHtml(entry.run.tag)} · ${escHtml(getSimRunDisplayName(entry.run))} · ${timing} · ${shownSpeed} km/h · BAT ${ersBattery.toFixed(1)}% · ${drsLabel} · ${ersLabel} · L${lap} · ${lapTime.toFixed(2)}s/lap</span>
      </span>
    `;
  }).join('');
}

// Continue in next part...

// ============================================================
//  SIM RACING HELPER FUNCTIONS
// ============================================================

function updateSimBrakeDistances(path, lapLength) {
  if (!path || !lapLength) return;
  simState.turn1Distance = findClosestDistanceOnPath(path, SIM_TURN1_MARKER.x, SIM_TURN1_MARKER.y, lapLength);
  simState.turn2Distance = findClosestDistanceOnPath(path, SIM_TURN2_MARKER.x, SIM_TURN2_MARKER.y, lapLength);
  simState.turn4Distance = findClosestDistanceOnPath(path, SIM_TURN4_MARKER.x, SIM_TURN4_MARKER.y, lapLength);
  simState.turn6Distance = findClosestDistanceOnPath(path, SIM_TURN6_MARKER.x, SIM_TURN6_MARKER.y, lapLength);
}

function updateSimStartFinishDistance(path, lapLength) {
  if (!path || !lapLength) {
    simState.startFinishDistance = null;
    return;
  }
  simState.startFinishDistance = findClosestDistanceOnPath(
    path,
    SIM_START_FINISH_MARKER.x,
    SIM_START_FINISH_MARKER.y,
    lapLength
  );
}

function updateSimDrsZones(path, lapLength) {
  if (!path || !lapLength) {
    simState.drsZones = [];
    return;
  }

  const zoneDefs = SIM_DRS_ZONE_CONFIGS.slice();
  if (simState.drsDraftZone.startMarker && simState.drsDraftZone.endMarker) {
    zoneDefs.unshift({
      id: 'DRS DRAFT',
      startMarker: simState.drsDraftZone.startMarker,
      endMarker: simState.drsDraftZone.endMarker
    });
  }

  simState.drsZones = zoneDefs.map(zone => {
    const startDistance = findClosestDistanceOnPath(path, zone.startMarker.x, zone.startMarker.y, lapLength);
    const endDistance = findClosestDistanceOnPath(path, zone.endMarker.x, zone.endMarker.y, lapLength);
    const zoneLength = getForwardDistanceOnLap(startDistance, endDistance, lapLength);
    return {
      ...zone,
      startDistance,
      endDistance,
      zoneLength
    };
  }).filter(zone => zone.zoneLength > 1);
}

function renderSimDrsZoneBadges(zones) {
  if (!Array.isArray(zones) || zones.length === 0) {
    return '<span class="sim-drs-chip">No DRS zone configured</span>';
  }

  return zones.map(zone => {
    const zoneLength = Math.round(Number(zone.zoneLength) || 0);
    return `<span class="sim-drs-chip">${escHtml(zone.id)} ACTIVE · LEN ${zoneLength}</span>`;
  }).join('');
}

function renderSimDrsZonesMarkup(path, lapLength, zones) {
  if (!path || !lapLength || !Array.isArray(zones) || zones.length === 0) return '';

  return zones.map(zone => {
    const startDistance = ((zone.startDistance % lapLength) + lapLength) % lapLength;
    const zoneLength = Math.max(0.1, Number(zone.zoneLength) || 0.1);
    const endDistance = (startDistance + zoneLength) % lapLength;
    const midDistance = (startDistance + zoneLength * 0.5) % lapLength;

    const startPoint = path.getPointAtLength(startDistance);
    const endPoint = path.getPointAtLength(endDistance);
    const labelPoint = path.getPointAtLength(midDistance);
    const polylinePoints = buildPathSegmentPolyline(
      path,
      startDistance,
      zoneLength,
      lapLength,
      SIM_DRS_OVERLAY_SAMPLE_SPACING
    );

    return `
      <g class="sim-drs-zone" aria-label="${escHtml(zone.id)} activation zone">
        <polyline class="sim-drs-zone-line" points="${polylinePoints}"></polyline>
        <circle class="sim-drs-zone-node sim-drs-zone-start" cx="${startPoint.x.toFixed(2)}" cy="${startPoint.y.toFixed(2)}" r="3"></circle>
        <circle class="sim-drs-zone-node sim-drs-zone-end" cx="${endPoint.x.toFixed(2)}" cy="${endPoint.y.toFixed(2)}" r="3"></circle>
        <text class="sim-drs-zone-label" x="${labelPoint.x.toFixed(2)}" y="${(labelPoint.y - 8).toFixed(2)}">${escHtml(zone.id)}</text>
      </g>
    `;
  }).join('');
}

function buildPathSegmentPolyline(path, startDistance, segmentLength, lapLength, stepDistance) {
  const distance = Math.max(0.1, Number(segmentLength) || 0.1);
  const step = Math.max(2, Number(stepDistance) || 8);
  const sampleCount = Math.max(6, Math.ceil(distance / step));
  const points = [];

  for (let i = 0; i <= sampleCount; i++) {
    const traveled = (distance * i) / sampleCount;
    const sampleDistance = (startDistance + traveled) % lapLength;
    const point = path.getPointAtLength(sampleDistance);
    points.push(`${point.x.toFixed(2)},${point.y.toFixed(2)}`);
  }

  return points.join(' ');
}

function findClosestDistanceOnPath(path, targetX, targetY, lapLength) {
  let bestDistance = 0;
  let bestScore = Number.POSITIVE_INFINITY;
  const samples = Math.max(600, Math.floor(lapLength * 2));

  for (let i = 0; i <= samples; i++) {
    const distance = (lapLength * i) / samples;
    const p = path.getPointAtLength(distance);
    const dx = p.x - targetX;
    const dy = p.y - targetY;
    const score = dx * dx + dy * dy;
    if (score < bestScore) {
      bestScore = score;
      bestDistance = distance;
    }
  }

  return bestDistance;
}

function getForwardDistanceOnLap(fromDistance, toDistance, lapLength) {
  return ((toDistance - fromDistance) % lapLength + lapLength) % lapLength;
}

function hasCrossedDistanceOnLap(fromDistance, toDistance, targetDistance, lapLength) {
  if (!lapLength) return false;
  const traveled = getForwardDistanceOnLap(fromDistance, toDistance, lapLength);
  const targetAhead = getForwardDistanceOnLap(fromDistance, targetDistance, lapLength);
  const epsilon = 1e-4;
  return targetAhead > epsilon && targetAhead <= traveled + epsilon;
}

function isDrsGapEligible(gapAheadSec) {
  return Number.isFinite(gapAheadSec) && gapAheadSec < SIM_DRS_ACTIVATION_GAP_SEC;
}

function getDrsTopSpeedMultiplier(powerUnit) {
  const pu = Math.max(1, Number(powerUnit) || 1);
  if (pu > 90) return 1 + SIM_DRS_TOP_SPEED_BOOST_PU_GT_90;
  if (pu >= 85) return 1 + SIM_DRS_TOP_SPEED_BOOST_PU_85_TO_90;
  return 1 + SIM_DRS_TOP_SPEED_BOOST_PU_LT_85;
}

function applyTurnSpeedTarget(baseSpeedKmh, distanceOnLap, turnDistance, turnTargetSpeed, lapLength) {
  if (turnDistance == null || !lapLength) return baseSpeedKmh;

  let target = baseSpeedKmh;
  const forwardToTurn = getForwardDistanceOnLap(distanceOnLap, turnDistance, lapLength);

  if (forwardToTurn <= SIM_BRAKE_PREP_DISTANCE) {
    const t = Math.max(0, Math.min(1, forwardToTurn / SIM_BRAKE_PREP_DISTANCE));
    const rampSpeed = turnTargetSpeed + (baseSpeedKmh - turnTargetSpeed) * t;
    target = Math.min(target, rampSpeed);
  }

  if (isDistanceInsideWindow(distanceOnLap, turnDistance, SIM_APEX_HOLD_WINDOW, lapLength)) {
    target = Math.min(target, turnTargetSpeed);
  }

  return target;
}

function isDistanceInsideWindow(distanceOnLap, centerDistance, halfWindow, lapLength) {
  if (centerDistance == null || !lapLength) return false;
  const diff = Math.abs(distanceOnLap - centerDistance);
  const wrappedDiff = Math.min(diff, lapLength - diff);
  return wrappedDiff <= halfWindow;
}

function getBrakeTargetSpeedKmh(baseSpeedKmh, distanceOnLap, lapLength) {
  let target = baseSpeedKmh;
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn1Distance, SIM_TURN1_ENTRY_KMH, lapLength);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn2Distance, SIM_TURN2_ENTRY_KMH, lapLength);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn4Distance, SIM_TURN4_ENTRY_KMH, lapLength);
  target = applyTurnSpeedTarget(target, distanceOnLap, simState.turn6Distance, SIM_TURN6_ENTRY_KMH, lapLength);
  return target;
}

function normalizeErsDeployRating(value) {
  const parsed = Number(value);
  const fallback = CAR_STAT_DEFAULTS.ersDeploy;
  const normalized = Number.isFinite(parsed) ? parsed : fallback;
  return Math.min(SIM_POWER_UNIT_MAX, Math.max(1, normalized));
}

function getErsBatteryCapacityPercent(ersDeployRating) {
  const rating = normalizeErsDeployRating(ersDeployRating);
  const capacity = SIM_ERS_BATTERY_START +
    (rating - SIM_ERS_BATTERY_CAPACITY_REFERENCE_DEPLOY) * SIM_ERS_BATTERY_CAPACITY_STEP_PER_DEPLOY;
  return Math.max(1, capacity);
}

function clampSimBattery(value, maxBattery = SIM_ERS_BATTERY_START) {
  return Math.max(0, Math.min(maxBattery, Number(value) || 0));
}

function getErsBoostKmh(ersDeployRating) {
  normalizeErsDeployRating(ersDeployRating);
  return SIM_ERS_SPEED_BOOST_KMH;
}

function getErsDrainRatePercentPerSec(ersDeployRating) {
  normalizeErsDeployRating(ersDeployRating);
  return SIM_ERS_DRAIN_PERCENT_PER_SEC;
}

function getErsChargeRatePercentPerSec(ersDeployRating) {
  normalizeErsDeployRating(ersDeployRating);
  return SIM_ERS_CHARGE_PERCENT_PER_SEC;
}

function getRequiredBrakeDecelKmhPerSec(currentSpeedKmh, distanceOnLap, currentPathSpeed, lapLength) {
  const constraints = [
    { turnDistance: simState.turn1Distance, targetSpeed: SIM_TURN1_ENTRY_KMH },
    { turnDistance: simState.turn2Distance, targetSpeed: SIM_TURN2_ENTRY_KMH },
    { turnDistance: simState.turn4Distance, targetSpeed: SIM_TURN4_ENTRY_KMH },
    { turnDistance: simState.turn6Distance, targetSpeed: SIM_TURN6_ENTRY_KMH }
  ];

  let requiredDecel = 0;

  constraints.forEach(({ turnDistance, targetSpeed }) => {
    if (turnDistance == null) return;
    const distanceToTurn = getForwardDistanceOnLap(distanceOnLap, turnDistance, lapLength);
    if (distanceToTurn > SIM_BRAKE_PREP_DISTANCE) return;
    if (currentSpeedKmh <= targetSpeed) return;

    const timeToTurn = distanceToTurn / Math.max(currentPathSpeed, 0.05);
    const neededDecel = (currentSpeedKmh - targetSpeed) / Math.max(timeToTurn, 0.05);
    requiredDecel = Math.max(requiredDecel, neededDecel * 1.1);
  });

  return requiredDecel;
}

function advanceSimRuns(dtSec, lapLength) {
  if (!dtSec || dtSec <= 0 || !lapLength || !Array.isArray(simState.teamRuns)) return;

  const elapsedSecNow = simState.startTs > 0 ? (simState.lastTickTs - simState.startTs) / 1000 : 0;
  const elapsedSecAfterStep = elapsedSecNow + dtSec;

  const orderedRuns = simState.teamRuns
    .slice()
    .sort((a, b) => {
      const distA = typeof a.currentDistance === 'number' ? a.currentDistance : -a.gridOffset;
      const distB = typeof b.currentDistance === 'number' ? b.currentDistance : -b.gridOffset;
      return distB - distA;
    });

  const gapAheadSecByRun = new Map();
  orderedRuns.forEach((run, idx) => {
    if (idx === 0) {
      gapAheadSecByRun.set(run, Number.POSITIVE_INFINITY);
      return;
    }

    const ahead = orderedRuns[idx - 1];
    const runDistance = typeof run.currentDistance === 'number' ? run.currentDistance : -run.gridOffset;
    const aheadDistance = typeof ahead.currentDistance === 'number' ? ahead.currentDistance : -ahead.gridOffset;
    const gapDistance = Math.max(0, aheadDistance - runDistance);
    const speedRef = Math.max(run.currentPathSpeed || run.pathSpeed, 0.05);
    gapAheadSecByRun.set(run, gapDistance / speedRef);
  });

  simState.teamRuns.forEach(run => {
    if (run.finishedRace) {
      run.currentSpeedKmh = 0;
      run.currentPathSpeed = 0;
      run.ersActive = false;
      run.ersBoostKmh = 0;
      run.drsActive = false;
      run.drsZoneId = null;
      run.drsEndDistance = null;
      run.gapAheadSec = null;
      return;
    }

    if (typeof run.currentDistance !== 'number') {
      run.currentDistance = -run.gridOffset;
    }

    const previousRaceProgress = getRunRaceProgressDistance(run);
    const wrappedDistance = ((run.currentDistance % lapLength) + lapLength) % lapLength;
    const previousDistanceOnLap = wrappedDistance;
    const referencePathSpeed = Math.max(run.currentPathSpeed || run.pathSpeed, 0.05);

    const ersDeployRating = normalizeErsDeployRating(run.ersDeployRating);
    const ersBatteryMax = getErsBatteryCapacityPercent(ersDeployRating);
    const currentBattery = clampSimBattery(run.ersBattery ?? ersBatteryMax, ersBatteryMax);
    const gapAheadSec = gapAheadSecByRun.get(run);

    const drsGapEligible = isDrsGapEligible(gapAheadSec);
    const drsActiveForStep = Boolean(run.drsActive);
    const drsTopSpeedMultiplier = drsActiveForStep ? getDrsTopSpeedMultiplier(run.powerUnit) : 1;
    const drsTopSpeedKmh = run.speedKmh * drsTopSpeedMultiplier;
    const currentSpeed = typeof run.currentSpeedKmh === 'number' ? run.currentSpeedKmh : run.speedKmh;
    const shouldDeployErs =
      currentBattery > SIM_ERS_MIN_BATTERY_TO_DEPLOY &&
      currentSpeed >= drsTopSpeedKmh - 0.5;

    const ersBoostKmh = shouldDeployErs ? getErsBoostKmh(ersDeployRating) : 0;
    const baseSpeedWithErs = drsTopSpeedKmh + ersBoostKmh;
    const targetSpeedKmh = getBrakeTargetSpeedKmh(baseSpeedWithErs, wrappedDistance, lapLength);

    const adaptiveDecel = getRequiredBrakeDecelKmhPerSec(currentSpeed, wrappedDistance, referencePathSpeed, lapLength);
    const decelRate = Math.max(SIM_BRAKE_DECEL_KMH_PER_SEC, adaptiveDecel);
    const decelStep = decelRate * dtSec;
    const accelMultiplier =
      (drsActiveForStep ? SIM_DRS_ACCEL_MULTIPLIER : 1) *
      (shouldDeployErs ? SIM_ERS_ACCEL_MULTIPLIER : 1);
    const accelStep = SIM_ACCEL_KMH_PER_SEC * accelMultiplier * dtSec;

    let nextSpeed = currentSpeed;
    if (targetSpeedKmh < currentSpeed) {
      nextSpeed = Math.max(targetSpeedKmh, currentSpeed - decelStep);
    } else if (targetSpeedKmh > currentSpeed) {
      nextSpeed = Math.min(targetSpeedKmh, currentSpeed + accelStep);
    }

    let nextBattery = currentBattery;
    if (shouldDeployErs) {
      nextBattery -= getErsDrainRatePercentPerSec(ersDeployRating) * dtSec;
    } else {
      nextBattery += getErsChargeRatePercentPerSec(ersDeployRating) * dtSec;
    }
    nextBattery = clampSimBattery(nextBattery, ersBatteryMax);

    run.currentSpeedKmh = nextSpeed;
    run.currentPathSpeed = (nextSpeed / SIM_MAX_SPEED_KMH) * SIM_BASE_PATH_SPEED * simState.speed;
    run.currentDistance += run.currentPathSpeed * dtSec;
    const currentRaceProgress = getRunRaceProgressDistance(run);
    const nextDistanceOnLap = ((run.currentDistance % lapLength) + lapLength) % lapLength;

    const finishLineDistance = simState.startFinishDistance;
    const crossedStartFinishLine =
      typeof finishLineDistance === 'number' &&
      hasCrossedDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, finishLineDistance, lapLength);

    let crossingTimeSec = null;
    if (crossedStartFinishLine) {
      const traveledOnLap = Math.max(
        getForwardDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, lapLength),
        1e-6
      );
      const distanceToLine = getForwardDistanceOnLap(previousDistanceOnLap, finishLineDistance, lapLength);
      const crossingFraction = Math.max(0, Math.min(1, distanceToLine / traveledOnLap));
      crossingTimeSec = elapsedSecNow + dtSec * crossingFraction;
      run.lapCrossings = (Number(run.lapCrossings) || 0) + 1;
    }

    const raceTargetDistance = SIM_RACE_TOTAL_LAPS * lapLength;
    if (previousRaceProgress < raceTargetDistance && currentRaceProgress >= raceTargetDistance) {
      const progressedThisStep = Math.max(currentRaceProgress - previousRaceProgress, 1e-6);
      const distanceToTarget = raceTargetDistance - previousRaceProgress;
      const completionFraction = Math.max(0, Math.min(1, distanceToTarget / progressedThisStep));
      run.distanceTargetReached = true;
      run.distanceTargetReachedTimeSec = elapsedSecNow + dtSec * completionFraction;
    } else if (!run.distanceTargetReached && currentRaceProgress >= raceTargetDistance) {
      run.distanceTargetReached = true;
      run.distanceTargetReachedTimeSec = elapsedSecAfterStep;
    }

    const canFinishAtStartLine =
      run.distanceTargetReached &&
      crossedStartFinishLine &&
      Number.isFinite(crossingTimeSec);
    const canFinishWithoutStartLine =
      run.distanceTargetReached &&
      typeof finishLineDistance !== 'number';

    if ((canFinishAtStartLine || canFinishWithoutStartLine) && !run.finishedRace) {
      run.finishedRace = true;
      run.finishTimeSec = canFinishAtStartLine
        ? crossingTimeSec
        : (Number(run.distanceTargetReachedTimeSec) || elapsedSecAfterStep);
      simState.finishCounter += 1;
      run.finishOrder = simState.finishCounter;
      run.currentSpeedKmh = 0;
      run.currentPathSpeed = 0;
    }

    if (!run.drsActive && drsGapEligible && Array.isArray(simState.drsZones) && simState.drsZones.length > 0) {
      const activationZone = simState.drsZones.find(zone =>
        hasCrossedDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, zone.startDistance, lapLength)
      ) || null;
      if (activationZone) {
        run.drsActive = true;
        run.drsZoneId = activationZone.id || 'DRS';
        run.drsEndDistance = activationZone.endDistance;
      }
    }

    if (run.drsActive && typeof run.drsEndDistance === 'number') {
      const crossedDrsEnd = hasCrossedDistanceOnLap(previousDistanceOnLap, nextDistanceOnLap, run.drsEndDistance, lapLength);
      if (crossedDrsEnd) {
        run.drsActive = false;
        run.drsZoneId = null;
        run.drsEndDistance = null;
      }
    }

    run.ersBatteryMax = ersBatteryMax;
    run.ersBattery = nextBattery;
    run.ersActive = shouldDeployErs && nextBattery > SIM_ERS_MIN_BATTERY_TO_DEPLOY;
    run.ersBoostKmh = run.ersActive ? ersBoostKmh : 0;
    run.drsTopSpeedKmh = drsTopSpeedKmh;
    run.gapAheadSec = Number.isFinite(gapAheadSec) ? gapAheadSec : null;
  });
}

function buildSimTeamRuns(teamsOnGrid) {
  const list = Array.isArray(teamsOnGrid) ? teamsOnGrid.slice(0, SIM_MAX_TEAMS_ON_TRACK) : [];
  const runs = [];
  list.forEach(team => {
    const teamDrivers = state.drivers.filter(d => String(d.teamId) === String(team.id)).slice(0, 2);
    for (let i = 0; i < 2; i++) {
        let tag = "";
        let d = teamDrivers[i];
        if (d) {
            const baseTag = d.seedId || d.last || d.first || `D${d.id || i}`;
            tag = String(baseTag).substring(0, 3).toUpperCase();
        } else {
            const baseTag = team.seedId || team.name || `T${team.id || i}`;
            tag = String(baseTag).substring(0, 3).toUpperCase() + (i + 1);
        }
        runs.push({ team, driver: d, tag });
    }
  });

  const center = (runs.length - 1) / 2;

  return runs.map((runObj, idx) => {
    const team = runObj.team;
    const setup = normalizeCarSetup(team.carSetup);
    const pu = Math.min(SIM_POWER_UNIT_MAX, Math.max(1, Number(setup.powerUnit) || CAR_STAT_DEFAULTS.powerUnit));
    const ersDeployRating = normalizeErsDeployRating(setup.ersDeploy);
    const speedKmh = SIM_MAX_SPEED_KMH - (SIM_POWER_UNIT_MAX - pu) * SIM_KMH_DROP_PER_PU;

    return {
      team,
      driver: runObj.driver || null,
      tag: runObj.tag,
      powerUnit: pu,
      ersDeployRating,
      ersBatteryMax: getErsBatteryCapacityPercent(ersDeployRating),
      speedKmh,
      pathSpeed: (speedKmh / SIM_MAX_SPEED_KMH) * SIM_BASE_PATH_SPEED * simState.speed,
      laneIndex: idx % SIM_LANE_COUNT,
      gridOffset: Math.floor(idx / SIM_LANE_COUNT) * SIM_ROW_GAP,
      uniqueLaneNudge: (idx - center) * 0.18,
      drsActive: false,
      drsZoneId: null,
      drsEndDistance: null,
      drsTopSpeedKmh: speedKmh
    };
  });
}

function getPointWithLaneOffset(path, distanceOnPath, laneOffset, lapLength) {
  const d1 = ((distanceOnPath % lapLength) + lapLength) % lapLength;
  const d2 = (d1 + 1) % lapLength;
  const p1 = path.getPointAtLength(d1);
  const p2 = path.getPointAtLength(d2);

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;

  const nx = -dy / len;
  const ny = dx / len;

  return {
    x: p1.x + nx * laneOffset,
    y: p1.y + ny * laneOffset
  };
}

function setSimStatus(message) {
  const status = document.getElementById('simStatus');
  if (status) status.textContent = message;
}

function setSimResetButtonVisible(visible) {
  const btn = document.getElementById('btnSimReset');
  if (!btn) return;
  btn.style.display = visible ? 'inline-flex' : 'none';
}

function setSimResultsTabVisible(visible) {
  const tab = document.getElementById('simResultsTab');
  if (!tab) return;
  tab.style.display = visible ? 'block' : 'none';
}

function getRunRaceProgressDistance(run) {
  const currentDistance = Number(run?.currentDistance) || 0;
  const gridOffset = Number(run?.gridOffset) || 0;
  return currentDistance + gridOffset;
}

function getSimRaceResults(lapLength, targetLaps) {
  if (!lapLength || !targetLaps || !Array.isArray(simState.teamRuns) || simState.teamRuns.length === 0) return null;

  const finishedRuns = simState.teamRuns.filter(run => run.finishedRace && Number.isFinite(run.finishTimeSec));
  if (finishedRuns.length !== simState.teamRuns.length) return null;

  return finishedRuns
    .slice()
    .sort((a, b) => {
      const timeDiff = Number(a.finishTimeSec) - Number(b.finishTimeSec);
      if (Math.abs(timeDiff) > 1e-6) return timeDiff;
      const finishOrderDiff = (Number(a.finishOrder) || Number.POSITIVE_INFINITY) - (Number(b.finishOrder) || Number.POSITIVE_INFINITY);
      if (finishOrderDiff !== 0) return finishOrderDiff;
      return getRunRaceProgressDistance(b) - getRunRaceProgressDistance(a);
    });
}

function renderSimResultsTab(results, targetLaps) {
  const body = document.getElementById('simResultsBody');
  const meta = document.getElementById('simResultsMeta');
  if (!body || !meta) return;

  if (!Array.isArray(results) || results.length === 0) {
    body.innerHTML = '<tr class="empty-row"><td colspan="6">No race result yet.</td></tr>';
    meta.textContent = '';
    return;
  }

  const leaderTime = Number(results[0]?.finishTimeSec) || 0;
  meta.textContent = `${results.length} drivers classified · ${targetLaps} laps`;

  body.innerHTML = results.map((run, idx) => {
    const finishTime = Number(run.finishTimeSec) || 0;
    const gapSec = Math.max(0, finishTime - leaderTime);
    const gapLabel = idx === 0 ? 'Leader' : `+${gapSec.toFixed(3)}s`;
    return `
      <tr>
        <td>P${idx + 1}</td>
        <td>${escHtml(run.tag)}</td>
        <td>${escHtml(getSimRunDisplayName(run))}</td>
        <td>${escHtml(run.team.name)}</td>
        <td>${finishTime.toFixed(3)}s</td>
        <td>${gapLabel}</td>
      </tr>
    `;
  }).join('');
}
