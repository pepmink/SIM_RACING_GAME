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
 */
const IMPACT_RANGES = {
  downforce: 0.15,   // ±15% (0.85x - 1.15x)
  cornering: 0.12,   // ±12% (0.88x - 1.12x)
  wing: 0.08,        // ±8% (0.92x - 1.08x)
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
 * Calculate downforce multiplier
 * @param {number} downforce - Car downforce rating (1-99)
 * @returns {number} Multiplier (0.85 - 1.15)
 */
function calculateDownforceMultiplier(downforce) {
  const rating = Math.max(1, Math.min(99, Number(downforce) || REFERENCE_RATING));
  return 1 + (rating - REFERENCE_RATING) / 100 * IMPACT_RANGES.downforce;
}

/**
 * Calculate cornering skill multiplier
 * @param {number} cornering - Driver cornering skill (1-99)
 * @returns {number} Multiplier (0.88 - 1.12)
 */
function calculateCorneringMultiplier(cornering) {
  const rating = Math.max(1, Math.min(99, Number(cornering) || REFERENCE_RATING));
  return 1 + (rating - REFERENCE_RATING) / 100 * IMPACT_RANGES.cornering;
}

/**
 * Calculate wing setup multiplier
 * @param {number} frontWing - Front wing setting (0-100)
 * @returns {number} Multiplier (0.92 - 1.08)
 */
function calculateWingMultiplier(frontWing) {
  const wing = Math.max(0, Math.min(100, Number(frontWing) || REFERENCE_WING));
  
  if (wing >= REFERENCE_WING) {
    // High wing (51-100) → More downforce → Faster corners
    return 1 + (wing - REFERENCE_WING) / REFERENCE_WING * IMPACT_RANGES.wing;
  } else {
    // Low wing (0-49) → Less downforce → Slower corners
    return 1 - (REFERENCE_WING - wing) / REFERENCE_WING * IMPACT_RANGES.wing;
  }
}

/**
 * Calculate control skill multiplier
 * @param {number} control - Driver control skill (1-99)
 * @returns {number} Multiplier (0.95 - 1.05)
 */
function calculateControlMultiplier(control) {
  const rating = Math.max(1, Math.min(99, Number(control) || REFERENCE_RATING));
  return 1 + (rating - REFERENCE_RATING) / 100 * IMPACT_RANGES.control;
}

/**
 * Calculate chassis multiplier
 * @param {number} chassis - Car chassis rating (1-99)
 * @returns {number} Multiplier (0.94 - 1.06)
 */
function calculateChassisMultiplier(chassis) {
  const rating = Math.max(1, Math.min(99, Number(chassis) || REFERENCE_RATING));
  return 1 + (rating - REFERENCE_RATING) / 100 * IMPACT_RANGES.chassis;
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

  // Extract values with fallbacks
  const downforce = carSetup?.downforce || REFERENCE_RATING;
  const chassis = carSetup?.chassis || REFERENCE_RATING;
  const cornering = driverSkills?.cornering || REFERENCE_RATING;
  const control = driverSkills?.control || REFERENCE_RATING;
  const frontWing = wingSetup?.frontWing ?? REFERENCE_WING;

  // Calculate all multipliers
  const downforceMult = calculateDownforceMultiplier(downforce);
  const corneringMult = calculateCorneringMultiplier(cornering);
  const wingMult = calculateWingMultiplier(frontWing);
  const controlMult = calculateControlMultiplier(control);
  const chassisMult = calculateChassisMultiplier(chassis);

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
  
  const downforce = carSetup?.downforce || REFERENCE_RATING;
  const chassis = carSetup?.chassis || REFERENCE_RATING;
  const cornering = driverSkills?.cornering || REFERENCE_RATING;
  const control = driverSkills?.control || REFERENCE_RATING;
  const frontWing = wingSetup?.frontWing ?? REFERENCE_WING;

  const downforceMult = calculateDownforceMultiplier(downforce);
  const corneringMult = calculateCorneringMultiplier(cornering);
  const wingMult = calculateWingMultiplier(frontWing);
  const controlMult = calculateControlMultiplier(control);
  const chassisMult = calculateChassisMultiplier(chassis);

  const finalSpeed = baseSpeed * downforceMult * corneringMult * wingMult * controlMult * chassisMult;

  return {
    cornerIndex,
    baseSpeed,
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
  calculateDownforceMultiplier,
  calculateCorneringMultiplier,
  calculateWingMultiplier,
  calculateControlMultiplier,
  calculateChassisMultiplier
};
