// ============================================================
//  RENDERING MODULE
// ============================================================

import { state } from '../core/state.js';
import { escHtml, timeAgo, getTeamTag, getRatingTier } from '../utils/helpers.js';
import { getComputedSkills } from '../modules/drivers.js';
import { getCarOverall } from '../modules/carSetup.js';

export function renderAll() {
  renderTeams();
  renderCarSetups();
  if (window.renderSimRacingPreview) window.renderSimRacingPreview();
  renderDrivers(state.drivers);
  renderStats();
  updateChips();
  renderActivity();
}

export function renderTeams(list = state.teams) {
  const tbody = document.getElementById('teamsBody');

  if (list.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No teams added yet.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((t, i) => {
    const driverCount = state.drivers.filter(d => String(d.teamId) === String(t.id)).length;
    const budgetText = t.budget != null ? `$${t.budget}M` : '—';
    const shortTag = getTeamTag(t.name, t.shortTag);

    return `
      <tr data-id="${t.id}">
        <td style="color:var(--text-3)">${i + 1}</td>
        <td>
          <div class="team-name-cell">
            ${t.logo
              ? `<img src="${t.logo}" class="team-logo-thumb" alt="${escHtml(t.name)}" />`
              : `<span class="team-dot" style="background:${t.color}; box-shadow: 0 0 6px ${t.color}"></span>`
            }
            <strong>${escHtml(t.name)}</strong>
            <span class="team-short-tag">${escHtml(shortTag)}</span>
          </div>
        </td>
        <td>${escHtml(t.country)}</td>
        <td>
          <div class="car-cell">
            ${t.carPhoto
              ? `<img src="${t.carPhoto}" class="car-photo-thumb" alt="${escHtml(t.car)}" />`
              : ''
            }
            <span>${escHtml(t.car)}</span>
          </div>
        </td>
        <td><span class="rating-badge rating-b">${t.category}</span></td>
        <td style="color:var(--text-2)">${budgetText}</td>
        <td>
          <span class="rating-badge ${driverCount > 0 ? 'rating-a' : 'rating-c'}">${driverCount}</span>
        </td>
        <td>
          <div style="display:flex; gap:6px">
            <button class="btn btn-icon" title="Edit" onclick="editTeam(${t.id})">&#9998;</button>
            <button class="btn btn-icon" title="Delete" style="color:#ff5252" onclick="confirmDelete('team', ${t.id})">&#10005;</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

export function renderDrivers(list = state.drivers) {
  const tbody = document.getElementById('driversBody');

  if (list.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No drivers added yet.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((d, i) => {
    const team = state.teams.find(t => String(t.id) === String(d.teamId));
    const teamCell = team
      ? `<span class="team-dot" style="background:${team.color}"></span>${escHtml(team.name)}`
      : '<span style="color:var(--text-3)">Free Agent</span>';

    const { pace, consistency, racecraft, overall } = getComputedSkills(d.skills);
    const { tierLabel: ratingLabel, tierClass: ratingClass } = getRatingTier(overall);

    return `
      <tr data-id="${d.id}">
        <td style="color:var(--text-3)">${i + 1}</td>
        <td><span class="number-badge">${d.number}</span></td>
        <td>
          <div class="driver-name-cell">
            ${d.photo
              ? `<img src="${d.photo}" class="driver-avatar-thumb" alt="${escHtml(d.first)}" />`
              : `<span class="driver-avatar-placeholder">${escHtml(d.first[0])}${escHtml(d.last[0])}</span>`
            }
            <strong>${escHtml(d.first)} ${escHtml(d.last)}</strong>
          </div>
        </td>
        <td>${escHtml(d.nationality)}</td>
        <td style="display:flex; align-items:center; gap:4px; border:none">${teamCell}</td>
        <td>${d.age ?? '—'}</td>
        <td>
          <span class="rating-badge ${ratingClass}" title="Pace:${pace} | Consistency:${consistency} | Racecraft:${racecraft}">
            ${ratingLabel} · ${overall}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:6px">
            <button class="btn btn-icon" title="Edit" onclick="editDriver(${d.id})">&#9998;</button>
            <button class="btn btn-icon" title="Delete" style="color:#ff5252" onclick="confirmDelete('driver', ${d.id})">&#10005;</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

export function renderCarSetups() {
  const tbody = document.getElementById('carSetupsBody');
  if (!tbody) return;

  if (state.teams.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="8">No teams available yet.</td></tr>';
    return;
  }

  tbody.innerHTML = state.teams.map(team => {
    const setup = window.normalizeCarSetup ? window.normalizeCarSetup(team.carSetup) : team.carSetup;
    const overall = getCarOverall(setup);
    const { tierLabel, tierClass } = getRatingTier(overall);

    return `
      <tr>
        <td>
          <div class="team-name-cell">
            <span class="team-dot" style="background:${team.color}; box-shadow: 0 0 6px ${team.color}"></span>
            <strong>${escHtml(team.name)}</strong>
          </div>
        </td>
        <td>${setup.powerUnit}</td>
        <td>${setup.downforce}</td>
        <td>${setup.chassis}</td>
        <td>${setup.reliability}</td>
        <td>${setup.ersDeploy}</td>
        <td>${setup.tyreDegradation}</td>
        <td><span class="rating-badge ${tierClass}">${tierLabel} · ${overall}</span></td>
      </tr>
    `;
  }).join('');
}

export function renderStats() {
  const nations = new Set(state.drivers.map(d => d.nationality.toLowerCase()));

  document.getElementById('stat-teams').textContent   = state.teams.length;
  document.getElementById('stat-drivers').textContent = state.drivers.length;
  document.getElementById('stat-nations').textContent = nations.size;

  const maxT = Math.max(state.teams.length, 10);
  const maxD = Math.max(state.drivers.length, 20);
  const maxN = Math.max(nations.size, 10);

  document.getElementById('bar-teams').style.width   = `${(state.teams.length / maxT) * 100}%`;
  document.getElementById('bar-drivers').style.width = `${(state.drivers.length / maxD) * 100}%`;
  document.getElementById('bar-nations').style.width = `${(nations.size / maxN) * 100}%`;

  // Animate speedometer
  animateSpeedometer(state.drivers.length * 12);
}

function updateChips() {
  document.getElementById('chip-teams').textContent   = state.teams.length;
  document.getElementById('chip-drivers').textContent = state.drivers.length;
}

export function renderActivity() {
  const list = document.getElementById('activityList');
  if (state.activity.length === 0) {
    list.innerHTML = '<div class="activity-empty">No activity yet. Add a team or driver to get started.</div>';
    return;
  }

  list.innerHTML = state.activity.map(a => {
    const ago = timeAgo(a.time);
    return `
      <div class="activity-item">
        <div class="activity-badge badge-${a.type}"></div>
        <div class="activity-text">${a.message}</div>
        <div class="activity-time">${ago}</div>
      </div>
    `;
  }).join('');
}

// ============================================================
//  SPEEDOMETER ANIMATION
// ============================================================

let speedInterval = null;

export function initSpeedometer() {
  // Auto idle animation
  speedInterval = setInterval(() => {
    const needle = document.getElementById('speedNeedle');
    if (!needle) return;
  }, 500);
}

function animateSpeedometer(targetSpeed) {
  const maxSpeed = 299;
  const clampedSpeed = Math.min(targetSpeed, maxSpeed);
  const angle = -90 + (clampedSpeed / maxSpeed) * 180;

  document.getElementById('speedNeedle').style.transform =
    `translateX(-50%) rotate(${angle}deg)`;

  let current = 0;
  const step = clampedSpeed / 30;
  const el = document.getElementById('speedNum');
  const counter = setInterval(() => {
    current = Math.min(current + step, clampedSpeed);
    el.textContent = Math.round(current);
    if (current >= clampedSpeed) clearInterval(counter);
  }, 20);
}

// Make functions available globally
window.renderAll = renderAll;
window.renderTeams = renderTeams;
window.renderDrivers = renderDrivers;
window.renderCarSetups = renderCarSetups;
