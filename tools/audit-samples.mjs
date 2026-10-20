import { WORLDS } from "../src/worlds.mjs";

const key = ({ x, y }) => `${x},${y}`;
const steps = [[1,0],[-1,0],[0,1],[0,-1]];

function reachable(world, gateOpen) {
  const walls = new Set(world.walls.map(key));
  if (!gateOpen) walls.add(key(world.gate));
  const seen = new Set([key(world.start)]);
  const queue = [{ ...world.start }];
  while (queue.length) {
    const point = queue.shift();
    for (const [dx, dy] of steps) {
      const next = { x: point.x + dx, y: point.y + dy };
      const id = key(next);
      if (next.x < 0 || next.y < 0 || next.x >= world.size.width || next.y >= world.size.height || walls.has(id) || seen.has(id)) continue;
      seen.add(id); queue.push(next);
    }
  }
  return seen;
}

let failures = 0;
for (const world of WORLDS) {
  const allPoints = [world.start, world.core, world.beacon, world.gate, ...world.lights, ...world.sprouts];
  const ids = allPoints.map(key);
  const unique = new Set(ids);
  const open = reachable(world, true);
  const closed = reachable(world, false);
  const gateNeighborReachable = steps.some(([dx, dy]) => closed.has(key({ x: world.gate.x + dx, y: world.gate.y + dy })));
  const errors = [];
  if (unique.size !== ids.length) errors.push("objective positions overlap");
  if (!allPoints.every((point) => open.has(key(point)))) errors.push("a required point is unreachable after opening the gate");
  if (!gateNeighborReachable) errors.push("the gate cannot be reached before it opens");
  if (closed.has(key(world.core))) errors.push("the Core can be reached without using Yield");
  if (world.lights.length < 3 || world.sprouts.length < 2) errors.push("sample objective count is incomplete");
  if (errors.length) { failures += 1; console.error(`${world.id}: ${errors.join("; ")}`); }
  else console.log(`${world.id}: playable graph OK (${open.size} walkable tiles)`);
}
if (failures) process.exitCode = 1;
else console.log(`${WORLDS.length}/${WORLDS.length} original sample worlds passed.`);
