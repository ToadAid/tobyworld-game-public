import test from "node:test";
import assert from "node:assert/strict";
import {
  SAVE_KEY,
  SAVE_VERSION,
  createProgress,
  isStageUnlocked,
  loadProgress,
  recordStageCompletion,
  saveProgress,
} from "../src/progress.mjs";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("a new campaign begins with only Deed 0715 unlocked", () => {
  const progress = createProgress();
  assert.equal(progress.version, SAVE_VERSION);
  assert.equal(isStageUnlocked(progress, "0715"), true);
  assert.equal(isStageUnlocked(progress, "0716"), false);
  assert.equal(isStageUnlocked(progress, "0717"), false);
  assert.equal(isStageUnlocked(progress, "0718"), false);
  assert.equal(isStageUnlocked(progress, "0340"), false);
  assert.equal(isStageUnlocked(progress, "0378"), false);
  assert.equal(isStageUnlocked(progress, "0118"), false);
  assert.equal(isStageUnlocked(progress, "0182"), false);
  assert.equal(isStageUnlocked(progress, "0887"), false);
  assert.equal(isStageUnlocked(progress, "1091"), false);
  assert.equal(isStageUnlocked(progress, "0969"), false);
  assert.equal(isStageUnlocked(progress, "0094"), false);
});

test("deeds unlock sequentially and preserve the best score", () => {
  let progress = recordStageCompletion(createProgress(), "0715", 1200);
  assert.equal(isStageUnlocked(progress, "0716"), true);
  assert.equal(isStageUnlocked(progress, "0717"), false);
  progress = recordStageCompletion(progress, "0715", 900);
  assert.deepEqual(progress.completed["0715"], { bestScore: 1200, completions: 2 });
  progress = recordStageCompletion(progress, "0716", 1500);
  assert.equal(isStageUnlocked(progress, "0717"), true);
  progress = recordStageCompletion(progress, "0717", 1800);
  assert.equal(isStageUnlocked(progress, "0718"), true);
  progress = recordStageCompletion(progress, "0718", 2100);
  assert.equal(isStageUnlocked(progress, "0340"), true);
  progress = recordStageCompletion(progress, "0340", 2400);
  assert.equal(isStageUnlocked(progress, "0378"), true);
  progress = recordStageCompletion(progress, "0378", 2700);
  assert.equal(isStageUnlocked(progress, "0118"), true);
  progress = recordStageCompletion(progress, "0118", 3000);
  assert.equal(isStageUnlocked(progress, "0182"), true);
  progress = recordStageCompletion(progress, "0182", 3300);
  assert.equal(isStageUnlocked(progress, "0887"), true);
  progress = recordStageCompletion(progress, "0887", 3600);
  assert.equal(isStageUnlocked(progress, "1091"), true);
  progress = recordStageCompletion(progress, "1091", 3900);
  assert.equal(isStageUnlocked(progress, "0969"), true);
  progress = recordStageCompletion(progress, "0969", 4200);
  assert.equal(isStageUnlocked(progress, "0094"), true);
});

test("version-nine saves that completed 0969 migrate forward and unlock 0094", () => {
  const storage = memoryStorage();
  storage.setItem(SAVE_KEY, JSON.stringify({ version: 9, unlocked: ["0715", "0716", "0717", "0718", "0340", "0378", "0118", "0182", "0887", "1091", "0969"], completed: { "0969": { bestScore: 4300, completions: 1 } } }));
  const progress = loadProgress(storage);
  assert.equal(progress.version, SAVE_VERSION);
  assert.equal(isStageUnlocked(progress, "0094"), true);
});

test("version-eight saves that completed 1091 migrate forward and unlock 0969", () => {
  const storage = memoryStorage();
  storage.setItem(SAVE_KEY, JSON.stringify({ version: 8, unlocked: ["0715", "0716", "0717", "0718", "0340", "0378", "0118", "0182", "0887", "1091"], completed: { "1091": { bestScore: 4000, completions: 1 } } }));
  const progress = loadProgress(storage);
  assert.equal(progress.version, SAVE_VERSION);
  assert.equal(isStageUnlocked(progress, "0969"), true);
});

test("version-seven saves that completed 0887 migrate forward and unlock 1091", () => {
  const storage = memoryStorage();
  storage.setItem(SAVE_KEY, JSON.stringify({ version: 7, unlocked: ["0715", "0716", "0717", "0718", "0340", "0378", "0118", "0182", "0887"], completed: { "0887": { bestScore: 3700, completions: 1 } } }));
  const progress = loadProgress(storage);
  assert.equal(progress.version, SAVE_VERSION);
  assert.equal(isStageUnlocked(progress, "1091"), true);
});

test("version-six saves that completed 0182 migrate forward and unlock 0887", () => {
  const storage = memoryStorage();
  storage.setItem(SAVE_KEY, JSON.stringify({ version: 6, unlocked: ["0715", "0716", "0717", "0718", "0340", "0378", "0118", "0182"], completed: { "0182": { bestScore: 3400, completions: 1 } } }));
  const progress = loadProgress(storage);
  assert.equal(progress.version, SAVE_VERSION); assert.equal(isStageUnlocked(progress, "0887"), true);
});

test("version-two saves that completed 0718 migrate forward and unlock 0340", () => {
  const storage = memoryStorage();
  storage.setItem(SAVE_KEY, JSON.stringify({
    version: 2,
    unlocked: ["0715", "0716", "0717", "0718"],
    completed: { "0718": { bestScore: 2200, completions: 1 } },
  }));
  const progress = loadProgress(storage);
  assert.equal(progress.version, SAVE_VERSION);
  assert.equal(isStageUnlocked(progress, "0340"), true);
});

test("version-three saves that completed 0340 migrate forward and unlock 0378", () => {
  const storage = memoryStorage();
  storage.setItem(SAVE_KEY, JSON.stringify({
    version: 3,
    unlocked: ["0715", "0716", "0717", "0718", "0340"],
    completed: { "0340": { bestScore: 2500, completions: 1 } },
  }));
  const progress = loadProgress(storage);
  assert.equal(progress.version, SAVE_VERSION);
  assert.equal(isStageUnlocked(progress, "0378"), true);
});

test("version-four saves that completed 0378 migrate forward and unlock 0118", () => {
  const storage = memoryStorage();
  storage.setItem(SAVE_KEY, JSON.stringify({
    version: 4,
    unlocked: ["0715", "0716", "0717", "0718", "0340", "0378"],
    completed: { "0378": { bestScore: 2800, completions: 1 } },
  }));
  const progress = loadProgress(storage);
  assert.equal(progress.version, SAVE_VERSION);
  assert.equal(isStageUnlocked(progress, "0118"), true);
});

test("version-five saves that completed 0118 migrate forward and unlock 0182", () => {
  const storage = memoryStorage();
  storage.setItem(SAVE_KEY, JSON.stringify({
    version: 5,
    unlocked: ["0715", "0716", "0717", "0718", "0340", "0378", "0118"],
    completed: { "0118": { bestScore: 3100, completions: 1 } },
  }));
  const progress = loadProgress(storage);
  assert.equal(progress.version, SAVE_VERSION);
  assert.equal(isStageUnlocked(progress, "0182"), true);
});

test("version-one saves that completed 0717 migrate forward and unlock 0718", () => {
  const storage = memoryStorage();
  storage.setItem(SAVE_KEY, JSON.stringify({
    version: 1,
    unlocked: ["0715", "0716", "0717"],
    completed: { "0717": { bestScore: 1900, completions: 1 } },
  }));
  const progress = loadProgress(storage);
  assert.equal(progress.version, SAVE_VERSION);
  assert.equal(isStageUnlocked(progress, "0718"), true);
});

test("versioned progress survives storage and malformed saves recover safely", () => {
  const storage = memoryStorage();
  const progress = recordStageCompletion(createProgress(), "0715", 777);
  assert.equal(saveProgress(progress, storage), true);
  assert.deepEqual(loadProgress(storage), progress);
  storage.setItem(SAVE_KEY, "not json");
  assert.deepEqual(loadProgress(storage), createProgress());
});
