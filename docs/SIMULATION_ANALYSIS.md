# 📊 PHÂN TÍCH SIMULATION - Các Tham Số Ảnh Hưởng

## 🏁 QUALIFYING SIMULATION

### ✅ Các Tham Số Được Sử Dụng:

#### 1. **Car Stats:**
- ✅ **powerUnit** → Top speed (speedKmh)
- ✅ **ersDeploy** → ERS battery capacity & effectiveness

#### 2. **Driver Skills (qua qualifyingRating):**
- ✅ **cornering** (28% weight)
- ✅ **braking** (18% weight)
- ✅ **reactions** (24% weight)
- ✅ **accuracy** (30% weight)
- ✅ **qualifying** (if available)

**Formula:**
```javascript
qualifyingRating = cornering * 0.28 + braking * 0.18 + reactions * 0.24 + accuracy * 0.30

qualifyingSpeedBoostKmh = 20 * paceMultiplier(qualifyingRating)
qualifyingAccelMultiplier = 1 + 0.04 * paceMultiplier(qualifyingRating)
```

#### 3. **Wing Setup (ACTIVE):**
- ✅ **frontWing** → Modifies: overtaking, defending, cornering, control
- ✅ **rearWing** → Modifies: braking, smooth

**Impact Chain:**
```
Wing Setup → Modified Skills → Qualifying Rating → Speed Boost & Accel
```

**Example:**
```
Base Skills: cornering=85, braking=80
Wing Setup: frontWing=20 (low), rearWing=15 (low)

Modified Skills:
  cornering = 85 + 0 = 85 (no change from low front wing)
  braking = 80 + 6.3 = 86.3 (bonus from low rear wing)

Qualifying Rating = 85*0.28 + 86.3*0.18 + ... = 87.5
Speed Boost = 20 * 0.75 = 15 km/h
Accel Multiplier = 1.03

Result: Faster lap times!
```

---

## 🏎️ RACE SIMULATION

### ✅ Các Tham Số Được Sử Dụng:

#### 1. **Car Stats:**
- ✅ **powerUnit** → Top speed (speedKmh)
  - Formula: `speedKmh = 370 - (99 - powerUnit) * 2`
  - Example: powerUnit=93 → 370 - 12 = 358 km/h

- ✅ **ersDeploy** → ERS effectiveness
  - Battery capacity
  - Charge/drain rate
  - Speed boost
  - Accel multiplier

#### 2. **DRS System:**
- ✅ **DRS zones** (track-specific)
- ✅ **Gap requirement** (< 1 second to car ahead)
- ✅ **powerUnit-based boost:**
  - powerUnit > 90: +4% speed
  - powerUnit 85-90: +7% speed
  - powerUnit < 85: +12% speed

#### 3. **Track Features:**
- ✅ **Braking zones** (turn distances)
- ✅ **Start/finish line**
- ✅ **Lap length**

### ❌ Các Tham Số KHÔNG Được Sử Dụng:

#### 1. **Driver Skills:**
- ❌ **cornering** - Not used
- ❌ **braking** - Not used
- ❌ **reactions** - Not used
- ❌ **accuracy** - Not used
- ❌ **control** - Not used
- ❌ **smooth** - Not used
- ❌ **adaptability** - Not used
- ❌ **overtaking** - Not used
- ❌ **defending** - Not used
- ❌ **qualifying** - Not used

#### 2. **Wing Setup:**
- ❌ **frontWing** - Not used in race
- ❌ **rearWing** - Not used in race

**Lý do:** Race simulation chỉ dựa vào car performance (powerUnit, ERS) và track features, không có driver skill factors.

#### 3. **Car Stats (Unused):**
- ❌ **downforce** - Not implemented
- ❌ **chassis** - Not implemented
- ❌ **reliability** - Not implemented
- ❌ **tyreDegradation** - Not implemented

---

## 📈 IMPACT SUMMARY

### Qualifying:
```
Wing Setup → ✅ HIGH IMPACT
  ↓
Modified Driver Skills → ✅ HIGH IMPACT
  ↓
Qualifying Rating → ✅ HIGH IMPACT
  ↓
Lap Times → ✅ AFFECTED
```

### Race:
```
Wing Setup → ❌ NO IMPACT
Driver Skills → ❌ NO IMPACT

Only Factors:
  - powerUnit → ✅ HIGH IMPACT
  - ersDeploy → ✅ MEDIUM IMPACT
  - DRS → ✅ MEDIUM IMPACT
  - Track layout → ✅ HIGH IMPACT
```

---

## 🎯 RECOMMENDATIONS

### Option 1: Keep Current (Qualifying Only)
**Pros:**
- Wing setup affects grid position
- Grid position affects race outcome
- Realistic (setup matters for qualifying)

**Cons:**
- Wing setup doesn't directly affect race pace
- Driver skills unused in race

### Option 2: Add Driver Skills to Race
**Implementation:**
```javascript
// In advanceSimRuns():

// 1. Use driver skills for cornering speed
const corneringSkill = run.driver?._modifiedSkills?.cornering || 75;
const corneringMultiplier = 0.95 + (corneringSkill / 99) * 0.1; // 0.95 to 1.05
targetSpeedKmh *= corneringMultiplier;

// 2. Use braking skill for brake zones
const brakingSkill = run.driver?._modifiedSkills?.braking || 75;
const brakingMultiplier = 0.9 + (brakingSkill / 99) * 0.2; // 0.9 to 1.1
decelRate *= brakingMultiplier;

// 3. Use overtaking for DRS effectiveness
const overtakingSkill = run.driver?._modifiedSkills?.overtaking || 75;
const overtakingBonus = (overtakingSkill - 75) * 0.001; // -0.075 to +0.024
drsTopSpeedMultiplier += overtakingBonus;

// 4. Use smooth for ERS efficiency
const smoothSkill = run.driver?._modifiedSkills?.smooth || 75;
const ersEfficiency = 0.9 + (smoothSkill / 99) * 0.2; // 0.9 to 1.1
ersDrainRate /= ersEfficiency;
```

**Impact:**
- Wing setup → Driver skills → Race performance
- More realistic simulation
- Setup choices matter throughout weekend

### Option 3: Add Unused Car Stats
**Implementation:**
```javascript
// 1. Downforce affects cornering speed
const downforce = run.team.carSetup.downforce || 75;
const corneringBonus = (downforce - 75) * 0.002; // -0.15 to +0.048
targetSpeedKmh *= (1 + corneringBonus);

// 2. Chassis affects stability (reduce speed variance)
const chassis = run.team.carSetup.chassis || 75;
const stabilityFactor = chassis / 99; // 0 to 1
// Use for random variations

// 3. Reliability affects breakdown chance
const reliability = run.team.carSetup.reliability || 75;
const breakdownChance = (99 - reliability) * 0.001; // 0 to 0.099
if (Math.random() < breakdownChance * dtSec) {
  run.mechanicalFailure = true;
}

// 4. Tyre degradation affects speed over time
const tyreDeg = run.team.carSetup.tyreDegradation || 25;
const lapProgress = run.lapCrossings || 0;
const degradationFactor = 1 - (tyreDeg / 99) * (lapProgress / 50) * 0.1;
targetSpeedKmh *= degradationFactor;
```

---

## 🔍 CURRENT STATUS

### What Works:
- ✅ Wing setup auto-optimization for Monza
- ✅ Wing modifiers applied to driver skills
- ✅ Modified skills affect qualifying performance
- ✅ Qualifying grid order affects race start positions

### What Doesn't Work (Yet):
- ❌ Wing setup doesn't affect race pace
- ❌ Driver skills unused in race
- ❌ Downforce, chassis, reliability, tyreDeg unused
- ❌ No mechanical failures
- ❌ No tyre strategy

---

## 💡 NEXT STEPS

### Phase 1: ✅ DONE
- Wing setup system
- Qualifying integration
- Auto-optimization

### Phase 2: Recommended
- [ ] Add driver skills to race simulation
- [ ] Implement cornering speed based on skills
- [ ] Implement braking efficiency based on skills
- [ ] Test and balance multipliers

### Phase 3: Advanced
- [ ] Implement downforce effects
- [ ] Implement reliability/failures
- [ ] Implement tyre degradation
- [ ] Add pit stop strategy

---

## 📝 CONCLUSION

**Current Implementation:**
- Wing setup ✅ **WORKS** for qualifying
- Wing setup ❌ **DOESN'T AFFECT** race directly
- Race outcome depends on: Grid position (from qualifying) + Car performance (powerUnit, ERS)

**To Make Wing Setup Affect Race:**
- Need to implement driver skills in race simulation
- Estimated effort: 2-3 hours
- Would make setup choices more impactful

---

**Analysis Date:** 2026-05-14  
**Version:** 2.0  
**Status:** Qualifying ✅ | Race ⚠️ (Partial)

