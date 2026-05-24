# 🏗️ ARCHITECTURE OVERVIEW

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                            │
│                  (Main HTML Document)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ <script type="module" src="js/main.js">
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                       js/main.js                             │
│                   (ES6 Module Entry)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ import { CHAMPIONSHIPS } from './config/championships'│  │
│  │ import * as CONSTANTS from './config/constants'       │  │
│  │ import { wingSetup } from './utils/wingSetup'         │  │
│  │ import { state } from './state/state'                 │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         │ Expose to window.*                 │
│                         ↓                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ window.CHAMPIONSHIPS_DATA                             │  │
│  │ window.DEFAULT_TEAMS_BY_CHAMP                         │  │
│  │ window.wingSetup.*                                    │  │
│  │ window.WING_CONSTANTS.*                               │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         │ Dynamically load app.js            │
│                         ↓                                    │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ <script src="app.js">
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                        app.js                                │
│                  (Traditional Script)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ const CHAMPIONSHIPS = window.CHAMPIONSHIPS_DATA       │  │
│  │ const DEFAULT_TEAMS = window.DEFAULT_TEAMS_BY_CHAMP  │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                    │
│                         │ User starts session                │
│                         ↓                                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ startSimQualifyingSession() / startSimRacingAnimation()│ │
│  │   ↓                                                    │  │
│  │ Auto-optimize wing setup for Monza                    │  │
│  │   ↓                                                    │  │
│  │ buildSimTeamRuns()                                    │  │
│  │   ↓                                                    │  │
│  │ Apply wing modifiers to driver skills                 │  │
│  │   ↓                                                    │  │
│  │ Use modified skills in simulation                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow: Wing Setup Integration

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER STARTS QUALIFYING/RACE                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. AUTO-OPTIMIZE WING SETUP                                 │
│                                                              │
│  For each team:                                             │
│    ┌──────────────────────────────────────────────┐        │
│    │ team = { carSetup, ... }                     │        │
│    │ driver = { skills, ... }                     │        │
│    │   ↓                                           │        │
│    │ optimal = calculateOptimalSetupForMonza()    │        │
│    │   ↓                                           │        │
│    │ team.setup = {                               │        │
│    │   frontWing: 15-35,                          │        │
│    │   rearWing: 10-30                            │        │
│    │ }                                             │        │
│    └──────────────────────────────────────────────┘        │
│                                                              │
│  Console: "✅ Red Bull: Front 18, Rear 16 (93%)"           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. BUILD SIMULATION RUNS                                    │
│                                                              │
│  For each driver:                                           │
│    ┌──────────────────────────────────────────────┐        │
│    │ baseSkills = {                               │        │
│    │   cornering: 85,                             │        │
│    │   braking: 80,                               │        │
│    │   overtaking: 75,                            │        │
│    │   ...                                         │        │
│    │ }                                             │        │
│    │   ↓                                           │        │
│    │ modifiedSkills = applyWingSetupToSkills()   │        │
│    │   ↓                                           │        │
│    │ driver._modifiedSkills = {                   │        │
│    │   cornering: 85 + 0,    (neutral)            │        │
│    │   braking: 80 + 6.3,    (low rear wing)      │        │
│    │   overtaking: 75 + 6.4, (low front wing)     │        │
│    │   ...                                         │        │
│    │ }                                             │        │
│    └──────────────────────────────────────────────┘        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. CALCULATE QUALIFYING PERFORMANCE                         │
│                                                              │
│  For each run:                                              │
│    ┌──────────────────────────────────────────────┐        │
│    │ effectiveSkills = driver._modifiedSkills     │        │
│    │   ↓                                           │        │
│    │ qualifyingSkill = inferQualifyingSkill()     │        │
│    │   = cornering * 0.28                         │        │
│    │   + braking * 0.18                           │        │
│    │   + reactions * 0.24                         │        │
│    │   + accuracy * 0.30                          │        │
│    │   ↓                                           │        │
│    │ qualifyingRating = 87 (example)              │        │
│    │   ↓                                           │        │
│    │ paceMultiplier = f(qualifyingRating)         │        │
│    │ speedBoost = 20 * paceMultiplier             │        │
│    └──────────────────────────────────────────────┘        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. SIMULATION RUNS                                          │
│                                                              │
│  • Cars move on track                                       │
│  • Lap times calculated                                     │
│  • Results reflect wing setup impact                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏎️ Wing Setup Impact Example

### Red Bull Racing (Strong Team)

**Car Stats:**
```
Power Unit: 93 (very strong)
Downforce: 92
ERS Deploy: 92
```

**Driver (Verstappen):**
```
Base Skills:
  Cornering: 95
  Braking: 96
  Overtaking: 96
  Control: 94
```

**Monza Optimization:**
```
Optimal Setup:
  Front Wing: 18 (aggressive, low downforce)
  Rear Wing: 16 (low drag)
  Confidence: 93%

Reasoning:
  - Strong power unit → can afford low downforce
  - High overtaking skill → benefit from low front wing
  - High braking skill → benefit from low rear wing
```

**Modified Skills:**
```
Front Wing 18 (deviation: -32):
  Overtaking: 96 + 5.1 = 99 (capped)
  Defending: 93 + 3.8 = 96.8

Rear Wing 16 (deviation: -34):
  Braking: 96 + 6.1 = 99 (capped)

Final Qualifying Skill:
  = cornering(95) * 0.28
  + braking(99) * 0.18
  + reactions(90) * 0.24
  + accuracy(87) * 0.30
  = 92.3 → Very fast lap times!
```

---

### Alpine (Weaker Team)

**Car Stats:**
```
Power Unit: 78 (weaker)
Downforce: 77
ERS Deploy: 86
```

**Driver (Gasly):**
```
Base Skills:
  Cornering: 83
  Braking: 84
  Overtaking: 87
  Control: 89
```

**Monza Optimization:**
```
Optimal Setup:
  Front Wing: 22 (more conservative)
  Rear Wing: 19 (more stability)
  Confidence: 85%

Reasoning:
  - Weaker power unit → need more downforce
  - Good overtaking → still benefit from low-ish front wing
  - Need stability → slightly higher rear wing
```

**Modified Skills:**
```
Front Wing 22 (deviation: -28):
  Overtaking: 87 + 4.5 = 91.5
  Defending: 82 + 3.4 = 85.4

Rear Wing 19 (deviation: -31):
  Braking: 84 + 5.6 = 89.6

Final Qualifying Skill:
  = cornering(83) * 0.28
  + braking(89.6) * 0.18
  + reactions(85) * 0.24
  + accuracy(75) * 0.30
  = 83.7 → Slower than Red Bull
```

---

## 📦 Module Structure

```
js/
├── main.js (Entry Point)
│   ├── Imports all modules
│   ├── Exposes to window.*
│   └── Loads app.js
│
├── config/
│   ├── championships.js
│   │   ├── CHAMPIONSHIPS
│   │   ├── DEFAULT_TEAMS_BY_CHAMP (with setup property)
│   │   ├── DEFAULT_DRIVERS_BY_CHAMP
│   │   └── F1_2025_QUALIFYING_BY_SEED
│   │
│   ├── constants.js
│   │   ├── SIM_* constants
│   │   ├── WING_SETUP_* constants
│   │   ├── MONZA_TRACK_PROFILE
│   │   └── MONZA_SETUP_WEIGHTS
│   │
│   ├── defaults.js
│   │   └── DEFAULT_VALUES
│   │
│   └── index.js (Barrel export)
│
├── state/
│   └── state.js
│       ├── createState()
│       ├── getState()
│       └── setState()
│
└── utils/
    └── wingSetup.js
        ├── getFrontWingModifiers()
        ├── getRearWingModifiers()
        ├── applyWingSetupToSkills()
        └── calculateOptimalSetupForMonza()
```

---

## 🔌 Integration Points

### 1. Module Loading (index.html)
```html
<script type="module" src="js/main.js"></script>
```

### 2. Data Exposure (main.js)
```javascript
window.CHAMPIONSHIPS_DATA = CHAMPIONSHIPS;
window.wingSetup = { ... };
```

### 3. Data Consumption (app.js)
```javascript
const CHAMPIONSHIPS = window.CHAMPIONSHIPS_DATA || { ... };
```

### 4. Auto-Optimization (app.js)
```javascript
function startSimQualifyingSession() {
  // Auto-optimize wing setup
  if (window.wingSetup) {
    state.teams.forEach(team => {
      const optimal = window.wingSetup.calculateOptimalSetupForMonza(...);
      team.setup = { frontWing: optimal.frontWing, rearWing: optimal.rearWing };
    });
  }
  ...
}
```

### 5. Skill Modification (app.js)
```javascript
function buildSimTeamRuns(teams) {
  return teams.map(team => {
    if (driver && team.setup && window.wingSetup) {
      driver._modifiedSkills = window.wingSetup.applyWingSetupToSkills(...);
    }
    ...
  });
}
```

### 6. Performance Calculation (app.js)
```javascript
simState.qualifyingRuns = baseRuns.map(run => {
  const effectiveSkills = run.driver?._modifiedSkills || run.driver?.skills;
  const qualifyingSkill = inferQualifyingSkill(effectiveSkills);
  ...
});
```

---

## 🎯 Key Design Decisions

### Why ES6 Modules?
- ✅ Clean separation of concerns
- ✅ Reusable code
- ✅ Easy to test
- ✅ Future-proof architecture

### Why Expose to window.*?
- ✅ Backward compatibility with app.js
- ✅ No need to refactor 3000+ lines immediately
- ✅ Gradual migration path

### Why Auto-Optimization?
- ✅ User doesn't need to understand wing setup
- ✅ Optimal performance automatically
- ✅ Can add manual UI later

### Why Store _modifiedSkills?
- ✅ Preserve original skills
- ✅ Easy to debug
- ✅ Can compare base vs modified

---

**Architecture Version:** 2.0  
**Last Updated:** 2026-05-14  
**Status:** ✅ Production Ready

