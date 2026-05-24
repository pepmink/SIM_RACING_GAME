// ============================================================
//  Championship Configuration
// ============================================================

export const CHAMPIONSHIPS = {
  f1: {
    id: 'f1',
    name: 'Formula 1',
    icon: '🏎',
    accentColor: '#e10600',
    categories: ['F1']
  },
  wec: {
    id: 'wec',
    name: 'FIA WEC',
    icon: '⏱',
    accentColor: '#0066cc',
    categories: ['Hypercar', 'LMP2', 'GTE Pro', 'GTE Am']
  },
  gt: {
    id: 'gt',
    name: 'GT Championship',
    icon: '🏁',
    accentColor: '#00a651',
    categories: ['GT3', 'GT4', 'GT2', 'Other']
  }
};

export const DEFAULT_TEAMS_BY_CHAMP = {
  f1: [
    { seedId: 'alpine', name: 'BWT Alpine F1 Team', country: 'France', car: 'A525', category: 'F1', color: '#0090ff', budget: 470, carSetup: { powerUnit: 78, downforce: 77, chassis: 71, reliability: 75, ersDeploy: 86, tyreDegradation: 41 }, setup: { frontWing: 50, rearWing: 50 } },
    { seedId: 'aston-martin', name: 'Aston Martin Aramco F1 Team', country: 'United Kingdom', car: 'AMR25', category: 'F1', color: '#006f62', budget: 520, carSetup: { powerUnit: 82, downforce: 78, chassis: 86, reliability: 81, ersDeploy: 88, tyreDegradation: 27 }, setup: { frontWing: 50, rearWing: 50 } },
    { seedId: 'ferrari', name: 'Scuderia Ferrari HP', country: 'Italy', car: 'SF-25', category: 'F1', color: '#e10600', budget: 680, carSetup: { powerUnit: 85, downforce: 83, chassis: 89, reliability: 92, ersDeploy: 90, tyreDegradation: 20 }, setup: { frontWing: 50, rearWing: 50 } },
    { seedId: 'haas', name: 'MoneyGram Haas F1 Team', country: 'United States', car: 'VF-25', category: 'F1', color: '#b6babd', budget: 310, carSetup: { powerUnit: 83, downforce: 81, chassis: 77, reliability: 86, ersDeploy: 78, tyreDegradation: 26 }, setup: { frontWing: 50, rearWing: 50 } },
    { seedId: 'sauber', name: 'Stake F1 Team Kick Sauber', country: 'Switzerland', car: 'C45', category: 'F1', color: '#00e701', budget: 300, carSetup: { powerUnit: 82, downforce: 78, chassis: 81, reliability: 77, ersDeploy: 82, tyreDegradation: 36 }, setup: { frontWing: 50, rearWing: 50 } },
    { seedId: 'mclaren', name: 'McLaren Formula 1 Team', country: 'United Kingdom', car: 'MCL39', category: 'F1', color: '#ff8700', budget: 640, carSetup: { powerUnit: 90, downforce: 95, chassis: 96, reliability: 90, ersDeploy: 85, tyreDegradation: 15 }, setup: { frontWing: 50, rearWing: 50 } },
    { seedId: 'mercedes', name: 'Mercedes-AMG Petronas F1 Team', country: 'Germany', car: 'F1 W16', category: 'F1', color: '#00d2be', budget: 630, carSetup: { powerUnit: 95, downforce: 87, chassis: 91, reliability: 97, ersDeploy: 90, tyreDegradation: 35 }, setup: { frontWing: 50, rearWing: 50 } },
    { seedId: 'racing-bulls', name: 'Visa Cash App Racing Bulls F1 Team', country: 'Italy', car: 'VCARB 02', category: 'F1', color: '#2b5db7', budget: 360, carSetup: { powerUnit: 86, downforce: 82, chassis: 83, reliability: 90, ersDeploy: 92, tyreDegradation: 35 }, setup: { frontWing: 50, rearWing: 50 } },
    { seedId: 'red-bull', name: 'Oracle Red Bull Racing', country: 'Austria', car: 'RB21', category: 'F1', color: '#1e41ff', budget: 700, carSetup: { powerUnit: 93, downforce: 92, chassis: 93, reliability: 95, ersDeploy: 92, tyreDegradation: 25 }, setup: { frontWing: 50, rearWing: 50 } },
    { seedId: 'williams', name: 'Atlassian Williams Racing', country: 'United Kingdom', car: 'FW47', category: 'F1', color: '#005aff', budget: 390, carSetup: { powerUnit: 91, downforce: 83, chassis: 86, reliability: 82, ersDeploy: 87, tyreDegradation: 31 }, setup: { frontWing: 50, rearWing: 50 } }
  ],
  wec: [
    { seedId: 'titan-hypercar', name: 'Titan Hypercar', country: 'Japan', car: 'TH-01H', category: 'Hypercar', color: '#0066cc', budget: 420 },
    { seedId: 'enduro-proton', name: 'Enduro Proton', country: 'Germany', car: 'EP-LMP2', category: 'LMP2', color: '#1f95ff', budget: 260 },
    { seedId: 'crimson-lemans', name: 'Crimson LeMans', country: 'Italy', car: 'CL-GTE', category: 'GTE Pro', color: '#d7263d', budget: 310 }
  ],
  gt: [
    { seedId: 'night-owl', name: 'Night Owl Motorsport', country: 'Belgium', car: 'NOM GT3', category: 'GT3', color: '#00a651', budget: 180 },
    { seedId: 'velocity-garage', name: 'Velocity Garage', country: 'United States', car: 'VG GT4', category: 'GT4', color: '#19bf6a', budget: 145 },
    { seedId: 'sunset-dynamics', name: 'Sunset Dynamics', country: 'Spain', car: 'SD GT2', category: 'GT2', color: '#f39c12', budget: 170 }
  ]
};

export const DEFAULT_DRIVERS_BY_CHAMP = {
  f1: [
    { seedId: 'gasly', first: 'Pierre', last: 'Gasly', number: 10, nationality: 'French', teamSeedId: 'alpine', skills: { cornering: 83, braking: 84, reactions: 85, accuracy: 75, control: 89, smooth: 76, adaptability: 81, overtaking: 87, defending: 82 } },
    { seedId: 'colapinto', first: 'Franco', last: 'Colapinto', number: 7, nationality: 'Australian', teamSeedId: 'alpine', skills: { cornering: 78, braking: 77, reactions: 75, accuracy: 86, control: 81, smooth: 72, adaptability: 85, overtaking: 86, defending: 85 } },
    { seedId: 'alonso', first: 'Fernando', last: 'Alonso', number: 14, nationality: 'Spanish', teamSeedId: 'aston-martin', skills: { cornering: 85, braking: 81, reactions: 80, accuracy: 89, control: 95, smooth: 96, adaptability: 82, overtaking: 83, defending: 95 } },
    { seedId: 'stroll', first: 'Lance', last: 'Stroll', number: 18, nationality: 'Canadian', teamSeedId: 'aston-martin', skills: { cornering: 81, braking: 78, reactions: 77, accuracy: 85, control: 82, smooth: 80, adaptability: 85, overtaking: 78, defending: 77 } },
    { seedId: 'leclerc', first: 'Charles', last: 'Leclerc', number: 16, nationality: 'Monegasque', teamSeedId: 'ferrari', skills: { cornering: 93, braking: 89, reactions: 92, accuracy: 91, control: 90, smooth: 85, adaptability: 90, overtaking: 91, defending: 85 } },
    { seedId: 'hamilton', first: 'Lewis', last: 'Hamilton', number: 44, nationality: 'British', teamSeedId: 'ferrari', skills: { cornering: 87, braking: 93, reactions: 82, accuracy: 95, control: 96, smooth: 88, adaptability: 83, overtaking: 85, defending: 90 } },
    { seedId: 'ocon', first: 'Esteban', last: 'Ocon', number: 31, nationality: 'French', teamSeedId: 'haas', skills: { cornering: 80, braking: 75, reactions: 81, accuracy: 88, control: 82, smooth: 81, adaptability: 73, overtaking: 78, defending: 88 } },
    { seedId: 'bearman', first: 'Oliver', last: 'Bearman', number: 87, nationality: 'British', teamSeedId: 'haas', skills: { cornering: 84, braking: 83, reactions: 78, accuracy: 85, control: 86, smooth: 75, adaptability: 78, overtaking: 89, defending: 81 } },
    { seedId: 'bortoleto', first: 'Gabriel', last: 'Bortoleto', number: 5, nationality: 'Brazilian', teamSeedId: 'sauber', skills: { cornering: 80, braking: 81, reactions: 73, accuracy: 72, control: 88, smooth: 78, adaptability: 79, overtaking: 85, defending: 89 } },
    { seedId: 'hulkenberg', first: 'Nico', last: 'Hulkenberg', number: 27, nationality: 'German', teamSeedId: 'sauber', skills: { cornering: 82, braking: 78, reactions: 85, accuracy: 80, control: 81, smooth: 82, adaptability: 72, overtaking: 76, defending: 93 } },
    { seedId: 'norris', first: 'Lando', last: 'Norris', number: 4, nationality: 'British', teamSeedId: 'mclaren', skills: { cornering: 88, braking: 85, reactions: 92, accuracy: 93, control: 94, smooth: 92, adaptability: 87, overtaking: 91, defending: 93 } },
    { seedId: 'piastri', first: 'Oscar', last: 'Piastri', number: 81, nationality: 'Australian', teamSeedId: 'mclaren', skills: { cornering: 85, braking: 87, reactions: 94, accuracy: 95, control: 90, smooth: 87, adaptability: 83, overtaking: 96, defending: 82 } },
    { seedId: 'antonelli', first: 'Kimi', last: 'Antonelli', number: 12, nationality: 'Italian', teamSeedId: 'mercedes', skills: { cornering: 86, braking: 83, reactions: 86, accuracy: 78, control: 75, smooth: 71, adaptability: 81, overtaking: 92, defending: 82 } },
    { seedId: 'russell', first: 'George', last: 'Russell', number: 63, nationality: 'British', teamSeedId: 'mercedes', skills: { cornering: 88, braking: 89, reactions: 81, accuracy: 92, control: 93, smooth: 90, adaptability: 85, overtaking: 89, defending: 94 } },
    { seedId: 'hadjar', first: 'Isack', last: 'Hadjar', number: 6, nationality: 'French', teamSeedId: 'racing-bulls', skills: { cornering: 87, braking: 81, reactions: 88, accuracy: 76, control: 77, smooth: 73, adaptability: 79, overtaking: 88, defending: 85 } },
    { seedId: 'lawson', first: 'Liam', last: 'Lawson', number: 30, nationality: 'New Zealander', teamSeedId: 'racing-bulls', skills: { cornering: 82, braking: 78, reactions: 83, accuracy: 81, control: 82, smooth: 83, adaptability: 75, overtaking: 82, defending: 88 } },
    { seedId: 'verstappen', first: 'Max', last: 'Verstappen', number: 1, nationality: 'Dutch', teamSeedId: 'red-bull', skills: { cornering: 95, braking: 96, reactions: 90, accuracy: 87, control: 94, smooth: 82, adaptability: 98, overtaking: 96, defending: 93 } },
    { seedId: 'tsunoda', first: 'Yuki', last: 'Tsunoda', number: 22, nationality: 'Japanese', teamSeedId: 'red-bull', skills: { cornering: 85, braking: 80, reactions: 87, accuracy: 75, control: 70, smooth: 87, adaptability: 83, overtaking: 80, defending: 89 } },
    { seedId: 'albon', first: 'Alexander', last: 'Albon', number: 23, nationality: 'Thai', teamSeedId: 'williams', skills: { cornering: 82, braking: 81, reactions: 90, accuracy: 88, control: 82, smooth: 84, adaptability: 80, overtaking: 86, defending: 81 } },
    { seedId: 'sainz', first: 'Carlos', last: 'Sainz Jr.', number: 55, nationality: 'Spanish', teamSeedId: 'williams', skills: { cornering: 90, braking: 85, reactions: 89, accuracy: 85, control: 86, smooth: 96, adaptability: 78, overtaking: 82, defending: 87 } }
  ],
  wec: [],
  gt: []
};

export const F1_2025_QUALIFYING_BY_SEED = {
  gasly: 86,
  colapinto: 77,
  alonso: 91,
  stroll: 75,
  leclerc: 95,
  hamilton: 87,
  ocon: 80,
  bearman: 86,
  bortoleto: 83,
  hulkenberg: 84,
  norris: 91,
  piastri: 93,
  antonelli: 85,
  russell: 94,
  hadjar: 87,
  lawson: 81,
  verstappen: 98,
  tsunoda: 80,
  albon: 82,
  sainz: 88
};
