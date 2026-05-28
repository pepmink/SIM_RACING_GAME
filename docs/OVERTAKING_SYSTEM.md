# 🏎️ OVERTAKING & DEFENDING SYSTEM

## 📋 OVERVIEW

The Overtaking & Defending System adds realistic AI racing interactions to the simulation. Cars can now attempt to overtake each other based on speed advantage, driver skills, and track position.

**Version:** 1.0  
**Deployed:** May 27, 2026  
**Status:** ✅ ACTIVE

---

## 🎯 KEY FEATURES

### 1. **Dynamic Overtaking Attempts**
- Cars automatically detect overtaking opportunities
- Based on gap (< 0.5 seconds) and speed advantage
- Only in designated overtaking zones

### 2. **Skill-Based Success Rates**
- Overtaking skill affects attack success (±20%)
- Defending skill affects defense success (±25%)
- Control skill helps defender handle pressure (±15%)

### 3. **Strategic Factors**
- DRS provides +15% overtaking bonus
- ERS deployment adds +10% bonus
- Position advantage gives defender +10%
- Zone difficulty affects base rates (Easy 50%, Medium 35%, Hard 20%)

### 4. **Cooldown System**
- 3 seconds after successful overtake
- 1.5 seconds after failed attempt
- Prevents unrealistic rapid position changes

### 5. **Visual Feedback**
- Overtaking zones highlighted on track
- Event log shows all attempts
- Results table displays overtake count

---

## 🗺️ OVERTAKING ZONES (MONZA)

### Zone 1: Main Straight (DRS 1)
- **Location:** Start/Finish straight
- **Difficulty:** Easy
- **Base Success Rate:** 50%
- **Color:** Green (#4caf50)
- **Characteristics:** Long straight, DRS available, high speed

### Zone 2: Curva Grande Exit (DRS 2)
- **Location:** After Curva Grande
- **Difficulty:** Medium
- **Base Success Rate:** 35%
- **Color:** Orange (#ff9800)
- **Characteristics:** Shorter straight, DRS available

### Zone 3: Lesmo 1 Entry
- **Location:** Approaching first Lesmo corner
- **Difficulty:** Hard
- **Base Success Rate:** 20%
- **Color:** Red (#f44336)
- **Characteristics:** Corner entry, high risk, requires skill

---

## 📊 SUCCESS CALCULATION

### Overtaking Success Formula

```javascript
successRate = baseRate (zone difficulty)
            + speedBonus (max +25% at 40 km/h advantage)
            + skillBonus (±20% from overtaking skill)
            + drsBonus (+15% if DRS active)
            + ersBonus (+10% if ERS deploying)
```

**Clamped between 10% - 90%**

### Defending Success Formula

```javascript
defenseRate = baseRate (zone difficulty)
            + skillBonus (±25% from defending skill)
            + controlBonus (±15% from control skill)
            + positionBonus (+10% always)
```

**Clamped between 10% - 90%**

### Final Decision

Both probabilities are normalized to sum to 100%, then a random roll determines the outcome.

---

## 📈 EXAMPLE SCENARIOS

### Scenario 1: Top Driver with DRS on Main Straight

**Attacker:** Verstappen (Overtaking 92, Speed +7 km/h, DRS, ERS)  
**Defender:** Leclerc (Defending 88, Control 86)

```
Attack Success:
  Base (easy):     50.0%
  Speed bonus:     +4.4%
  Skill bonus:     +1.4%
  DRS bonus:       +15.0%
  ERS bonus:       +10.0%
  ─────────────────────
  Total:           80.8%

Defense Success:
  Base (easy):     30.0%
  Skill bonus:     +0.75%
  Control bonus:   +0.15%
  Position bonus:  +10.0%
  ─────────────────────
  Total:           40.9%

Normalized:
  Attack:  66.4%
  Defense: 33.6%

→ Verstappen has 66.4% chance to overtake
```

### Scenario 2: Weak Driver at Corner Entry

**Attacker:** Albon (Overtaking 78, Speed +2 km/h, No DRS/ERS)  
**Defender:** Hamilton (Defending 94, Control 92)

```
Attack Success:
  Base (hard):     20.0%
  Speed bonus:     +1.25%
  Skill bonus:     -1.4%
  ─────────────────────
  Total:           19.9%

Defense Success:
  Base (hard):     60.0%
  Skill bonus:     +2.25%
  Control bonus:   +1.05%
  Position bonus:  +10.0%
  ─────────────────────
  Total:           73.3%

Normalized:
  Attack:  21.4%
  Defense: 78.6%

→ Albon only has 21.4% chance to overtake
```

---

## 🎮 USER INTERFACE

### 1. Track Visualization
- **Overtaking zones** highlighted with colored dashed lines
- **Zone labels** show difficulty (Easy/Medium/Hard)
- **Animated pulse** effect on zones

### 2. Event Log
- **Real-time updates** for all overtaking attempts
- **Success (✅)** and **Failed (❌)** indicators
- **Details:** Lap number, zone name, probability
- **Auto-scroll:** Newest events at top
- **Limit:** 20 most recent events
- **Clear button** to reset log

### 3. Results Table
- **Overtakes column** shows completed overtakes
- **Green badge** with up arrow (↑) for positive overtakes
- **Gray badge** for zero overtakes

---

## 🔧 TECHNICAL IMPLEMENTATION

### Files Modified/Created

1. **`js/utils/overtakingSystem.js`** (NEW)
   - Core overtaking logic
   - Success calculation functions
   - Zone detection
   - Gap calculation

2. **`app.js`** (MODIFIED)
   - Added `processOvertakingAttempts()` function
   - Integrated into `advanceSimRuns()` loop
   - Added event log functions
   - Updated `renderSimResultsTab()` for overtakes column

3. **`index.html`** (MODIFIED)
   - Added overtaking zones to SVG
   - Added event log HTML structure
   - Added overtakes column to results table

4. **`style.css`** (MODIFIED)
   - Added overtaking zone styles
   - Added event log styles
   - Added overtakes badge styles

5. **`js/main.js`** (MODIFIED)
   - Imported overtakingSystem module
   - Exposed globally as `window.overtakingSystem`

---

## 📊 STATISTICS TRACKED

For each car during race:
- `overtakesCompleted` - Successful overtakes
- `overtakesFailed` - Failed overtake attempts
- `defensesSuccessful` - Successfully defended position
- `defensesFailed` - Lost position to overtake

---

## ⚙️ CONFIGURATION

### Constants (in `overtakingSystem.js`)

```javascript
GAP_THRESHOLD = 0.5 seconds
COOLDOWNS = {
  afterSuccess: 3.0 seconds,
  afterFailed: 1.5 seconds
}

IMPACT_FACTORS = {
  maxSpeedBonus: 0.25,        // +25% max
  speedThreshold: 40,         // km/h
  overtakingSkillImpact: 0.20,
  defendingSkillImpact: 0.25,
  controlSkillImpact: 0.15,
  drsBonus: 0.15,
  ersBonus: 0.10,
  positionBonus: 0.10
}
```

---

## 🧪 TESTING

### Manual Testing Steps

1. **Start F1 Championship**
2. **Navigate to Sim Racing**
3. **Run Qualifying** (to set grid order)
4. **Start Race**
5. **Observe:**
   - Event log populates with overtaking attempts
   - Console shows overtake success/failures
   - Results table shows overtake counts

### Expected Behavior

- **Top teams** (Mercedes, Red Bull) should overtake more
- **DRS zones** should see more overtaking attempts
- **Corner zones** should have fewer successful overtakes
- **Event log** should show realistic mix of success/failure
- **No infinite loops** or position swapping

---

## 🐛 KNOWN LIMITATIONS

1. **No side-by-side visualization** - Cars don't show visual battle on track
2. **No battle panel** - Live probability display not implemented yet
3. **Single-file racing** - Cars still follow single racing line
4. **No tire/fuel strategy** - Overtaking doesn't consider tire wear
5. **No team orders** - No strategic team-based overtaking

---

## 🚀 FUTURE ENHANCEMENTS

### Phase 2 (Potential)
- [ ] Live battle panel with probability bars
- [ ] Side-by-side car visualization during battles
- [ ] Battle indicators on track (⚔️ icon)
- [ ] Sound effects for overtakes
- [ ] Replay system for key overtakes

### Phase 3 (Advanced)
- [ ] Multi-line racing (inside/outside lines)
- [ ] Slipstream effect (separate from DRS)
- [ ] Tire degradation affecting overtaking
- [ ] Weather impact on overtaking zones
- [ ] Team radio messages for overtakes

---

## 📝 CHANGELOG

### v1.0 (May 27, 2026)
- ✅ Initial deployment
- ✅ 3 overtaking zones on Monza
- ✅ Skill-based success calculation
- ✅ Event log with real-time updates
- ✅ Overtakes column in results
- ✅ Cooldown system
- ✅ DRS/ERS integration

---

## 🎓 USAGE TIPS

### For Balanced Racing
- Ensure driver skills are varied (not all 75)
- Use realistic car setups (not all identical)
- Wing setup affects straight-line speed (impacts overtaking)

### For Testing
- Set one car much faster (powerUnit 95 vs 75)
- Give one driver high overtaking skill (95)
- Watch Main Straight for most overtakes

### For Realism
- Keep default settings (don't modify constants)
- Let qualifying determine grid order
- Observe natural overtaking patterns

---

**Documentation Version:** 1.0  
**Last Updated:** May 27, 2026  
**Author:** Kiro AI Assistant
