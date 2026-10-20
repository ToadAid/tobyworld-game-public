import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { ACTIVE_STAGE, getNextStage, getStage, STAGES, STAGE_ORDER } from "../src/stages.mjs";

test("stage 0715 keeps canonical and imagined artwork distinct", async () => {
  const stage = getStage(715);
  assert.equal(stage, ACTIVE_STAGE);
  assert.equal(Object.keys(STAGES).length, 12);
  assert.notEqual(stage.art.canonical, stage.art.imagined);
  assert.equal(stage.art.imaginedCredit, "Toadaid Forge");
  assert.deepEqual(stage.level.signs, {
    Background: "Verdant Veil",
    Land: "Waystones",
    Core: "Rootbound",
    Relic: "Wayfinder Compass",
    Keeper: "Satoby",
  });
  await access(new URL(`../${stage.art.canonical.replace("./", "")}`, import.meta.url));
  await access(new URL(`../${stage.art.imagined.replace("./", "")}`, import.meta.url));
});

test("stage 0716 carries the canonical Frostveil signs and follows 0715", async () => {
  const stage = getStage(716);
  assert.equal(getNextStage(715), stage);
  assert.equal(getNextStage(716), getStage(717));
  assert.deepEqual(STAGE_ORDER.map(({ id }) => id), ["0715", "0716", "0717", "0718", "0340", "0378", "0118", "0182", "0887", "1091", "0969", "0094"]);
  assert.notEqual(stage.art.canonical, stage.art.imagined);
  assert.equal(stage.theme.terrain, "frostveil");
  assert.deepEqual(stage.level.signs, {
    Background: "Violet Dusk",
    Land: "Frostveil",
    Core: "Sato",
    Relic: "Wayfinder Compass",
    Keeper: "Satoby",
  });
  await access(new URL(`../${stage.art.canonical.replace("./", "")}`, import.meta.url));
  await access(new URL(`../${stage.art.imagined.replace("./", "")}`, import.meta.url));
});

test("stage 0717 carries the canonical Stillwater signs and completes the route", async () => {
  const stage = getStage(717);
  assert.equal(getNextStage(716), stage);
  assert.equal(getNextStage(717), getStage(718));
  assert.notEqual(stage.art.canonical, stage.art.imagined);
  assert.equal(stage.theme.terrain, "stillwater");
  assert.deepEqual(stage.level.signs, {
    Background: "Gilded Dawn",
    Land: "Stillwater",
    Core: "Taboshi",
    Relic: "Seed Vessel",
    Keeper: "Hush",
  });
  await access(new URL(`../${stage.art.canonical.replace("./", "")}`, import.meta.url));
  await access(new URL(`../${stage.art.imagined.replace("./", "")}`, import.meta.url));
});

test("stage 0718 carries the canonical Cloudwake signs and opens Sporegrove", async () => {
  const stage = getStage(718);
  assert.equal(getNextStage(717), stage);
  assert.equal(getNextStage(718), getStage(340));
  assert.notEqual(stage.art.canonical, stage.art.imagined);
  assert.equal(stage.theme.terrain, "cloudwake");
  assert.deepEqual(stage.level.signs, {
    Background: "Cloudwake",
    Land: "Sunfield",
    Core: "Eclipse",
    Relic: "Wayfinder Compass",
    Keeper: "OG",
  });
  await access(new URL(`../${stage.art.canonical.replace("./", "")}`, import.meta.url));
  await access(new URL(`../${stage.art.imagined.replace("./", "")}`, import.meta.url));
});

test("stage 0340 carries the canonical Sporegrove signs and opens Emberreach", async () => {
  const stage = getStage(340);
  assert.equal(getNextStage(718), stage);
  assert.equal(getNextStage(340), getStage(378));
  assert.notEqual(stage.art.canonical, stage.art.imagined);
  assert.equal(stage.theme.terrain, "sporegrove");
  assert.deepEqual(stage.level.signs, {
    Background: "Gilded Dawn",
    Land: "Sporegrove",
    Core: "Shard",
    Relic: "Ancient Rune",
    Keeper: "Satoby",
  });
  await access(new URL(`../${stage.art.canonical.replace("./", "")}`, import.meta.url));
  await access(new URL(`../${stage.art.imagined.replace("./", "")}`, import.meta.url));
});

test("stage 0378 carries the canonical Emberreach signs and opens Mossmere", async () => {
  const stage = getStage(378);
  assert.equal(getNextStage(340), stage);
  assert.equal(getNextStage(378), getStage(118));
  assert.notEqual(stage.art.canonical, stage.art.imagined);
  assert.equal(stage.theme.terrain, "emberreach");
  assert.deepEqual(stage.level.signs, {
    Background: "Cloudwake",
    Land: "Emberreach",
    Core: "Sato",
    Relic: "Ancient Rune",
    Keeper: "OG",
  });
  await access(new URL(`../${stage.art.canonical.replace("./", "")}`, import.meta.url));
  await access(new URL(`../${stage.art.imagined.replace("./", "")}`, import.meta.url));
});

test("stage 0118 carries the canonical Mossmere signs and opens the Meadow", async () => {
  const stage = getStage(118);
  assert.equal(getNextStage(378), stage);
  assert.equal(getNextStage(118), getStage(182));
  assert.notEqual(stage.art.canonical, stage.art.imagined);
  assert.equal(stage.theme.terrain, "mossmere");
  assert.deepEqual(stage.level.signs, {
    Background: "Violet Dusk",
    Land: "Mossmere",
    Core: "Taboshi",
    Relic: "Kiribako",
    Keeper: "Satoby",
  });
  await access(new URL(`../${stage.art.canonical.replace("./", "")}`, import.meta.url));
  await access(new URL(`../${stage.art.imagined.replace("./", "")}`, import.meta.url));
});

test("stage 0182 carries the canonical Meadow signs and opens the mapped Frostveil", async () => {
  const stage = getStage(182);
  assert.equal(getNextStage(118), stage);
  assert.equal(getNextStage(182), getStage(887));
  assert.notEqual(stage.art.canonical, stage.art.imagined);
  assert.equal(stage.theme.terrain, "meadow");
  assert.deepEqual(stage.level.signs, {
    Background: "Gilded Dawn",
    Land: "Meadow",
    Core: "Patience",
    Relic: "Gate Key",
    Keeper: "OG",
  });
  await access(new URL(`../${stage.art.canonical.replace("./", "")}`, import.meta.url));
  await access(new URL(`../${stage.art.imagined.replace("./", "")}`, import.meta.url));
});

test("stage 0887 carries the canonical mapped Frostveil signs and opens veiled Stillwater", async () => {
  const stage = getStage(887);
  assert.equal(getNextStage(182), stage); assert.equal(getNextStage(887), getStage(1091));
  assert.equal(stage.theme.terrain, "mapfrost");
  assert.deepEqual(stage.level.signs, { Background: "Cloudwake", Land: "Frostveil", Core: "Shard", Relic: "Lore Map", Keeper: "Hush" });
  await access(new URL(`../${stage.art.canonical.replace("./", "")}`, import.meta.url));
  await access(new URL(`../${stage.art.imagined.replace("./", "")}`, import.meta.url));
});

test("stage 1091 carries the canonical Stillwater signs and opens the Pond threshold", async () => {
  const stage = getStage(1091);
  assert.equal(getNextStage(887), stage); assert.equal(getNextStage(1091), getStage(969));
  assert.equal(stage.theme.terrain, "veilwater");
  assert.deepEqual(stage.level.signs, { Background: "Verdant Veil", Land: "Stillwater", Core: "Taboshi", Relic: "Gate Key", Keeper: "Hush" });
  await access(new URL(`../${stage.art.canonical.replace("./", "")}`, import.meta.url));
  await access(new URL(`../${stage.art.imagined.replace("./", "")}`, import.meta.url));
});

test("stage 0969 carries the canonical Pond signs and opens the final Pond", async () => {
  const stage = getStage(969);
  assert.equal(getNextStage(1091), stage); assert.equal(getNextStage(969), getStage(94));
  assert.equal(stage.theme.terrain, "pond");
  assert.deepEqual(stage.level.signs, { Background: "Cloudwake", Land: "The Pond", Core: "Patience", Relic: "Gate Key", Keeper: "Satoby" });
  await access(new URL(`../${stage.art.canonical.replace("./", "")}`, import.meta.url));
  await access(new URL(`../${stage.art.imagined.replace("./", "")}`, import.meta.url));
});

test("stage 0094 carries the canonical final Pond signs and completes the route", async () => {
  const stage = getStage(94);
  assert.equal(getNextStage(969), stage); assert.equal(getNextStage(94), null);
  assert.equal(stage.theme.terrain, "pondmemory");
  assert.deepEqual(stage.level.signs, { Background: "Verdant Veil", Land: "The Pond", Core: "Patience", Relic: "Wayfinder Compass", Keeper: "Satoby" });
  await access(new URL(`../${stage.art.canonical.replace("./", "")}`, import.meta.url));
  await access(new URL(`../${stage.art.imagined.replace("./", "")}`, import.meta.url));
});

test("the title screen exposes every playable deed for direct testing", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  for (const id of STAGE_ORDER.map(({ id }) => id)) assert.match(html, new RegExp(`data-stage="${id}"`));
  assert.match(app, /URLSearchParams\(window\.location\.search\)/);
  assert.match(app, /getStage\(button\.dataset\.stage\)/);
  assert.match(app, /query\.get\("test"\) === "1"/);
  assert.match(app, /!testMode && !isStageUnlocked/);
  assert.match(app, /if \(!testMode\) \{[\s\S]*recordStageCompletion/);
});

test("desktop browsers keep the visible game control dock", async () => {
  const styles = await readFile(new URL("../styles.css", import.meta.url), "utf8");
  assert.match(styles, /@media \(min-width: 861px\) and \(pointer: fine\)/);
  assert.match(styles, /\.mobile-controls \{[\s\S]*?display: flex;/);
  assert.match(styles, /height: min\(calc\(100dvh - 250px\), 56\.25vw\)/);
});

test("the pause menu exposes safe resume, restart, and quit routes", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../app.js", import.meta.url), "utf8");
  assert.match(html, /id="pause-panel"[\s\S]*id="resume-button"[\s\S]*id="restart-button"[\s\S]*id="quit-button"/);
  assert.match(app, /function openPauseMenu\(\)/);
  assert.match(app, /function quitToTitle\(\)/);
  assert.match(app, /event\.key === "Escape"/);
});
