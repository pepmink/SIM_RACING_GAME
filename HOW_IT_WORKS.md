# 🔧 Cách các file hoạt động - Chi tiết

## 📖 Mục lục
1. [Luồng khởi động ứng dụng](#1-luồng-khởi-động-ứng-dụng)
2. [Cách modules tương tác](#2-cách-modules-tương-tác)
3. [Chi tiết từng module](#3-chi-tiết-từng-module)
4. [Ví dụ thực tế](#4-ví-dụ-thực-tế)

---

## 1. Luồng khởi động ứng dụng

### Bước 1: Browser load index.html
```html
<!-- index.html -->
<script type="module" src="js/main.js"></script>
```

### Bước 2: main.js được thực thi
```javascript
// js/main.js
import { initNavigation } from './core/navigation.js';
import { initTeamForm } from './modules/teams.js';
// ... import các modules khác

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();      // Khởi tạo navigation
  initTeamForm();        // Khởi tạo form teams
  initDriverForm();      // Khởi tạo form drivers
  // ... khởi tạo các modules khác
  openChampionshipScreen(); // Hiển thị màn hình chọn championship
});
```

### Bước 3: Các modules được khởi tạo
Mỗi module đăng ký event listeners và chuẩn bị sẵn sàng.

---

## 2. Cách modules tương tác

### 🔄 Sơ đồ tương tác

```
┌─────────────────────────────────────────────────────────┐
│                      index.html                          │
│                    (User Interface)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                      main.js                             │
│              (Entry Point - Orchestrator)                │
└─┬───────────┬───────────┬───────────┬──────────┬────────┘
  │           │           │           │          │
  ▼           ▼           ▼           ▼          ▼
┌────┐    ┌────┐    ┌─────────┐  ┌─────┐   ┌──────┐
│Core│    │Modules│  │  UI     │  │Utils│   │Config│
└─┬──┘    └─┬──┘    └────┬────┘  └──┬──┘   └───┬──┘
  │         │            │          │          │
  │         │            │          │          │
  ▼         ▼            ▼          ▼          ▼
state.js  teams.js   render.js  helpers.js constants.js
navigation.js drivers.js components.js      defaults.js
         carSetup.js
         simRacing.js
```

### 📊 Luồng dữ liệu

```
User Action (Click button)
    ↓
Event Listener (trong module)
    ↓
Update State (state.js)
    ↓
Save to localStorage (state.js)
    ↓
Trigger Render (render.js)
    ↓
Update UI (index.html)
```

---

## 3. Chi tiết từng module

### 📁 A. CONFIG - Cấu hình tĩnh

#### `constants.js` - Các hằng số
```javascript
// Định nghĩa các giá trị không đổi
export const CHAMPIONSHIPS = {
  f1: { id: 'f1', name: 'Formula 1', ... }
};

export const SIM_MAX_SPEED_KMH = 370;
export const SIM_RACE_TOTAL_LAPS = 3;
```

**Vai trò**: Lưu trữ các giá trị cố định, dễ thay đổi khi cần.

**Được sử dụng bởi**: 
- `navigation.js` (hiển thị championships)
- `simRacing.js` (tính toán physics)
- `carSetup.js` (giá trị mặc định)

---

#### `defaults.js` - Dữ liệu mặc định
```javascript
// Dữ liệu teams và drivers có sẵn
export const DEFAULT_TEAMS_BY_CHAMP = {
  f1: [
    { seedId: 'ferrari', name: 'Scuderia Ferrari', ... },
    { seedId: 'mclaren', name: 'McLaren F1', ... }
  ]
};
```

**Vai trò**: Cung cấp dữ liệu khởi tạo cho mỗi championship.

**Được sử dụng bởi**: 
- `state.js` (seed default data khi load championship)

---

### 📁 B. CORE - Chức năng cốt lõi

#### `state.js` - Quản lý trạng thái
```javascript
// State object chứa tất cả dữ liệu
export const state = {
  teams: [],      // Danh sách teams
  drivers: [],    // Danh sách drivers
  activity: [],   // Lịch sử hoạt động
  nextTeamId: 1,
  nextDriverId: 1
};

// Lưu vào localStorage
export function saveToStorage() {
  localStorage.setItem(
    `simracing_state_${currentChampionship}`, 
    JSON.stringify(state)
  );
}

// Load từ localStorage
export function loadFromStorage() {
  const saved = localStorage.getItem(...);
  Object.assign(state, JSON.parse(saved));
}
```

**Vai trò**: 
- ✅ Single source of truth cho toàn bộ app
- ✅ Quản lý localStorage
- ✅ Normalize dữ liệu
- ✅ Seed default data

**Được sử dụng bởi**: TẤT CẢ modules khác

**Tương tác**:
```
teams.js ──────┐
drivers.js ────┤
carSetup.js ───┼──> state.js ──> localStorage
simRacing.js ──┤
render.js ─────┘
```

---

#### `navigation.js` - Điều hướng
```javascript
export function navigate(sectionId) {
  // 1. Ẩn tất cả sections
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
  });
  
  // 2. Hiện section được chọn
  document.getElementById(`section-${sectionId}`)
    .classList.add('active');
  
  // 3. Trigger callback
  if (window.onNavigate) {
    window.onNavigate(sectionId);
  }
}
```

**Vai trò**:
- ✅ Chuyển đổi giữa các sections
- ✅ Quản lý championship selection
- ✅ Update UI theme theo championship

**Được gọi bởi**:
- User clicks navigation menu
- `main.js` (khởi tạo)

---

### 📁 C. MODULES - Chức năng chính

#### `teams.js` - Quản lý Teams

**Luồng hoạt động**:
```
1. User điền form
   ↓
2. User click "Add Team"
   ↓
3. validateTeamForm() kiểm tra dữ liệu
   ↓
4. Tạo team object
   ↓
5. state.teams.push(team)
   ↓
6. saveToStorage()
   ↓
7. renderAll() cập nhật UI
```

**Code example**:
```javascript
export function initTeamForm() {
  document.getElementById('teamForm')
    .addEventListener('submit', e => {
      e.preventDefault();
      
      // Validate
      if (!validateTeamForm()) return;
      
      // Create team
      const team = {
        id: state.nextTeamId++,
        name: getValue('teamName'),
        country: getValue('teamCountry'),
        // ...
      };
      
      // Update state
      state.teams.push(team);
      addActivity('team', `Team ${team.name} added`);
      saveToStorage();
      
      // Update UI
      renderAll();
      showToast(`Team "${team.name}" added!`, 'success');
    });
}
```

**Tương tác**:
```
teams.js
  ├─> state.js (update teams array)
  ├─> render.js (hiển thị teams table)
  └─> components.js (show toast notification)
```

---

#### `drivers.js` - Quản lý Drivers

**Đặc biệt**: Tính toán skills

```javascript
// Tính toán skills từ 9 sub-skills
export function getComputedSkills(skills) {
  const pace = avg('cornering', 'braking', 'reactions');
  const consistency = avg('accuracy', 'control', 'smooth');
  const racecraft = avg('adaptability', 'overtaking', 'defending');
  const overall = (pace + consistency + racecraft) / 3;
  
  return { pace, consistency, racecraft, overall };
}
```

**Luồng**:
```
User kéo skill sliders
  ↓
updateSkillSub() được gọi
  ↓
recomputeSkillGroups() tính lại
  ↓
Update UI hiển thị overall rating
```

---

#### `carSetup.js` - Quản lý Car Setup

**Chức năng chính**:
```javascript
export function getCarOverall(setup) {
  // Tính overall từ 6 stats
  const s = normalizeCarSetup(setup);
  return Math.round(
    (s.powerUnit + s.downforce + s.chassis + 
     s.reliability + s.ersDeploy + 
     (100 - s.tyreDegradation)) / 6
  );
}
```

**Luồng**:
```
1. User chọn team từ dropdown
   ↓
2. loadSelectedTeamCarSetup() load stats
   ↓
3. User điều chỉnh sliders
   ↓
4. updateCarSetupOverall() tính lại rating
   ↓
5. User click "Save"
   ↓
6. team.carSetup được update
   ↓
7. saveToStorage()
```

---

#### `simRacing.js` - Race Simulation (Phức tạp nhất!)

**Cấu trúc**:
```javascript
export const simState = {
  running: false,
  rafId: null,
  teamRuns: [],  // Mỗi car trên track
  drsZones: [],
  // ...
};
```

**Luồng simulation**:
```
1. User click "Sim Racing"
   ↓
2. startSimRacingAnimation()
   ├─> buildSimTeamRuns() tạo cars
   ├─> updateSimDrsZones() tính DRS zones
   └─> requestAnimationFrame(tick)
       ↓
3. Mỗi frame (60fps):
   tick()
   ├─> advanceSimRuns(dtSec)
   │   ├─> Tính speed (DRS, ERS, braking)
   │   ├─> Update position
   │   ├─> Check DRS activation
   │   ├─> Check finish line
   │   └─> Update battery
   └─> renderRaceDotsAtTime()
       └─> Vẽ cars lên SVG track
```

**Physics calculations**:
```javascript
// Tính tốc độ dựa trên Power Unit
const speedKmh = SIM_MAX_SPEED_KMH - 
  (SIM_POWER_UNIT_MAX - powerUnit) * SIM_KMH_DROP_PER_PU;

// DRS boost
if (drsActive) {
  speedKmh *= getDrsTopSpeedMultiplier(powerUnit);
}

// ERS boost
if (ersActive) {
  speedKmh += SIM_ERS_SPEED_BOOST_KMH;
}

// Braking cho corners
const targetSpeed = getBrakeTargetSpeedKmh(
  baseSpeed, 
  distanceOnLap, 
  lapLength
);
```

**Tương tác**:
```
simRacing.js
  ├─> state.js (đọc teams & drivers)
  ├─> constants.js (physics constants)
  └─> render.js (hiển thị results)
```

---

### 📁 D. UI - Giao diện

#### `render.js` - Rendering

**Chức năng**: Chuyển data thành HTML

```javascript
export function renderTeams(list = state.teams) {
  const tbody = document.getElementById('teamsBody');
  
  tbody.innerHTML = list.map(team => `
    <tr>
      <td>${escHtml(team.name)}</td>
      <td>${escHtml(team.country)}</td>
      <td>
        <button onclick="editTeam(${team.id})">Edit</button>
        <button onclick="confirmDelete('team', ${team.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}
```

**Được gọi bởi**:
- `main.js` (khởi tạo)
- `teams.js` (sau khi add/edit/delete)
- `drivers.js` (sau khi add/edit/delete)
- `navigation.js` (khi chuyển section)

---

#### `components.js` - UI Components

**Toast notification**:
```javascript
export function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
```

**Modal confirmation**:
```javascript
export function confirmDelete(type, id) {
  // Hiển thị modal
  openModal();
  
  // Lưu pending action
  pendingDelete = { type, id };
}

// Khi user click "Confirm"
document.getElementById('modalConfirm')
  .addEventListener('click', () => {
    // Thực hiện delete
    if (pendingDelete.type === 'team') {
      state.teams = state.teams.filter(t => t.id !== id);
    }
    saveToStorage();
    renderAll();
  });
```

---

### 📁 E. UTILS - Tiện ích

#### `helpers.js` - Helper functions

```javascript
// Escape HTML để tránh XSS
export function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Format time
export function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  // ...
}

// Get rating tier
export function getRatingTier(overall) {
  if (overall >= 90) return { tierLabel: 'S', tierClass: 'rating-s' };
  if (overall >= 85) return { tierLabel: 'A', tierClass: 'rating-a' };
  // ...
}
```

**Được sử dụng bởi**: TẤT CẢ modules

---

## 4. Ví dụ thực tế

### 📝 Ví dụ 1: User thêm một team mới

```
┌─────────────────────────────────────────────────────────┐
│ 1. User điền form và click "Add Team"                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. teams.js: Event listener được trigger                │
│    - validateTeamForm() kiểm tra input                  │
│    - Tạo team object với ID mới                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. state.js: Update state                               │
│    - state.teams.push(newTeam)                          │
│    - state.nextTeamId++                                 │
│    - addActivity('team', 'Team added')                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. state.js: Save to localStorage                       │
│    - localStorage.setItem('simracing_state_f1', ...)    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. render.js: Update UI                                 │
│    - renderTeams() vẽ lại table                         │
│    - renderStats() cập nhật statistics                  │
│    - renderActivity() hiển thị activity feed            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 6. components.js: Show notification                     │
│    - showToast('Team "Ferrari" added!', 'success')      │
└─────────────────────────────────────────────────────────┘
```

---

### 🏎️ Ví dụ 2: Simulation đang chạy

```
┌─────────────────────────────────────────────────────────┐
│ Frame 1 (t = 0.016s)                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ simRacing.js: tick() được gọi                            │
│                                                          │
│ 1. advanceSimRuns(0.016)                                │
│    ├─> Mỗi car:                                         │
│    │   ├─> Tính target speed (DRS, ERS, braking)       │
│    │   ├─> Accelerate/decelerate                        │
│    │   ├─> Update position                              │
│    │   ├─> Check DRS zones                              │
│    │   ├─> Update ERS battery                           │
│    │   └─> Check finish line                            │
│    │                                                     │
│ 2. renderRaceDotsAtTime(0.016)                          │
│    ├─> Tính position trên track                         │
│    ├─> Vẽ SVG circles cho mỗi car                       │
│    └─> Update legend (positions, speeds, gaps)          │
│                                                          │
│ 3. requestAnimationFrame(tick) ──> Frame 2              │
└─────────────────────────────────────────────────────────┘
```

**Chi tiết tính toán trong 1 frame**:
```javascript
// Cho mỗi car:
const dtSec = 0.016; // ~60fps

// 1. Tính target speed
let targetSpeed = baseSpeed;

// DRS active?
if (drsActive) {
  targetSpeed *= 1.04; // +4% boost
}

// ERS active?
if (ersBattery > 15 && currentSpeed >= targetSpeed - 0.5) {
  targetSpeed += 10; // +10 km/h
  ersBattery -= 10 * dtSec; // Drain battery
}

// Approaching corner?
if (distanceToTurn1 < 64) {
  targetSpeed = Math.min(targetSpeed, 90); // Brake to 90 km/h
}

// 2. Accelerate/decelerate
if (currentSpeed < targetSpeed) {
  currentSpeed += 25 * dtSec; // Accelerate
} else {
  currentSpeed -= 110 * dtSec; // Brake
}

// 3. Update position
currentDistance += (currentSpeed / 370) * 90 * dtSec;

// 4. Check DRS activation
if (gapToCarAhead < 1.0 && insideDrsZone) {
  drsActive = true;
}

// 5. Check finish
if (crossedFinishLine && completedLaps >= 3) {
  finishedRace = true;
  finishTime = elapsedTime;
}
```

---

### 🔄 Ví dụ 3: User chuyển Championship

```
┌─────────────────────────────────────────────────────────┐
│ 1. User click "FIA WEC" card                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. navigation.js: selectChampionship('wec')             │
│    - setCurrentChampionship('wec')                      │
│    - Reset state object                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. state.js: loadFromStorage()                          │
│    - Load từ localStorage key 'simracing_state_wec'     │
│    - Nếu không có data: seed defaults từ defaults.js    │
│    - ensureDefaultTeams() thêm WEC teams                │
│    - ensureDefaultDrivers() thêm WEC drivers            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. navigation.js: updateChampionshipUI()                │
│    - Update topbar badge (icon, name, color)            │
│    - Update sidebar                                     │
│    - Update CSS variables (--accent color)              │
│    - Update category dropdown                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. render.js: renderAll()                               │
│    - Render WEC teams                                   │
│    - Render WEC drivers                                 │
│    - Update statistics                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Tóm tắt quan trọng

### 1. **State là trung tâm**
```
Tất cả modules ──> state.js ──> localStorage
                      ↓
                  render.js ──> UI
```

### 2. **Modules độc lập**
- Mỗi module có trách nhiệm riêng
- Giao tiếp qua state.js
- Không phụ thuộc trực tiếp vào nhau

### 3. **Event-driven**
```
User action → Event listener → Update state → Render UI
```

### 4. **Separation of Concerns**
- **Config**: Dữ liệu tĩnh
- **Core**: State & navigation
- **Modules**: Business logic
- **UI**: Presentation
- **Utils**: Helpers

### 5. **Unidirectional data flow**
```
User Input → Module → State → Render → UI
     ↑                                   │
     └───────────────────────────────────┘
```

---

## 💡 Tips khi phát triển

### Thêm feature mới:
1. **Xác định module**: Feature thuộc module nào?
2. **Update state**: Cần thêm data gì vào state?
3. **Business logic**: Viết logic trong module
4. **Render**: Thêm render function
5. **Wire up**: Connect trong main.js

### Debug:
1. **Console.log state**: `console.log(state.teams)`
2. **Check localStorage**: DevTools → Application → Local Storage
3. **Breakpoints**: Đặt trong module tương ứng
4. **Network**: Check nếu có API calls

### Best practices:
- ✅ Luôn update state trước khi render
- ✅ Luôn save sau khi update state
- ✅ Validate input trước khi update state
- ✅ Use helper functions để tránh duplicate code
- ✅ Keep functions small và focused

---

Hy vọng giải thích này giúp bạn hiểu rõ cách các file hoạt động! 🚀
