export const SAVE_KEY = "toadaid-pathways-sample-progress-v1";
const EMPTY = Object.freeze({ version: 1, unlocked: 1, completed: [], bestMoves: {} });

export function normalizeProgress(value) {
  const completed = Array.isArray(value?.completed) ? [...new Set(value.completed.filter((id) => typeof id === "string"))] : [];
  const unlocked = Math.max(1, Math.min(3, Number.isInteger(value?.unlocked) ? value.unlocked : completed.length + 1));
  const bestMoves = Object.fromEntries(Object.entries(value?.bestMoves ?? {}).filter(([, moves]) => Number.isInteger(moves) && moves > 0));
  return { version: 1, unlocked, completed, bestMoves };
}

export function loadProgress(storage = globalThis.localStorage) {
  try { return normalizeProgress(JSON.parse(storage?.getItem(SAVE_KEY) ?? "null")); }
  catch { return { ...EMPTY, completed: [], bestMoves: {} }; }
}

export function saveProgress(progress, storage = globalThis.localStorage) {
  const normalized = normalizeProgress(progress);
  try { storage?.setItem(SAVE_KEY, JSON.stringify(normalized)); return normalized; }
  catch { return normalized; }
}

export function recordCompletion(progress, worldId, moves, worldIndex) {
  const next = normalizeProgress(progress);
  if (!next.completed.includes(worldId)) next.completed.push(worldId);
  const previous = next.bestMoves[worldId];
  next.bestMoves[worldId] = previous ? Math.min(previous, moves) : moves;
  next.unlocked = Math.max(next.unlocked, Math.min(3, worldIndex + 2));
  return next;
}
