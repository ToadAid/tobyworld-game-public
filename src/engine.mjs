const key = ({ x, y }) => `${x},${y}`;
const same = (a, b) => a.x === b.x && a.y === b.y;
const adjacent = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) <= 1;

export function createRun(world) {
  return {
    world,
    player: { ...world.start },
    collected: new Set(),
    tended: new Set(),
    beaconFound: false,
    gateOpen: false,
    yields: 2,
    patienceSeconds: 0,
    moves: 0,
    complete: false,
  };
}

export function isBlocked(state, point) {
  const { world } = state;
  if (point.x < 0 || point.y < 0 || point.x >= world.size.width || point.y >= world.size.height) return true;
  if (world.walls.some((wall) => same(wall, point))) return true;
  return !state.gateOpen && same(world.gate, point);
}

export function objectives(state) {
  return {
    lights: state.collected.size,
    lightsGoal: state.world.lights.length,
    sprouts: state.tended.size,
    sproutsGoal: state.world.sprouts.length,
    beacon: state.beaconFound,
    gate: state.gateOpen,
  };
}

export function readyForCore(state) {
  const status = objectives(state);
  return status.lights === status.lightsGoal && status.sprouts === status.sproutsGoal && status.beacon && status.gate;
}

function applyTile(state) {
  const location = key(state.player);
  const light = state.world.lights.find((point) => same(point, state.player));
  if (light) state.collected.add(location);
  if (same(state.world.beacon, state.player)) state.beaconFound = true;
  if (same(state.world.core, state.player) && readyForCore(state)) state.complete = true;
}

export function move(state, dx, dy) {
  if (state.complete) return { moved: false, event: "complete" };
  const next = { x: state.player.x + Math.sign(dx), y: state.player.y + Math.sign(dy) };
  if (isBlocked(state, next)) return { moved: false, event: same(next, state.world.gate) ? "gate" : "wall" };
  state.player = next;
  state.moves += 1;
  state.patienceSeconds = 0;
  const before = state.collected.size;
  const hadBeacon = state.beaconFound;
  applyTile(state);
  if (state.complete) return { moved: true, event: "complete" };
  if (state.collected.size > before) return { moved: true, event: "light" };
  if (!hadBeacon && state.beaconFound) return { moved: true, event: "beacon" };
  if (same(state.world.core, state.player)) return { moved: true, event: "core-locked" };
  return { moved: true, event: "step" };
}

export function holdPatience(state, seconds) {
  if (state.complete) return { tended: false };
  state.patienceSeconds += Math.max(0, seconds);
  const sprout = state.world.sprouts.find((point) => adjacent(point, state.player) && !state.tended.has(key(point)));
  if (sprout && state.patienceSeconds >= 1.2) {
    state.tended.add(key(sprout));
    state.patienceSeconds = 0;
    return { tended: true, point: sprout };
  }
  return { tended: false };
}

export function yieldAtGate(state) {
  if (state.complete || state.gateOpen || state.yields < 1 || !adjacent(state.player, state.world.gate)) return false;
  state.gateOpen = true;
  state.yields -= 1;
  return true;
}

export function snapshotRun(state) {
  return {
    worldId: state.world.id,
    player: { ...state.player },
    collected: [...state.collected],
    tended: [...state.tended],
    beaconFound: state.beaconFound,
    gateOpen: state.gateOpen,
    yields: state.yields,
    moves: state.moves,
    complete: state.complete,
  };
}
