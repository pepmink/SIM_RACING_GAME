// ============================================================
//  Wing Setup Utilities
// ============================================================

import {
  FRONT_WING_OVERTAKING_MAX_BONUS,
  FRONT_WING_DEFENDING_MAX_BONUS,
  FRONT_WING_CORNERING_MAX_BONUS,
  FRONT_WING_CONTROL_MAX_BONUS,
  REAR_WING_BRAKING_MAX_BONUS,
  REAR_WING_SMOOTH_MAX_BONUS,
  WING_SETUP_NEUTRAL_POINT,
  MONZA_SETUP_WEIGHTS
} from '../config/constants.js';

/**
 * Calculate front wing modifiers based on setup value
 * @param {number} frontWing - Front wing value (0-100)
 * @returns {object} Skill modifiers
 */
export function getFrontWingModifiers(frontWing) {
  const deviation = frontWing - WING_SETUP_NEUTRAL_POINT; // -50 to +50
  
  if (deviation < 0) {
    // Low downforce setup (0-49) → good for overtaking & defending
    const intensity = Math.abs(deviation) / 50; // 0 to 1
    return {
      overtaking: intensity * FRONT_WING_OVERTAKING_MAX_BONUS,
      defending: intensity * FRONT_WING_DEFENDING_MAX_BONUS,
      cornering: 0,
      control: 0
    };
  } else if (deviation > 0) {
    // High downforce setup (51-100) → good for cornering & control
    const intensity = deviation / 50; // 0 to 1
    return {
      overtaking: 0,
      defending: 0,
      cornering: intensity * FRONT_WING_CORNERING_MAX_BONUS,
      control: intensity * FRONT_WING_CONTROL_MAX_BONUS
    };
  } else {
    // Neutral (50)
    return { overtaking: 0, defending: 0, cornering: 0, control: 0 };
  }
}

/**
 * Calculate rear wing modifiers based on setup value
 * @param {number} rearWing - Rear wing value (0-100)
 * @returns {object} Skill modifiers
 */
export function getRearWingModifiers(rearWing) {
  const deviation = rearWing - WING_SETUP_NEUTRAL_POINT; // -50 to +50
  
  if (deviation < 0) {
    // Low drag setup (0-49) → good for braking
    const intensity = Math.abs(deviation) / 50; // 0 to 1
    return {
      braking: intensity * REAR_WING_BRAKING_MAX_BONUS,
      smooth: 0
    };
  } else if (deviation > 0) {
    // High stability setup (51-100) → good for smooth
    const intensity = deviation / 50; // 0 to 1
    return {
      braking: 0,
      smooth: intensity * REAR_WING_SMOOTH_MAX_BONUS
    };
  } else {
    // Neutral (50)
    return { braking: 0, smooth: 0 };
  }
}

/**
 * Apply wing setup modifiers to driver skills
 * @param {object} baseSkills - Base driver skills
 * @param {object} setup - Team setup { frontWing, rearWing }
 * @returns {object} Modified skills
 */
export function applyWingSetupToSkills(baseSkills, setup) {
  const frontMods = getFrontWingModifiers(setup.frontWing || WING_SETUP_NEUTRAL_POINT);
  const rearMods = getRearWingModifiers(setup.rearWing || WING_SETUP_NEUTRAL_POINT);
  
  return {
    cornering: clamp(baseSkills.cornering + frontMods.cornering, 1, 99),
    braking: clamp(baseSkills.braking + rearMods.braking, 1, 99),
    reactions: baseSkills.reactions,
    accuracy: baseSkills.accuracy,
    control: clamp(baseSkills.control + frontMods.control, 1, 99),
    smooth: clamp(baseSkills.smooth + rearMods.smooth, 1, 99),
    adaptability: baseSkills.adaptability,
    overtaking: clamp(baseSkills.overtaking + frontMods.overtaking, 1, 99),
    defending: clamp(baseSkills.defending + frontMods.defending, 1, 99),
    qualifying: baseSkills.qualifying
  };
}

/**
 * Calculate optimal setup for Monza track
 * @param {object} team - Team object with carSetup
 * @param {object} driver - Driver object with skills
 * @returns {object} Optimal setup { frontWing, rearWing, confidence }
 */
export function calculateOptimalSetupForMonza(team, driver) {
  // Normalize car setup (assume normalizeCarSetup is available globally)
  const carSetup = team.carSetup || {};
  const powerUnit = Number(carSetup.powerUnit) || 75;
  const downforce = Number(carSetup.downforce) || 75;
  const ersDeploy = Number(carSetup.ersDeploy) || 75;
  
  // Normalize driver skills (assume normalizeDriverSkills is available globally)
  const skills = driver.skills || {};
  const overtaking = Number(skills.overtaking) || 75;
  const braking = Number(skills.braking) || 75;
  const cornering = Number(skills.cornering) || 75;
  const control = Number(skills.control) || 75;
  
  // Calculate team strengths (deviation from average)
  const powerAdvantage = powerUnit - 75;
  
  // Calculate driver strengths (deviation from average)
  const overtakingSkill = overtaking - 75;
  const brakingSkill = braking - 75;
  const corneringSkill = cornering - 75;
  const controlSkill = control - 75;
  
  // Calculate priorities based on Monza weights
  const weights = MONZA_SETUP_WEIGHTS;
  const straightSpeedPriority = weights.straightSpeed * (1 + powerAdvantage * 0.01);
  const overtakingPriority = weights.overtaking * (1 + overtakingSkill * 0.01);
  const brakingPriority = weights.braking * (1 + brakingSkill * 0.01);
  const corneringPriority = weights.cornering * (1 + corneringSkill * 0.01);
  const stabilityPriority = weights.stability * (1 + controlSkill * 0.01);
  
  // Front Wing calculation
  const lowDownforceScore = straightSpeedPriority + overtakingPriority;
  const highDownforceScore = corneringPriority + stabilityPriority;
  const frontBalance = lowDownforceScore / (lowDownforceScore + highDownforceScore);
  const frontWing = Math.round(35 - (frontBalance * 20)); // Range: 35 to 15
  
  // Rear Wing calculation
  const lowDragScore = straightSpeedPriority + brakingPriority;
  const highStabilityScore = stabilityPriority;
  const rearBalance = lowDragScore / (lowDragScore + highStabilityScore);
  const rearWing = Math.round(30 - (rearBalance * 20)); // Range: 30 to 10
  
  // Calculate confidence (how well this setup matches Monza)
  const confidence = Math.round(
    (straightSpeedPriority * 95 + 
     overtakingPriority * 90 + 
     brakingPriority * 70) / 1.55
  );
  
  return {
    frontWing: clamp(frontWing, 15, 35),
    rearWing: clamp(rearWing, 10, 30),
    confidence: clamp(confidence, 0, 100)
  };
}

/**
 * Clamp value between min and max
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
