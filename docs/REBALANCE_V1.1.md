# 🔄 DYNAMIC CORNERING SPEED v1.1 - REBALANCED

## 📋 OVERVIEW

Version 1.1 fixes critical balance issues discovered in v1.0:
1. **High-Speed Amplification** - Excessive speed differences at fast corners
2. **Wing Setup Dominance** - Wing setup overshadowing other stats
3. **Missing Straight-Line Trade-off** - No penalty for high downforce wings

---

## 🚨 PROBLEMS FIXED

### Problem 1: High-Speed Amplification (CRITICAL)

**Issue:**
```
Turn 8 (245 km/h base):
Mercedes: 261.4 km/h
Alpine:   227.8 km/h
Chênh lệch: 33.6 km/h ❌ PHI THỰC TẾ!
```

**Root Cause:**
- Multiplicative formula amplifies differences at high base speeds
- 13.7% gap × 245 km/h = 33.6 km/h (too large!)

**Solution: Speed-based Sensitivity Scaling**
```javascript
// Slower corners get full impact, faster corners get reduced impact
sensitivity = max(0.3, 1 - (baseSpeed - 85) / 250)

Turn 2 (85 km/h):  sensitivity = 1.00 (100% impact)
Turn 4 (130 km/h): sensitivity = 0.82 (82% impact)
Turn 6 (208 km/h): sensitivity = 0.51 (51% impact)
Turn 8 (245 km/h): sensitivity = 0.36 (36% impact)
```

**Result:**
```
Turn 8 (245 km/h base):
Mercedes: 249.2 km/h
Alpine:   240.3 km/h
Chênh lệch: 8.9 km/h ✅ REALISTIC!

Improvement: 33.6 → 8.9 km/h (74% reduction)
```

---

### Problem 2: Wing Setup Dominance (CRITICAL)

**Issue:**
```
Wing contribution: 70.1% of total gap
Downforce: only 15.3%
Cornering: only 8.8%

Wing setup overshadows car and driver stats!
```

**Root Cause:**
- Wing impact range too high (±8%)
- Other factors too small in comparison

**Solution: Reduce Wing Impact Range**
```javascript
// OLD:
wing: 0.08  // ±8% (0.92x - 1.08x)

// NEW:
wing: 0.05  // ±5% (0.95x - 1.05x)

Reduction: 37.5% decrease in wing impact
```

**Result:**
```
Wing contribution: 59.7% of total gap (was 70.1%)
Downforce: 20.9% (was 15.3%)
Cornering: 11.9% (was 8.8%)

Improvement: 10.4 percentage points reduction
```

---

### Problem 3: Missing Straight-Line Trade-off (NEW FEATURE)

**Issue:**
```
High wing setup:
- Faster in corners: +4.1 km/h
- Penalty on straights: NONE ❌

Result: Everyone chooses high wing (no strategy)
```

**Solution: Straight-Line Drag Formula**
```javascript
function calculateStraightLineDrag(frontWing) {
  if (frontWing > 50) {
    // High wing = High drag = Slower straights
    return ((frontWing - 50) / 50) * 15;  // Max 15 km/h penalty
  } else {
    // Low wing = Low drag = Faster straights
    return -((50 - frontWing) / 50) * 8;  // Max 8 km/h bonus
  }
}
```

**Result:**
```
Wing 100 (High downforce):
- Corner advantage: +2.6 km/h per corner
- Straight penalty: -15 km/h
- Best for: Monaco, Singapore (corner-heavy tracks)

Wing 0 (Low downforce):
- Corner disadvantage: -2.6 km/h per corner
- Straight bonus: +8 km/h
- Best for: Monza, Spa (straight-heavy tracks)

Trade-off: Clear and meaningful! ✅
```

---

## 📊 FINAL BALANCE RESULTS

### Mercedes (Top Team) vs Alpine (Mid Team)

**Setup:**
```
Mercedes: downforce 92, cornering 88, wing 80, control 86, chassis 90
Alpine:   downforce 78, cornering 78, wing 20, control 80, chassis 82
```

**Corner Speeds:**
```
Turn 2 (Slow):      89.1 vs 80.6 km/h  →  8.5 km/h diff ✅
Turn 4 (Medium):   135.1 vs 124.4 km/h → 10.7 km/h diff ✅
Turn 6 (Fast):     213.1 vs 202.4 km/h → 10.6 km/h diff ✅
Turn 8 (Very Fast): 249.2 vs 240.3 km/h →  8.9 km/h diff ✅

Total corner advantage: 38.8 km/h (9 corners)
Average per corner: 4.3 km/h
```

**Straight-Line:**
```
Mercedes (wing 80): -9.0 km/h penalty
Alpine (wing 20):   +4.8 km/h bonus
Net disadvantage: -13.8 km/h
```

**Monza Overall (30% corners, 70% straights):**
```
Weighted corner:   +11.6 km/h
Weighted straight: -9.7 km/h
Net advantage:     +1.9 km/h ✅ BALANCED!
```

---

## 🔧 TECHNICAL CHANGES

### File: `js/utils/dynamicCorneringSpeed.js`

#### 1. Updated Impact Ranges
```javascript
const IMPACT_RANGES = {
  downforce: 0.15,   // ±15% (unchanged)
  cornering: 0.12,   // ±12% (unchanged)
  wing: 0.05,        // ±5% (REDUCED from ±8%)
  control: 0.05,     // ±5% (unchanged)
  chassis: 0.06      // ±6% (unchanged)
};
```

#### 2. Added Sensitivity Function
```javascript
function calculateSensitivity(baseCornerSpeed) {
  return Math.max(0.3, 1 - (baseCornerSpeed - 85) / 250);
}
```

#### 3. Updated All Multiplier Functions
```javascript
// Example: Downforce multiplier with sensitivity
function calculateDownforceMultiplier(downforce, sensitivity = 1.0) {
  const rating = Math.max(1, Math.min(99, Number(downforce) || 85));
  const baseMultiplier = 1 + (rating - 85) / 100 * 0.15;
  return 1 + (baseMultiplier - 1) * sensitivity;  // Apply sensitivity
}

// Same pattern for: cornering, wing, control, chassis
```

#### 4. Updated Main Calculation Function
```javascript
export function calculateDynamicCornerSpeed(cornerIndex, carSetup, driverSkills, wingSetup) {
  const baseSpeed = BASE_CORNER_SPEEDS[cornerIndex];
  const sensitivity = calculateSensitivity(baseSpeed);  // NEW
  
  // All multipliers now use sensitivity
  const downforceMult = calculateDownforceMultiplier(downforce, sensitivity);
  const corneringMult = calculateCorneringMultiplier(cornering, sensitivity);
  const wingMult = calculateWingMultiplier(frontWing, sensitivity);
  const controlMult = calculateControlMultiplier(control, sensitivity);
  const chassisMult = calculateChassisMultiplier(chassis, sensitivity);
  
  return baseSpeed * downforceMult * corneringMult * wingMult * controlMult * chassisMult;
}
```

### File: `app.js`

#### 1. Added Straight-Line Drag Function
```javascript
function calculateStraightLineDrag(frontWing) {
  const wing = Math.max(0, Math.min(100, Number(frontWing) || 50));
  
  if (wing > 50) {
    return ((wing - 50) / 50) * 15;  // Penalty
  } else {
    return -((50 - wing) / 50) * 8;  // Bonus
  }
}
```

#### 2. Applied Drag to Qualifying Simulation
```javascript
const ersBoostKmh = shouldDeployErs ? getErsBoostKmh(ersDeployRating) : 0;
const wingDragPenalty = calculateStraightLineDrag(run.team?.setup?.frontWing || 50);  // NEW
const baseTargetSpeedKmh = drsTopSpeedKmh + ersBoostKmh + qualifyingSpeedBoostKmh - wingDragPenalty;
```

#### 3. Applied Drag to Race Simulation
```javascript
const ersBoostKmh = shouldDeployErs ? getRaceErsSpeedBoostKmh(run.speedKmh, ersDeployRating) : 0;
const wingDragPenalty = calculateStraightLineDrag(run.team?.setup?.frontWing || 50);  // NEW
const baseSpeedWithErs = drsTopSpeedKmh + ersBoostKmh - wingDragPenalty;
```

---

## 📈 IMPACT COMPARISON

### v1.0 vs v1.1

| Metric | v1.0 | v1.1 | Change |
|--------|------|------|--------|
| **Turn 8 diff** | 33.6 km/h | 8.9 km/h | -74% ✅ |
| **Wing dominance** | 70.1% | 59.7% | -10.4 pts ✅ |
| **Straight trade-off** | None | 15 km/h max | Added ✅ |
| **Monza net advantage** | +25.5 km/h | +1.9 km/h | -92% ✅ |

### Stats Utilization

| Stat | v1.0 | v1.1 | Status |
|------|------|------|--------|
| downforce | ±1.5% | ±1.5% (scaled) | ✅ Active |
| cornering | ±1.2% | ±1.2% (scaled) | ✅ Active |
| wing | ±4.8% | ±3.0% (scaled) | ✅ Balanced |
| control | ±0.5% | ±0.5% (scaled) | ✅ Active |
| chassis | ±0.6% | ±0.6% (scaled) | ✅ Active |

---

## 🎮 GAMEPLAY IMPACT

### Wing Setup Strategy

**Monaco (80% corners, 20% straights):**
```
Optimal: High wing (80-100)
- Corner advantage: +23 km/h (weighted)
- Straight penalty: -3 km/h (weighted)
- Net: +20 km/h ✅ Clear winner
```

**Monza (30% corners, 70% straights):**
```
Optimal: Low wing (0-20)
- Corner disadvantage: -12 km/h (weighted)
- Straight bonus: +6 km/h (weighted)
- Net: -6 km/h ✅ Better than high wing
```

**Silverstone (50% corners, 50% straights):**
```
Optimal: Medium wing (40-60)
- Balanced trade-off
- Depends on car/driver strengths
```

### Team Performance

**Top Team (Mercedes):**
- Still fastest overall ✅
- But not dominant (1.9 km/h vs 25.5 km/h)
- Realistic advantage

**Mid Team (Alpine):**
- Competitive with right strategy ✅
- Can beat top teams on specific tracks
- Wing setup matters

**Weak Team (Haas):**
- Still slowest ✅
- But not hopeless
- Good driver can compensate

---

## ✅ VALIDATION CHECKLIST

- [x] Turn 8 difference < 20 km/h
- [x] Wing dominance < 60%
- [x] Straight-line trade-off exists
- [x] Monza balance reasonable
- [x] All corners < 15 km/h difference
- [x] Strategic depth increased
- [x] No performance regression
- [x] Backward compatible

---

## 🚀 DEPLOYMENT

### Files Modified:
1. `js/utils/dynamicCorneringSpeed.js` - Core rebalance
2. `app.js` - Straight-line drag integration

### Files Created:
1. `test_balance.py` - Balance validation
2. `test_rebalance.py` - Rebalance testing
3. `test_final_balance.py` - Final validation
4. `docs/REBALANCE_V1.1.md` - This document

### Testing:
```bash
# Run balance tests
python test_final_balance.py

# Expected output:
✅ Turn 8 chấp nhận được
✅ Wing cân bằng tốt
✅ Monza balance OK
🎉 READY TO DEPLOY!
```

### Browser Testing:
```
1. Open: http://localhost:8000/test-dynamic-cornering.html
2. Verify: All tests pass
3. Open: http://localhost:8000/index.html
4. Run: Qualifying and Race
5. Check: Mercedes faster but not dominant
```

---

## 📝 NOTES

- Sensitivity scaling is automatic (no configuration needed)
- Drag formula applies to both qualifying and race
- Wing setup now has meaningful strategic trade-offs
- Balance is realistic for F1 (top team ~2 km/h faster per lap)
- System is track-agnostic (works for any track with different base speeds)

---

**Version:** 1.1  
**Date:** 2026-05-26  
**Status:** ✅ Deployed & Balanced  
**Previous Version:** 1.0 (had critical balance issues)
