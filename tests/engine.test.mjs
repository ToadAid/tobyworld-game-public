import test from "node:test";
import assert from "node:assert/strict";
import { createRun, holdPatience, move, objectives, readyForCore, yieldAtGate } from "../src/engine.mjs";
import { WORLDS } from "../src/worlds.mjs";

test("a run begins with isolated, incomplete objectives", () => {
  const state = createRun(WORLDS[0]);
  assert.deepEqual(objectives(state), { lights: 0, lightsGoal: 3, sprouts: 0, sproutsGoal: 2, beacon: false, gate: false });
  assert.equal(readyForCore(state), false);
});

test("Yield cannot be wasted away from a gate", () => {
  const state = createRun(WORLDS[0]);
  assert.equal(yieldAtGate(state), false);
  assert.equal(state.yields, 2);
});

test("Patience tends an adjacent sprout after the threshold", () => {
  const state = createRun(WORLDS[0]);
  state.player = { x: 3, y: 1 };
  assert.equal(holdPatience(state, 1).tended, false);
  assert.equal(holdPatience(state, .21).tended, true);
  assert.equal(state.tended.size, 1);
});

test("a completed objective set awakens the Core", () => {
  const state = createRun(WORLDS[0]);
  for (const point of state.world.lights) state.collected.add(`${point.x},${point.y}`);
  for (const point of state.world.sprouts) state.tended.add(`${point.x},${point.y}`);
  state.beaconFound = true; state.gateOpen = true; state.player = { x: state.world.core.x - 1, y: state.world.core.y };
  assert.equal(move(state, 1, 0).event, "complete");
  assert.equal(state.complete, true);
});
