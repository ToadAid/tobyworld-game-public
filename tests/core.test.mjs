import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DIRECTIONS, TobyworldGame, LEVEL_0094, LEVEL_0118, LEVEL_0182, LEVEL_0340, LEVEL_0378, LEVEL_0887, LEVEL_0969, LEVEL_1091, LEVEL_715, LEVEL_716, LEVEL_717, LEVEL_718 } from "../src/core.mjs";

function advance(game, seconds, step = 0.05) {
  for (let elapsed = 0; elapsed < seconds; elapsed += step) game.update(step);
}

function reachableTiles(game, gateOpen) {
  game.yieldTime = gateOpen ? 1 : 0;
  const level = game.level;
  const startKey = `${level.start.x},${level.start.y}`;
  const reached = new Set([startKey]);
  const pending = [{ ...level.start }];
  while (pending.length) {
    const tile = pending.shift();
    for (const [direction, vector] of Object.entries(DIRECTIONS)) {
      if (!game.canMove(tile, direction, gateOpen)) continue;
      const next = { x: tile.x + vector.x, y: tile.y + vector.y };
      const key = `${next.x},${next.y}`;
      if (reached.has(key)) continue;
      reached.add(key);
      pending.push(next);
    }
  }
  return reached;
}

test("Deed 715 map is rectangular and carries its five canonical signs", () => {
  assert.ok(LEVEL_715.map.every((row) => row.length === 17));
  assert.deepEqual(LEVEL_715.signs, {
    Background: "Verdant Veil",
    Land: "Waystones",
    Core: "Rootbound",
    Relic: "Wayfinder Compass",
    Keeper: "Satoby",
  });
});

test("Deed 716 is a valid Frostveil crossing with reachable objectives", () => {
  const game = new TobyworldGame(LEVEL_716);
  assert.ok(LEVEL_716.map.every((row) => row.length === 17));
  assert.equal(LEVEL_716.threats.length, 3);
  const closed = reachableTiles(game, false);
  const open = reachableTiles(game, true);
  assert.equal(closed.has(`${LEVEL_716.relic.x},${LEVEL_716.relic.y}`), false);
  for (const tile of [LEVEL_716.core, LEVEL_716.relic, LEVEL_716.bloom, ...LEVEL_716.sprouts]) {
    assert.equal(open.has(`${tile.x},${tile.y}`), true);
  }
});

test("Deed 717 is a valid Stillwater crossing with a Seed Vessel objective", () => {
  const game = new TobyworldGame(LEVEL_717);
  assert.ok(LEVEL_717.map.every((row) => row.length === 17));
  assert.equal(LEVEL_717.threats.length, 4);
  assert.ok(game.lights.size >= LEVEL_717.lightGoal);
  const closed = reachableTiles(game, false);
  const open = reachableTiles(game, true);
  assert.equal(closed.has(`${LEVEL_717.relic.x},${LEVEL_717.relic.y}`), false);
  for (const tile of [LEVEL_717.core, LEVEL_717.relic, LEVEL_717.bloom, ...LEVEL_717.sprouts]) {
    assert.equal(open.has(`${tile.x},${tile.y}`), true);
  }
  assert.deepEqual(LEVEL_717.signs, {
    Background: "Gilded Dawn",
    Land: "Stillwater",
    Core: "Taboshi",
    Relic: "Seed Vessel",
    Keeper: "Hush",
  });
});

test("Deed 718 is a valid Cloudwake crossing with an Eclipse Core", () => {
  const game = new TobyworldGame(LEVEL_718);
  assert.ok(LEVEL_718.map.every((row) => row.length === 17));
  assert.equal(LEVEL_718.threats.length, 5);
  assert.ok(game.lights.size >= LEVEL_718.lightGoal);
  const closed = reachableTiles(game, false);
  const open = reachableTiles(game, true);
  assert.equal(closed.has(`${LEVEL_718.relic.x},${LEVEL_718.relic.y}`), false);
  for (const tile of [LEVEL_718.core, LEVEL_718.relic, LEVEL_718.bloom, ...LEVEL_718.sprouts]) {
    assert.equal(open.has(`${tile.x},${tile.y}`), true);
  }
  assert.deepEqual(LEVEL_718.signs, {
    Background: "Cloudwake",
    Land: "Sunfield",
    Core: "Eclipse",
    Relic: "Wayfinder Compass",
    Keeper: "OG",
  });
});

test("Deed 340 is a valid Sporegrove crossing with an Ancient Rune and Shard", () => {
  const game = new TobyworldGame(LEVEL_0340);
  assert.ok(LEVEL_0340.map.every((row) => row.length === 17));
  assert.equal(LEVEL_0340.threats.length, 6);
  assert.ok(game.lights.size >= LEVEL_0340.lightGoal);
  const closed = reachableTiles(game, false);
  const open = reachableTiles(game, true);
  assert.equal(closed.has(`${LEVEL_0340.relic.x},${LEVEL_0340.relic.y}`), false);
  for (const tile of [LEVEL_0340.core, LEVEL_0340.relic, LEVEL_0340.bloom, ...LEVEL_0340.sprouts]) {
    assert.equal(open.has(`${tile.x},${tile.y}`), true);
  }
  assert.deepEqual(LEVEL_0340.signs, {
    Background: "Gilded Dawn",
    Land: "Sporegrove",
    Core: "Shard",
    Relic: "Ancient Rune",
    Keeper: "Satoby",
  });
});

test("Sporegrove paths breathe closed while Patience slows their cycle", () => {
  const game = new TobyworldGame(LEVEL_0340);
  game.start();
  game.threats = [];
  const besideSpore = { x: 5, y: 2 };
  assert.equal(game.areSporesOpen(), true);
  assert.equal(game.canMove(besideSpore, "right", true), true);
  game.sporeTime = LEVEL_0340.sporeOpenSeconds + 0.1;
  assert.equal(game.areSporesOpen(), false);
  assert.equal(game.canMove(besideSpore, "right", true), false);
  game.sporeTime = 0;
  game.setPatience(true);
  advance(game, 1);
  assert.ok(game.sporeTime > 0.17 && game.sporeTime < 0.19);
});

test("Deed 378 is a valid Emberreach crossing with an Ancient Rune and Sato Core", () => {
  const game = new TobyworldGame(LEVEL_0378);
  assert.ok(LEVEL_0378.map.every((row) => row.length === 17));
  assert.equal(LEVEL_0378.threats.length, 7);
  assert.ok(game.lights.size >= LEVEL_0378.lightGoal);
  const closed = reachableTiles(game, false);
  const open = reachableTiles(game, true);
  assert.equal(closed.has(`${LEVEL_0378.relic.x},${LEVEL_0378.relic.y}`), false);
  for (const tile of [LEVEL_0378.core, LEVEL_0378.relic, LEVEL_0378.bloom, ...LEVEL_0378.sprouts]) {
    assert.equal(open.has(`${tile.x},${tile.y}`), true);
  }
  assert.deepEqual(LEVEL_0378.signs, {
    Background: "Cloudwake",
    Land: "Emberreach",
    Core: "Sato",
    Relic: "Ancient Rune",
    Keeper: "OG",
  });
});

test("Ember paths burn only during a surge until the Ancient Rune cools them", () => {
  const game = new TobyworldGame(LEVEL_0378);
  game.start();
  game.threats = [];
  game.emberTime = LEVEL_0378.emberCoolSeconds + 0.1;
  assert.equal(game.isEmberSurging(), true);
  game.arriveAt({ x: 3, y: 1 });
  assert.equal(game.hearts, 2);
  assert.equal(game.consumeEvents().some(({ type }) => type === "ember_burn"), true);
  game.invulnerableTime = 0;
  game.relicFound = true;
  assert.equal(game.isEmberSurging(), false);
  game.arriveAt({ x: 3, y: 1 });
  assert.equal(game.hearts, 2);
});

test("Patience slows the Emberreach heat cycle", () => {
  const game = new TobyworldGame(LEVEL_0378);
  game.start();
  game.threats = [];
  game.setPatience(true);
  advance(game, 1);
  assert.ok(game.emberTime > 0.19 && game.emberTime < 0.21);
});

test("Deed 118 is a valid Mossmere crossing with a Kiribako memory trail", () => {
  const game = new TobyworldGame(LEVEL_0118);
  assert.ok(LEVEL_0118.map.every((row) => row.length === 17));
  assert.equal(LEVEL_0118.threats.length, 8);
  assert.equal(LEVEL_0118.memorySequence.length, 3);
  assert.ok(game.lights.size >= LEVEL_0118.lightGoal);
  const closed = reachableTiles(game, false);
  const open = reachableTiles(game, true);
  assert.equal(closed.has(`${LEVEL_0118.relic.x},${LEVEL_0118.relic.y}`), false);
  for (const tile of [LEVEL_0118.core, LEVEL_0118.relic, LEVEL_0118.bloom, ...LEVEL_0118.sprouts, ...LEVEL_0118.memorySequence]) {
    assert.equal(open.has(`${tile.x},${tile.y}`), true);
  }
  assert.deepEqual(LEVEL_0118.signs, {
    Background: "Violet Dusk",
    Land: "Mossmere",
    Core: "Taboshi",
    Relic: "Kiribako",
    Keeper: "Satoby",
  });
});

test("the Kiribako memory echoes must be restored in numbered order", () => {
  const game = new TobyworldGame(LEVEL_0118);
  game.start();
  game.threats = [];
  game.relicFound = true;
  game.arriveAt(LEVEL_0118.memorySequence[1]);
  assert.equal(game.memoryProgress, 0);
  assert.equal(game.consumeEvents().some(({ type }) => type === "memory_reset"), true);
  game.arriveAt(LEVEL_0118.memorySequence[0]);
  game.arriveAt(LEVEL_0118.memorySequence[1]);
  game.arriveAt(LEVEL_0118.memorySequence[2]);
  assert.equal(game.memoryProgress, 3);
  assert.equal(game.consumeEvents().some(({ type }) => type === "memory_complete"), true);
  game.lightsCollected = LEVEL_0118.lightGoal;
  LEVEL_0118.sprouts.forEach((sprout) => game.tended.add(`${sprout.x},${sprout.y}`));
  assert.equal(game.requirementsMet(), true);
});

test("Deed 182 is a valid Meadow crossing with four Gate Key shortcuts", () => {
  const game = new TobyworldGame(LEVEL_0182);
  assert.ok(LEVEL_0182.map.every((row) => row.length === 17));
  assert.equal(LEVEL_0182.threats.length, 9);
  assert.equal(LEVEL_0182.map.join("").split("D").length - 1, 4);
  assert.ok(game.lights.size >= LEVEL_0182.lightGoal);
  const closed = reachableTiles(game, false);
  const open = reachableTiles(game, true);
  assert.equal(closed.has(`${LEVEL_0182.relic.x},${LEVEL_0182.relic.y}`), false);
  for (const tile of [LEVEL_0182.core, LEVEL_0182.relic, LEVEL_0182.bloom, ...LEVEL_0182.sprouts]) {
    assert.equal(open.has(`${tile.x},${tile.y}`), true);
  }
  assert.deepEqual(LEVEL_0182.signs, {
    Background: "Gilded Dawn",
    Land: "Meadow",
    Core: "Patience",
    Relic: "Gate Key",
    Keeper: "OG",
  });
});

test("the Gate Key permanently opens every marked Meadow shortcut", () => {
  const game = new TobyworldGame(LEVEL_0182);
  game.start();
  game.threats = [];
  assert.equal(game.canMove({ x: 5, y: 2 }, "right", true), false);
  game.arriveAt(LEVEL_0182.relic);
  assert.equal(game.relicFound, true);
  assert.equal(game.canMove({ x: 5, y: 2 }, "right", true), true);
  assert.equal(game.consumeEvents().some(({ type }) => type === "key_unlocked"), true);
});

test("Deed 887 is a valid Frostveil crossing whose Lore Map charts the route", () => {
  const game = new TobyworldGame(LEVEL_0887);
  assert.ok(LEVEL_0887.map.every((row) => row.length === 17));
  assert.equal(LEVEL_0887.threats.length, 10);
  assert.ok(game.lights.size >= LEVEL_0887.lightGoal);
  const open = reachableTiles(game, true);
  for (const tile of [LEVEL_0887.core, LEVEL_0887.relic, LEVEL_0887.bloom, ...LEVEL_0887.sprouts]) assert.equal(open.has(`${tile.x},${tile.y}`), true);
  assert.deepEqual(LEVEL_0887.signs, { Background: "Cloudwake", Land: "Frostveil", Core: "Shard", Relic: "Lore Map", Keeper: "Hush" });
});

test("the Lore Map grants persistent guidance for the rest of the stage", () => {
  const game = new TobyworldGame(LEVEL_0887);
  game.start(); game.threats = [];
  game.arriveAt(LEVEL_0887.relic);
  assert.equal(game.relicFound, true);
  assert.ok(game.guidanceTime > game.remaining);
  assert.equal(game.consumeEvents().some(({ type }) => type === "map_revealed"), true);
  advance(game, 2);
  assert.ok(game.guidanceTime > game.remaining);
});

test("Deed 1091 is a valid Stillwater crossing whose Gate Key waits beyond a submerged path", () => {
  const game = new TobyworldGame(LEVEL_1091);
  assert.ok(LEVEL_1091.map.every((row) => row.length === 17));
  assert.equal(LEVEL_1091.threats.length, 9);
  assert.equal(LEVEL_1091.map.join("").split("U").length - 1, 4);
  assert.equal(LEVEL_1091.map.join("").split("D").length - 1, 2);
  assert.ok(game.lights.size >= LEVEL_1091.lightGoal);
  game.yieldTime = 1;
  const hidden = reachableTiles(game, true);
  assert.equal(hidden.has(`${LEVEL_1091.relic.x},${LEVEL_1091.relic.y}`), false);
  game.submergedRevealTime = 1;
  const revealed = reachableTiles(game, true);
  for (const tile of [LEVEL_1091.core, LEVEL_1091.relic, LEVEL_1091.bloom, ...LEVEL_1091.sprouts]) assert.equal(revealed.has(`${tile.x},${tile.y}`), true);
  assert.deepEqual(LEVEL_1091.signs, { Background: "Verdant Veil", Land: "Stillwater", Core: "Taboshi", Relic: "Gate Key", Keeper: "Hush" });
});

test("Deed 1091 begins with a calm, unoccupied route from Toby to Hush", () => {
  const game = new TobyworldGame(LEVEL_1091);
  const safeRoute = new Set(["1,7", "2,7", "3,7", "4,7", "5,7", "6,7", "7,7", "7,6", "7,5", "7,4", "7,3"]);
  assert.equal(game.threats.some(({ tile }) => safeRoute.has(`${tile.x},${tile.y}`)), false);
  assert.ok(game.threats.every(({ stunned }) => stunned === LEVEL_1091.openingQuietSeconds));
});

test("Hush and complete stillness reveal Deed 1091's submerged paths temporarily", () => {
  const game = new TobyworldGame(LEVEL_1091);
  game.start(); game.threats = []; game.keeperAwakened = true;
  game.player.tile = { x: 15, y: 3 }; game.player.from = { x: 15, y: 3 }; game.player.to = { x: 15, y: 3 };
  game.player.moving = false; game.releaseDirection();
  assert.equal(game.canMove(game.player.tile, "up", true), false);
  game.setPatience(true); advance(game, 0.7);
  assert.equal(game.areSubmergedPathsRevealed(), true);
  assert.equal(game.canMove(game.player.tile, "up", true), true);
  assert.equal(game.consumeEvents().some(({ type }) => type === "submerged_revealed"), true);
  game.setPatience(false); advance(game, LEVEL_1091.submergedRevealSeconds + 0.1);
  assert.equal(game.areSubmergedPathsRevealed(), false);
});

test("Deed 969 is a valid Pond crossing whose Gate Key waits beyond a breathing threshold", () => {
  const game = new TobyworldGame(LEVEL_0969);
  assert.ok(LEVEL_0969.map.every((row) => row.length === 17));
  assert.equal(LEVEL_0969.threats.length, 10);
  assert.equal(LEVEL_0969.map.join("").split("P").length - 1, 4);
  assert.equal(LEVEL_0969.map.join("").split("D").length - 1, 2);
  assert.ok(game.lights.size >= LEVEL_0969.lightGoal);
  game.yieldTime = 1;
  const closed = reachableTiles(game, true);
  assert.equal(closed.has(`${LEVEL_0969.relic.x},${LEVEL_0969.relic.y}`), false);
  game.pondThresholdTime = 1;
  const open = reachableTiles(game, true);
  for (const tile of [LEVEL_0969.core, LEVEL_0969.relic, LEVEL_0969.bloom, ...LEVEL_0969.sprouts]) assert.equal(open.has(`${tile.x},${tile.y}`), true);
  assert.deepEqual(LEVEL_0969.signs, { Background: "Cloudwake", Land: "The Pond", Core: "Patience", Relic: "Gate Key", Keeper: "Satoby" });
});

test("patient breathing briefly opens Pond rings while Satoby's welcome opens them permanently", () => {
  const game = new TobyworldGame(LEVEL_0969);
  game.start(); game.threats = [];
  game.player.tile = { x: 15, y: 3 }; game.player.from = { x: 15, y: 3 }; game.player.to = { x: 15, y: 3 };
  game.player.moving = false; game.releaseDirection();
  assert.equal(game.canMove(game.player.tile, "up", true), false);
  game.setPatience(true); advance(game, 0.85);
  assert.equal(game.arePondThresholdsOpen(), true);
  assert.equal(game.consumeEvents().some(({ type }) => type === "pond_threshold_open"), true);
  game.setPatience(false); advance(game, LEVEL_0969.pondThresholdSeconds + 0.1);
  assert.equal(game.arePondThresholdsOpen(), false);
  game.player.tile = { x: 7, y: 3 }; game.player.from = { x: 7, y: 3 }; game.player.to = { x: 7, y: 3 };
  game.releaseDirection(); game.setPatience(true); advance(game, 1.1);
  assert.equal(game.pondWelcomed, true);
  assert.equal(game.arePondThresholdsOpen(), true);
});

test("Deed 94 is a valid final Pond whose Wayfinder reveals three Door Echoes", () => {
  const game = new TobyworldGame(LEVEL_0094);
  assert.ok(LEVEL_0094.map.every((row) => row.length === 17));
  assert.equal(LEVEL_0094.convergenceTiles.length, 3);
  assert.equal(LEVEL_0094.map.join("").split("A").length - 1, 3);
  assert.equal(LEVEL_0094.threats.length, 10);
  assert.ok(game.lights.size >= LEVEL_0094.lightGoal);
  game.yieldTime = 1; game.pondWelcomed = true;
  const open = reachableTiles(game, true);
  for (const tile of [LEVEL_0094.core, LEVEL_0094.relic, LEVEL_0094.bloom, ...LEVEL_0094.sprouts, ...LEVEL_0094.convergenceTiles]) assert.equal(open.has(`${tile.x},${tile.y}`), true);
  assert.deepEqual(LEVEL_0094.signs, { Background: "Verdant Veil", Land: "The Pond", Core: "Patience", Relic: "Wayfinder Compass", Keeper: "Satoby" });
});

test("the final Wayfinder lets Patience awaken all three Door Echoes", () => {
  const game = new TobyworldGame(LEVEL_0094);
  game.start(); game.threats = []; game.relicFound = true;
  for (const tile of LEVEL_0094.convergenceTiles) {
    game.player.tile = { ...tile }; game.player.from = { ...tile }; game.player.to = { ...tile };
    game.player.moving = false; game.releaseDirection(); game.setPatience(true); advance(game, 0.9); game.setPatience(false);
  }
  assert.equal(game.convergenceAwakened.size, 3);
  assert.equal(game.consumeEvents().some(({ type }) => type === "convergence_complete"), true);
  game.lightsCollected = LEVEL_0094.lightGoal;
  LEVEL_0094.sprouts.forEach((sprout) => game.tended.add(`${sprout.x},${sprout.y}`));
  assert.equal(game.requirementsMet(), true);
});

test("Satoby grants Wayfinder guidance when Toby listens with Patience", () => {
  const game = new TobyworldGame(LEVEL_715);
  game.start();
  game.threats = [];
  game.patience = 40;
  game.player.tile = { x: 7, y: 3 };
  game.player.from = { x: 7, y: 3 };
  game.player.to = { x: 7, y: 3 };
  game.player.moving = false;
  game.releaseDirection();
  assert.equal(game.cellAt(LEVEL_715.keeper.x, LEVEL_715.keeper.y), "#");
  assert.equal(game.isNearKeeper(), true);
  game.setPatience(true);
  advance(game, 1.1);
  assert.equal(game.keeperAwakened, true);
  assert.ok(game.guidanceTime > 11);
  assert.equal(game.patience, 100);
  assert.equal(game.consumeEvents().some(({ type }) => type === "keeper_awakened"), true);
});

test("Hush quiets every threat when Toby listens at Stillwater", () => {
  const game = new TobyworldGame(LEVEL_717);
  game.start();
  game.player.tile = { x: 7, y: 3 };
  game.player.from = { x: 7, y: 3 };
  game.player.to = { x: 7, y: 3 };
  game.player.moving = false;
  game.releaseDirection();
  game.setPatience(true);
  advance(game, 1.1);
  assert.equal(game.keeperAwakened, true);
  assert.equal(game.guidanceTime, 0);
  assert.ok(game.threats.every(({ stunned }) => stunned > 6));
});

test("OG restores courage and grants a ten-second sky ward", () => {
  const game = new TobyworldGame(LEVEL_718);
  game.start();
  game.hearts = 2;
  game.player.tile = { x: 7, y: 3 };
  game.player.from = { x: 7, y: 3 };
  game.player.to = { x: 7, y: 3 };
  game.player.moving = false;
  game.releaseDirection();
  game.setPatience(true);
  advance(game, 1.1);
  assert.equal(game.keeperAwakened, true);
  assert.equal(game.hearts, 3);
  assert.ok(game.invulnerableTime > 9);
});

test("every Keeper can be reached from the starting side without opening the gate", () => {
  for (const level of [LEVEL_715, LEVEL_716, LEVEL_717, LEVEL_718, LEVEL_0340, LEVEL_0378, LEVEL_0118, LEVEL_0182, LEVEL_0887, LEVEL_1091, LEVEL_0969, LEVEL_0094]) {
    const reachable = reachableTiles(new TobyworldGame(level), false);
    const adjacentKeys = Object.values(DIRECTIONS).map(({ x, y }) => `${level.keeper.x + x},${level.keeper.y + y}`);
    assert.equal(adjacentKeys.some((key) => reachable.has(key)), true, `Keeper ${level.signs.Keeper} is unreachable in ${level.id}`);
  }
});

test("Toby follows queued directions along the Waystones", () => {
  const game = new TobyworldGame();
  game.start();
  game.queueDirection("right");
  advance(game, 0.25);
  assert.ok(game.actorPosition(game.player).x > LEVEL_715.start.x);
  advance(game, 0.3);
  assert.ok(game.player.tile.x >= 2);
});

test("releasing a direction stops Toby cleanly on the next tile", () => {
  const game = new TobyworldGame();
  game.start();
  game.threats = [];
  game.queueDirection("right");
  advance(game, 0.05);
  assert.equal(game.player.moving, true);
  assert.equal(game.releaseDirection("right"), true);
  advance(game, 0.5);
  assert.deepEqual(game.player.tile, { x: 2, y: 7 });
  assert.equal(game.player.moving, false);
  advance(game, 0.5);
  assert.deepEqual(game.player.tile, { x: 2, y: 7 });
});

test("releasing an older key does not cancel a newly queued direction", () => {
  const game = new TobyworldGame();
  game.start();
  game.queueDirection("right");
  game.queueDirection("up");
  assert.equal(game.releaseDirection("right"), false);
  assert.equal(game.player.movementActive, true);
  assert.equal(game.player.queued, "up");
});

test("the living gate opens only while Yield is active", () => {
  const game = new TobyworldGame();
  game.start();
  game.threats = [];
  game.player.tile = { x: 7, y: 7 };
  game.player.from = { x: 7, y: 7 };
  game.player.to = { x: 7, y: 7 };
  game.player.moving = false;
  game.queueDirection("right");
  assert.equal(game.canMove(game.player.tile, "right", true), false);
  assert.equal(game.activateYield(), true);
  assert.equal(game.canMove(game.player.tile, "right", true), true);
  game.update(0.05);
  assert.equal(game.player.to.x, 8);
  assert.equal(game.yieldCharges, 2);
});

test("Yield cannot be wasted away from the living gate", () => {
  const game = new TobyworldGame();
  game.start();
  assert.equal(game.isNearYieldGate(), false);
  assert.equal(game.activateYield(), false);
  assert.equal(game.yieldCharges, 3);
  assert.equal(game.consumeEvents().at(-1).type, "yield_waits");
});

test("Yield is a real threshold to the Wayfinder half of the land", () => {
  const game = new TobyworldGame();
  const relicKey = `${LEVEL_715.relic.x},${LEVEL_715.relic.y}`;
  assert.equal(reachableTiles(game, false).has(relicKey), false);
  assert.equal(reachableTiles(game, true).has(relicKey), true);
});

test("holding Patience while still tends a sprout", () => {
  const game = new TobyworldGame();
  game.start();
  const sprout = LEVEL_715.sprouts[0];
  game.player.tile = { ...sprout };
  game.player.from = { ...sprout };
  game.player.to = { ...sprout };
  game.player.moving = false;
  game.setPatience(true);
  advance(game, 1.5);
  assert.equal(game.tended.has(`${sprout.x},${sprout.y}`), true);
  assert.equal(game.score, 500);
  assert.ok(game.patience < 100);
});

test("the Rootbound Core wakes only after every tending requirement", () => {
  const game = new TobyworldGame();
  game.start();
  game.lightsCollected = LEVEL_715.lightGoal;
  game.relicFound = true;
  LEVEL_715.sprouts.forEach((sprout) => game.tended.add(`${sprout.x},${sprout.y}`));
  assert.equal(game.requirementsMet(), true);
  game.arriveAt(LEVEL_715.core);
  assert.equal(game.phase, "won");
});

test("Taboshi Harvest eats a ghost and returns it to a distant safe path", () => {
  const game = new TobyworldGame(LEVEL_715);
  game.start(); game.consumeEvents();
  game.arriveAt(LEVEL_715.bloom);
  assert.equal(game.resonanceTime, 7);
  assert.equal(game.consumeEvents().some(({ type }) => type === "taboshi_harvest"), true);
  const threat = game.threats[0];
  threat.tile = { ...game.player.tile }; threat.from = { ...game.player.tile }; threat.to = { ...game.player.tile }; threat.moving = false;
  game.checkCollisions();
  const distance = Math.abs(threat.tile.x - game.player.tile.x) + Math.abs(threat.tile.y - game.player.tile.y);
  assert.ok(distance >= 8);
  assert.equal(game.cellAt(threat.tile.x, threat.tile.y), ".");
  assert.equal(game.isReservedTile(threat.tile), false);
  assert.equal(game.consumeEvents().some(({ type }) => type === "ghost_eaten"), true);
});

test("generated lore index contains all 2,869 canonical deeds", async () => {
  const index = JSON.parse(await readFile(new URL("../data/lore-lands.json", import.meta.url), "utf8"));
  assert.equal(index.count, 2869);
  const deed = index.lands.find((land) => land.id === "0715");
  assert.ok(deed);
  assert.equal(deed.signs.Land, "Waystones");
  assert.equal(deed.signs.Core, "Rootbound");
});
