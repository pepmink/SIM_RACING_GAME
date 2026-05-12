// ============================================================
//  Default Values & Constants
// ============================================================

export const CAR_STAT_DEFAULTS = {
  powerUnit: 75,
  downforce: 75,
  chassis: 75,
  reliability: 75,
  ersDeploy: 75,
  tyreDegradation: 25
};

export function getDefaultDriverSkills() {
  return {
    cornering: 75,
    braking: 75,
    reactions: 75,
    accuracy: 75,
    control: 75,
    smooth: 75,
    adaptability: 75,
    overtaking: 75,
    defending: 75,
    qualifying: 75
  };
}
