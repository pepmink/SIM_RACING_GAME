// ============================================================
//  Overtaking & Defending System
// ============================================================
// Handles AI racing interactions: overtaking attempts, defending,
// and position swaps during race simulation

/**
 * Overtaking zones configuration for Monza
 * Each zone has different difficulty affecting base success rates
 */
export const OVERTAKING_ZONES = [
  {
    id: 'zone1',
    name: 'Main Straight (DRS 1)',
    startMarker: { x: 742.6, y: 380.9 },
    endMarker: { x: 440.6, y: 380 },
    difficulty: 'easy',
    color: '#4caf50'
  },
  {
    id: 'zone2',
    name: 'Curva Grande Exit (DRS 2)',
    startMarker: { x: 265.8, y: 80.8 },
    endMarker: { x: 438.9, y: 248.7 },
    difficulty: 'medium',
    color: '#ff9800'
  },
  {
    id: 'zone3',
    name: 'Lesmo 1 Entry',
    startMarker: { x: 180, y: 240 },
    endMarker: { x: 230, y: 240 },
    difficulty: 'hard',
    color: '#f44336'
  }
];

/**
 * Base success rates by zone difficulty
 */
const BASE_RATES = {
  overtaking: {
    easy: 0.50,    // 50% on long straights
    medium: 0.35,  // 35% on shorter straights
    hard: 0.20     // 20% when entering corners
  },
  defending: {
    easy: 0.30,    // 30% defense on straights
    medium: 0.45,  // 45% defense on shorter sections
    hard: 0.60     // 60% defense in corners
  }
};

/**
 * Impact factors for overtaking/defending calculations
 */
const IMPACT_FACTORS = {
  maxSpeedBonus: 0.25,        // Max +25% from speed advantage
  speedThreshold: 40,         // 40 km/h speed diff = max bonus
  overtakingSkillImpact: 0.20, // ±20% from overtaking skill
  defendingSkillImpact: 0.25,  // ±25% from defending skill
  controlSkillImpact: 0.15,    // ±15% from control skill
  drsBonus: 0.15,              // +15% with DRS
  ersBonus: 0.10,              // +10% with ERS
  positionBonus: 0.10          // +10% for defender (position advantage)
};

/**
 * Cooldown durations (in seconds)
 */
const COOLDOWNS = {
  afterSuccess: 3.0,   // 3 seconds after successful overtake
  afterFailed: 1.5     // 1.5 seconds after failed attempt
};

/**
 * Gap threshold for overtaking attempts (in seconds)
 */
const GAP_THRESHOLD = 0.5; // Must be within 0.5 seconds

/**
 * Calculate distance between two points
 */
function calculateDistance(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a car is currently in an overtaking zone
 * @param {Object} car - Car object with position {x, y}
 * @param {number} lapLength - Total lap length
 * @returns {Object|null} Zone object if in zone, null otherwise
 */
export function getCurrentOvertakingZone(car, lapLength) {
  if (!car || !car.position) return null;

  for (const zone of OVERTAKING_ZONES) {
    const distToStart = calculateDistance(car.position, zone.startMarker);
    const distToEnd = calculateDistance(car.position, zone.endMarker);
    const zoneLength = calculateDistance(zone.startMarker, zone.endMarker);

    // Check if car is between start and end markers (with some tolerance)
    if (distToStart < zoneLength && distToEnd < zoneLength) {
      return zone;
    }
  }

  return null;
}

/**
 * Calculate overtaking success probability
 * @param {Object} attacker - Attacking car object
 * @param {Object} defender - Defending car object
 * @param {Object} zone - Overtaking zone
 * @returns {number} Success probability (0-1)
 */
export function calculateOvertakingSuccess(attacker, defender, zone) {
  // 1. Base rate from zone difficulty
  let successRate = BASE_RATES.overtaking[zone.difficulty];

  // 2. Speed advantage bonus
  const speedDiff = attacker.speedKmh - defender.speedKmh;
  const speedBonus = Math.min(
    IMPACT_FACTORS.maxSpeedBonus,
    (speedDiff / IMPACT_FACTORS.speedThreshold) * IMPACT_FACTORS.maxSpeedBonus
  );
  successRate += Math.max(0, speedBonus); // Only positive speed diff helps

  // 3. Overtaking skill bonus
  const attackerSkill = attacker.driver?.skills?.overtaking || 85;
  const skillBonus = ((attackerSkill - 85) / 100) * IMPACT_FACTORS.overtakingSkillImpact;
  successRate += skillBonus;

  // 4. DRS bonus
  if (attacker.drsActive) {
    successRate += IMPACT_FACTORS.drsBonus;
  }

  // 5. ERS bonus
  if (attacker.ersDeploying) {
    successRate += IMPACT_FACTORS.ersBonus;
  }

  // Clamp between 10% and 90%
  return Math.max(0.10, Math.min(0.90, successRate));
}

/**
 * Calculate defending success probability
 * @param {Object} defender - Defending car object
 * @param {Object} attacker - Attacking car object
 * @param {Object} zone - Overtaking zone
 * @returns {number} Success probability (0-1)
 */
export function calculateDefendingSuccess(defender, attacker, zone) {
  // 1. Base rate from zone difficulty
  let defenseRate = BASE_RATES.defending[zone.difficulty];

  // 2. Defending skill bonus
  const defenderSkill = defender.driver?.skills?.defending || 85;
  const skillBonus = ((defenderSkill - 85) / 100) * IMPACT_FACTORS.defendingSkillImpact;
  defenseRate += skillBonus;

  // 3. Control skill bonus (handling pressure)
  const controlSkill = defender.driver?.skills?.control || 85;
  const controlBonus = ((controlSkill - 85) / 100) * IMPACT_FACTORS.controlSkillImpact;
  defenseRate += controlBonus;

  // 4. Position advantage (always benefits defender)
  defenseRate += IMPACT_FACTORS.positionBonus;

  // Clamp between 10% and 90%
  return Math.max(0.10, Math.min(0.90, defenseRate));
}

/**
 * Check if a car can attempt overtaking
 * @param {Object} attacker - Car attempting to overtake
 * @param {Object} defender - Car being overtaken
 * @param {number} gap - Gap in seconds
 * @param {Object} zone - Current overtaking zone
 * @param {number} currentTime - Current simulation time
 * @returns {boolean} True if can attempt
 */
export function canAttemptOvertake(attacker, defender, gap, zone, currentTime) {
  // Must be within gap threshold
  if (gap > GAP_THRESHOLD) return false;

  // Must be in an overtaking zone
  if (!zone) return false;

  // Attacker must be faster
  if (attacker.speedKmh <= defender.speedKmh) return false;

  // Check cooldown
  if (attacker.cooldownUntil && currentTime < attacker.cooldownUntil) return false;

  return true;
}

/**
 * Attempt an overtake and determine outcome
 * @param {Object} attacker - Car attempting to overtake
 * @param {Object} defender - Car being overtaken
 * @param {Object} zone - Overtaking zone
 * @param {number} currentTime - Current simulation time
 * @param {number} currentLap - Current lap number
 * @returns {Object} Result object with success flag and details
 */
export function attemptOvertake(attacker, defender, zone, currentTime, currentLap) {
  // Calculate probabilities
  const attackSuccess = calculateOvertakingSuccess(attacker, defender, zone);
  const defendSuccess = calculateDefendingSuccess(defender, attacker, zone);

  // Normalize probabilities
  const total = attackSuccess + defendSuccess;
  const normalizedAttack = attackSuccess / total;
  const normalizedDefend = defendSuccess / total;

  // Random roll
  const roll = Math.random();
  const success = roll < normalizedAttack;

  // Set cooldown
  attacker.cooldownUntil = currentTime + (success ? COOLDOWNS.afterSuccess : COOLDOWNS.afterFailed);

  // Create result object
  const result = {
    success,
    attacker: {
      name: attacker.driver ? `${attacker.driver.first} ${attacker.driver.last}` : 'Unknown',
      tag: attacker.teamTag || 'UNK',
      probability: (normalizedAttack * 100).toFixed(1)
    },
    defender: {
      name: defender.driver ? `${defender.driver.first} ${defender.driver.last}` : 'Unknown',
      tag: defender.teamTag || 'UNK',
      probability: (normalizedDefend * 100).toFixed(1)
    },
    zone: zone.name,
    zoneDifficulty: zone.difficulty,
    lap: currentLap,
    timestamp: new Date().toLocaleTimeString(),
    factors: {
      attacker: {
        speedAdvantage: Math.round(attacker.speedKmh - defender.speedKmh),
        hasDRS: attacker.drsActive || false,
        hasERS: attacker.ersDeploying || false,
        overtakingSkill: attacker.driver?.skills?.overtaking || 85
      },
      defender: {
        defendingSkill: defender.driver?.skills?.defending || 85,
        controlSkill: defender.driver?.skills?.control || 85
      }
    }
  };

  return result;
}

/**
 * Swap positions of two cars in the race order
 * @param {Array} cars - Array of car objects
 * @param {Object} attacker - Car that overtook
 * @param {Object} defender - Car that was overtaken
 */
export function swapPositions(cars, attacker, defender) {
  const attackerIndex = cars.indexOf(attacker);
  const defenderIndex = cars.indexOf(defender);

  if (attackerIndex === -1 || defenderIndex === -1) {
    console.warn('Cannot swap positions: car not found in array');
    return;
  }

  // Swap in array
  [cars[attackerIndex], cars[defenderIndex]] = [cars[defenderIndex], cars[attackerIndex]];

  // Update position numbers
  cars.forEach((car, index) => {
    car.racePosition = index + 1;
  });
}

/**
 * Calculate gap between two cars (in seconds)
 * @param {Object} carBehind - Car behind
 * @param {Object} carAhead - Car ahead
 * @param {number} lapLength - Total lap length
 * @returns {number} Gap in seconds
 */
export function calculateGap(carBehind, carAhead, lapLength) {
  if (!carBehind || !carAhead) return Infinity;

  // Calculate distance difference
  const distanceDiff = carAhead.distance - carBehind.distance;

  // Handle lap difference
  if (distanceDiff < 0) {
    // Car ahead is on next lap
    return Infinity;
  }

  // Convert distance to time gap using average speed
  const avgSpeed = (carBehind.speedKmh + carAhead.speedKmh) / 2;
  if (avgSpeed === 0) return Infinity;

  // Distance in km, speed in km/h → time in hours → convert to seconds
  const gapSeconds = (distanceDiff / 1000) / avgSpeed * 3600;

  return gapSeconds;
}

/**
 * Get statistics for a car's overtaking performance
 * @param {Object} car - Car object
 * @returns {Object} Statistics
 */
export function getOvertakingStats(car) {
  return {
    overtakesCompleted: car.overtakesCompleted || 0,
    overtakesFailed: car.overtakesFailed || 0,
    defensesSuccessful: car.defensesSuccessful || 0,
    defensesFailed: car.defensesFailed || 0,
    successRate: car.overtakesCompleted > 0
      ? ((car.overtakesCompleted / (car.overtakesCompleted + car.overtakesFailed)) * 100).toFixed(1)
      : '0.0'
  };
}

/**
 * Initialize overtaking stats for a car
 * @param {Object} car - Car object
 */
export function initializeOvertakingStats(car) {
  car.overtakesCompleted = 0;
  car.overtakesFailed = 0;
  car.defensesSuccessful = 0;
  car.defensesFailed = 0;
  car.cooldownUntil = 0;
}

// Export constants for external use
export const CONSTANTS = {
  GAP_THRESHOLD,
  COOLDOWNS,
  IMPACT_FACTORS,
  BASE_RATES
};
