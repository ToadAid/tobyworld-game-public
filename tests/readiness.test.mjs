import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const text = async (path) => readFile(new URL(path, root), "utf8");

test("the runtime has no automatic third-party requests", async () => {
  const files = await Promise.all(["index.html", "app.js", "styles.css", "sw.js", "manifest.webmanifest"].map(text));
  const joined = files.join("\n");
  const urls = [...joined.matchAll(/https?:\/\/[^\s\"'<)]+/g)].map((match) => match[0]);
  assert.deepEqual(urls.sort(), ["https://t.me/toadgang", "https://tobyworld.app", "https://x.com/toadgod1017"].sort());
  assert.doesNotMatch(joined, /fetch\(["']https?:\/\//);
});

test("external community links use safe new-tab attributes", async () => {
  const html = await text("index.html");
  assert.equal((html.match(/target="_blank"/g) ?? []).length, 3);
  assert.equal((html.match(/rel="noopener noreferrer external"/g) ?? []).length, 3);
});

test("the clean edition contains no canonical asset formats or nested Git data", async () => {
  const forbidden = [/deed[-_]/i, /toby\.png/i, /taboshi/i, /keeper/i, /ipfs/i, /\.git$/];
  async function walk(directory, prefix = "") {
    const entries = await readdir(directory, { withFileTypes: true });
    const names = [];
    for (const entry of entries) {
      const relative = join(prefix, entry.name); names.push(relative);
      if (entry.isDirectory()) names.push(...await walk(join(directory, entry.name), relative));
    }
    return names;
  }
  const names = await walk(fileURLToPath(root));
  for (const pattern of forbidden) assert.equal(names.some((name) => pattern.test(name)), false, `forbidden path matched ${pattern}`);
});

test("PWA cache includes every runtime module", async () => {
  const sw = await text("sw.js");
  for (const path of ["index.html", "styles.css", "app.js", "manifest.webmanifest", "docs/icon.svg", "docs/preview.png", "src/worlds.mjs", "src/engine.mjs", "src/progress.mjs", "src/gamepad.mjs", "src/audio.mjs", "src/pause.mjs"]) assert.match(sw, new RegExp(path.replaceAll(".", "\\.")));
});
