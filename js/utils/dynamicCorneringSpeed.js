// ============================================================
//  Dynamic Cornering Speed System
// ============================================================
// Replaces fixed corner speeds with dynamic calculation based on:
// - Car downforce
// - Driver cornering skill
// - Wing setup (front wing)
// - Driver control skill
// - Car chassis

/**
 * Base corner speeds for Monza (reference for average car/driver with rating 85)
 * These represent the speed of a "standard" car with all stats at 85
 */
export const BASE_CORNER_SPEEDS = [
  90,   // Turn 1: Prima Variante (chicane)
  85,   // Turn 2: Seconda Variante (SLOWEST)
  130,  // Turn 3: Curva Grande entry
  208,  // Turn 4: Lesmo 1
  225,  // Turn 5: Lesmo 2 entry
  195,  // Turn 6: Lesmo 2 apex
  228,  // Turn 7: Ascari entry
  245,  // Turn 8: Ascari exit (FASTEST)
  219   // Turn 9: Parabolica
];

/**
 * Impact ranges for each factor (as multipliers)
 * BALANCED VERSION: Reduced wing impact to prevent dominance
 */
const IMPACT_RANGES = {
  downforce: 0.15,   // ±15% (0.85x - 1.15x)
  cornering: 0.12,   // ±12% (0.88x - 1.12x)
  wing: 0.05,        // ±5% (0.95x - 1.05x) - REDUCED from ±8%
  control: 0.05,     // ±5% (0.95x - 1.05x)
  chassis: 0.06      // ±6% (0.94x - 1.06x)
};

/**
 * Reference point for all stats (average car/driver)
 */
const REFERENCE_RATING = 85;

/**
 * Reference point for wing setup (neutral)
 */
const REFERENCE_WING = 50;

/**
 * Calculate sensitivity factor based on corner speed
 * Slower corners get full impact (1.0), faster corners get reduced impact (0.36)
 * This prevents excessive speed differences at high-speed corners
 * @param {number} baseCornerSpeed - Base corner speed in km/h
 * @returns {number} Sensitivity factor (0.3 - 1.0)
 */
function calculateSensitivity(baseCornerSpeed) {
  // Formula: sensitivity = max(0.3, 1 - (speed - 85) / 250)
  // 85 km/h (slow) → 1.0 (100% impact)
  // 245 km/h (fast) → 0.36 (36% impact)
  return Math.max(0.3, 1 - (baseCornerSpeed - 85) / 250);
}

/**
 * Calculate downforce multiplier with sensitivity scaling
 * @param {number} downforce - Car downforce rating (1-99)
 * @param {number} sensitivity - Sensitivity factor (0.3-1.0)
 * @returns {number} Multiplier (0.85 - 1.15)
 */
function calculateDownforceMultiplier(downforce, sensitivity = 1.0) {
  const rating = Math.max(1, Math.min(99, Number(downforce) || REFERENCE_RATING));
  const baseMultiplier = 1 + (rating - REFERENCE_RATING) / 100 * IMPACT_RANGES.downforce;
  // Apply sensitivity: impact is reduced at high speeds
  return 1 + (baseMultiplier - 1) * sensitivity;
}

/**
 * Calculate cornering skill multiplier with sensitivity scaling
 * @param {number} cornering - Driver cornering skill (1-99)
 * @param {number} sensitivity - Sensitivity factor (0.3-1.0)
 * @returns {number} Multiplier (0.88 - 1.12)
 */
function calculateCorneringMultiplier(cornering, sensitivity = 1.0) {
  const rating = Math.max(1, Math.min(99, Number(cornering) || REFERENCE_RATING));
  const baseMultiplier = 1 + (rating - REFERENCE_RATING) / 100 * IMPACT_RANGES.cornering;
  return 1 + (baseMultiplier - 1) * sensitivity;
}

/**
 * Calculate wing setup multiplier with sensitivity scaling
 * @param {number} frontWing - Front wing setting (0-100)
 * @param {number} sensitivity - Sensitivity factor (0.3-1.0)
 * @returns {number} Multiplier (0.95 - 1.05)
 */
function calculateWingMultiplier(frontWing, sensitivity = 1.0) {
  const wing = Math.max(0, Math.min(100, Number(frontWing) || REFERENCE_WING));
  
  let baseMultiplier;
  if (wing >= REFERENCE_WING) {
    // High wing (51-100) → More downforce → Faster corners
    baseMultiplier = 1 + (wing - REFERENCE_WING) / REFERENCE_WING * IMPACT_RANGES.wing;
  } else {
    // Low wing (0-49) → Less downforce → Slower corners
    baseMultiplier = 1 - (REFERENCE_WING - wing) / REFERENCE_WING * IMPACT_RANGES.wing;
  }
  
  return 1 + (baseMultiplier - 1) * sensitivity;
}

/**
 * Calculate control skill multiplier with sensitivity scaling
 * @param {number} control - Driver control skill (1-99)
 * @param {number} sensitivity - Sensitivity factor (0.3-1.0)
 * @returns {number} Multiplier (0.95 - 1.05)
 */
function calculateControlMultiplier(control, sensitivity = 1.0) {
  const rating = Math.max(1, Math.min(99, Number(control) || REFERENCE_RATING));
  const baseMultiplier = 1 + (rating - REFERENCE_RATING) / 100 * IMPACT_RANGES.control;
  return 1 + (baseMultiplier - 1) * sensitivity;
}

/**
 * Calculate chassis multiplier with sensitivity scaling
 * @param {number} chassis - Car chassis rating (1-99)
 * @param {number} sensitivity - Sensitivity factor (0.3-1.0)
 * @returns {number} Multiplier (0.94 - 1.06)
 */
function calculateChassisMultiplier(chassis, sensitivity = 1.0) {
  const rating = Math.max(1, Math.min(99, Number(chassis) || REFERENCE_RATING));
  const baseMultiplier = 1 + (rating - REFERENCE_RATING) / 100 * IMPACT_RANGES.chassis;
  return 1 + (baseMultiplier - 1) * sensitivity;
}

/**
 * Calculate dynamic corner speed for a specific corner
 * @param {number} cornerIndex - Corner index (0-8 for Monza's 9 corners)
 * @param {Object} carSetup - Car setup object with downforce, chassis
 * @param {Object} driverSkills - Driver skills object with cornering, control
 * @param {Object} wingSetup - Wing setup object with frontWing
 * @returns {number} Dynamic corner speed in km/h
 */
export function calculateDynamicCornerSpeed(cornerIndex, carSetup, driverSkills, wingSetup) {
  // Validate corner index
  if (cornerIndex < 0 || cornerIndex >= BASE_CORNER_SPEEDS.length) {
    console.warn(`Invalid corner index: ${cornerIndex}`);
    return BASE_CORNER_SPEEDS[0] || 85;
  }

  // Get base speed for this corner
  const baseSpeed = BASE_CORNER_SPEEDS[cornerIndex];
  
  // Calculate sensitivity based on corner speed (prevents high-speed amplification)
  const sensitivity = calculateSensitivity(baseSpeed);

  // Extract values with fallbacks
  const downforce = carSetup?.downforce || REFERENCE_RATING;
  const chassis = carSetup?.chassis || REFERENCE_RATING;
  const cornering = driverSkills?.cornering || REFERENCE_RATING;
  const control = driverSkills?.control || REFERENCE_RATING;
  const frontWing = wingSetup?.frontWing ?? REFERENCE_WING;

  // Calculate all multipliers with sensitivity scaling
  const downforceMult = calculateDownforceMultiplier(downforce, sensitivity);
  const corneringMult = calculateCorneringMultiplier(cornering, sensitivity);
  const wingMult = calculateWingMultiplier(frontWing, sensitivity);
  const controlMult = calculateControlMultiplier(control, sensitivity);
  const chassisMult = calculateChassisMultiplier(chassis, sensitivity);

  // Calculate final speed
  const finalSpeed = baseSpeed * downforceMult * corneringMult * wingMult * controlMult * chassisMult;

  return Math.max(30, Math.round(finalSpeed)); // Minimum 30 km/h for safety
}

/**
 * Get all 9 corner speeds for a car/driver combination
 * @param {Object} carSetup - Car setup object
 * @param {Object} driverSkills - Driver skills object
 * @param {Object} wingSetup - Wing setup object
 * @returns {Array<number>} Array of 9 corner speeds in km/h
 */
export function getAllCornerSpeeds(carSetup, driverSkills, wingSetup) {
  return BASE_CORNER_SPEEDS.map((_, index) => 
    calculateDynamicCornerSpeed(index, carSetup, driverSkills, wingSetup)
  );
}

/**
 * Get detailed breakdown of corner speed calculation (for debugging/UI)
 * @param {number} cornerIndex - Corner index
 * @param {Object} carSetup - Car setup object
 * @param {Object} driverSkills - Driver skills object
 * @param {Object} wingSetup - Wing setup object
 * @returns {Object} Detailed breakdown
 */
export function getCornerSpeedBreakdown(cornerIndex, carSetup, driverSkills, wingSetup) {
  const baseSpeed = BASE_CORNER_SPEEDS[cornerIndex];
  const sensitivity = calculateSensitivity(baseSpeed);
  
  const downforce = carSetup?.downforce || REFERENCE_RATING;
  const chassis = carSetup?.chassis || REFERENCE_RATING;
  const cornering = driverSkills?.cornering || REFERENCE_RATING;
  const control = driverSkills?.control || REFERENCE_RATING;
  const frontWing = wingSetup?.frontWing ?? REFERENCE_WING;

  const downforceMult = calculateDownforceMultiplier(downforce, sensitivity);
  const corneringMult = calculateCorneringMultiplier(cornering, sensitivity);
  const wingMult = calculateWingMultiplier(frontWing, sensitivity);
  const controlMult = calculateControlMultiplier(control, sensitivity);
  const chassisMult = calculateChassisMultiplier(chassis, sensitivity);

  const finalSpeed = baseSpeed * downforceMult * corneringMult * wingMult * controlMult * chassisMult;

  return {
    cornerIndex,
    baseSpeed,
    sensitivity,
    finalSpeed: Math.round(finalSpeed),
    factors: {
      downforce: { value: downforce, multiplier: downforceMult, impact: (downforceMult - 1) * 100 },
      cornering: { value: cornering, multiplier: corneringMult, impact: (corneringMult - 1) * 100 },
      frontWing: { value: frontWing, multiplier: wingMult, impact: (wingMult - 1) * 100 },
      control: { value: control, multiplier: controlMult, impact: (controlMult - 1) * 100 },
      chassis: { value: chassis, multiplier: chassisMult, impact: (chassisMult - 1) * 100 }
    },
    totalMultiplier: downforceMult * corneringMult * wingMult * controlMult * chassisMult,
    speedDifference: Math.round(finalSpeed - baseSpeed)
  };
}

/**
 * Compare corner speeds between two car/driver combinations
 * @param {Object} setup1 - First setup { carSetup, driverSkills, wingSetup }
 * @param {Object} setup2 - Second setup { carSetup, driverSkills, wingSetup }
 * @returns {Object} Comparison data
 */
export function compareCornerSpeeds(setup1, setup2) {
  const speeds1 = getAllCornerSpeeds(setup1.carSetup, setup1.driverSkills, setup1.wingSetup);
  const speeds2 = getAllCornerSpeeds(setup2.carSetup, setup2.driverSkills, setup2.wingSetup);

  const differences = speeds1.map((speed1, index) => ({
    corner: index + 1,
    speed1,
    speed2: speeds2[index],
    difference: speed1 - speeds2[index],
    percentDiff: ((speed1 - speeds2[index]) / speeds2[index] * 100).toFixed(2)
  }));

  const totalAdvantage = differences.reduce((sum, d) => sum + d.difference, 0);
  const avgDifference = totalAdvantage / differences.length;

  return {
    differences,
    totalAdvantage: Math.round(totalAdvantage),
    avgDifference: Math.round(avgDifference * 10) / 10,
    setup1Faster: totalAdvantage > 0
  };
}

// Export for testing/debugging
export const TESTING = {
  IMPACT_RANGES,
  REFERENCE_RATING,
  REFERENCE_WING,
  calculateSensitivity,
  calculateDownforceMultiplier,
  calculateCorneringMultiplier,
  calculateWingMultiplier,
  calculateControlMultiplier,
  calculateChassisMultiplier
};
