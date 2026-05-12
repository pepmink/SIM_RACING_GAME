# 📋 Hướng Dẫn Chia Module cho SIM_RACING_GAME

## 🎯 Mục Tiêu
Chia file `app.js` (3000+ dòng) thành các module nhỏ, dễ quản lý và bảo trì.

## 📁 Cấu Trúc Module Đã Tạo

```
SIM_RACING_GAME/
├── app.js                          # File gốc (giữ nguyên để backup)
├── app-modular.js                  # File mới sử dụng ES6 modules
├── index.html                      # Cần update script tag
│
├── js/
│   ├── config/
│   │   ├── championships.js        # ✅ ĐÃ TẠO - CHAMPIONSHIPS, DEFAULT_TEAMS, DEFAULT_DRIVERS
│   │   ├── constants.js            # ✅ ĐÃ TẠO - Tất cả SIM_* constants
│   │   └── defaults.js             # ✅ ĐÃ TẠO - CAR_STAT_DEFAULTS, getDefaultDriverSkills
│   │
│   ├── state/
│   │   ├── state.js                # ✅ ĐÃ TẠO - state, simState, global variables
│   │   └── storage.js              # ⏳ CẦN TẠO - localStorage functions
│   │
│   ├── ui/
│   │   ├── navigation.js           # ⏳ CẦN TẠO - initNavigation, navigate
│   │   ├── championship.js         # ⏳ CẦN TẠO - championship selection UI
│   │   ├── forms.js                # ⏳ CẦN TẠO - form utilities
│   │   └── search.js               # ⏳ CẦN TẠO - search functionality
│   │
│   ├── teams/
│   │   ├── teamForm.js             # ⏳ CẦN TẠO - team CRUD
│   │   ├── teamUtils.js            # ⏳ CẦN TẠO - team utilities
│   │   └── carSetup.js             # ⏳ CẦN TẠO - car setup management
│   │
│   ├── drivers/
│   │   ├── driverForm.js           # ⏳ CẦN TẠO - driver CRUD
│   │   └── driverUtils.js          # ⏳ CẦN TẠO - driver utilities
│   │
│   ├── simulation/
│   │   ├── simCore.js              # ⏳ CẦN TẠO - core simulation logic
│   │   ├── simQualifying.js        # ⏳ CẦN TẠO - qualifying simulation
│   │   ├── simRace.js              # ⏳ CẦN TẠO - race simulation
│   │   ├── simPhysics.js           # ⏳ CẦN TẠO - physics calculations
│   │   └── simRendering.js         # ⏳ CẦN TẠO - canvas rendering
│   │
│   └── utils/
│       ├── helpers.js              # ⏳ CẦN TẠO - utility functions
│       └── validators.js           # ⏳ CẦN TẠO - validation functions
```

## 🔧 Các File Đã Hoàn Thành

### 1. `js/config/championships.js`
**Exports:**
- `CHAMPIONSHIPS` - Cấu hình các giải đua
- `DEFAULT_TEAMS_BY_CHAMP` - Danh sách team mặc định
- `DEFAULT_DRIVERS_BY_CHAMP` - Danh sách driver mặc định
- `F1_2025_QUALIFYING_BY_SEED` - Điểm qualifying mặc định

### 2. `js/config/constants.js`
**Exports:** Tất cả các hằng số simulation (SIM_*)
- Speed & Physics constants
- Turn entry speeds
- Braking & Acceleration
- Track markers
- DRS Configuration
- ERS Configuration
- Qualifying Configuration
- Session Phases

### 3. `js/config/defaults.js`
**Exports:**
- `CAR_STAT_DEFAULTS` - Giá trị mặc định cho car setup
- `getDefaultDriverSkills()` - Function trả về skills mặc định

### 4. `js/state/state.js`
**Exports:**
- `state` - Application state (teams, drivers, activity)
- `simState` - Simulation state
- Global variables và setters

## 📝 Các Bước Tiếp Theo

### Bước 1: Phân Tích Functions trong app.js

Dựa trên grep search, app.js có các nhóm functions chính:

#### **Championship & Storage** (Lines ~296-410)
- `openChampionshipScreen()`
- `selectChampionship(id)`
- `updateCategoryDropdown()`
- `updateChampionshipUI()`
- `saveToStorage()`
- `loadFromStorage()`
- `ensureDefaultTeams()`
- `ensureDefaultDrivers()`

#### **Navigation** (Lines ~631-678)
- `initNavigation()`
- `navigate(sectionId)`

#### **Team Management** (Lines ~679-835)
- `initTeamForm()`
- `validateTeamForm()`
- `normalizeCarSetup()`
- `isUntouchedDefaultCarSetup()`

#### **Driver Management** (Lines ~836-959)
- `initDriverForm()`
- `validateDriverForm()`
- `populateTeamDropdown()`
- `normalizeDriverSkills()`
- `isUntouchedDefaultSkills()`
- `inferQualifyingSkill()`
- `getQualifyingPaceMultiplier()`
- `getQualifyingAccelMultiplier()`
- `getQualifyingSpeedBoostKmh()`

#### **Rendering** (Lines ~960-1070)
- `renderAll()`
- `renderTeams()`
- `renderDrivers()`
- `renderCarSetups()`

#### **Simulation** (Lines ~1071-end)
- `initSimRacingSection()`
- `startSimRacingAnimation()`
- `stopSimRacingAnimation()`
- `startSimQualifyingSession()`
- `stopSimQualifyingSession()`
- `renderSimRacingPreview()`
- `renderRaceDotsAtTime()`
- `renderSimDriverTiming()`
- ... và nhiều functions khác

### Bước 2: Tạo Module storage.js

```javascript
// js/state/storage.js
import { state } from './state.js';
import { currentChampionship } from './state.js';
import { DEFAULT_TEAMS_BY_CHAMP, DEFAULT_DRIVERS_BY_CHAMP } from '../config/championships.js';

export function saveToStorage() {
  // Copy code từ app.js
}

export function loadFromStorage() {
  // Copy code từ app.js
}

export function ensureDefaultTeams() {
  // Copy code từ app.js
}

export function ensureDefaultDrivers() {
  // Copy code từ app.js
}
```

### Bước 3: Update index.html

Thay đổi từ:
```html
<script src="app.js"></script>
```

Thành:
```html
<script type="module" src="app-modular.js"></script>
```

### Bước 4: Expose Functions to Window

Vì HTML sử dụng `onclick="functionName()"`, cần expose functions:

```javascript
// Trong app-modular.js
window.selectChampionship = selectChampionship;
window.navigate = navigate;
window.addTeam = addTeam;
// ... etc
```

## ⚠️ Lưu Ý Quan Trọng

1. **Giữ nguyên app.js cũ** - Để backup và so sánh
2. **Test từng module** - Sau khi tạo mỗi module, test kỹ
3. **Browser compatibility** - ES6 modules cần browser hiện đại
4. **CORS issues** - Cần chạy qua web server (không mở trực tiếp file://)

## 🚀 Cách Chạy Sau Khi Refactor

```bash
# Option 1: Python simple server
python -m http.server 8000

# Option 2: Node.js http-server
npx http-server

# Option 3: VS Code Live Server extension
# Click "Go Live" trong VS Code
```

Sau đó mở: `http://localhost:8000`

## 📊 Lợi Ích Sau Khi Hoàn Thành

✅ **Maintainability**: Dễ tìm và sửa code  
✅ **Reusability**: Functions có thể tái sử dụng  
✅ **Testability**: Dễ viết unit tests  
✅ **Scalability**: Dễ thêm features mới  
✅ **Collaboration**: Nhiều người có thể làm việc song song  
✅ **Performance**: Có thể lazy load modules không cần thiết  

## 🎓 Học Thêm

- [ES6 Modules - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [JavaScript Module Pattern](https://www.patterns.dev/posts/module-pattern/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
