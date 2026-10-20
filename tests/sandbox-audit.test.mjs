import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { SIGN_MAPPINGS } from "../src/deed-sandbox.mjs";
import { SIGN_NAMES, auditSandboxArchive, auditSandboxStage, selectRepresentativeDeeds } from "../src/sandbox-audit.mjs";
import { createDeedSandboxStage } from "../src/deed-sandbox.mjs";

const archive = JSON.parse(await readFile(new URL("../data/lore-lands.json", import.meta.url), "utf8"));

test("every generated deed has a reachable route and completable objective placement", () => {
  const result = auditSandboxArchive(archive.lands);
  assert.equal(result.total, 2869);
  assert.deepEqual(result.failures, []);
});

test("the deterministic phone matrix covers every value in all five sign categories", () => {
  const first = selectRepresentativeDeeds(archive.lands);
  const second = selectRepresentativeDeeds(structuredClone(archive.lands));
  assert.deepEqual(first, second);
  assert.deepEqual(first.uncovered, []);
  assert.ok(first.deeds.length >= 9, "nine Land values require at least nine representative deeds");
  assert.ok(first.deeds.length <= 12, "the representative matrix should stay practical for phone QA");
  for (const signName of SIGN_NAMES) {
    assert.deepEqual(
      new Set(first.deeds.map((deed) => deed.signs[signName])),
      new Set(Object.keys(SIGN_MAPPINGS[signName])),
      `${signName} lacks representative coverage`,
    );
  }
  for (const deed of first.deeds) assert.deepEqual(auditSandboxStage(createDeedSandboxStage(deed)), []);
});

test("the route auditor detects self-locked Relics and unreachable objectives", () => {
  const stage = createDeedSandboxStage(archive.lands.find((deed) => deed.signs.Relic === "Gate Key"));
  const rows = [...stage.level.map];
  const relic = stage.level.relic;
  rows[relic.y] = `${rows[relic.y].slice(0, relic.x)}D${rows[relic.y].slice(relic.x + 1)}`;
  const broken = { ...stage, level: { ...stage.level, map: rows } };
  assert.ok(auditSandboxStage(broken).some((error) => error.includes("Relic is unreachable")));
});
