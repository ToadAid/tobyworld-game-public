const freezePoints = (points) => Object.freeze(points.map(([x, y]) => Object.freeze({ x, y })));

function world(config) {
  return Object.freeze({
    ...config,
    size: Object.freeze({ width: 15, height: 9 }),
    start: Object.freeze(config.start),
    core: Object.freeze(config.core),
    beacon: Object.freeze(config.beacon),
    gate: Object.freeze(config.gate),
    walls: freezePoints(config.walls),
    lights: freezePoints(config.lights),
    sprouts: freezePoints(config.sprouts),
    palette: Object.freeze(config.palette),
    sound: Object.freeze(config.sound),
  });
}

export const WORLDS = Object.freeze([
  world({
    id: "moonlit-garden",
    name: "Moonlit Garden",
    subtitle: "Listen for the quiet path",
    description: "Gather three lights, tend two sprouts with Patience, then Yield at the reed gate.",
    start: { x: 1, y: 7 }, core: { x: 13, y: 1 }, beacon: { x: 7, y: 6 }, gate: { x: 8, y: 4 },
    lights: [[3, 7], [6, 5], [11, 2]], sprouts: [[3, 2], [11, 6]],
    walls: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[0,1],[8,1],[14,1],[0,2],[5,2],[8,2],[9,2],[14,2],[0,3],[2,3],[3,3],[5,3],[7,3],[8,3],[9,3],[11,3],[12,3],[14,3],[0,4],[5,4],[14,4],[0,5],[2,5],[3,5],[7,5],[8,5],[11,5],[12,5],[14,5],[0,6],[5,6],[8,6],[9,6],[14,6],[0,7],[8,7],[14,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8]],
    palette: { sky: "#132b2d", glow: "#9be6bd", ground: "#244a3d", path: "#d6e7b4", water: "#15384a", accent: "#f7df91" },
    sound: { root: 196, notes: [293.66, 392, 440, 587.33] },
  }),
  world({
    id: "reedwater-crossing",
    name: "Reedwater Crossing",
    subtitle: "A bridge opens for those who yield",
    description: "Follow the islands, wake the beacon, and spend one Yield at the center crossing.",
    start: { x: 1, y: 1 }, core: { x: 13, y: 7 }, beacon: { x: 12, y: 1 }, gate: { x: 7, y: 4 },
    lights: [[3, 1], [5, 6], [10, 4], [12, 6]], sprouts: [[2, 6], [9, 2]],
    walls: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[0,1],[7,1],[14,1],[0,2],[3,2],[5,2],[7,2],[11,2],[14,2],[0,3],[3,3],[7,3],[9,3],[11,3],[14,3],[0,4],[1,4],[2,4],[3,4],[5,4],[9,4],[11,4],[12,4],[13,4],[14,4],[0,5],[3,5],[5,5],[7,5],[11,5],[14,5],[0,6],[7,6],[9,6],[14,6],[0,7],[7,7],[14,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8]],
    palette: { sky: "#19294a", glow: "#b9d8ff", ground: "#355f73", path: "#e5e2bd", water: "#15365d", accent: "#f5c77e" },
    sound: { root: 220, notes: [329.63, 440, 493.88, 659.25] },
  }),
  world({
    id: "sunrise-terrace",
    name: "Sunrise Terrace",
    subtitle: "Carry what you learned into the light",
    description: "Complete the final garden and awaken the sample edition's last Core.",
    start: { x: 1, y: 7 }, core: { x: 13, y: 1 }, beacon: { x: 2, y: 1 }, gate: { x: 10, y: 4 },
    lights: [[3, 6], [6, 1], [8, 6], [12, 3]], sprouts: [[4, 2], [7, 4], [12, 6]],
    walls: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[0,1],[10,1],[14,1],[0,2],[2,2],[6,2],[8,2],[10,2],[12,2],[14,2],[0,3],[4,3],[6,3],[10,3],[14,3],[0,4],[2,4],[4,4],[6,4],[8,4],[12,4],[14,4],[0,5],[2,5],[6,5],[8,5],[10,5],[12,5],[14,5],[0,6],[4,6],[10,6],[14,6],[0,7],[10,7],[14,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8]],
    palette: { sky: "#4a2b42", glow: "#ffd7a1", ground: "#6b5640", path: "#f4e4b7", water: "#3a4265", accent: "#fff1a8" },
    sound: { root: 246.94, notes: [369.99, 493.88, 554.37, 739.99] },
  }),
]);

export function getWorld(index) {
  return WORLDS[Math.max(0, Math.min(WORLDS.length - 1, Number(index) || 0))];
}
