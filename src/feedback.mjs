export const HAPTICS_KEY = "tobyworld-haptics-enabled";
export const VISUAL_EFFECTS_KEY = "tobyworld-visual-effects";

export const HAPTIC_PATTERNS = Object.freeze({
  tended: Object.freeze([14]),
  keeper_awakened: Object.freeze([18, 42, 18]),
  relic: Object.freeze([22, 34, 42]),
  taboshi_harvest: Object.freeze([18, 34, 18]),
  ghost_eaten: Object.freeze([12]),
  hurt: Object.freeze([65]),
  ember_burn: Object.freeze([65]),
  won: Object.freeze([25, 42, 25, 42, 75]),
});

export function loadHapticsPreference(storage = globalThis.localStorage) {
  try {
    return storage?.getItem(HAPTICS_KEY) !== "false";
  } catch {
    return true;
  }
}

export function saveHapticsPreference(enabled, storage = globalThis.localStorage) {
  try {
    storage?.setItem(HAPTICS_KEY, String(Boolean(enabled)));
    return true;
  } catch {
    return false;
  }
}

export function loadVisualEffectsPreference(storage = globalThis.localStorage, fallback = "full") {
  try {
    const saved = storage?.getItem(VISUAL_EFFECTS_KEY);
    return saved === "full" || saved === "reduced" ? saved : fallback;
  } catch {
    return fallback;
  }
}

export function saveVisualEffectsPreference(level, storage = globalThis.localStorage) {
  if (level !== "full" && level !== "reduced") return false;
  try {
    storage?.setItem(VISUAL_EFFECTS_KEY, level);
    return true;
  } catch {
    return false;
  }
}

export function vibrateForEvent(type, enabled, vibrate = globalThis.navigator?.vibrate?.bind(globalThis.navigator)) {
  const pattern = HAPTIC_PATTERNS[type];
  if (!enabled || !pattern || typeof vibrate !== "function") return false;
  return Boolean(vibrate(pattern));
}
