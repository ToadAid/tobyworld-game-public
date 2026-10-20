import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const assetRoot = new URL("../assets/keepers/", import.meta.url);

test("Keeper masters preserve the canonical names, colors, dimensions, alpha, and hashes", async () => {
  const manifest = JSON.parse(await readFile(new URL("manifest.json", assetRoot), "utf8"));
  assert.deepEqual(Object.keys(manifest.keepers), ["OG", "Hush", "Satoby"]);
  assert.deepEqual(Object.values(manifest.keepers).map(({ color }) => color), ["blue", "gray", "gold"]);

  for (const keeper of Object.values(manifest.keepers)) {
    const png = await readFile(new URL(keeper.file, assetRoot));
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(png.readUInt32BE(16), 1254);
    assert.equal(png.readUInt32BE(20), 1254);
    assert.equal(png[25], 6, `${keeper.file} must remain RGBA with transparency support`);
    assert.equal(createHash("sha256").update(png).digest("hex"), keeper.sha256);
  }
});
