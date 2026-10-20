import { LEVEL_0118, LEVEL_0182, LEVEL_0340, LEVEL_0378, LEVEL_0969, LEVEL_715, LEVEL_716, LEVEL_717, LEVEL_718 } from "./core.mjs";

const freezeEntries = (entries) => Object.freeze(Object.fromEntries(
  Object.entries(entries).map(([key, value]) => [key, Object.freeze(value)]),
));

export const BACKGROUND_MAPPINGS = freezeEntries({
  "Verdant Veil": {
    atmosphere: "Canopy-filtered green light, drifting pollen, and a soft ground mist.",
    audio: "Leaf rustle, low wooden drones, and a patient three-note pulse.",
    audioKey: "verdant-veil",
  },
  "Violet Dusk": {
    atmosphere: "Violet twilight, silver fog, and slow firefly glints at the path edge.",
    audio: "Night insects, glassy droplets, and a descending moonlit motif.",
    audioKey: "violet-dusk",
  },
  "Gilded Dawn": {
    atmosphere: "Warm horizon light, long gold shadows, and motes rising with the dawn.",
    audio: "Open-air birdsong, bell tones, and a gently ascending morning motif.",
    audioKey: "gilded-dawn",
  },
  Cloudwake: {
    atmosphere: "High cloud light, moving shadows, and wind ribbons crossing the land.",
    audio: "Airy wind, distant chimes, and a spacious climbing motif.",
    audioKey: "cloudwake",
  },
});

export const LAND_MAPPINGS = freezeEntries({
  Waystones: {
    layout: "Branching stone corridors gathered around a central Yield crossing.",
    layoutKey: "waystones",
    traversal: "Landmark stones make every major turn readable from a distance.",
  },
  Frostveil: {
    layout: "Crystalline lanes narrow toward a two-sided frozen crossing.",
    layoutKey: "frostveil",
    traversal: "Clear ice sightlines alternate with crystal choke points.",
  },
  Stillwater: {
    layout: "Stepping-stone loops connect two quiet shores across shallow water.",
    layoutKey: "stillwater",
    traversal: "Water divides the route while warm stones mark safe footing.",
  },
  Sunfield: {
    layout: "Broad sunlit circuits link separated terraces around an open center.",
    layoutKey: "sunfield",
    traversal: "Long sightlines expose choices before the next narrow bridge.",
  },
  Sporegrove: {
    layout: "Fungal rings and cross-paths hinge on a breathing central passage.",
    layoutKey: "sporegrove",
    traversal: "Marked spore paths open and close on a visible repeating cycle.",
  },
  Emberreach: {
    layout: "Offset basalt loops cross a band of heat-marked paths.",
    layoutKey: "emberreach",
    traversal: "Ember paths stay traversable, but punish entry during their visible surge.",
  },
  Mossmere: {
    layout: "Fog-softened loops fold back through three numbered memory clearings.",
    layoutKey: "mossmere",
    traversal: "Repeated landmarks reward retracing an ordered route.",
  },
  Meadow: {
    layout: "Open grassy circuits surround locked shortcuts and flower landmarks.",
    layoutKey: "meadow",
    traversal: "Wide sightlines reveal doors before a relic permanently opens them.",
  },
  "The Pond": {
    layout: "Concentric shoreline paths pass through four patient ring thresholds.",
    layoutKey: "pond",
    traversal: "Closed rings open briefly through stillness or remain open after a welcome.",
  },
});

export const CORE_MAPPINGS = freezeEntries({
  Rootbound: { objective: "Tend every sprout before waking the rooted center.", objectiveKey: "tend" },
  Sato: { objective: "Complete the land's crossing and return its carried sign to the center.", objectiveKey: "return" },
  Taboshi: { objective: "Restore the land's scattered living pattern before approaching the center.", objectiveKey: "restore" },
  Eclipse: { objective: "Bring light from both sides of the land until shadow and radiance balance.", objectiveKey: "balance" },
  Shard: { objective: "Read the land's changing paths and assemble their answer at the center.", objectiveKey: "attune" },
  Patience: { objective: "Finish every required ritual, then become still long enough for the center to answer.", objectiveKey: "patience" },
});

export const RELIC_MAPPINGS = freezeEntries({
  "Wayfinder Compass": { rule: "Points toward the nearest unfinished required objective.", ruleKey: "guidance" },
  "Seed Vessel": { rule: "Carries a seed that must be planted at the Core after the land is tended.", ruleKey: "plant" },
  "Ancient Rune": { rule: "Reveals the timing of living hazards and permanently calms one route.", ruleKey: "calm" },
  Kiribako: { rule: "Unseals three numbered echoes that must be revisited in order.", ruleKey: "memory" },
  "Gate Key": { rule: "Permanently opens marked shortcut doors after it is found.", ruleKey: "unlock" },
  "Lore Map": { rule: "Charts a persistent path toward unfinished required objectives.", ruleKey: "chart" },
});

export const KEEPER_MAPPINGS = freezeEntries({
  Satoby: { ability: "Wayfinder Welcome", rule: "Patient listening grants route guidance; at Pond rings it grants a lasting welcome.", abilityKey: "guidance" },
  Hush: { ability: "Quieting", rule: "Patient listening stills nearby threats and enables hidden paths that answer silence.", abilityKey: "quiet" },
  OG: { ability: "Sky Ward", rule: "Patient listening restores one courage and grants brief protection from one hazard crossing.", abilityKey: "ward" },
});

export const SIGN_MAPPINGS = Object.freeze({
  Background: BACKGROUND_MAPPINGS,
  Land: LAND_MAPPINGS,
  Core: CORE_MAPPINGS,
  Relic: RELIC_MAPPINGS,
  Keeper: KEEPER_MAPPINGS,
});

export function sandboxSeed(value) {
  const text = String(value ?? "");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function createDeedSandboxProfile(deed) {
  if (!deed?.id || !deed?.signs) return null;
  const background = BACKGROUND_MAPPINGS[deed.signs.Background];
  const land = LAND_MAPPINGS[deed.signs.Land];
  const core = CORE_MAPPINGS[deed.signs.Core];
  const relic = RELIC_MAPPINGS[deed.signs.Relic];
  const keeper = KEEPER_MAPPINGS[deed.signs.Keeper];
  if (!background || !land || !core || !relic || !keeper) return null;

  const signature = [deed.id, ...["Background", "Land", "Core", "Relic", "Keeper"].map((name) => deed.signs[name])].join("|");
  return Object.freeze({
    deedId: String(deed.id),
    seed: sandboxSeed(signature),
    layoutKey: land.layoutKey,
    audioKey: background.audioKey,
    objectiveKey: core.objectiveKey,
    relicRuleKey: relic.ruleKey,
    keeperAbilityKey: keeper.abilityKey,
    layout: land.layout,
    traversal: land.traversal,
    atmosphere: background.atmosphere,
    audio: background.audio,
    objective: core.objective,
    relicRule: relic.rule,
    keeperAbility: keeper.ability,
    keeperRule: keeper.rule,
  });
}
const LAND_TEMPLATES = Object.freeze({
  Waystones: LEVEL_715,
  Frostveil: LEVEL_716,
  Stillwater: LEVEL_717,
  Sunfield: LEVEL_718,
  Sporegrove: LEVEL_0340,
  Emberreach: LEVEL_0378,
  Mossmere: LEVEL_0118,
  Meadow: LEVEL_0182,
  "The Pond": LEVEL_0969,
});

const BACKGROUND_THEMES = freezeEntries({
  "Verdant Veil": { landTop: "rgba(34,108,67,.24)", landBottom: "rgba(9,52,43,.44)", landBorder: "rgba(220,255,181,.82)", hudPanel: "rgba(4,30,44,.82)", hudCard: "rgba(10,50,64,.66)", audioProfileId: "0715" },
  "Violet Dusk": { landTop: "rgba(108,76,156,.24)", landBottom: "rgba(31,27,78,.46)", landBorder: "rgba(229,211,255,.84)", hudPanel: "rgba(31,27,78,.84)", hudCard: "rgba(76,64,134,.66)", audioProfileId: "0716" },
  "Gilded Dawn": { landTop: "rgba(255,198,112,.22)", landBottom: "rgba(63,79,61,.44)", landBorder: "rgba(255,230,159,.88)", hudPanel: "rgba(38,52,55,.84)", hudCard: "rgba(87,91,67,.66)", audioProfileId: "0717" },
  Cloudwake: { landTop: "rgba(255,221,143,.22)", landBottom: "rgba(78,109,157,.42)", landBorder: "rgba(255,242,195,.9)", hudPanel: "rgba(28,55,82,.84)", hudCard: "rgba(86,81,120,.66)", audioProfileId: "0718" },
});

const TERRAIN_KEYS = Object.freeze({
  Waystones: "waystones", Frostveil: "frostveil", Stillwater: "stillwater", Sunfield: "cloudwake",
  Sporegrove: "sporegrove", Emberreach: "emberreach", Mossmere: "mossmere", Meadow: "meadow", "The Pond": "pond",
});

function sandboxMap(template, deed, seed) {
  const rows = template.map.map((row) => {
    let next = row.replaceAll("U", ".").replaceAll("A", ".");
    if (deed.signs.Land !== "Sporegrove") next = next.replaceAll("S", ".");
    if (deed.signs.Land !== "Emberreach") next = next.replaceAll("H", ".");
    if (deed.signs.Land !== "The Pond") next = next.replaceAll("P", ".");
    if (deed.signs.Relic !== "Gate Key") next = next.replaceAll("D", ".");
    return next;
  });
  if (deed.signs.Relic === "Gate Key" && !rows.some((row) => row.includes("D"))) {
    const candidates = [];
    for (let y = 1; y < rows.length - 1; y += 1) {
      for (let x = 1; x < rows[y].length - 1; x += 1) {
        if (rows[y][x] !== "#") continue;
        const horizontal = rows[y][x - 1] !== "#" && rows[y][x + 1] !== "#";
        const vertical = rows[y - 1][x] !== "#" && rows[y + 1][x] !== "#";
        if (horizontal || vertical) candidates.push({ x, y });
      }
    }
    for (let index = 0; index < Math.min(2, candidates.length); index += 1) {
      const candidate = candidates[(seed + index * 7) % candidates.length];
      rows[candidate.y] = `${rows[candidate.y].slice(0, candidate.x)}D${rows[candidate.y].slice(candidate.x + 1)}`;
    }
  }
  return Object.freeze(rows);
}

function reachableSandboxTiles(map, start) {
  const reached = new Set([`${start.x},${start.y}`]);
  const queue = [{ ...start }];
  for (let index = 0; index < queue.length; index += 1) {
    const tile = queue[index];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const next = { x: tile.x + dx, y: tile.y + dy };
      const nextKey = `${next.x},${next.y}`;
      if ((map[next.y]?.[next.x] ?? "#") === "#" || reached.has(nextKey)) continue;
      reached.add(nextKey);
      queue.push(next);
    }
  }
  return reached;
}

function chooseRitualTiles(map, start, reserved, seed, count) {
  const reachable = reachableSandboxTiles(map, start);
  const candidates = [];
  for (let y = 1; y < map.length - 1; y += 1) {
    for (let x = 1; x < map[y].length - 1; x += 1) {
      if (map[y][x] === "." && reachable.has(`${x},${y}`) && !reserved.has(`${x},${y}`)) candidates.push({ x, y });
    }
  }
  const chosen = [];
  for (let index = 0; index < count && candidates.length; index += 1) {
    chosen.push(Object.freeze(candidates.splice((seed + index * 11) % candidates.length, 1)[0]));
  }
  return Object.freeze(chosen);
}

export function createDeedSandboxStage(deed) {
  const profile = createDeedSandboxProfile(deed);
  const template = LAND_TEMPLATES[deed?.signs?.Land];
  const backgroundTheme = BACKGROUND_THEMES[deed?.signs?.Background];
  if (!profile || !template || !backgroundTheme) return null;

  const keeperAbility = deed.signs.Keeper === "Hush" ? "quiet" : deed.signs.Keeper === "OG" ? "ward" : deed.signs.Land === "The Pond" ? "welcome" : "guidance";
  const map = sandboxMap(template, deed, profile.seed);
  const reserved = new Set([template.start, template.core, template.relic, template.bloom, ...template.sprouts].map(({ x, y }) => `${x},${y}`));
  const level = {
    id: deed.id,
    name: `Generated sandbox for Lore Land Deed #${Number(deed.id)}`,
    signs: Object.freeze({ ...deed.signs }),
    map,
    start: template.start,
    core: template.core,
    relic: template.relic,
    bloom: template.bloom,
    keeper: template.keeper,
    keeperAbility,
    keeperQuietSeconds: 8,
    sprouts: Object.freeze(template.sprouts.slice(0, deed.signs.Core === "Rootbound" ? 4 : 2)),
    threats: Object.freeze((template.threats ?? [
      { kind: "drifter", tile: { x: 7, y: 1 }, direction: "left", speed: 2.05 },
      { kind: "listener", tile: { x: 11, y: 7 }, direction: "left", speed: 2.28 },
    ]).slice(0, 5)),
    lightGoal: 34 + (profile.seed % 7),
    timeLimit: 210,
    openingQuietSeconds: 3,
    gateHint: `the ${deed.signs.Land} crossing`,
  };

  if (deed.signs.Land === "Sporegrove") Object.assign(level, { sporeCycleSeconds: 6, sporeOpenSeconds: 3.6 });
  if (deed.signs.Land === "Emberreach") Object.assign(level, { emberCycleSeconds: 7, emberCoolSeconds: 4 });
  if (deed.signs.Land === "The Pond") Object.assign(level, { pondThresholdSeconds: 6, pondStillnessSeconds: 0.8 });
  if (deed.signs.Relic === "Wayfinder Compass") level.wayfinderGuidance = true;
  if (deed.signs.Relic === "Seed Vessel") level.seedPlantSeconds = 1.1;
  if (deed.signs.Relic === "Ancient Rune") level.runeCalmsHazards = true;
  if (deed.signs.Relic === "Kiribako") level.memorySequence = chooseRitualTiles(map, template.start, reserved, profile.seed, 3);
  if (deed.signs.Core === "Taboshi") level.requiresHarvest = true;
  if (deed.signs.Core === "Sato") level.requiresReturnCrossing = true;
  if (deed.signs.Core === "Eclipse") level.eclipseBalance = true;
  if (deed.signs.Core === "Shard") level.shardTiles = chooseRitualTiles(map, template.start, reserved, profile.seed ^ 0x9e3779b9, 3);
  if (deed.signs.Core === "Patience") level.coreStillnessSeconds = 1.25;

  return Object.freeze({
    id: deed.id,
    title: `${deed.signs.Land} Sandbox`,
    intro: `${profile.layout} ${profile.objective}`,
    isSandbox: true,
    sandboxProfile: profile,
    audioProfileId: backgroundTheme.audioProfileId,
    level: Object.freeze(level),
    art: Object.freeze({ canonical: `./assets/deed-thumbnails/${deed.id}.webp`, imagined: `./assets/deed-thumbnails/${deed.id}.webp`, imaginedCredit: "Canonical archive visual" }),
    theme: Object.freeze({
      terrain: TERRAIN_KEYS[deed.signs.Land], backdropOpacity: 0.88, backdropBlur: 0.35, backdropSaturation: 1.05,
      landTop: backgroundTheme.landTop, landBottom: backgroundTheme.landBottom, landBorder: backgroundTheme.landBorder,
      hudPanel: backgroundTheme.hudPanel, hudCard: backgroundTheme.hudCard,
    }),
  });
}
