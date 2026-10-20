import { STAGE_ORDER, getNextStage } from "./stages.mjs";

export const SAVE_VERSION = 10;
export const SAVE_KEY = "tobyworld-paths-progress";

const stageIds = new Set(STAGE_ORDER.map(({ id }) => id));

export function createProgress() {
  return {
    version: SAVE_VERSION,
    unlocked: [STAGE_ORDER[0].id],
    completed: {},
  };
}

export function migrateProgress(value) {
  if (!value || typeof value !== "object" || Number(value.version ?? 0) > SAVE_VERSION) return createProgress();

  const unlocked = Array.isArray(value.unlocked)
    ? value.unlocked.filter((id) => stageIds.has(String(id).padStart(4, "0"))).map((id) => String(id).padStart(4, "0"))
    : [];
  const normalizedUnlocked = [...new Set([STAGE_ORDER[0].id, ...unlocked])];
  const completed = {};

  if (value.completed && typeof value.completed === "object") {
    for (const [rawId, record] of Object.entries(value.completed)) {
      const id = String(rawId).padStart(4, "0");
      if (!stageIds.has(id) || !record || typeof record !== "object") continue;
      completed[id] = {
        bestScore: Math.max(0, Number(record.bestScore) || 0),
        completions: Math.max(1, Math.floor(Number(record.completions) || 1)),
      };
    }
  }

  for (const id of Object.keys(completed)) {
    const followingStage = getNextStage(id);
    if (followingStage && !normalizedUnlocked.includes(followingStage.id)) normalizedUnlocked.push(followingStage.id);
  }

  return { version: SAVE_VERSION, unlocked: normalizedUnlocked, completed };
}

export function loadProgress(storage = globalThis.localStorage) {
  try {
    return migrateProgress(JSON.parse(storage?.getItem(SAVE_KEY) ?? "null"));
  } catch {
    return createProgress();
  }
}

export function saveProgress(progress, storage = globalThis.localStorage) {
  try {
    storage?.setItem(SAVE_KEY, JSON.stringify(migrateProgress(progress)));
    return true;
  } catch {
    return false;
  }
}

export function isStageUnlocked(progress, id) {
  const normalizedId = String(id).padStart(4, "0");
  return migrateProgress(progress).unlocked.includes(normalizedId);
}

export function recordStageCompletion(progress, id, score = 0) {
  const next = migrateProgress(progress);
  const normalizedId = String(id).padStart(4, "0");
  if (!stageIds.has(normalizedId)) return next;

  const previous = next.completed[normalizedId];
  next.completed[normalizedId] = {
    bestScore: Math.max(previous?.bestScore ?? 0, Math.max(0, Number(score) || 0)),
    completions: (previous?.completions ?? 0) + 1,
  };

  const followingStage = getNextStage(normalizedId);
  if (followingStage && !next.unlocked.includes(followingStage.id)) next.unlocked.push(followingStage.id);
  return next;
}
