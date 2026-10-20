import test from "node:test";
import assert from "node:assert/strict";
import { SAVE_KEY, loadProgress, normalizeProgress, recordCompletion, saveProgress } from "../src/progress.mjs";

function memoryStorage() {
  const data = new Map();
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

test("malformed saves recover safely", () => {
  const storage = { getItem: () => "not-json", setItem() {} };
  assert.deepEqual(loadProgress(storage), { version: 1, unlocked: 1, completed: [], bestMoves: {} });
});

test("completion unlocks the next sample world and preserves best score", () => {
  let progress = normalizeProgress(null);
  progress = recordCompletion(progress, "moonlit-garden", 42, 0);
  progress = recordCompletion(progress, "moonlit-garden", 55, 0);
  assert.equal(progress.unlocked, 2);
  assert.equal(progress.bestMoves["moonlit-garden"], 42);
});

test("saved progress survives a reload", () => {
  const storage = memoryStorage();
  saveProgress({ unlocked: 2, completed: ["moonlit-garden"], bestMoves: { "moonlit-garden": 44 } }, storage);
  assert.equal(JSON.parse(storage.getItem(SAVE_KEY)).unlocked, 2);
  assert.deepEqual(loadProgress(storage).completed, ["moonlit-garden"]);
});
