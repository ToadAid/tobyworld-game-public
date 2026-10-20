export const DIRECTIONS = Object.freeze({
  up: { x: 0, y: -1, opposite: "down" },
  down: { x: 0, y: 1, opposite: "up" },
  left: { x: -1, y: 0, opposite: "right" },
  right: { x: 1, y: 0, opposite: "left" },
});

export const LEVEL_715 = Object.freeze({
  id: "0715",
  name: "Lore Land Deed #715",
  signs: Object.freeze({
    Background: "Verdant Veil",
    Land: "Waystones",
    Core: "Rootbound",
    Relic: "Wayfinder Compass",
    Keeper: "Satoby",
  }),
  map: Object.freeze([
    "#################",
    "#.......#.......#",
    "#.###.#.#.#.###.#",
    "#.....#.#.#.....#",
    "###.#.#####.#.###",
    "#...#...#...#...#",
    "#.###.#####.###.#",
    "#.......G.......#",
    "#################",
  ]),
  start: Object.freeze({ x: 1, y: 7 }),
  core: Object.freeze({ x: 7, y: 7 }),
  relic: Object.freeze({ x: 15, y: 1 }),
  bloom: Object.freeze({ x: 15, y: 7 }),
  keeper: Object.freeze({ x: 8, y: 3 }),
  keeperAbility: "guidance",
  sprouts: Object.freeze([
    Object.freeze({ x: 1, y: 1 }),
    Object.freeze({ x: 5, y: 3 }),
    Object.freeze({ x: 13, y: 5 }),
  ]),
  lightGoal: 30,
  timeLimit: 150,
  gateHint: "bottom-center",
});

export const LEVEL_716 = Object.freeze({
  id: "0716",
  name: "Lore Land Deed #716",
  signs: Object.freeze({
    Background: "Violet Dusk",
    Land: "Frostveil",
    Core: "Sato",
    Relic: "Wayfinder Compass",
    Keeper: "Satoby",
  }),
  map: Object.freeze([
    "#################",
    "#.......#.......#",
    "#.#####.#.#####.#",
    "#.#.....#.....#.#",
    "#.#.###.G.###.#.#",
    "#...#...#...#...#",
    "###.#.#####.#.###",
    "#.......#.......#",
    "#################",
  ]),
  start: Object.freeze({ x: 1, y: 7 }),
  core: Object.freeze({ x: 7, y: 1 }),
  relic: Object.freeze({ x: 15, y: 1 }),
  bloom: Object.freeze({ x: 15, y: 7 }),
  keeper: Object.freeze({ x: 8, y: 3 }),
  keeperAbility: "guidance",
  sprouts: Object.freeze([
    Object.freeze({ x: 1, y: 1 }),
    Object.freeze({ x: 5, y: 5 }),
    Object.freeze({ x: 13, y: 3 }),
  ]),
  threats: Object.freeze([
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 5, y: 1 }), direction: "left", speed: 2.12 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 11, y: 5 }), direction: "right", speed: 2.34 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 15, y: 3 }), direction: "down", speed: 1.94 }),
  ]),
  lightGoal: 34,
  timeLimit: 165,
  gateHint: "center crossing",
});

export const LEVEL_717 = Object.freeze({
  id: "0717",
  name: "Lore Land Deed #717",
  signs: Object.freeze({
    Background: "Gilded Dawn",
    Land: "Stillwater",
    Core: "Taboshi",
    Relic: "Seed Vessel",
    Keeper: "Hush",
  }),
  map: Object.freeze([
    "#################",
    "#.......#.......#",
    "#.###.#.#.#.###.#",
    "#...#...#...#...#",
    "#.#.###.G.###.#.#",
    "#.#.....#.....#.#",
    "#.#####.#.#####.#",
    "#.......#.......#",
    "#################",
  ]),
  start: Object.freeze({ x: 1, y: 7 }),
  core: Object.freeze({ x: 7, y: 1 }),
  relic: Object.freeze({ x: 15, y: 7 }),
  bloom: Object.freeze({ x: 15, y: 1 }),
  keeper: Object.freeze({ x: 8, y: 3 }),
  keeperAbility: "quiet",
  sprouts: Object.freeze([
    Object.freeze({ x: 1, y: 1 }),
    Object.freeze({ x: 5, y: 5 }),
    Object.freeze({ x: 11, y: 3 }),
  ]),
  threats: Object.freeze([
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 5, y: 1 }), direction: "right", speed: 2.18 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 3, y: 7 }), direction: "left", speed: 2.06 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 5 }), direction: "up", speed: 2.38 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 15, y: 3 }), direction: "down", speed: 2.02 }),
  ]),
  lightGoal: 36,
  timeLimit: 180,
  gateHint: "the stillwater bridge",
});

export const LEVEL_718 = Object.freeze({
  id: "0718",
  name: "Lore Land Deed #718",
  signs: Object.freeze({
    Background: "Cloudwake",
    Land: "Sunfield",
    Core: "Eclipse",
    Relic: "Wayfinder Compass",
    Keeper: "OG",
  }),
  map: Object.freeze([
    "#################",
    "#...#...#.......#",
    "#.#.#.#.#.#####.#",
    "#.#...#.#.....#.#",
    "#.#####.G.###.#.#",
    "#.....#.#...#...#",
    "###.#.#.###.#.###",
    "#...#...#.....#.#",
    "#################",
  ]),
  start: Object.freeze({ x: 1, y: 7 }),
  core: Object.freeze({ x: 7, y: 1 }),
  relic: Object.freeze({ x: 15, y: 1 }),
  bloom: Object.freeze({ x: 13, y: 7 }),
  keeper: Object.freeze({ x: 8, y: 3 }),
  keeperAbility: "ward",
  sprouts: Object.freeze([
    Object.freeze({ x: 1, y: 1 }),
    Object.freeze({ x: 5, y: 3 }),
    Object.freeze({ x: 11, y: 3 }),
    Object.freeze({ x: 11, y: 7 }),
  ]),
  threats: Object.freeze([
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 3, y: 1 }), direction: "down", speed: 2.22 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 5, y: 5 }), direction: "left", speed: 2.08 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 11, y: 1 }), direction: "right", speed: 2.42 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 15, y: 3 }), direction: "down", speed: 2.12 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 5 }), direction: "left", speed: 2.3 }),
  ]),
  lightGoal: 40,
  timeLimit: 195,
  gateHint: "the cloud bridge",
});

export const LEVEL_0340 = Object.freeze({
  id: "0340",
  name: "Lore Land Deed #340",
  signs: Object.freeze({
    Background: "Gilded Dawn",
    Land: "Sporegrove",
    Core: "Shard",
    Relic: "Ancient Rune",
    Keeper: "Satoby",
  }),
  map: Object.freeze([
    "#################",
    "#.......#.......#",
    "#.###.S.#.S.###.#",
    "#...#...#...#...#",
    "#.S.###.G.###.S.#",
    "#...#...#...#...#",
    "#.###.S.#.S.###.#",
    "#.......#.......#",
    "#################",
  ]),
  start: Object.freeze({ x: 1, y: 7 }),
  core: Object.freeze({ x: 7, y: 1 }),
  relic: Object.freeze({ x: 15, y: 1 }),
  bloom: Object.freeze({ x: 15, y: 7 }),
  keeper: Object.freeze({ x: 8, y: 3 }),
  keeperAbility: "guidance",
  sprouts: Object.freeze([
    Object.freeze({ x: 1, y: 1 }),
    Object.freeze({ x: 6, y: 2 }),
    Object.freeze({ x: 10, y: 6 }),
    Object.freeze({ x: 15, y: 3 }),
  ]),
  threats: Object.freeze([
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 3, y: 1 }), direction: "right", speed: 2.3 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 1, y: 5 }), direction: "up", speed: 2.16 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 5, y: 7 }), direction: "left", speed: 2.46 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 11, y: 1 }), direction: "right", speed: 2.2 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 5 }), direction: "down", speed: 2.5 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 11, y: 7 }), direction: "left", speed: 2.24 }),
  ]),
  sporeCycleSeconds: 6,
  sporeOpenSeconds: 3.6,
  lightGoal: 44,
  timeLimit: 210,
  gateHint: "the spore bridge",
});

export const LEVEL_0378 = Object.freeze({
  id: "0378",
  name: "Lore Land Deed #378",
  signs: Object.freeze({
    Background: "Cloudwake",
    Land: "Emberreach",
    Core: "Sato",
    Relic: "Ancient Rune",
    Keeper: "OG",
  }),
  map: Object.freeze([
    "#################",
    "#..H....#....H..#",
    "#.###H#.#.#H###.#",
    "#...#...#...#...#",
    "#.#H###.G.###H#.#",
    "#.#.....#.....#.#",
    "#.#####H#H#####.#",
    "#..H....#....H..#",
    "#################",
  ]),
  start: Object.freeze({ x: 1, y: 7 }),
  core: Object.freeze({ x: 7, y: 1 }),
  relic: Object.freeze({ x: 15, y: 7 }),
  bloom: Object.freeze({ x: 15, y: 1 }),
  keeper: Object.freeze({ x: 8, y: 3 }),
  keeperAbility: "ward",
  sprouts: Object.freeze([
    Object.freeze({ x: 1, y: 1 }),
    Object.freeze({ x: 5, y: 5 }),
    Object.freeze({ x: 11, y: 3 }),
    Object.freeze({ x: 13, y: 7 }),
  ]),
  threats: Object.freeze([
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 3, y: 1 }), direction: "right", speed: 2.38 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 1, y: 5 }), direction: "up", speed: 2.22 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 5, y: 7 }), direction: "left", speed: 2.52 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 11, y: 1 }), direction: "right", speed: 2.28 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 5 }), direction: "down", speed: 2.58 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 11, y: 7 }), direction: "left", speed: 2.32 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 15, y: 3 }), direction: "down", speed: 2.44 }),
  ]),
  emberCycleSeconds: 7,
  emberCoolSeconds: 4,
  lightGoal: 48,
  timeLimit: 225,
  gateHint: "the ember bridge",
});

export const LEVEL_0118 = Object.freeze({
  id: "0118",
  name: "Lore Land Deed #118",
  signs: Object.freeze({
    Background: "Violet Dusk",
    Land: "Mossmere",
    Core: "Taboshi",
    Relic: "Kiribako",
    Keeper: "Satoby",
  }),
  map: Object.freeze([
    "#################",
    "#..M....#.......#",
    "#.###.#.#.#.###.#",
    "#...#...#...#M..#",
    "#.#.###.G.###.#.#",
    "#.#..M..#.....#.#",
    "#.#####.#.#####.#",
    "#.......#.......#",
    "#################",
  ]),
  start: Object.freeze({ x: 1, y: 7 }),
  core: Object.freeze({ x: 7, y: 1 }),
  relic: Object.freeze({ x: 15, y: 7 }),
  bloom: Object.freeze({ x: 15, y: 1 }),
  keeper: Object.freeze({ x: 8, y: 3 }),
  keeperAbility: "guidance",
  sprouts: Object.freeze([
    Object.freeze({ x: 1, y: 1 }),
    Object.freeze({ x: 5, y: 3 }),
    Object.freeze({ x: 11, y: 5 }),
    Object.freeze({ x: 15, y: 5 }),
  ]),
  memorySequence: Object.freeze([
    Object.freeze({ x: 13, y: 3 }),
    Object.freeze({ x: 5, y: 5 }),
    Object.freeze({ x: 3, y: 1 }),
  ]),
  threats: Object.freeze([
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 5, y: 1 }), direction: "right", speed: 2.44 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 1, y: 5 }), direction: "up", speed: 2.28 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 3, y: 7 }), direction: "left", speed: 2.56 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 11, y: 1 }), direction: "right", speed: 2.34 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 5 }), direction: "down", speed: 2.62 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 11, y: 7 }), direction: "left", speed: 2.38 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 15, y: 3 }), direction: "down", speed: 2.5 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 9, y: 5 }), direction: "right", speed: 2.3 }),
  ]),
  lightGoal: 52,
  timeLimit: 240,
  gateHint: "the moonlit bridge",
});

export const LEVEL_0182 = Object.freeze({
  id: "0182",
  name: "Lore Land Deed #182",
  signs: Object.freeze({
    Background: "Gilded Dawn",
    Land: "Meadow",
    Core: "Patience",
    Relic: "Gate Key",
    Keeper: "OG",
  }),
  map: Object.freeze([
    "#################",
    "#.......#.......#",
    "#.###.D.#.D.###.#",
    "#...#...#...#...#",
    "#.#.###.G.###.#.#",
    "#...#...#...#...#",
    "#.###.D.#.D.###.#",
    "#.......#.......#",
    "#################",
  ]),
  start: Object.freeze({ x: 1, y: 7 }),
  core: Object.freeze({ x: 7, y: 1 }),
  relic: Object.freeze({ x: 15, y: 7 }),
  bloom: Object.freeze({ x: 15, y: 1 }),
  keeper: Object.freeze({ x: 8, y: 3 }),
  keeperAbility: "ward",
  sprouts: Object.freeze([
    Object.freeze({ x: 1, y: 1 }),
    Object.freeze({ x: 5, y: 3 }),
    Object.freeze({ x: 5, y: 7 }),
    Object.freeze({ x: 11, y: 3 }),
    Object.freeze({ x: 13, y: 5 }),
  ]),
  threats: Object.freeze([
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 3, y: 1 }), direction: "right", speed: 2.48 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 1, y: 5 }), direction: "up", speed: 2.32 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 3, y: 7 }), direction: "left", speed: 2.6 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 7, y: 3 }), direction: "up", speed: 2.36 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 11, y: 1 }), direction: "right", speed: 2.66 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 9, y: 5 }), direction: "right", speed: 2.42 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 7 }), direction: "left", speed: 2.54 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 15, y: 3 }), direction: "down", speed: 2.38 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 15, y: 5 }), direction: "up", speed: 2.5 }),
  ]),
  lightGoal: 56,
  timeLimit: 255,
  gateHint: "the meadow bridge",
});

export const LEVEL_0887 = Object.freeze({
  id: "0887",
  name: "Lore Land Deed #887",
  signs: Object.freeze({
    Background: "Cloudwake",
    Land: "Frostveil",
    Core: "Shard",
    Relic: "Lore Map",
    Keeper: "Hush",
  }),
  map: Object.freeze([
    "#################",
    "#.......#.......#",
    "#.#####.#.#####.#",
    "#.....#.#.#.....#",
    "#.#.###.G.###.#.#",
    "#...#...#...#...#",
    "#.###.#####.###.#",
    "#.......#.......#",
    "#################",
  ]),
  start: Object.freeze({ x: 1, y: 7 }),
  core: Object.freeze({ x: 7, y: 1 }),
  relic: Object.freeze({ x: 15, y: 1 }),
  bloom: Object.freeze({ x: 15, y: 7 }),
  keeper: Object.freeze({ x: 8, y: 3 }),
  keeperAbility: "quiet",
  sprouts: Object.freeze([
    Object.freeze({ x: 1, y: 1 }),
    Object.freeze({ x: 5, y: 3 }),
    Object.freeze({ x: 3, y: 7 }),
    Object.freeze({ x: 11, y: 3 }),
    Object.freeze({ x: 13, y: 5 }),
  ]),
  threats: Object.freeze([
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 3, y: 1 }), direction: "right", speed: 2.52 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 1, y: 3 }), direction: "down", speed: 2.36 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 1, y: 5 }), direction: "up", speed: 2.64 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 5, y: 7 }), direction: "left", speed: 2.4 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 7, y: 5 }), direction: "up", speed: 2.7 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 11, y: 1 }), direction: "right", speed: 2.44 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 15, y: 3 }), direction: "down", speed: 2.68 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 11, y: 5 }), direction: "right", speed: 2.42 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 7 }), direction: "left", speed: 2.58 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 15, y: 5 }), direction: "up", speed: 2.46 }),
  ]),
  lightGoal: 54,
  timeLimit: 270,
  gateHint: "the frost bridge",
});

export const LEVEL_1091 = Object.freeze({
  id: "1091",
  name: "Lore Land Deed #1091",
  signs: Object.freeze({
    Background: "Verdant Veil",
    Land: "Stillwater",
    Core: "Taboshi",
    Relic: "Gate Key",
    Keeper: "Hush",
  }),
  map: Object.freeze([
    "#################",
    "#.......#...#...#",
    "#.###.#.#.#U###U#",
    "#...#...#...#...#",
    "#.#U###.G.###D#.#",
    "#...#...#...#...#",
    "#.###U#.#.#D###.#",
    "#.......#.......#",
    "#################",
  ]),
  start: Object.freeze({ x: 1, y: 7 }),
  core: Object.freeze({ x: 7, y: 1 }),
  relic: Object.freeze({ x: 15, y: 1 }),
  bloom: Object.freeze({ x: 15, y: 7 }),
  keeper: Object.freeze({ x: 8, y: 3 }),
  keeperAbility: "quiet",
  sprouts: Object.freeze([
    Object.freeze({ x: 1, y: 1 }),
    Object.freeze({ x: 5, y: 3 }),
    Object.freeze({ x: 3, y: 7 }),
    Object.freeze({ x: 11, y: 3 }),
    Object.freeze({ x: 13, y: 5 }),
  ]),
  threats: Object.freeze([
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 3, y: 1 }), direction: "right", speed: 2.32 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 1, y: 3 }), direction: "down", speed: 2.2 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 9, y: 3 }), direction: "down", speed: 2.28 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 11, y: 1 }), direction: "right", speed: 2.48 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 9, y: 7 }), direction: "right", speed: 2.26 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 3 }), direction: "down", speed: 2.4 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 15, y: 5 }), direction: "up", speed: 2.3 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 7 }), direction: "left", speed: 2.42 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 15, y: 3 }), direction: "down", speed: 2.24 }),
  ]),
  openingQuietSeconds: 4,
  keeperQuietSeconds: 10,
  submergedRevealSeconds: 6,
  submergedStillnessSeconds: 0.65,
  lightGoal: 58,
  timeLimit: 285,
  gateHint: "the stillwater threshold",
});

export const LEVEL_0969 = Object.freeze({
  id: "0969",
  name: "Lore Land Deed #969",
  signs: Object.freeze({
    Background: "Cloudwake",
    Land: "The Pond",
    Core: "Patience",
    Relic: "Gate Key",
    Keeper: "Satoby",
  }),
  map: Object.freeze([
    "#################",
    "#.......#...#...#",
    "#.###.#.#.#P###P#",
    "#...#...#...#...#",
    "#.#P###.G.###D#.#",
    "#...#...#...#...#",
    "#.###P#.#.#D###.#",
    "#.......#.......#",
    "#################",
  ]),
  start: Object.freeze({ x: 1, y: 7 }),
  core: Object.freeze({ x: 7, y: 1 }),
  relic: Object.freeze({ x: 15, y: 1 }),
  bloom: Object.freeze({ x: 15, y: 7 }),
  keeper: Object.freeze({ x: 8, y: 3 }),
  keeperAbility: "welcome",
  sprouts: Object.freeze([
    Object.freeze({ x: 1, y: 1 }),
    Object.freeze({ x: 5, y: 3 }),
    Object.freeze({ x: 3, y: 7 }),
    Object.freeze({ x: 11, y: 3 }),
    Object.freeze({ x: 13, y: 5 }),
  ]),
  threats: Object.freeze([
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 3, y: 1 }), direction: "right", speed: 2.38 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 1, y: 3 }), direction: "down", speed: 2.24 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 9, y: 3 }), direction: "down", speed: 2.32 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 11, y: 1 }), direction: "right", speed: 2.5 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 9, y: 7 }), direction: "right", speed: 2.3 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 3 }), direction: "down", speed: 2.46 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 15, y: 5 }), direction: "up", speed: 2.34 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 7 }), direction: "left", speed: 2.48 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 15, y: 3 }), direction: "down", speed: 2.28 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 11, y: 5 }), direction: "left", speed: 2.42 }),
  ]),
  openingQuietSeconds: 4,
  pondThresholdSeconds: 6,
  pondStillnessSeconds: 0.8,
  lightGoal: 60,
  timeLimit: 300,
  gateHint: "the Pond threshold",
});

export const LEVEL_0094 = Object.freeze({
  id: "0094",
  name: "Lore Land Deed #94",
  signs: Object.freeze({
    Background: "Verdant Veil",
    Land: "The Pond",
    Core: "Patience",
    Relic: "Wayfinder Compass",
    Keeper: "Satoby",
  }),
  map: Object.freeze([
    "#################",
    "#..A....#...#...#",
    "#..#..#.#.#P###P#",
    "#...#...#...#...#",
    "#.#P###.G.###.#.#",
    "#...#...#...#...#",
    "#..#.P#.#.#.###.#",
    "#....A..#..A....#",
    "#################",
  ]),
  start: Object.freeze({ x: 1, y: 7 }),
  core: Object.freeze({ x: 7, y: 1 }),
  relic: Object.freeze({ x: 15, y: 1 }),
  bloom: Object.freeze({ x: 15, y: 7 }),
  keeper: Object.freeze({ x: 8, y: 3 }),
  keeperAbility: "welcome",
  sprouts: Object.freeze([
    Object.freeze({ x: 1, y: 1 }),
    Object.freeze({ x: 5, y: 3 }),
    Object.freeze({ x: 3, y: 7 }),
    Object.freeze({ x: 11, y: 3 }),
    Object.freeze({ x: 13, y: 5 }),
  ]),
  convergenceTiles: Object.freeze([
    Object.freeze({ x: 3, y: 1 }),
    Object.freeze({ x: 5, y: 7 }),
    Object.freeze({ x: 11, y: 7 }),
  ]),
  threats: Object.freeze([
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 1, y: 3 }), direction: "down", speed: 2.28 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 5, y: 1 }), direction: "right", speed: 2.44 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 9, y: 3 }), direction: "down", speed: 2.34 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 11, y: 1 }), direction: "right", speed: 2.52 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 9, y: 7 }), direction: "right", speed: 2.32 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 3 }), direction: "down", speed: 2.48 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 15, y: 5 }), direction: "up", speed: 2.36 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 13, y: 7 }), direction: "left", speed: 2.5 }),
    Object.freeze({ kind: "drifter", tile: Object.freeze({ x: 15, y: 3 }), direction: "down", speed: 2.3 }),
    Object.freeze({ kind: "listener", tile: Object.freeze({ x: 11, y: 5 }), direction: "left", speed: 2.44 }),
  ]),
  openingQuietSeconds: 4.5,
  pondThresholdSeconds: 6,
  pondStillnessSeconds: 0.8,
  convergenceSeconds: 0.85,
  lightGoal: 60,
  timeLimit: 315,
  gateHint: "the final Pond threshold",
});

const tileKey = (tile) => `${tile.x},${tile.y}`;
const cloneTile = (tile) => ({ x: tile.x, y: tile.y });

export class TobyworldGame {
  constructor(level = LEVEL_715, random = Math.random) {
    this.level = level;
    this.random = random;
    this.events = [];
    this.reset();
  }

  reset() {
    this.phase = "ready";
    this.paused = false;
    this.elapsed = 0;
    this.remaining = this.level.timeLimit;
    this.score = 0;
    this.hearts = 3;
    this.lightsCollected = 0;
    this.relicFound = false;
    this.yieldCharges = 3;
    this.yieldTime = 0;
    this.patience = 100;
    this.patienceHeld = false;
    this.patienceReleaseRequired = false;
    this.resonanceTime = 0;
    this.invulnerableTime = 0;
    this.tendProgress = 0;
    this.tendingKey = null;
    this.tended = new Set();
    this.keeperAwakened = false;
    this.keeperNearby = false;
    this.keeperListening = false;
    this.keeperProgress = 0;
    this.guidanceTime = 0;
    this.sporeTime = 0;
    this.emberTime = 0;
    this.memoryProgress = 0;
    this.harvested = false;
    this.eclipseSides = new Set();
    this.shardAttuned = new Set();
    this.seedPlanted = false;
    this.coreAwakened = false;
    this.coreRitualProgress = 0;
    this.coreRitualListening = false;
    this.crossedFarSide = false;
    this.submergedRevealTime = 0;
    this.submergedStillnessTime = 0;
    this.pondThresholdTime = 0;
    this.pondStillnessTime = 0;
    this.pondWelcomed = false;
    this.convergenceProgress = 0;
    this.convergenceKey = null;
    this.convergenceAwakened = new Set();
    this.events.length = 0;

    this.player = {
      tile: cloneTile(this.level.start),
      from: cloneTile(this.level.start),
      to: cloneTile(this.level.start),
      progress: 1,
      moving: false,
      direction: "right",
      queued: "right",
      movementActive: false,
      speed: 5.25,
    };

    const threatPlan = this.level.threats ?? [
      { kind: "drifter", tile: { x: 7, y: 1 }, direction: "left", speed: 2.05 },
      { kind: "listener", tile: { x: 11, y: 7 }, direction: "left", speed: 2.28 },
    ];
    this.threats = threatPlan.map(({ kind, tile, direction, speed }) => this.makeThreat(kind, tile, direction, speed));
    if (this.level.openingQuietSeconds) {
      for (const threat of this.threats) threat.stunned = this.level.openingQuietSeconds;
    }

    this.lights = new Set();
    for (let y = 0; y < this.level.map.length; y += 1) {
      for (let x = 0; x < this.level.map[y].length; x += 1) {
        const tile = { x, y };
        if (this.level.map[y][x] !== "#" && !this.isReservedTile(tile)) this.lights.add(tileKey(tile));
      }
    }
    this.emit("reset", { lightTotal: this.lights.size });
  }

  makeThreat(kind, tile, direction, speed) {
    return {
      kind,
      spawn: cloneTile(tile),
      tile: cloneTile(tile),
      from: cloneTile(tile),
      to: cloneTile(tile),
      progress: 1,
      moving: false,
      direction,
      speed,
      stunned: 0,
    };
  }

  start() {
    if (this.phase === "won" || this.phase === "lost") this.reset();
    this.phase = "playing";
    this.paused = false;
    this.collectAt(this.player.tile);
    this.emit("started", {});
  }

  togglePause() {
    if (this.phase !== "playing") return this.paused;
    this.paused = !this.paused;
    this.emit(this.paused ? "paused" : "resumed", {});
    return this.paused;
  }

  queueDirection(direction) {
    if (!DIRECTIONS[direction]) return false;
    this.player.queued = direction;
    this.player.movementActive = true;
    return true;
  }

  releaseDirection(direction = null) {
    if (direction && this.player.queued !== direction) return false;
    this.player.movementActive = false;
    return true;
  }

  setPatience(held) {
    if (!held) {
      this.patienceHeld = false;
      this.patienceReleaseRequired = false;
      return;
    }
    if (this.patienceReleaseRequired) return;
    this.patienceHeld = this.patience > 0 && this.phase === "playing";
  }

  activateYield() {
    if (this.phase !== "playing" || this.yieldCharges <= 0 || this.yieldTime > 0) return false;
    if (!this.isNearYieldGate()) {
      this.emit("yield_waits", { hint: this.level.gateHint ?? "the living gate" });
      return false;
    }
    this.yieldCharges -= 1;
    this.yieldTime = 5.5;
    this.emit("yield", { charges: this.yieldCharges });
    return true;
  }

  isNearYieldGate() {
    if (this.cellAt(this.player.tile.x, this.player.tile.y) === "G") return true;
    return Object.values(DIRECTIONS).some((vector) => this.cellAt(this.player.tile.x + vector.x, this.player.tile.y + vector.y) === "G");
  }

  update(dt) {
    if (!Number.isFinite(dt) || dt <= 0 || this.phase !== "playing" || this.paused) return;
    const step = Math.min(dt, 0.05);
    this.elapsed += step;
    this.remaining = Math.max(0, this.level.timeLimit - this.elapsed);
    this.yieldTime = Math.max(0, this.yieldTime - step);
    this.resonanceTime = Math.max(0, this.resonanceTime - step);
    this.invulnerableTime = Math.max(0, this.invulnerableTime - step);
    this.guidanceTime = Math.max(0, this.guidanceTime - step);
    this.submergedRevealTime = Math.max(0, this.submergedRevealTime - step);
    this.pondThresholdTime = Math.max(0, this.pondThresholdTime - step);

    const usingPatience = this.patienceHeld && this.patience > 0;
    if (this.level.sporeCycleSeconds) {
      const cycleRate = usingPatience ? 0.18 : 1;
      this.sporeTime = (this.sporeTime + step * cycleRate) % this.level.sporeCycleSeconds;
    }
    if (this.level.emberCycleSeconds) {
      const cycleRate = usingPatience ? 0.2 : 1;
      this.emberTime = (this.emberTime + step * cycleRate) % this.level.emberCycleSeconds;
    }
    if (usingPatience) this.patience = Math.max(0, this.patience - 22 * step);
    else if (!this.player.moving) this.patience = Math.min(100, this.patience + 14 * step);
    else this.patience = Math.min(100, this.patience + 3.5 * step);
    if (this.patience <= 0) this.patienceHeld = false;

    this.updateSubmergedPaths(step, usingPatience);
    this.updatePondThresholds(step, usingPatience);

    this.updatePlayer(step, usingPatience);
    this.updateTending(step, usingPatience);
    this.updateKeeper(step, usingPatience);
    this.updateConvergence(step, usingPatience);
    this.updateCoreRitual(step, usingPatience);
    this.updateThreats(step, usingPatience);
    this.checkCollisions();

    if (this.remaining <= 0) this.lose("The land returns to stillness. Study the path and try again.");
  }

  updateSubmergedPaths(dt, usingPatience) {
    if (!this.level.submergedRevealSeconds) return;
    const listening = this.keeperAwakened && usingPatience && !this.player.moving && !this.player.movementActive;
    if (!listening) {
      this.submergedStillnessTime = 0;
      return;
    }
    if (this.submergedRevealTime > 0) {
      this.submergedStillnessTime = 0;
      return;
    }
    this.submergedStillnessTime += dt;
    if (this.submergedStillnessTime < (this.level.submergedStillnessSeconds ?? 0.65)) return;
    this.submergedStillnessTime = 0;
    this.submergedRevealTime = this.level.submergedRevealSeconds;
    this.emit("submerged_revealed", { seconds: this.submergedRevealTime });
  }

  updatePondThresholds(dt, usingPatience) {
    if (!this.level.pondThresholdSeconds || this.pondWelcomed) return;
    const besideThreshold = Object.values(DIRECTIONS).some((vector) => this.cellAt(this.player.tile.x + vector.x, this.player.tile.y + vector.y) === "P");
    const breathing = besideThreshold && usingPatience && !this.player.moving && !this.player.movementActive;
    if (!breathing) {
      this.pondStillnessTime = 0;
      return;
    }
    if (this.pondThresholdTime > 0) return;
    this.pondStillnessTime += dt;
    if (this.pondStillnessTime < (this.level.pondStillnessSeconds ?? 0.8)) return;
    this.pondStillnessTime = 0;
    this.pondThresholdTime = this.level.pondThresholdSeconds;
    this.emit("pond_threshold_open", { seconds: this.pondThresholdTime });
  }

  updatePlayer(dt, usingPatience) {
    const player = this.player;
    if (player.moving) {
      player.progress = Math.min(1, player.progress + player.speed * dt);
      if (player.progress >= 1) {
        player.tile = cloneTile(player.to);
        player.from = cloneTile(player.tile);
        player.moving = false;
        this.arriveAt(player.tile);
      }
    }

    if (!player.moving && !usingPatience && player.movementActive) {
      const preferred = player.queued;
      if (this.canMove(player.tile, preferred, true)) this.beginMove(player, preferred, true);
      else if (this.canMove(player.tile, player.direction, true)) this.beginMove(player, player.direction, true);
    }
  }

  updateTending(dt, usingPatience) {
    const playerKey = tileKey(this.player.tile);
    const isSprout = this.level.sprouts.some((sprout) => tileKey(sprout) === playerKey);
    const canTend = usingPatience && !this.player.moving && isSprout && !this.tended.has(playerKey);

    if (!canTend) {
      this.tendProgress = Math.max(0, this.tendProgress - dt * 0.9);
      if (this.tendProgress === 0) this.tendingKey = null;
      return;
    }

    if (this.tendingKey !== playerKey) {
      this.tendingKey = playerKey;
      this.tendProgress = 0;
      this.emit("tending", { current: this.tended.size, total: this.level.sprouts.length });
    }

    this.tendProgress += dt;
    if (this.tendProgress >= 1.35) {
      this.tended.add(playerKey);
      this.tendProgress = 0;
      this.tendingKey = null;
      this.score += 500;
      this.emit("tended", { current: this.tended.size, total: this.level.sprouts.length });
    }
  }

  isNearKeeper() {
    if (!this.level.keeper) return false;
    const position = this.actorPosition(this.player);
    return Math.abs(position.x - this.level.keeper.x) + Math.abs(position.y - this.level.keeper.y) <= 1.05;
  }

  updateKeeper(dt, usingPatience) {
    if (!this.level.keeper || this.keeperAwakened) return;
    const nearby = this.isNearKeeper();
    if (nearby && !this.keeperNearby) {
      this.emit("keeper_near", { name: this.level.signs.Keeper, ability: this.level.keeperAbility });
    }
    this.keeperNearby = nearby;
    const canListen = nearby && usingPatience && !this.player.moving;
    if (!canListen) {
      this.keeperProgress = Math.max(0, this.keeperProgress - dt * 0.75);
      if (this.keeperProgress === 0) this.keeperListening = false;
      return;
    }
    if (!this.keeperListening) {
      this.keeperListening = true;
      this.emit("keeper_listening", { name: this.level.signs.Keeper });
    }
    this.keeperProgress += dt;
    if (this.keeperProgress < 1) return;

    this.keeperAwakened = true;
    this.keeperListening = false;
    this.keeperProgress = 0;
    this.patience = 100;
    this.patienceHeld = false;
    this.patienceReleaseRequired = true;
    this.score += 500;
    if (this.level.keeperAbility === "quiet") {
      for (const threat of this.threats) threat.stunned = Math.max(threat.stunned, this.level.keeperQuietSeconds ?? 7);
    } else if (this.level.keeperAbility === "ward") {
      this.hearts = Math.min(3, this.hearts + 1);
      this.invulnerableTime = Math.max(this.invulnerableTime, 10);
    } else if (this.level.keeperAbility === "welcome") {
      this.pondWelcomed = true;
      this.pondThresholdTime = 0;
      this.guidanceTime = 12;
    } else {
      this.guidanceTime = 12;
    }
    this.emit("keeper_awakened", { name: this.level.signs.Keeper, ability: this.level.keeperAbility });
  }

  updateConvergence(dt, usingPatience) {
    if (!this.level.convergenceTiles) return;
    const playerKey = tileKey(this.player.tile);
    const isEcho = this.level.convergenceTiles.some((tile) => tileKey(tile) === playerKey);
    const canAwaken = this.relicFound && isEcho && !this.convergenceAwakened.has(playerKey) && usingPatience && !this.player.moving;
    if (!canAwaken) {
      this.convergenceProgress = Math.max(0, this.convergenceProgress - dt * 0.9);
      if (this.convergenceProgress === 0) this.convergenceKey = null;
      return;
    }
    if (this.convergenceKey !== playerKey) {
      this.convergenceKey = playerKey;
      this.convergenceProgress = 0;
      this.emit("convergence_listening", { current: this.convergenceAwakened.size, total: this.level.convergenceTiles.length });
    }
    this.convergenceProgress += dt;
    if (this.convergenceProgress < (this.level.convergenceSeconds ?? 0.85)) return;
    this.convergenceAwakened.add(playerKey);
    this.convergenceProgress = 0;
    this.convergenceKey = null;
    this.score += 750;
    const complete = this.convergenceAwakened.size === this.level.convergenceTiles.length;
    this.emit(complete ? "convergence_complete" : "convergence_awakened", { current: this.convergenceAwakened.size, total: this.level.convergenceTiles.length });
  }

  updateCoreRitual(dt, usingPatience) {
    const needsSeed = Boolean(this.level.seedPlantSeconds) && !this.seedPlanted;
    const needsStillness = Boolean(this.level.coreStillnessSeconds) && !this.coreAwakened;
    if (!needsSeed && !needsStillness) return;
    const atCore = tileKey(this.player.tile) === tileKey(this.level.core);
    const canListen = atCore && this.baseRequirementsMet() && usingPatience && !this.player.moving && !this.player.movementActive;
    if (!canListen) {
      this.coreRitualProgress = Math.max(0, this.coreRitualProgress - dt * 0.8);
      if (this.coreRitualProgress === 0) this.coreRitualListening = false;
      return;
    }
    if (!this.coreRitualListening) {
      this.coreRitualListening = true;
      this.emit(needsSeed ? "seed_planting" : "core_listening", {});
    }
    this.coreRitualProgress += dt;
    const duration = Math.max(this.level.seedPlantSeconds ?? 0, this.level.coreStillnessSeconds ?? 0);
    if (this.coreRitualProgress < duration) return;
    if (this.level.seedPlantSeconds) this.seedPlanted = true;
    if (this.level.coreStillnessSeconds) this.coreAwakened = true;
    this.coreRitualProgress = 0;
    this.coreRitualListening = false;
    this.score += 600;
    this.emit(this.level.seedPlantSeconds ? "seed_planted" : "core_awakened", {});
    if (this.requirementsMet()) this.win();
  }

  updateThreats(dt, usingPatience) {
    const speedFactor = usingPatience ? 0.23 : 1;
    for (const threat of this.threats) {
      threat.stunned = Math.max(0, threat.stunned - dt);
      if (threat.stunned > 0) continue;
      if (threat.moving) {
        threat.progress = Math.min(1, threat.progress + threat.speed * speedFactor * dt);
        if (threat.progress >= 1) {
          threat.tile = cloneTile(threat.to);
          threat.from = cloneTile(threat.tile);
          threat.moving = false;
        }
      }
      if (!threat.moving) {
        const direction = this.chooseThreatDirection(threat);
        if (direction) this.beginMove(threat, direction, false);
      }
    }
  }

  beginMove(actor, direction, playerCanUseGate = false) {
    const vector = DIRECTIONS[direction];
    if (!vector || !this.canMove(actor.tile, direction, playerCanUseGate)) return false;
    actor.from = cloneTile(actor.tile);
    actor.to = { x: actor.tile.x + vector.x, y: actor.tile.y + vector.y };
    actor.progress = 0;
    actor.moving = true;
    actor.direction = direction;
    if (actor === this.player) actor.queued = direction;
    return true;
  }

  canMove(tile, direction, canUseYieldGate = false) {
    const vector = DIRECTIONS[direction];
    if (!vector) return false;
    const x = tile.x + vector.x;
    const y = tile.y + vector.y;
    if (y < 0 || y >= this.level.map.length || x < 0 || x >= this.level.map[y].length) return false;
    const cell = this.level.map[y][x];
    if (cell === "#") return false;
    if (cell === "G") return canUseYieldGate && this.yieldTime > 0;
    if (cell === "S") return this.areSporesOpen();
    if (cell === "D") return this.relicFound;
    if (cell === "U") return this.areSubmergedPathsRevealed();
    if (cell === "P") return this.arePondThresholdsOpen();
    return true;
  }

  arePondThresholdsOpen() {
    return !this.level.pondThresholdSeconds || this.pondWelcomed || this.pondThresholdTime > 0;
  }

  areSubmergedPathsRevealed() {
    return !this.level.submergedRevealSeconds || this.submergedRevealTime > 0;
  }

  areSporesOpen() {
    if (!this.level.sporeCycleSeconds) return true;
    return this.sporeTime < this.level.sporeOpenSeconds;
  }

  isEmberSurging() {
    const runeCooled = this.relicFound && this.level.signs.Relic === "Ancient Rune";
    if (!this.level.emberCycleSeconds || runeCooled) return false;
    return this.emberTime >= this.level.emberCoolSeconds;
  }

  chooseThreatDirection(threat) {
    const available = Object.keys(DIRECTIONS).filter((direction) => this.canMove(threat.tile, direction, false));
    if (available.length === 0) return null;
    const forward = available.filter((direction) => direction !== DIRECTIONS[threat.direction]?.opposite);
    const candidates = forward.length ? forward : available;

    if (threat.kind === "listener") {
      return candidates.sort((a, b) => this.distanceAfter(threat.tile, a) - this.distanceAfter(threat.tile, b))[0];
    }

    const order = ["right", "down", "left", "up"];
    const startIndex = order.indexOf(threat.direction);
    for (let offset = 0; offset < order.length; offset += 1) {
      const direction = order[(startIndex + offset + order.length) % order.length];
      if (candidates.includes(direction)) return direction;
    }
    return candidates[0];
  }

  distanceAfter(tile, direction) {
    const vector = DIRECTIONS[direction];
    const x = tile.x + vector.x;
    const y = tile.y + vector.y;
    const playerPosition = this.actorPosition(this.player);
    return Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y);
  }

  arriveAt(tile) {
    if (this.level.requiresReturnCrossing) {
      const middle = this.level.map[0].length / 2;
      const startOnLeft = this.level.start.x < middle;
      if ((startOnLeft && tile.x > middle) || (!startOnLeft && tile.x < middle)) this.crossedFarSide = true;
    }
    if (this.cellAt(tile.x, tile.y) === "H" && this.isEmberSurging() && this.invulnerableTime <= 0) {
      this.hearts -= 1;
      this.invulnerableTime = 2.25;
      this.player.tile = cloneTile(this.level.start);
      this.player.from = cloneTile(this.level.start);
      this.player.to = cloneTile(this.level.start);
      this.player.moving = false;
      this.player.progress = 1;
      this.player.queued = "right";
      this.player.direction = "right";
      this.player.movementActive = false;
      this.emit("ember_burn", { hearts: this.hearts });
      if (this.hearts <= 0) this.lose("The Emberreach asks for a slower choice. Breathe, then cross on the cool tide.");
      return;
    }
    this.collectAt(tile);
    if (tileKey(tile) === tileKey(this.level.relic) && !this.relicFound) {
      this.relicFound = true;
      this.score += 1000;
      this.emit("relic", { name: this.level.signs.Relic });
      if (this.level.emberCycleSeconds && this.level.signs.Relic === "Ancient Rune") this.emit("rune_cooled", {});
      if (this.level.runeCalmsHazards) {
        for (const threat of this.threats) threat.stunned = Math.max(threat.stunned, 8);
        if (!this.level.emberCycleSeconds) this.emit("rune_calmed", {});
      }
      if (this.level.signs.Relic === "Gate Key") this.emit("key_unlocked", {});
      if (this.level.signs.Relic === "Lore Map") {
        this.guidanceTime = Math.max(this.guidanceTime, this.remaining + 1);
        this.emit("map_revealed", {});
      }
      if (this.level.wayfinderGuidance) this.guidanceTime = Math.max(this.guidanceTime, this.remaining + 1);
      if (this.level.convergenceTiles && this.level.signs.Relic === "Wayfinder Compass") this.guidanceTime = Math.max(this.guidanceTime, this.remaining + 1);
    }
    if (tileKey(tile) === tileKey(this.level.bloom) && this.resonanceTime <= 0) {
      this.resonanceTime = 7;
      this.harvested = true;
      this.score += 250;
      this.emit("taboshi_harvest", { seconds: this.resonanceTime });
    }
    if (this.level.shardTiles) {
      const shardKey = tileKey(tile);
      if (this.level.shardTiles.some((shard) => tileKey(shard) === shardKey) && !this.shardAttuned.has(shardKey)) {
        this.shardAttuned.add(shardKey);
        this.score += 300;
        this.emit(this.shardAttuned.size === this.level.shardTiles.length ? "shards_complete" : "shard_attuned", { current: this.shardAttuned.size, total: this.level.shardTiles.length });
      }
    }
    if (this.relicFound && this.level.memorySequence && this.memoryProgress < this.level.memorySequence.length) {
      const memoryIndex = this.level.memorySequence.findIndex((memory) => tileKey(memory) === tileKey(tile));
      if (memoryIndex === this.memoryProgress) {
        this.memoryProgress += 1;
        this.score += 250;
        this.emit(this.memoryProgress === this.level.memorySequence.length ? "memory_complete" : "memory_echo", {
          current: this.memoryProgress,
          total: this.level.memorySequence.length,
        });
      } else if (memoryIndex >= 0) {
        this.memoryProgress = memoryIndex === 0 ? 1 : 0;
        this.emit("memory_reset", { current: this.memoryProgress, total: this.level.memorySequence.length });
      }
    }
    if (tileKey(tile) === tileKey(this.level.core) && this.requirementsMet()) this.win();
    else if (tileKey(tile) === tileKey(this.level.core)) this.emit("core_waits", this.progressSummary());
  }

  collectAt(tile) {
    const key = tileKey(tile);
    if (!this.lights.delete(key)) return;
    this.lightsCollected += 1;
    if (this.level.eclipseBalance) this.eclipseSides.add(tile.x < this.level.map[0].length / 2 ? "west" : "east");
    this.score += this.resonanceTime > 0 ? 25 : 10;
    this.emit("light", { collected: this.lightsCollected, goal: this.level.lightGoal });
  }

  checkCollisions() {
    if (this.invulnerableTime > 0) return;
    const playerPosition = this.actorPosition(this.player);
    for (const threat of this.threats) {
      const threatPosition = this.actorPosition(threat);
      const distance = Math.hypot(playerPosition.x - threatPosition.x, playerPosition.y - threatPosition.y);
      if (distance > 0.52) continue;
      if (this.resonanceTime > 0) {
        this.score += 300;
        const respawn = this.farthestSafeTileFromPlayer(threat);
        threat.spawn = cloneTile(respawn);
        threat.tile = cloneTile(respawn);
        threat.from = cloneTile(threat.tile);
        threat.to = cloneTile(threat.tile);
        threat.moving = false;
        threat.progress = 1;
        threat.stunned = 1.1;
        this.emit("ghost_eaten", { kind: threat.kind, respawn: cloneTile(respawn) });
      } else {
        this.hearts -= 1;
        this.invulnerableTime = 2.25;
        this.player.tile = cloneTile(this.level.start);
        this.player.from = cloneTile(this.level.start);
        this.player.to = cloneTile(this.level.start);
        this.player.moving = false;
        this.player.progress = 1;
        this.player.queued = "right";
        this.player.direction = "right";
        this.player.movementActive = false;
        this.emit("hurt", { hearts: this.hearts });
        if (this.hearts <= 0) this.lose("Toby needs a moment to breathe. The land will remember your next path.");
      }
      break;
    }
  }

  farthestSafeTileFromPlayer(excludedThreat = null) {
    const player = this.actorPosition(this.player);
    const occupied = new Set(this.threats
      .filter((threat) => threat !== excludedThreat)
      .map((threat) => tileKey(threat.tile)));
    let best = cloneTile(this.level.start);
    let bestDistance = -1;
    for (let y = 0; y < this.level.map.length; y += 1) {
      for (let x = 0; x < this.level.map[y].length; x += 1) {
        const tile = { x, y };
        if (this.level.map[y][x] !== "." || this.isReservedTile(tile) || occupied.has(tileKey(tile))) continue;
        const distance = Math.abs(x - player.x) + Math.abs(y - player.y);
        if (distance <= bestDistance) continue;
        best = tile;
        bestDistance = distance;
      }
    }
    return best;
  }

  requirementsMet() {
    const baseComplete = this.baseRequirementsMet();
    const seedComplete = !this.level.seedPlantSeconds || this.seedPlanted;
    const stillnessComplete = !this.level.coreStillnessSeconds || this.coreAwakened;
    return baseComplete && seedComplete && stillnessComplete;
  }

  baseRequirementsMet() {
    const memoryComplete = !this.level.memorySequence || this.memoryProgress === this.level.memorySequence.length;
    const convergenceComplete = !this.level.convergenceTiles || this.convergenceAwakened.size === this.level.convergenceTiles.length;
    const harvestComplete = !this.level.requiresHarvest || this.harvested;
    const eclipseComplete = !this.level.eclipseBalance || this.eclipseSides.size === 2;
    const shardsComplete = !this.level.shardTiles || this.shardAttuned.size === this.level.shardTiles.length;
    const crossingComplete = !this.level.requiresReturnCrossing || this.crossedFarSide;
    return this.lightsCollected >= this.level.lightGoal && this.relicFound && this.tended.size === this.level.sprouts.length && memoryComplete && convergenceComplete && harvestComplete && eclipseComplete && shardsComplete && crossingComplete;
  }

  progressSummary() {
    return {
      lights: this.lightsCollected,
      lightGoal: this.level.lightGoal,
      relic: this.relicFound,
      tended: this.tended.size,
      tendGoal: this.level.sprouts.length,
      memory: this.memoryProgress,
      memoryGoal: this.level.memorySequence?.length ?? 0,
      convergence: this.convergenceAwakened.size,
      convergenceGoal: this.level.convergenceTiles?.length ?? 0,
      harvested: this.harvested,
      harvestGoal: this.level.requiresHarvest ? 1 : 0,
      eclipseSides: this.eclipseSides.size,
      eclipseGoal: this.level.eclipseBalance ? 2 : 0,
      shards: this.shardAttuned.size,
      shardGoal: this.level.shardTiles?.length ?? 0,
      seedPlanted: this.seedPlanted,
      seedGoal: this.level.seedPlantSeconds ? 1 : 0,
      coreAwakened: this.coreAwakened,
      coreRitualGoal: this.level.coreStillnessSeconds ? 1 : 0,
      crossedFarSide: this.crossedFarSide,
      crossingGoal: this.level.requiresReturnCrossing ? 1 : 0,
    };
  }

  win() {
    if (this.phase !== "playing") return;
    this.phase = "won";
    this.score += Math.round(this.remaining * 10) + this.hearts * 250;
    this.emit("won", { score: this.score });
  }

  lose(reason) {
    if (this.phase !== "playing") return;
    this.phase = "lost";
    this.emit("lost", { reason, score: this.score });
  }

  actorPosition(actor) {
    if (!actor.moving) return cloneTile(actor.tile);
    return {
      x: actor.from.x + (actor.to.x - actor.from.x) * actor.progress,
      y: actor.from.y + (actor.to.y - actor.from.y) * actor.progress,
    };
  }

  cellAt(x, y) {
    return this.level.map[y]?.[x] ?? "#";
  }

  isReservedTile(tile) {
    const key = tileKey(tile);
    return key === tileKey(this.level.start) || key === tileKey(this.level.core) || key === tileKey(this.level.relic) || key === tileKey(this.level.bloom) || (this.level.keeper && key === tileKey(this.level.keeper)) || this.level.sprouts.some((sprout) => tileKey(sprout) === key) || (this.level.convergenceTiles?.some((echo) => tileKey(echo) === key) ?? false) || (this.level.shardTiles?.some((shard) => tileKey(shard) === key) ?? false);
  }

  emit(type, detail) {
    this.events.push({ type, detail });
  }

  consumeEvents() {
    return this.events.splice(0);
  }
}
