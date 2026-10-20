import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { findCanonicalDeed, ipfsGatewayUrl, ipfsGatewayUrls, normalizeDeedId } from "../src/deed-archive.mjs";

const archive = JSON.parse(await readFile(new URL("../data/lore-lands.json", import.meta.url), "utf8"));

test("deed lookup normalizes safe archive IDs and rejects invalid input", () => {
  assert.equal(normalizeDeedId("94"), "0094");
  assert.equal(normalizeDeedId("#969"), "0969");
  for (const value of ["", "frog", "1.5", "0", "4001", "-1"]) assert.equal(normalizeDeedId(value), null);
});

test("canonical IPFS image URIs become safe public gateway thumbnail URLs", () => {
  assert.equal(
    ipfsGatewayUrl("ipfs://QmcR39nWoXBWKZdx7zhdLjWR7SkuqxvuXyB5b8erQAL2Po/94.png"),
    "https://ipfs.io/ipfs/QmcR39nWoXBWKZdx7zhdLjWR7SkuqxvuXyB5b8erQAL2Po/94.png",
  );
  assert.equal(ipfsGatewayUrl("https://example.com/not-ipfs.png"), null);
  assert.equal(ipfsGatewayUrl("javascript:alert(1)"), null);
  assert.deepEqual(
    ipfsGatewayUrls("ipfs://QmExample/94.png"),
    [
      "https://dweb.link/ipfs/QmExample/94.png",
      "https://w3s.link/ipfs/QmExample/94.png",
      "https://ipfs.io/ipfs/QmExample/94.png",
    ],
  );
  assert.deepEqual(ipfsGatewayUrls("https://example.com/not-ipfs.png"), []);
});

test("deed lookup returns the exact five canonical signs from the 2,869-deed index", () => {
  assert.equal(archive.lands.length, 2869);
  const deed = findCanonicalDeed(archive.lands, 94);
  assert.equal(deed.id, "0094");
  assert.deepEqual(deed.signs, {
    Background: "Verdant Veil",
    Land: "The Pond",
    Core: "Patience",
    Relic: "Wayfinder Compass",
    Keeper: "Satoby",
  });
  assert.equal(findCanonicalDeed(archive.lands, 1370), null);
});

test("every canonical deed has a bundled 512px visual", async () => {
  const thumbnailDirectory = new URL("../assets/deed-thumbnails/", import.meta.url);
  const thumbnails = (await readdir(thumbnailDirectory)).filter((file) => file.endsWith(".webp"));
  assert.equal(thumbnails.length, archive.lands.length);
  assert.deepEqual(new Set(thumbnails), new Set(archive.lands.map(({ id }) => `${id}.webp`)));
  const sample = await readFile(new URL("../assets/deed-thumbnails/0001.webp", import.meta.url));
  assert.ok(sample.length > 20_000, "the sandbox visual tier should not regress to the former 256px payload");
});
