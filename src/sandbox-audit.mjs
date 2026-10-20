import { TobyworldGame } from "./core.mjs";
import { SIGN_MAPPINGS, createDeedSandboxStage } from "./deed-sandbox.mjs";

export const SIGN_NAMES = Object.freeze(["Background", "Land", "Core", "Relic", "Keeper"]);

const key = ({ x, y }) => `${x},${y}`;

function reachableTiles(map, start, { doorsOpen = false } = {}) {
  const reached = new Set([key(start)]);
  const queue = [{ ...start }];
  for (let index = 0; index < queue.length; index += 1) {
    const tile = queue[index];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const next = { x: tile.x + dx, y: tile.y + dy };
      const cell = map[next.y]?.[next.x] ?? "#";
      if (cell === "#" || (cell === "D" && !doorsOpen) || reached.has(key(next))) continue;
      reached.add(key(next));
      queue.push(next);
    }
  }
  return reached;
}

function keeperCanBeHeard(reached, keeper) {
  return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => reached.has(`${keeper.x + dx},${keeper.y + dy}`));
}

export function auditSandboxStage(stage) {
  const errors = [];
  if (!stage?.isSandbox || !stage.level) return Object.freeze(["Not a generated sandbox stage"]);
  const { level } = stage;
  const width = level.map[0]?.length ?? 0;
  if (!width || level.map.some((row) => row.length !== width)) errors.push("Map rows are not rectangular");

  const beforeRelic = reachableTiles(level.map, level.start, { doorsOpen: false });
  const afterRelic = reachableTiles(level.map, level.start, { doorsOpen: true });
  const required = [
    ["Core", level.core], ["Relic", level.relic], ["Taboshi Harvest", level.bloom],
    ...level.sprouts.map((tile, index) => [`Sprout ${index + 1}`, tile]),
    ...(level.memorySequence ?? []).map((tile, index) => [`Memory echo ${index + 1}`, tile]),
    ...(level.shardTiles ?? []).map((tile, index) => [`Shard attunement ${index + 1}`, tile]),
  ];
  for (const [name, tile] of required) {
    if (!afterRelic.has(key(tile))) errors.push(`${name} is unreachable after the Relic is found`);
  }
  if (!beforeRelic.has(key(level.relic))) errors.push("Relic is unreachable before locked doors open");
  if (!keeperCanBeHeard(beforeRelic, level.keeper)) errors.push("Keeper cannot be heard before the Relic is found");
  for (const [index, threat] of level.threats.entries()) {
    if (!afterRelic.has(key(threat.tile))) errors.push(`Threat ${index + 1} starts outside the playable route`);
  }

  const game = new TobyworldGame(level, () => 0.5);
  if (game.lights.size < level.lightGoal) errors.push(`Only ${game.lights.size} Lore Lights exist for a goal of ${level.lightGoal}`);
  if (level.requiresReturnCrossing && ![...afterRelic].some((tileKey) => Number(tileKey.split(",")[0]) > width / 2)) errors.push("Sato route never reaches the far side");
  if (level.eclipseBalance) {
    const sides = new Set([...afterRelic].map((tileKey) => Number(tileKey.split(",")[0]) < width / 2 ? "west" : "east"));
    if (sides.size < 2) errors.push("Eclipse route cannot collect light on both sides");
  }
  if (level.signs.Relic === "Gate Key" && !level.map.some((row) => row.includes("D"))) errors.push("Gate Key has no shortcut door to open");
  if (level.signs.Relic === "Kiribako" && level.memorySequence?.length !== 3) errors.push("Kiribako does not expose three ordered echoes");
  if (level.signs.Core === "Shard" && level.shardTiles?.length !== 3) errors.push("Shard Core does not expose three attunements");
  return Object.freeze(errors);
}

export function selectRepresentativeDeeds(lands) {
  const remaining = new Set(SIGN_NAMES.flatMap((name) => Object.keys(SIGN_MAPPINGS[name]).map((value) => `${name}:${value}`)));
  const candidates = [...lands].sort((a, b) => Number(a.id) - Number(b.id));
  const selected = [];
  while (remaining.size) {
    let best = null;
    let bestCoverage = [];
    for (const deed of candidates) {
      if (selected.includes(deed)) continue;
      const coverage = SIGN_NAMES.map((name) => `${name}:${deed.signs[name]}`).filter((entry) => remaining.has(entry));
      if (coverage.length > bestCoverage.length) {
        best = deed;
        bestCoverage = coverage;
      }
    }
    if (!best || !bestCoverage.length) break;
    selected.push(best);
    bestCoverage.forEach((entry) => remaining.delete(entry));
  }
  return Object.freeze({ deeds: Object.freeze(selected), uncovered: Object.freeze([...remaining]) });
}

export function auditSandboxArchive(lands) {
  const failures = [];
  for (const deed of lands) {
    const errors = auditSandboxStage(createDeedSandboxStage(deed));
    if (errors.length) failures.push(Object.freeze({ id: deed.id, errors }));
  }
  const representative = selectRepresentativeDeeds(lands);
  return Object.freeze({ total: lands.length, failures: Object.freeze(failures), representative });
}
