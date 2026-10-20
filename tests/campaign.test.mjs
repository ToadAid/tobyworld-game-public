import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const manifest = JSON.parse(await readFile(new URL("../data/owned-deeds.json", import.meta.url), "utf8"));
const campaign = JSON.parse(await readFile(new URL("../data/campaign.json", import.meta.url), "utf8"));
const chapters = campaign.acts.flatMap(({ chapters: actChapters }) => actChapters);
const deedsById = new Map(manifest.deeds.map((deed) => [deed.id, deed]));

test("the owned source manifest preserves all local pairs and imagined variants", () => {
  assert.equal(manifest.collectionContext.reportedOwnedDeedCount, 80);
  assert.equal(manifest.collectionContext.locallyPairedDeedCount, 34);
  assert.equal(manifest.collectionContext.locallyAvailableImaginedVariantCount, 5);
  assert.equal(manifest.deeds.length, 34);
  assert.equal(new Set(manifest.deeds.map(({ id }) => id)).size, 34);

  for (const deed of manifest.deeds) {
    assert.deepEqual(Object.keys(deed.signs), ["Background", "Land", "Core", "Relic", "Keeper"]);
    assert.match(deed.curated.original.sha256, /^[a-f0-9]{64}$/);
    assert.equal(deed.curated.imagined.filter(({ selected }) => selected).length, 1);
    assert.equal(deed.curated.imagined.some(({ file }) => file === deed.curated.selectedImagined), true);
  }
});

test("the twelve-door campaign keeps the forged opening and uses owned pairs", () => {
  assert.equal(campaign.acts.length, 3);
  assert.equal(chapters.length, 12);
  assert.deepEqual(chapters.slice(0, 4).map(({ deed }) => deed), ["0715", "0716", "0717", "0718"]);
  assert.ok(chapters.every(({ status }) => status === "playable"));
  assert.equal(new Set(chapters.map(({ deed }) => deed)).size, 12);
  assert.ok(chapters.every(({ deed }) => deedsById.has(deed)));
});

test("the selected path represents every local sign category", () => {
  const selected = chapters.map(({ deed }) => deedsById.get(deed).signs);
  const coverage = (sign) => [...new Set(selected.map((entry) => entry[sign]))].sort();
  assert.deepEqual(coverage("Background"), ["Cloudwake", "Gilded Dawn", "Verdant Veil", "Violet Dusk"]);
  assert.deepEqual(coverage("Land"), ["Emberreach", "Frostveil", "Meadow", "Mossmere", "Sporegrove", "Stillwater", "Sunfield", "The Pond", "Waystones"]);
  assert.deepEqual(coverage("Core"), ["Eclipse", "Patience", "Rootbound", "Sato", "Shard", "Taboshi"]);
  assert.deepEqual(coverage("Relic"), ["Ancient Rune", "Gate Key", "Kiribako", "Lore Map", "Seed Vessel", "Wayfinder Compass"]);
  assert.deepEqual(coverage("Keeper"), ["Hush", "OG", "Satoby"]);
});
