import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { TobyworldGame } from "../src/core.mjs";
import { SIGN_MAPPINGS, createDeedSandboxProfile, createDeedSandboxStage, sandboxSeed } from "../src/deed-sandbox.mjs";

const archive = JSON.parse(await readFile(new URL("../data/lore-lands.json", import.meta.url), "utf8"));
const appSource = await readFile(new URL("../app.js", import.meta.url), "utf8");
const signNames = ["Background", "Land", "Core", "Relic", "Keeper"];

test("sandbox mappings cover every canonical value in all five sign categories", () => {
  for (const signName of signNames) {
    const canonicalValues = new Set(archive.lands.map((deed) => deed.signs[signName]));
    assert.deepEqual(new Set(Object.keys(SIGN_MAPPINGS[signName])), canonicalValues, `${signName} mapping drifted`);
  }
});

test("all 2,869 canonical deeds resolve to complete deterministic sandbox recipes", () => {
  for (const deed of archive.lands) {
    const first = createDeedSandboxProfile(deed);
    const second = createDeedSandboxProfile(structuredClone(deed));
    assert.deepEqual(first, second, `Deed #${deed.id} is not deterministic`);
    for (const key of ["layout", "traversal", "atmosphere", "audio", "objective", "relicRule", "keeperAbility", "keeperRule"]) {
      assert.equal(typeof first[key], "string", `Deed #${deed.id} has no ${key}`);
      assert.ok(first[key].trim().length > 3, `Deed #${deed.id} has an incomplete ${key}`);
    }
  }
});

test("the deed identity and full five-sign combination determine the sandbox seed", () => {
  const deed94 = archive.lands.find(({ id }) => id === "0094");
  const profile = createDeedSandboxProfile(deed94);
  assert.equal(profile.layoutKey, "pond");
  assert.equal(profile.audioKey, "verdant-veil");
  assert.equal(profile.objectiveKey, "patience");
  assert.equal(profile.relicRuleKey, "guidance");
  assert.equal(profile.keeperAbilityKey, "guidance");
  assert.equal(profile.seed, sandboxSeed("0094|Verdant Veil|The Pond|Patience|Wayfinder Compass|Satoby"));

  const renumbered = createDeedSandboxProfile({ ...deed94, id: "9999" });
  assert.notEqual(profile.seed, renumbered.seed);
});

test("unknown or incomplete signs fail closed instead of inventing a mapping", () => {
  assert.equal(createDeedSandboxProfile(null), null);
  assert.equal(createDeedSandboxProfile({ id: "0001", signs: {} }), null);
  assert.equal(createDeedSandboxProfile({
    id: "0001",
    signs: { Background: "Unknown", Land: "Waystones", Core: "Rootbound", Relic: "Lore Map", Keeper: "Hush" },
  }), null);
});

test("all canonical deeds build valid, playable sandbox stages", () => {
  for (const deed of archive.lands) {
    const stage = createDeedSandboxStage(deed);
    assert.equal(stage.isSandbox, true);
    assert.equal(stage.id, deed.id);
    assert.deepEqual(stage.level.signs, deed.signs);
    assert.ok(stage.art.imagined.endsWith(`${deed.id}.webp`));
    const width = stage.level.map[0].length;
    assert.ok(stage.level.map.every((row) => row.length === width), `Deed #${deed.id} has ragged rows`);
    for (const tile of [stage.level.start, stage.level.core, stage.level.relic, stage.level.bloom, ...stage.level.sprouts]) {
      assert.notEqual(stage.level.map[tile.y]?.[tile.x], "#", `Deed #${deed.id} places an objective in a wall`);
    }
    const game = new TobyworldGame(stage.level, () => 0.5);
    assert.ok(game.lights.size >= stage.level.lightGoal, `Deed #${deed.id} cannot meet its light goal`);
  }
});

test("sandbox navigation deep-links by deed and cannot write campaign completion", () => {
  assert.match(appSource, /query\.get\("sandbox"\) === "1"/);
  assert.match(appSource, /url\.searchParams\.set\("sandbox", "1"\)/);
  assert.match(appSource, /if \(!activeStage\.isSandbox\) \{[\s\S]*?recordStageCompletion/);
  assert.match(appSource, /campaign progress unchanged/i);
});

function deedWith(signName, value) {
  return archive.lands.find((deed) => deed.signs[signName] === value);
}

function deedWithCore(value) {
  return archive.lands.find((deed) => deed.signs.Core === value && deed.signs.Relic === "Wayfinder Compass");
}

function satisfyUniversalObjectives(game) {
  game.lightsCollected = game.level.lightGoal;
  game.relicFound = true;
  game.tended = new Set(game.level.sprouts.map(({ x, y }) => `${x},${y}`));
  game.memoryProgress = game.level.memorySequence?.length ?? 0;
  game.convergenceAwakened = new Set((game.level.convergenceTiles ?? []).map(({ x, y }) => `${x},${y}`));
}

test("all six Core signs add their declared sandbox completion rule", () => {
  const rootbound = new TobyworldGame(createDeedSandboxStage(deedWithCore("Rootbound")).level);
  satisfyUniversalObjectives(rootbound); rootbound.tended.clear();
  assert.equal(rootbound.requirementsMet(), false);
  rootbound.tended = new Set(rootbound.level.sprouts.map(({ x, y }) => `${x},${y}`));
  assert.equal(rootbound.requirementsMet(), true);

  const sato = new TobyworldGame(createDeedSandboxStage(deedWithCore("Sato")).level);
  satisfyUniversalObjectives(sato);
  assert.equal(sato.requirementsMet(), false);
  sato.crossedFarSide = true;
  assert.equal(sato.requirementsMet(), true);

  const taboshi = new TobyworldGame(createDeedSandboxStage(deedWithCore("Taboshi")).level);
  satisfyUniversalObjectives(taboshi);
  assert.equal(taboshi.requirementsMet(), false);
  taboshi.harvested = true;
  assert.equal(taboshi.requirementsMet(), true);

  const eclipse = new TobyworldGame(createDeedSandboxStage(deedWithCore("Eclipse")).level);
  satisfyUniversalObjectives(eclipse);
  assert.equal(eclipse.requirementsMet(), false);
  eclipse.eclipseSides = new Set(["west", "east"]);
  assert.equal(eclipse.requirementsMet(), true);

  const shard = new TobyworldGame(createDeedSandboxStage(deedWithCore("Shard")).level);
  satisfyUniversalObjectives(shard);
  assert.equal(shard.requirementsMet(), false);
  shard.shardAttuned = new Set(shard.level.shardTiles.map(({ x, y }) => `${x},${y}`));
  assert.equal(shard.requirementsMet(), true);

  const patience = new TobyworldGame(createDeedSandboxStage(deedWithCore("Patience")).level);
  satisfyUniversalObjectives(patience);
  assert.equal(patience.requirementsMet(), false);
  patience.coreAwakened = true;
  assert.equal(patience.requirementsMet(), true);
});

test("all six Relics add a concrete sandbox mechanic", () => {
  const wayfinderStage = createDeedSandboxStage(deedWith("Relic", "Wayfinder Compass"));
  const wayfinder = new TobyworldGame(wayfinderStage.level); wayfinder.phase = "playing"; wayfinder.arriveAt(wayfinder.level.relic);
  assert.ok(wayfinder.guidanceTime > wayfinder.remaining);

  const seedStage = createDeedSandboxStage(deedWith("Relic", "Seed Vessel"));
  assert.ok(seedStage.level.seedPlantSeconds > 0);

  const runeStage = createDeedSandboxStage(deedWith("Relic", "Ancient Rune"));
  const rune = new TobyworldGame(runeStage.level); rune.phase = "playing"; rune.arriveAt(rune.level.relic);
  assert.ok(rune.threats.every((threat) => threat.stunned >= 8));

  const kiribakoStage = createDeedSandboxStage(deedWith("Relic", "Kiribako"));
  assert.equal(kiribakoStage.level.memorySequence.length, 3);

  const keyStage = createDeedSandboxStage(deedWith("Relic", "Gate Key"));
  assert.ok(keyStage.level.map.some((row) => row.includes("D")));

  const mapStage = createDeedSandboxStage(deedWith("Relic", "Lore Map"));
  const loreMap = new TobyworldGame(mapStage.level); loreMap.phase = "playing"; loreMap.arriveAt(loreMap.level.relic);
  assert.ok(loreMap.guidanceTime > loreMap.remaining);
});

test("Seed Vessel planting and the Patience Core complete through held stillness", () => {
  const seedDeed = archive.lands.find((deed) => deed.signs.Relic === "Seed Vessel" && deed.signs.Core === "Rootbound");
  const seedGame = new TobyworldGame(createDeedSandboxStage(seedDeed).level);
  satisfyUniversalObjectives(seedGame);
  seedGame.phase = "playing"; seedGame.threats = []; seedGame.player.tile = { ...seedGame.level.core };
  seedGame.setPatience(true);
  for (let index = 0; index < 30; index += 1) seedGame.update(0.05);
  assert.equal(seedGame.seedPlanted, true);
  assert.equal(seedGame.phase, "won");

  const patienceGame = new TobyworldGame(createDeedSandboxStage(deedWithCore("Patience")).level);
  satisfyUniversalObjectives(patienceGame);
  patienceGame.phase = "playing"; patienceGame.threats = []; patienceGame.player.tile = { ...patienceGame.level.core };
  patienceGame.setPatience(true);
  for (let index = 0; index < 32; index += 1) patienceGame.update(0.05);
  assert.equal(patienceGame.coreAwakened, true);
  assert.equal(patienceGame.phase, "won");
});
