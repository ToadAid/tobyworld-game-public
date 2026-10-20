import { TobyworldGame, DIRECTIONS } from "./src/core.mjs";
import { ACTIVE_STAGE, STAGE_ORDER, getNextStage, getStage } from "./src/stages.mjs";
import { isStageUnlocked, loadProgress, recordStageCompletion, saveProgress } from "./src/progress.mjs";
import { ReactiveAudioEngine, loadAudioPreferences, saveAudioPreferences } from "./src/audio.mjs";
import { getKeeperWhisper } from "./src/dialogue.mjs";
import {
  loadHapticsPreference,
  loadVisualEffectsPreference,
  saveHapticsPreference,
  saveVisualEffectsPreference,
  vibrateForEvent,
} from "./src/feedback.mjs";
import { findCanonicalDeed, ipfsGatewayUrls, normalizeDeedId } from "./src/deed-archive.mjs";
import { createDeedSandboxProfile, createDeedSandboxStage } from "./src/deed-sandbox.mjs";
import { readStandardGamepad } from "./src/gamepad.mjs";

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");
const titleScreen = document.querySelector("#title-screen");
const startButton = document.querySelector("#start-button");
const soundButton = document.querySelector("#sound-button");
const hapticsButton = document.querySelector("#haptics-button");
const fullscreenButton = document.querySelector("#fullscreen-button");
const pauseButton = document.querySelector("#pause-button");
const patienceButton = document.querySelector("#patience-button");
const yieldButton = document.querySelector("#yield-button");
const yieldHint = yieldButton.querySelector("small");
const announcement = document.querySelector("#announcement");
const liveStatus = document.querySelector("#live-status");
const howButton = document.querySelector("#how-button");
const closeHowButton = document.querySelector("#close-how-button");
const aboutButton = document.querySelector("#about-button");
const aboutPanel = document.querySelector("#about-panel");
const closeAboutButton = document.querySelector("#close-about-button");
const closeAboutButtons = [...document.querySelectorAll("[data-close-about]")];
const communityButton = document.querySelector("#community-button");
const communityPanel = document.querySelector("#community-panel");
const closeCommunityButton = document.querySelector("#close-community-button");
const firstCommunityLink = communityPanel.querySelector("a");
const deedWandererButton = document.querySelector("#deed-wanderer-button");
const deedWandererPanel = document.querySelector("#deed-wanderer-panel");
const closeDeedWandererButton = document.querySelector("#close-deed-wanderer-button");
const deedLookupForm = document.querySelector("#deed-lookup-form");
const deedLookupInput = document.querySelector("#deed-lookup-input");
const deedLookupSubmit = document.querySelector("#deed-lookup-submit");
const deedLookupStatus = document.querySelector("#deed-lookup-status");
const deedLookupResult = document.querySelector("#deed-lookup-result");
const deedLookupNumber = document.querySelector("#deed-lookup-number");
const deedLookupImage = document.querySelector("#deed-lookup-image");
const deedLookupVisualFrame = deedLookupImage.parentElement;
const deedLookupVisualStatus = document.querySelector("#deed-lookup-visual-status");
const deedSandboxRecipe = document.querySelector("#deed-sandbox-recipe");
const deedSandboxSeed = document.querySelector("#deed-sandbox-seed");
const enterDeedSandboxButton = document.querySelector("#enter-deed-sandbox-button");
const howPanel = document.querySelector("#how-panel");
const pausePanel = document.querySelector("#pause-panel");
const resumeButton = document.querySelector("#resume-button");
const restartButton = document.querySelector("#restart-button");
const quitButton = document.querySelector("#quit-button");
const audioLevelButtons = [...document.querySelectorAll("[data-audio-channel][data-audio-level]")];
const hapticsSettingButtons = [...document.querySelectorAll("[data-haptics-setting]")];
const visualEffectsButtons = [...document.querySelectorAll("[data-visual-effects]")];
const frame = document.querySelector(".game-frame");
const footerStage = document.querySelector("#footer-stage");
const titleArt = document.querySelector("#title-art");
const titleHeading = document.querySelector("#title-heading");
const stageIntro = document.querySelector("#stage-intro");
const deedCard = document.querySelector("#deed-card");
const deedCardArt = document.querySelector("#deed-card-art");
const deedNumber = document.querySelector("#deed-number");
const deedSelect = document.querySelector("#deed-select");
const deedSelectLabel = document.querySelector("#deed-select-label");
const stageButtons = [...document.querySelectorAll("[data-stage]")];
const mobileControls = document.querySelector(".mobile-controls");
const sandboxModeBadge = document.querySelector("#sandbox-mode-badge");
const lowResolutionArt = window.matchMedia("(max-width: 860px), (pointer: coarse)");
const touchPrimary = window.matchMedia("(pointer: coarse)");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const TILE = 54;
const ORIGIN = { x: 30, y: 144 };
const query = new URLSearchParams(window.location.search);
const testMode = query.get("test") === "1";
let campaignProgress = loadProgress();
const requestedStage = getStage(query.get("deed"));
const latestUnlockedStage = [...STAGE_ORDER].reverse().find(({ id }) => isStageUnlocked(campaignProgress, id)) ?? ACTIVE_STAGE;
let activeStage = requestedStage && (testMode || isStageUnlocked(campaignProgress, requestedStage.id))
  ? requestedStage
  : testMode ? ACTIVE_STAGE : latestUnlockedStage;
let level = activeStage.level;
let game = new TobyworldGame(level);
let deedArchivePromise = null;
let deedVisualRequestId = 0;
let selectedArchiveDeed = null;
let gamepadState = {};
let gamepadDirection = null;
let gamepadConnected = false;
let fullscreenTransitioning = false;
const findGate = () => {
  for (let y = 0; y < level.map.length; y += 1) {
    const x = level.map[y].indexOf("G");
    if (x >= 0) return { x, y };
  }
  return { x: 0, y: 0 };
};
let gateTile = findGate();
const deedArt = new Image();
deedArt.src = preferredImaginedArt(activeStage);
const tobyArt = new Image();
tobyArt.src = "assets/toby.png";
const keeperArt = {
  OG: new Image(),
  Hush: new Image(),
  Satoby: new Image(),
};
keeperArt.OG.src = "assets/keepers/keeper-og.png";
keeperArt.Hush.src = "assets/keepers/keeper-hush.png";
keeperArt.Satoby.src = "assets/keepers/keeper-satoby.png";

let lastTime = performance.now();
let soundEnabled = true;
let hapticsEnabled = loadHapticsPreference();
let audioPreferences = loadAudioPreferences();
const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
let visualEffectsPreference = loadVisualEffectsPreference(undefined, null);
let visualEffects = visualEffectsPreference ?? (reducedMotionMedia.matches ? "reduced" : "full");
const reactiveAudio = new ReactiveAudioEngine();
reactiveAudio.setMix(audioPreferences);
let swipeStart = null;
let screenPulse = 0;
let screenPulseColor = "255,255,255";
let particles = [];
let lastFootstepTile = `${game.player.tile.x},${game.player.tile.y}`;
let reducedMotion = visualEffects === "reduced";

const palette = Object.freeze({
  night: "#071a2b",
  panel: "#0d3042",
  sky: "#8ce6f4",
  leaf: "#6fda72",
  leafDark: "#276b4c",
  path: "#b8dc8b",
  pathLight: "#e0f2b3",
  stone: "#d8d2ad",
  stoneDark: "#766d5c",
  water: "#2f9eb0",
  patience: "#ef4a43",
  patienceDark: "#8e2432",
  gold: "#ffd66e",
  ink: "#f7fff2",
  muted: "#a9cbd0",
  danger: "#fa6b62",
});

function preferredImaginedArt(stage) {
  return lowResolutionArt.matches && stage.art.imaginedLow ? stage.art.imaginedLow : stage.art.imagined;
}

function syncArtworkResolution() {
  const imaginedArt = preferredImaginedArt(activeStage);
  deedArt.src = imaginedArt;
  if (activeStage.id !== ACTIVE_STAGE.id || activeStage.isSandbox) titleArt.src = imaginedArt;
}

function startGame() {
  ensureAudio();
  if (touchPrimary.matches && !fullscreenElement() && !isStandaloneDisplay()) void toggleFullscreen({ announceFallback: false });
  titleScreen.hidden = true;
  howPanel.hidden = true;
  aboutPanel.hidden = true;
  pausePanel.hidden = true;
  game.start();
  lastFootstepTile = `${game.player.tile.x},${game.player.tile.y}`;
  syncPauseButton();
  announce(activeStage.isSandbox ? "GENERATED DOOR OPEN" : "THE LAND REMEMBERS", activeStage.isSandbox ? "Toadaid sandbox · campaign progress is untouched" : "Study the waystones");
  showControlIntroduction();
  canvas.focus();
}

function restartGame() {
  pausePanel.hidden = true;
  game.reset();
  game.start();
  lastFootstepTile = `${game.player.tile.x},${game.player.tile.y}`;
  syncPauseButton();
  announce("BEGIN AGAIN", "Patience is never wasted");
  canvas.focus();
}

function syncStageLanding() {
  const words = activeStage.title.toUpperCase().split(" ");
  const finalWord = words.pop();
  titleHeading.innerHTML = `${words.join(" ")}<br><span>${finalWord}</span>`;
  stageIntro.textContent = activeStage.intro ?? (activeStage.id === "0716"
    ? "Cross the frozen threshold. Tend the Frostveil. Awaken the Sato Core."
    : "Study the paths. Tend what grows. Awaken each Core and cross into the next Lore Land.");
  startButton.textContent = activeStage.isSandbox ? `ENTER SANDBOX #${Number(activeStage.id)}` : `ENTER DEED #${activeStage.id}`;
  document.querySelector(".stage-credit").textContent = activeStage.isSandbox ? "GENERATED SANDBOX · TOADAID ADAPTATION" : "PLAYABLE WORLD · IMAGINED BY TOADAID";
  sandboxModeBadge.hidden = !activeStage.isSandbox;
  titleArt.src = activeStage.id === ACTIVE_STAGE.id && !activeStage.isSandbox ? "assets/tobyworld-trio.png" : preferredImaginedArt(activeStage);
  titleArt.alt = activeStage.id === ACTIVE_STAGE.id && !activeStage.isSandbox
    ? "Taboshi, Toby, and Patience together in Tobyworld"
    : activeStage.isSandbox ? `Canonical archive visual used behind the generated sandbox for Lore Land Deed ${activeStage.id}` : `Imagined playable world for Lore Land Deed ${activeStage.id}`;
  deedCard.setAttribute("aria-label", `Canonical signs for Lore Land Deed ${activeStage.id}`);
  deedCardArt.src = activeStage.art.canonical;
  deedCardArt.alt = `Original canonical artwork for Lore Land Deed ${activeStage.id}`;
  deedNumber.textContent = `#${Number(activeStage.id)}`;
  deedCard.querySelectorAll("[data-sign]").forEach((node) => { node.textContent = level.signs[node.dataset.sign]; });
  stageButtons.forEach((button) => button.setAttribute("aria-pressed", String(!activeStage.isSandbox && button.dataset.stage === activeStage.id)));
  syncStageAccess();
}

function syncStageAccess() {
  const visibleStages = STAGE_ORDER.filter(({ id }) => testMode || isStageUnlocked(campaignProgress, id));
  deedSelectLabel.textContent = testMode ? "SELECT DEED · TEST ACCESS" : "CHOOSE AWAKENED DEED";
  deedSelect.hidden = !testMode && visibleStages.length <= 1;
  stageButtons.forEach((button) => {
    const accessible = testMode || isStageUnlocked(campaignProgress, button.dataset.stage);
    button.hidden = !accessible;
    button.disabled = !accessible;
  });
}

function showControlIntroduction() {
  let alreadyIntroduced = false;
  try { alreadyIntroduced = localStorage.getItem("tobyworld-controls-introduced") === "true"; } catch {}
  if (activeStage.id !== STAGE_ORDER[0].id || alreadyIntroduced) return;
  mobileControls.classList.add("is-learning");
  window.setTimeout(() => {
    mobileControls.classList.remove("is-learning");
    try { localStorage.setItem("tobyworld-controls-introduced", "true"); } catch {}
  }, reducedMotion ? 3500 : 7000);
}

function syncHapticsButton() {
  const supported = typeof navigator.vibrate === "function";
  hapticsButton.hidden = !supported;
  hapticsButton.setAttribute("aria-pressed", String(hapticsEnabled));
  hapticsButton.setAttribute("aria-label", hapticsEnabled ? "Turn haptic feedback off" : "Turn haptic feedback on");
  hapticsSettingButtons.forEach((button) => {
    button.disabled = !supported;
    button.setAttribute("aria-pressed", String(hapticsEnabled === (button.dataset.hapticsSetting === "on")));
  });
}

function setHapticsEnabled(enabled) {
  hapticsEnabled = Boolean(enabled);
  saveHapticsPreference(hapticsEnabled);
  syncHapticsButton();
  if (hapticsEnabled) navigator.vibrate?.(24);
  liveStatus.textContent = hapticsEnabled ? "Haptic feedback on." : "Haptic feedback off.";
}

function syncVisualEffects() {
  reducedMotion = visualEffects === "reduced";
  document.documentElement.classList.toggle("reduced-effects", reducedMotion);
  visualEffectsButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.visualEffects === visualEffects));
  });
  if (reducedMotion) {
    particles = particles.slice(0, 8);
    screenPulse = Math.min(screenPulse, 0.14);
  }
}

function setVisualEffects(level) {
  if (level !== "full" && level !== "reduced") return;
  visualEffects = level;
  visualEffectsPreference = level;
  saveVisualEffectsPreference(level);
  syncVisualEffects();
  liveStatus.textContent = `Visual effects set to ${level}.`;
}

function syncAudioLevelButtons() {
  audioLevelButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(audioPreferences[button.dataset.audioChannel] === button.dataset.audioLevel));
  });
}

function setAudioLevel(channel, level) {
  if (!Object.hasOwn(audioPreferences, channel)) return;
  audioPreferences = reactiveAudio.setMix({ ...audioPreferences, [channel]: level });
  saveAudioPreferences(audioPreferences);
  syncAudioLevelButtons();
  if (soundEnabled && channel === "effects") {
    ensureAudio();
    tone(420, 0.12, "sine", 0.035, 1.3);
  }
  const label = channel === "music" ? "Music and ambience" : "Game effects";
  liveStatus.textContent = `${label} set to ${audioPreferences[channel]}.`;
}

function selectStage(stage, { focus = true, updateUrl = true } = {}) {
  if (!stage || (!stage.isSandbox && !testMode && !isStageUnlocked(campaignProgress, stage.id))) return false;
  activeStage = stage;
  level = activeStage.level;
  game = new TobyworldGame(level);
  reactiveAudio.setStage(activeStage.audioProfileId ?? activeStage.id);
  lastFootstepTile = `${game.player.tile.x},${game.player.tile.y}`;
  gateTile = findGate();
  deedArt.src = preferredImaginedArt(activeStage);
  frame.setAttribute("aria-label", `Lore Land Deed ${activeStage.id} game`);
  canvas.setAttribute("aria-label", `A maze on Lore Land Deed ${activeStage.id}. Use arrow keys or WASD to guide Toby. Press Q for Yield and hold Space for Patience.`);
  if (footerStage) footerStage.textContent = `DEED #${activeStage.id} · FIVE SIGNS · ONE LORE`;
  particles = [];
  syncStageLanding();
  titleScreen.hidden = false;
  liveStatus.textContent = `Deed #${activeStage.id}: ${activeStage.title}. Select Enter to begin.`;
  if (updateUrl && window.history?.replaceState) {
    const url = new URL(window.location.href);
    url.searchParams.set("deed", String(Number(activeStage.id)));
    if (activeStage.isSandbox) url.searchParams.set("sandbox", "1");
    else url.searchParams.delete("sandbox");
    url.searchParams.delete("lookup");
    window.history.replaceState({}, "", url);
  }
  if (focus) startButton.focus();
  return true;
}

function advanceOrRestart() {
  if (game.phase === "lost") { restartGame(); return; }
  if (activeStage.isSandbox) { restartGame(); return; }
  const nextStage = getNextStage(activeStage.id);
  if (!nextStage) { selectStage(STAGE_ORDER[0]); return; }
  selectStage(nextStage);
  tone(392, 0.5, "sine", 0.05, 1.5);
}

function togglePause() {
  const paused = game.togglePause();
  syncPauseButton();
  if (game.phase === "playing") announce(paused ? "STILLNESS" : "THE PATH CONTINUES", paused ? "Game paused" : "Game resumed");
}

function syncPauseButton() {
  const paused = game.phase === "playing" && game.paused;
  pauseButton.setAttribute("aria-pressed", String(paused));
  pauseButton.setAttribute("aria-label", paused ? "Resume game" : "Pause game");
}

function fullscreenElement() {
  return document.fullscreenElement ?? document.webkitFullscreenElement ?? null;
}

function syncFullscreenButton() {
  const active = Boolean(fullscreenElement());
  fullscreenButton.setAttribute("aria-pressed", String(active));
  fullscreenButton.setAttribute("aria-label", active ? "Exit fullscreen" : "Enter fullscreen");
}

function isStandaloneDisplay() {
  return window.matchMedia("(display-mode: standalone), (display-mode: fullscreen)").matches || window.navigator.standalone === true;
}

async function toggleFullscreen({ announceFallback = true } = {}) {
  fullscreenTransitioning = true;
  try {
    if (fullscreenElement()) {
      const exit = document.exitFullscreen ?? document.webkitExitFullscreen;
      if (exit) await exit.call(document);
      return;
    }

    const root = document.documentElement;
    const request = root.requestFullscreen ?? root.webkitRequestFullscreen;
    if (!request) {
      if (!announceFallback) return;
      const detail = isStandaloneDisplay()
        ? "Tobyworld is already running without the browser bar"
        : "Use your browser menu to Add to Home screen, then open Tobyworld from its icon";
      announce("FULLSCREEN TIP", detail);
      liveStatus.textContent = detail;
      return;
    }
    await request.call(root, { navigationUI: "hide" });
  } catch {
    if (!announceFallback) return;
    const detail = "Fullscreen was blocked. Add Tobyworld to your Home screen to hide the browser bar.";
    announce("FULLSCREEN TIP", detail);
    liveStatus.textContent = detail;
  } finally {
    window.setTimeout(() => { fullscreenTransitioning = false; }, 500);
  }
}

function openPauseMenu() {
  if (game.phase !== "playing") return;
  game.releaseDirection();
  game.setPatience(false);
  if (!game.paused) game.togglePause();
  syncPauseButton();
  pausePanel.hidden = false;
  liveStatus.textContent = "Game paused. Resume, restart the deed, or quit to the title screen.";
  resumeButton.focus();
}

function resumeFromMenu() {
  pausePanel.hidden = true;
  if (game.phase === "playing" && game.paused) game.togglePause();
  syncPauseButton();
  announce("THE PATH CONTINUES", "Game resumed");
  canvas.focus();
}

function quitToTitle() {
  pausePanel.hidden = true;
  game.releaseDirection();
  game.setPatience(false);
  game.reset();
  syncPauseButton();
  announcement.classList.remove("is-visible");
  titleScreen.hidden = false;
  liveStatus.textContent = `Returned to the title screen. Deed #${activeStage.id}: ${activeStage.title} is selected.`;
  startButton.focus();
}

function announce(title, detail = "") {
  announcement.classList.remove("is-visible");
  announcement.innerHTML = `${escapeHTML(title)}${detail ? `<small>${escapeHTML(detail)}</small>` : ""}`;
  void announcement.offsetWidth;
  announcement.classList.add("is-visible");
  liveStatus.textContent = detail ? `${title}. ${detail}` : title;
}

function pulseScreen(amount, color = "255,255,255") {
  screenPulse = reducedMotion ? Math.min(amount, 0.14) : amount;
  screenPulseColor = color;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function processEvents() {
  for (const event of game.consumeEvents()) {
    switch (event.type) {
      case "yield":
        announce("TABOSHI YIELDS", "The living gate opens");
        tone(330, 0.16, "sine", 0.045, 1.5);
        spawnBurst(gateTile.x, gateTile.y, palette.leaf, 22);
        break;
      case "yield_waits":
        announce("FIND THE LIVING GATE", event.detail.hint);
        tone(180, 0.12, "sine", 0.025, 0.82);
        break;
      case "tending":
        liveStatus.textContent = "Hold Patience and remain still to tend this sprout.";
        break;
      case "light":
        reactiveAudio.light(event.detail.collected);
        break;
      case "tended":
        vibrateForEvent(event.type, hapticsEnabled);
        announce("LIFE REMEMBERS", `${event.detail.current} of ${event.detail.total} sprouts tended`);
        tone(440, 0.22, "sine", 0.055, 1.45);
        spawnBurst(game.player.tile.x, game.player.tile.y, "#b6ff8c", 30);
        break;
      case "keeper_near":
        announce(`${event.detail.name.toUpperCase()} WHISPERS`, `“${getKeeperWhisper(event.detail.name, activeStage.id)}” · Toadaid adaptation`);
        tone(245, 0.18, "sine", 0.035, 1.2);
        break;
      case "keeper_listening":
        liveStatus.textContent = `Listening to ${event.detail.name}. Keep holding Patience.`;
        break;
      case "keeper_awakened":
        vibrateForEvent(event.type, hapticsEnabled);
        if (event.detail.ability === "quiet") {
          announce("HUSH QUIETS THE LAND", level.submergedRevealSeconds
            ? `Threats rest for ${level.keeperQuietSeconds} seconds · stop completely and hold Patience`
            : "Every threat rests for seven seconds");
        } else if (event.detail.ability === "ward") {
          announce("OG HOLDS THE HORIZON", "Courage restored · sky ward for ten seconds");
        } else if (event.detail.ability === "welcome") {
          announce("SATOBY WELCOMES TOBY", "Every Pond ring opens · belonging is not ownership");
        } else {
          announce("SATOBY GUIDES", "Golden light reveals the next tending");
        }
        tone(event.detail.ability === "quiet" ? 220 : event.detail.ability === "ward" ? 392 : event.detail.ability === "welcome" ? 494 : 560, 0.48, "sine", 0.055, 1.6);
        spawnBurst(level.keeper.x, level.keeper.y, event.detail.ability === "quiet" ? "#d6dce2" : event.detail.ability === "ward" ? "#7bdcff" : event.detail.ability === "welcome" ? "#9df4e5" : palette.gold, 42);
        break;
      case "relic":
        vibrateForEvent(event.type, hapticsEnabled);
        announce(`${event.detail.name.toUpperCase()} FOUND`, event.detail.name === "Seed Vessel"
          ? "The Vessel carries the next beginning"
          : event.detail.name === "Ancient Rune"
            ? "An old promise wakes beneath the path"
            : event.detail.name === "Kiribako"
              ? "A sleeping memory opens"
              : event.detail.name === "Gate Key"
                ? (level.pondThresholdSeconds ? "The threshold opens, but the Pond is never claimed" : "The Meadow remembers every locked way")
                : event.detail.name === "Lore Map"
                  ? "Every unfinished path can now be seen"
                : "The Compass points toward the Core");
        tone(520, 0.32, "triangle", 0.06, 1.55);
        spawnBurst(level.relic.x, level.relic.y, palette.gold, 36);
        break;
      case "rune_cooled":
        announce("THE OATH HOLDS", "The Ancient Rune cools every ember path");
        tone(392, 0.45, "sine", 0.055, 1.8);
        spawnBurst(level.relic.x, level.relic.y, "#8cecff", 48);
        break;
      case "rune_calmed":
        announce("THE RUNE REMEMBERS", "Every threat rests for eight seconds");
        tone(392, 0.45, "sine", 0.05, 1.55);
        break;
      case "memory_echo":
        announce("MEMORY ANSWERS", `${event.detail.current} of ${event.detail.total} echoes restored`);
        tone(466, 0.28, "sine", 0.05, 1.35);
        break;
      case "memory_reset":
        announce("THE MEMORY FADES", event.detail.current
          ? `First echo remembered · seek echo 2 of ${event.detail.total}`
          : "Return to echo 1 and follow the numbered trail");
        tone(196, 0.3, "triangle", 0.045, 0.68);
        break;
      case "memory_complete":
        announce("THE KIRIBAKO REMEMBERS", "All three echoes return to Mossmere");
        tone(523, 0.5, "sine", 0.06, 1.65);
        spawnBurst(game.player.tile.x, game.player.tile.y, "#c8b5ff", 52);
        break;
      case "key_unlocked":
        announce(level.pondThresholdSeconds ? "THE POND KEY TURNS" : level.submergedRevealSeconds ? "THE DROWNED GATES OPEN" : "THE MEADOW GATES OPEN", level.pondThresholdSeconds
          ? "Two return doors open · the threshold remains a welcome"
          : level.submergedRevealSeconds
          ? "Stillwater releases its hidden doors"
          : "Four permanent shortcuts answer the Gate Key");
        tone(587, 0.48, "triangle", 0.06, 1.7);
        spawnBurst(level.relic.x, level.relic.y, "#ffe48a", 52);
        break;
      case "submerged_revealed":
        announce("THE WATER REMEMBERS", `Submerged paths revealed for ${event.detail.seconds} seconds`);
        tone(392, 0.42, "sine", 0.05, 1.5);
        break;
      case "pond_threshold_open":
        announce("THE POND BREATHES OPEN", `${event.detail.seconds} seconds · cross without claiming`);
        tone(440, 0.42, "sine", 0.05, 1.55);
        break;
      case "convergence_listening":
        liveStatus.textContent = "Hold Patience and remain still. This Door Echo is listening.";
        break;
      case "convergence_awakened":
        announce("A DOOR ANSWERS", `${event.detail.current} of ${event.detail.total} acts remembered`);
        tone(523, 0.38, "sine", 0.055, 1.5);
        spawnBurst(game.player.tile.x, game.player.tile.y, "#fff0a6", 42);
        break;
      case "convergence_complete":
        announce("EVERY DOOR REMAINS OPEN", "The three acts answer together · return to the Patience Core");
        tone(659, 0.62, "triangle", 0.06, 1.7);
        spawnBurst(game.player.tile.x, game.player.tile.y, "#baffdc", 64);
        break;
      case "map_revealed":
        announce("THE FROST IS CHARTED", "The Lore Map now guides every unfinished path");
        tone(659, 0.5, "sine", 0.055, 1.55);
        spawnBurst(level.relic.x, level.relic.y, "#b9edff", 54);
        break;
      case "taboshi_harvest":
        vibrateForEvent(event.type, hapticsEnabled);
        announce("TABOSHI HARVEST", `${event.detail.seconds} seconds · ghosts can be eaten · Toadaid adaptation`);
        reactiveAudio.harvest();
        pulseScreen(0.3, "203,142,255");
        spawnBurst(level.bloom.x, level.bloom.y, "#d9b3ff", 64);
        break;
      case "shard_attuned":
        announce("SHARD ATTUNED", `${event.detail.current} of ${event.detail.total} fragments answering`);
        tone(466, 0.28, "triangle", 0.045, 1.35);
        break;
      case "shards_complete":
        announce("THE SHARD ANSWERS", "All three fragments are attuned");
        tone(622, 0.48, "triangle", 0.055, 1.55);
        break;
      case "seed_planting":
        liveStatus.textContent = "Hold Patience at the Core to plant the Seed Vessel.";
        break;
      case "seed_planted":
        announce("THE SEED TAKES ROOT", "The carried beginning returns to the Core");
        tone(523, 0.5, "sine", 0.055, 1.6);
        break;
      case "core_listening":
        liveStatus.textContent = "Remain completely still and hold Patience until the Core answers.";
        break;
      case "core_awakened":
        announce("PATIENCE ANSWERS", "The Core wakes through stillness");
        tone(587, 0.55, "sine", 0.055, 1.65);
        break;
      case "ghost_eaten":
        vibrateForEvent(event.type, hapticsEnabled);
        announce("TABOSHI FEAST", "Ghost returned far across the land");
        tone(610, 0.16, "triangle", 0.04, 0.72);
        pulseScreen(0.22, "203,142,255");
        spawnBurst(game.player.tile.x, game.player.tile.y, "#f1d2ff", 22);
        break;
      case "hurt":
        vibrateForEvent(event.type, hapticsEnabled);
        announce("BREATHE", `${event.detail.hearts} courage remaining`);
        tone(105, 0.23, "sawtooth", 0.06, 0.55);
        pulseScreen(0.36, "255,92,82");
        break;
      case "ember_burn":
        vibrateForEvent(event.type, hapticsEnabled);
        announce("THE EMBER SURGES", `${event.detail.hearts} courage remaining · cross on the cool tide`);
        tone(82, 0.3, "sawtooth", 0.07, 1.7);
        pulseScreen(0.42, "255,92,82");
        break;
      case "core_waits": {
        const detail = event.detail;
        const missing = [];
        if (detail.lights < detail.lightGoal) missing.push(`${detail.lightGoal - detail.lights} lights`);
        if (!detail.relic) missing.push(`the ${level.signs.Relic}`);
        if (detail.tended < detail.tendGoal) missing.push(`${detail.tendGoal - detail.tended} sprouts`);
        if (detail.memory < detail.memoryGoal) missing.push(`${detail.memoryGoal - detail.memory} memory echoes`);
        if (detail.convergence < detail.convergenceGoal) missing.push(`${detail.convergenceGoal - detail.convergence} Door Echoes`);
        if (detail.harvested < detail.harvestGoal) missing.push("the Taboshi Harvest");
        if (detail.eclipseSides < detail.eclipseGoal) missing.push(`${detail.eclipseGoal - detail.eclipseSides} side of the Eclipse balance`);
        if (detail.shards < detail.shardGoal) missing.push(`${detail.shardGoal - detail.shards} Shard fragments`);
        if (detail.seedPlanted < detail.seedGoal) missing.push("planting the Seed Vessel with Patience");
        if (detail.coreAwakened < detail.coreRitualGoal) missing.push("the final Patience ritual");
        if (detail.crossedFarSide < detail.crossingGoal) missing.push("crossing to the far side and returning");
        announce("THE CORE WAITS", missing.join(" · "));
        tone(155, 0.16, "sine", 0.03, 0.78);
        break;
      }
      case "won": {
        vibrateForEvent(event.type, hapticsEnabled);
        const nextStage = activeStage.isSandbox ? null : getNextStage(activeStage.id);
        const unlockedNewStage = !activeStage.isSandbox && !testMode && nextStage && !isStageUnlocked(campaignProgress, nextStage.id);
        if (!activeStage.isSandbox) {
          if (!testMode) {
            campaignProgress = recordStageCompletion(campaignProgress, activeStage.id, event.detail.score);
            saveProgress(campaignProgress);
            syncStageAccess();
          }
        }
        announce(activeStage.isSandbox ? "SANDBOX TENDED" : !nextStage ? "THE POND REMEMBERS" : "THE LAND AWAKENS", activeStage.isSandbox
          ? `Generated Deed #${Number(activeStage.id)} complete · campaign progress unchanged · Score ${event.detail.score}`
          : unlockedNewStage
          ? `Deed #${nextStage.id} awakened · Score ${event.detail.score}`
          : !nextStage ? `Twelve doors awakened · 2,869 deeds remembered · Score ${event.detail.score}` : `Deed #${activeStage.id} tended · Score ${event.detail.score}`);
        victoryChord();
        break;
      }
      case "lost":
        announce("NOW BREATHE", event.detail.reason);
        tone(130, 0.55, "triangle", 0.05, 0.5);
        break;
      default:
        break;
    }
  }
}

function update(dt) {
  game.update(dt);
  processEvents();
  const currentFootstepTile = `${game.player.tile.x},${game.player.tile.y}`;
  if (game.phase === "playing" && !game.paused && currentFootstepTile !== lastFootstepTile) reactiveAudio.footstep();
  lastFootstepTile = currentFootstepTile;
  const playerPosition = game.actorPosition(game.player);
  const danger = game.threats.some((threat) => {
    if (threat.stunned > 0) return false;
    const threatPosition = game.actorPosition(threat);
    return Math.hypot(threatPosition.x - playerPosition.x, threatPosition.y - playerPosition.y) < 2.75;
  });
  reactiveAudio.update({
    playing: game.phase === "playing",
    paused: game.paused,
    patience: game.patienceHeld,
    danger: danger || game.isEmberSurging(),
  });
  const yieldReady = game.phase === "playing" && game.isNearYieldGate() && game.yieldCharges > 0 && game.yieldTime <= 0;
  yieldButton.classList.toggle("is-ready", yieldReady);
  yieldButton.setAttribute("aria-label", yieldReady ? "Use Yield to open the living gate" : `Yield works beside ${level.gateHint}`);
  yieldHint.textContent = yieldReady ? "OPEN THE GATE" : level.gateHint.toUpperCase();
  screenPulse = Math.max(0, screenPulse - dt);
  particles.forEach((particle) => {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vy += 25 * dt;
  });
  particles = particles.filter((particle) => particle.life > 0);
}

function draw(now) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawBackdrop(now);
  drawLand(now);
  drawHUD();
  drawParticles();
  if (game.paused) drawOverlay("STILLNESS", pausePanel.hidden
    ? (touchPrimary.matches ? "Tap the land or ▶ to continue" : "Press P to continue · Esc for menu")
    : "Choose how the journey continues");
  if (game.phase === "won") {
    const nextStage = activeStage.isSandbox ? null : getNextStage(activeStage.id);
    drawEndOverlay(activeStage.isSandbox ? "SANDBOX TENDED" : nextStage ? "THE LAND AWAKENS" : "THE POND REMEMBERS", activeStage.isSandbox
      ? "Campaign progress unchanged · tap or press Enter to tend this generated door again"
      : nextStage ? `Tap or press Enter to cross into Deed #${nextStage.id}` : "Twelve doors awakened · every deed remains a door · tap to journey again");
  }
  if (game.phase === "lost") drawEndOverlay("NOW BREATHE", "Tap the land or press Enter to begin again");
  if (screenPulse > 0) {
    ctx.fillStyle = `rgba(${screenPulseColor},${screenPulse * 0.48})`;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
}

function drawBackdrop(now) {
  if (deedArt.complete && deedArt.naturalWidth) {
    const scale = Math.max(WIDTH / deedArt.naturalWidth, HEIGHT / deedArt.naturalHeight);
    const width = deedArt.naturalWidth * scale;
    const height = deedArt.naturalHeight * scale;
    ctx.save();
    ctx.globalAlpha = activeStage.theme.backdropOpacity;
    ctx.filter = `blur(${activeStage.theme.backdropBlur}px) saturate(${activeStage.theme.backdropSaturation})`;
    ctx.drawImage(deedArt, (WIDTH - width) / 2, (HEIGHT - height) / 2, width, height);
    ctx.restore();
  } else {
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, "#96e7dc");
    gradient.addColorStop(0.52, "#57999a");
    gradient.addColorStop(1, "#15364a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
  const shade = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  shade.addColorStop(0, "rgba(5,26,39,0.07)");
  shade.addColorStop(0.72, "rgba(5,26,39,0.24)");
  shade.addColorStop(1, "rgba(5,26,39,0.62)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "rgba(220,255,239,0.5)";
  for (let index = 0; index < 16; index += 1) {
    const x = ((index * 137 + now * 0.012) % (WIDTH + 100)) - 50;
    const y = 105 + (index * 79) % 560 + Math.sin(now * 0.001 + index) * 14;
    ctx.beginPath();
    ctx.ellipse(x, y, 9, 4, index, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLand(now) {
  ctx.save();
  roundedRect(ORIGIN.x - 28, ORIGIN.y - 30, level.map[0].length * TILE + 56, level.map.length * TILE + 58, 44);
  const landGradient = ctx.createLinearGradient(ORIGIN.x, ORIGIN.y, ORIGIN.x, ORIGIN.y + level.map.length * TILE);
  landGradient.addColorStop(0, activeStage.theme.landTop);
  landGradient.addColorStop(1, activeStage.theme.landBottom);
  ctx.fillStyle = landGradient;
  ctx.fill();
  ctx.strokeStyle = activeStage.theme.landBorder;
  ctx.lineWidth = 3;
  ctx.stroke();

  for (let y = 0; y < level.map.length; y += 1) {
    for (let x = 0; x < level.map[y].length; x += 1) {
      const cell = level.map[y][x];
      if (cell === "#") {
        drawFoliageCell(x, y, now);
        continue;
      }
      drawPathCell(x, y, cell, now);
    }
  }

  drawGuidance(now);
  drawObjectives(now);
  drawThreats(now);
  drawToby(now);
  ctx.restore();
}

function drawPathCell(x, y, cell, now) {
  const px = ORIGIN.x + x * TILE;
  const py = ORIGIN.y + y * TILE;
  const frostveil = activeStage.theme.terrain === "frostveil" || activeStage.theme.terrain === "mapfrost";
  const stillwater = activeStage.theme.terrain === "stillwater" || activeStage.theme.terrain === "veilwater";
  const cloudwake = activeStage.theme.terrain === "cloudwake";
  const sporegrove = activeStage.theme.terrain === "sporegrove";
  const emberreach = activeStage.theme.terrain === "emberreach";
  const mossmere = activeStage.theme.terrain === "mossmere";
  const meadow = activeStage.theme.terrain === "meadow";
  const pond = activeStage.theme.terrain === "pond" || activeStage.theme.terrain === "pondmemory";
  ctx.fillStyle = cell === "G"
    ? (frostveil ? "#6774b9" : stillwater ? "#528f8a" : cloudwake ? "#8f79ad" : sporegrove ? "#87683e" : emberreach ? "#875040" : mossmere ? "#4d6f64" : meadow ? "#758546" : pond ? "#4d8e91" : "#4a8b5a")
    : (frostveil ? "rgba(205, 237, 255, 0.82)" : stillwater ? "rgba(219, 203, 151, 0.9)" : cloudwake ? "rgba(246, 205, 116, 0.9)" : sporegrove ? "rgba(224, 192, 124, 0.9)" : emberreach ? "rgba(226, 168, 105, 0.9)" : mossmere ? "rgba(183, 205, 172, 0.88)" : meadow ? "rgba(235, 215, 137, 0.9)" : pond ? "rgba(235, 222, 163, 0.92)" : palette.path);
  roundedRect(px + 2, py + 2, TILE - 4, TILE - 4, 13);
  ctx.fill();
  ctx.fillStyle = cell === "G" ? (frostveil ? "rgba(57,49,126,0.78)" : stillwater ? "rgba(27,91,90,0.82)" : cloudwake ? "rgba(73,57,111,0.82)" : sporegrove ? "rgba(74,66,42,0.82)" : emberreach ? "rgba(83,44,43,0.86)" : mossmere ? "rgba(39,62,63,0.86)" : meadow ? "rgba(75,91,43,0.84)" : "rgba(29,87,49,0.8)") : (frostveil ? "rgba(255,255,255,0.5)" : stillwater ? "rgba(255,239,183,0.44)" : cloudwake ? "rgba(255,244,196,0.55)" : sporegrove ? "rgba(255,226,151,0.48)" : emberreach ? "rgba(255,213,153,0.5)" : mossmere ? "rgba(225,229,202,0.45)" : meadow ? "rgba(255,239,174,0.5)" : "rgba(246,255,208,0.38)");
  ctx.fillRect(px + 11, py + 9, 17, 5);
  ctx.strokeStyle = frostveil ? "rgba(91,103,181,0.35)" : stillwater ? "rgba(35,104,102,0.42)" : cloudwake ? "rgba(145,91,51,0.4)" : sporegrove ? "rgba(101,79,45,0.45)" : emberreach ? "rgba(115,55,42,0.5)" : mossmere ? "rgba(61,92,74,0.46)" : meadow ? "rgba(111,98,48,0.46)" : "rgba(52,100,63,0.22)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if ((x + y) % 3 === 0 && cell !== "G" && cell !== "S" && cell !== "H" && cell !== "M" && cell !== "D" && cell !== "U" && cell !== "P" && cell !== "A") {
    ctx.fillStyle = frostveil ? "#b8ddf1" : stillwater ? "#e7d49e" : cloudwake ? "#f4dfb4" : sporegrove ? "#b99a62" : emberreach ? "#a56b4e" : mossmere ? "#84977b" : meadow ? "#bda76a" : palette.stone;
    ctx.beginPath();
    ctx.ellipse(px + 25, py + 27, 13, 8, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = frostveil ? "#718fbd" : stillwater ? "#7c7560" : cloudwake ? "#a47752" : sporegrove ? "#6e5a3f" : emberreach ? "#633d38" : mossmere ? "#506258" : meadow ? "#716342" : palette.stoneDark;
    ctx.stroke();
  }

  if (cell === "G") drawYieldGate(px + TILE / 2, py + TILE / 2);
  if (cell === "S") drawSporePath(px + TILE / 2, py + TILE / 2);
  if (cell === "H") drawEmberPath(px + TILE / 2, py + TILE / 2);
  if (cell === "D") drawMeadowDoor(px + TILE / 2, py + TILE / 2);
  if (cell === "U") drawSubmergedPath(px + TILE / 2, py + TILE / 2, now);
  if (cell === "P") drawPondThreshold(px + TILE / 2, py + TILE / 2, now);
  if (cell === "A") drawDoorEcho({ x, y }, now);
  const key = `${x},${y}`;
  if (game.lights.has(key) && (cell !== "U" || game.areSubmergedPathsRevealed()) && (cell !== "P" || game.arePondThresholdsOpen())) drawLoreLight(px + TILE / 2, py + TILE / 2);
}

function drawDoorEcho(tile, now) {
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  const key = `${tile.x},${tile.y}`;
  const awake = game.convergenceAwakened.has(key);
  const ready = game.relicFound;
  const listening = game.convergenceKey === key;
  const pulse = reducedMotion ? 1 : 1 + Math.sin(now * 0.006 + tile.x) * 0.08;
  ctx.save(); ctx.translate(x, y); ctx.scale(pulse, pulse);
  ctx.shadowColor = awake ? "#baffdc" : ready ? "#ffe48a" : "transparent";
  ctx.shadowBlur = awake || ready ? 18 : 0;
  ctx.fillStyle = awake ? "#3f9b79" : ready ? "#806a3f" : "#4b6662";
  ctx.beginPath(); ctx.moveTo(0, -21); ctx.lineTo(18, -8); ctx.lineTo(14, 19); ctx.lineTo(-14, 19); ctx.lineTo(-18, -8); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = awake ? "#eaffd9" : ready ? "#ffe7a0" : "#9db0aa"; ctx.lineWidth = 3; ctx.stroke();
  drawText(awake ? "✓" : ready ? "∞" : "·", 0, 6, 18, "#ffffff", "center", 950);
  if (listening) {
    ctx.strokeStyle = "#fff5b5"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 29, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, game.convergenceProgress / (level.convergenceSeconds ?? 0.85))); ctx.stroke();
  }
  ctx.restore();
}

function drawPondThreshold(x, y, now) {
  const open = game.arePondThresholdsOpen();
  const welcomed = game.pondWelcomed;
  const pulse = reducedMotion ? 0 : Math.sin(now * 0.005) * 2;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = open ? "rgba(85, 194, 190, 0.38)" : "rgba(24, 91, 118, 0.92)";
  ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = welcomed ? "#fff0a6" : open ? "#b9fff1" : "#84cfe5";
  ctx.lineWidth = open ? 4 : 3;
  if (!open) ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.arc(0, 0, 17 + pulse, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  if (open) {
    ctx.fillStyle = welcomed ? "#ffe48a" : "#d8fff6";
    for (const offset of [-12, 0, 12]) { ctx.beginPath(); ctx.ellipse(offset, offset === 0 ? -3 : 4, 7, 4, -0.2, 0, Math.PI * 2); ctx.fill(); }
  } else {
    ctx.strokeStyle = "#d9f7ff"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-7, -3); ctx.lineTo(0, 5); ctx.lineTo(7, -3); ctx.stroke();
  }
  ctx.restore();
}

function drawSubmergedPath(x, y, now) {
  const revealed = game.areSubmergedPathsRevealed();
  const pulse = reducedMotion ? 0 : Math.sin(now * 0.006) * 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = revealed ? "rgba(87, 190, 160, 0.42)" : "rgba(15, 89, 94, 0.92)";
  roundedRect(-25, -25, 50, 50, 12); ctx.fill();
  ctx.strokeStyle = revealed ? "#e8ffc9" : "rgba(166, 237, 220, 0.58)";
  ctx.lineWidth = revealed ? 3 : 2;
  if (!revealed) ctx.setLineDash([4, 5]);
  ctx.beginPath(); ctx.ellipse(0, 1, 18 + pulse, 8, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
  if (revealed) {
    ctx.fillStyle = "#d9e0b0";
    for (const offset of [-14, 0, 14]) {
      ctx.beginPath(); ctx.ellipse(offset, offset % 2 ? 4 : -2, 8, 5, -0.25, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#627d69"; ctx.stroke();
    }
  } else {
    ctx.fillStyle = "rgba(224, 255, 235, 0.72)";
    for (const offset of [-8, 0, 8]) { ctx.beginPath(); ctx.arc(offset, 1, 2, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.restore();
}

function drawMeadowDoor(x, y) {
  const open = game.relicFound;
  ctx.save(); ctx.translate(x, y); ctx.globalAlpha = open ? 0.45 : 1;
  ctx.fillStyle = open ? "#9bd17b" : "#6c6754";
  roundedRect(-21, -22, 42, 44, 8); ctx.fill();
  ctx.strokeStyle = open ? "#e4ffc7" : "#e7ca78"; ctx.lineWidth = 3; ctx.stroke();
  if (open) {
    ctx.strokeStyle = "#f4ffdd"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-2, 8); ctx.lineTo(12, -9); ctx.stroke();
  } else {
    ctx.fillStyle = "#f2cf6e"; roundedRect(-8, -2, 16, 14, 4); ctx.fill();
    ctx.strokeStyle = "#f2cf6e"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, -4, 7, Math.PI, 0); ctx.stroke();
  }
  ctx.restore();
}

function drawEmberPath(x, y) {
  const surging = game.isEmberSurging();
  const runeCooled = game.relicFound;
  ctx.save();
  ctx.translate(x, y);
  if (runeCooled) {
    ctx.strokeStyle = "#8cecff"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-15, 10); ctx.lineTo(-5, -11); ctx.lineTo(4, 7); ctx.lineTo(15, -12); ctx.stroke();
    ctx.fillStyle = "#d5f8ff"; ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
  } else if (surging) {
    ctx.shadowColor = "#ff5a36"; ctx.shadowBlur = 18;
    ctx.fillStyle = "#ff6138";
    ctx.beginPath(); ctx.moveTo(-18, 17); ctx.quadraticCurveTo(-19, -3, -7, -17); ctx.quadraticCurveTo(-7, 2, 1, 6); ctx.quadraticCurveTo(5, -12, 16, -21); ctx.quadraticCurveTo(19, 3, 14, 17); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#ffe083";
    ctx.beginPath(); ctx.moveTo(-7, 16); ctx.quadraticCurveTo(-6, 2, 2, -7); ctx.quadraticCurveTo(9, 5, 7, 16); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#3e2528"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-16, 16); ctx.lineTo(16, -16); ctx.stroke();
  } else {
    ctx.fillStyle = "#4a4144";
    ctx.beginPath(); ctx.moveTo(-19, 13); ctx.lineTo(-10, -12); ctx.lineTo(1, -4); ctx.lineTo(11, -17); ctx.lineTo(19, 13); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#f4ad67"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-14, 8); ctx.quadraticCurveTo(0, 14, 14, 7); ctx.stroke();
  }
  ctx.restore();
}

function drawSporePath(x, y) {
  const open = game.areSporesOpen();
  ctx.save();
  ctx.translate(x, y);
  if (open) {
    ctx.strokeStyle = "#fff0a6";
    ctx.lineWidth = 4;
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.arc(0, 0, 17, 0, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#d97943";
    for (const offset of [-13, 13]) {
      ctx.beginPath(); ctx.ellipse(offset, 7, 7, 4, 0, Math.PI, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f3d6a0"; ctx.fillRect(offset - 2, 7, 4, 8); ctx.fillStyle = "#d97943";
    }
  } else {
    ctx.fillStyle = "rgba(53, 45, 37, 0.5)";
    ctx.beginPath(); ctx.arc(0, 0, 23, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#b94f3f";
    ctx.beginPath(); ctx.ellipse(0, -4, 23, 13, 0, Math.PI, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#ffe2a1"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-16, -6); ctx.quadraticCurveTo(0, 7, 16, -6); ctx.stroke();
    ctx.fillStyle = "#e8c891"; roundedRect(-6, -4, 12, 27, 5); ctx.fill();
    ctx.strokeStyle = "#402f27"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-15, 14); ctx.lineTo(15, -14); ctx.moveTo(-15, -14); ctx.lineTo(15, 14); ctx.stroke();
  }
  ctx.restore();
}

function drawFoliageCell(x, y, now) {
  if (x === 0 || y === 0 || x === level.map[0].length - 1 || y === level.map.length - 1) return;
  const px = ORIGIN.x + x * TILE;
  const py = ORIGIN.y + y * TILE;
  const sway = reducedMotion ? 0 : Math.sin(now * 0.0014 + x * 0.9 + y) * 2;
  if (activeStage.theme.terrain === "frostveil" || activeStage.theme.terrain === "mapfrost") {
    ctx.fillStyle = (x + y) % 2 ? "rgba(87,105,175,0.78)" : "rgba(111,136,196,0.78)";
    ctx.beginPath();
    ctx.moveTo(px + 4, py + 46); ctx.lineTo(px + 17 + sway, py + 13); ctx.lineTo(px + 27, py + 45); ctx.closePath(); ctx.fill();
    ctx.fillStyle = (x * 3 + y) % 4 === 0 ? "rgba(180,239,255,0.92)" : "rgba(220,244,255,0.76)";
    ctx.beginPath();
    ctx.moveTo(px + 18, py + 44); ctx.lineTo(px + 34 - sway, py + 5); ctx.lineTo(px + 45, py + 44); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(242,252,255,0.72)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px + 34 - sway, py + 5); ctx.lineTo(px + 34, py + 43); ctx.stroke();
    return;
  }
  if (activeStage.theme.terrain === "stillwater" || activeStage.theme.terrain === "veilwater" || activeStage.theme.terrain === "pond" || activeStage.theme.terrain === "pondmemory") {
    const ripple = reducedMotion ? 0 : Math.sin(now * 0.002 + x + y) * 2;
    ctx.fillStyle = (x + y) % 2 ? "rgba(31, 105, 105, 0.82)" : "rgba(42, 124, 116, 0.82)";
    roundedRect(px + 2, py + 2, TILE - 4, TILE - 4, 14);
    ctx.fill();
    ctx.strokeStyle = "rgba(183, 244, 221, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(px + 27, py + 28, 16 + ripple, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
    if ((x * 3 + y) % 4 === 0) {
      ctx.fillStyle = "#6eb96d";
      ctx.beginPath(); ctx.ellipse(px + 29, py + 27, 12, 7, -0.25, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffd3dd";
      ctx.beginPath(); ctx.arc(px + 25, py + 24, 4, 0, Math.PI * 2); ctx.arc(px + 32, py + 24, 4, 0, Math.PI * 2); ctx.arc(px + 28, py + 30, 4, 0, Math.PI * 2); ctx.fill();
    }
    return;
  }
  if (activeStage.theme.terrain === "cloudwake") {
    const drift = reducedMotion ? 0 : Math.sin(now * 0.0012 + x * 0.7 + y) * 3;
    ctx.fillStyle = (x + y) % 2 ? "rgba(229, 241, 255, 0.84)" : "rgba(255, 248, 224, 0.88)";
    ctx.beginPath();
    ctx.arc(px + 15 + drift, py + 31, 13, 0, Math.PI * 2);
    ctx.arc(px + 28 + drift, py + 22, 18, 0, Math.PI * 2);
    ctx.arc(px + 42 + drift, py + 32, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(145, 186, 218, 0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px + 8, py + 43); ctx.quadraticCurveTo(px + 28, py + 49, px + 48, py + 42); ctx.stroke();
    if ((x * 3 + y) % 5 === 0) {
      ctx.fillStyle = "#ffd57a";
      ctx.beginPath(); ctx.arc(px + 29, py + 20, 3.5, 0, Math.PI * 2); ctx.fill();
    }
    return;
  }
  if (activeStage.theme.terrain === "sporegrove") {
    ctx.fillStyle = (x + y) % 2 ? "rgba(47, 72, 49, 0.9)" : "rgba(62, 83, 51, 0.9)";
    roundedRect(px + 2, py + 9, TILE - 4, TILE - 11, 16); ctx.fill();
    ctx.fillStyle = (x * 3 + y) % 4 === 0 ? "#c85843" : "#d98145";
    ctx.beginPath(); ctx.ellipse(px + 28 + sway, py + 21, 21, 12, 0, Math.PI, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ead2a3";
    roundedRect(px + 23 + sway, py + 20, 10, 25, 5); ctx.fill();
    ctx.fillStyle = "rgba(255, 236, 177, 0.85)";
    ctx.beginPath(); ctx.arc(px + 20 + sway, py + 15, 2.5, 0, Math.PI * 2); ctx.arc(px + 32 + sway, py + 11, 2, 0, Math.PI * 2); ctx.fill();
    return;
  }
  if (activeStage.theme.terrain === "emberreach") {
    const glow = reducedMotion ? 0.55 : 0.48 + Math.sin(now * 0.004 + x + y) * 0.16;
    ctx.fillStyle = (x + y) % 2 ? "rgba(69, 44, 48, 0.94)" : "rgba(84, 48, 45, 0.94)";
    roundedRect(px + 2, py + 4, TILE - 4, TILE - 6, 10); ctx.fill();
    ctx.strokeStyle = `rgba(255, 118, 57, ${glow})`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px + 7, py + 35); ctx.lineTo(px + 18, py + 23); ctx.lineTo(px + 29, py + 31); ctx.lineTo(px + 44, py + 14); ctx.stroke();
    ctx.fillStyle = "#ffb35f";
    ctx.beginPath(); ctx.arc(px + 18, py + 23, 3, 0, Math.PI * 2); ctx.arc(px + 44, py + 14, 2.5, 0, Math.PI * 2); ctx.fill();
    return;
  }
  if (activeStage.theme.terrain === "mossmere") {
    const mist = reducedMotion ? 0 : Math.sin(now * 0.0013 + x * 0.8 + y) * 3;
    ctx.fillStyle = (x + y) % 2 ? "rgba(31, 84, 67, 0.9)" : "rgba(42, 96, 73, 0.9)";
    roundedRect(px + 2, py + 5, TILE - 4, TILE - 7, 16); ctx.fill();
    ctx.fillStyle = "rgba(197, 180, 235, 0.5)";
    ctx.beginPath(); ctx.ellipse(px + 27 + mist, py + 24, 23, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = (x * 3 + y) % 4 === 0 ? "#bd91df" : "#83c17f";
    ctx.beginPath(); ctx.arc(px + 17, py + 18, 5, 0, Math.PI * 2); ctx.arc(px + 35, py + 31, 4, 0, Math.PI * 2); ctx.fill();
    return;
  }
  if (activeStage.theme.terrain === "meadow") {
    ctx.fillStyle = (x + y) % 2 ? "rgba(87, 125, 52, 0.9)" : "rgba(107, 143, 57, 0.9)";
    roundedRect(px + 2, py + 7, TILE - 4, TILE - 9, 16); ctx.fill();
    ctx.strokeStyle = "#d9bd57"; ctx.lineWidth = 3;
    for (const offset of [13, 25, 38]) {
      ctx.beginPath(); ctx.moveTo(px + offset, py + 42); ctx.quadraticCurveTo(px + offset - 5 + sway, py + 26, px + offset + sway, py + 13); ctx.stroke();
    }
    ctx.fillStyle = (x * 3 + y) % 4 === 0 ? "#fff4c7" : "#f1a9c2";
    ctx.beginPath(); ctx.arc(px + 19, py + 23, 4, 0, Math.PI * 2); ctx.arc(px + 35, py + 31, 3.5, 0, Math.PI * 2); ctx.fill();
    return;
  }
  ctx.fillStyle = (x + y) % 2 ? "#245f48" : "#2f7450";
  ctx.beginPath();
  ctx.arc(px + 16 + sway, py + 28, 16, 0, Math.PI * 2);
  ctx.arc(px + 33 + sway, py + 23, 18, 0, Math.PI * 2);
  ctx.arc(px + 28 + sway, py + 38, 15, 0, Math.PI * 2);
  ctx.fill();
  if ((x * 3 + y) % 5 === 0) {
    ctx.fillStyle = "#ffe6ef";
    ctx.beginPath();
    ctx.arc(px + 22, py + 24, 3, 0, Math.PI * 2);
    ctx.arc(px + 28, py + 24, 3, 0, Math.PI * 2);
    ctx.arc(px + 25, py + 29, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.gold;
    ctx.fillRect(px + 24, py + 25, 3, 3);
  }
}

function drawLoreLight(x, y) {
  const pulse = reducedMotion ? 1 : 0.76 + Math.sin(performance.now() * 0.006 + x) * 0.18;
  ctx.save();
  ctx.globalAlpha = pulse;
  ctx.shadowColor = "#fff4a8";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#fff6b6";
  ctx.beginPath();
  ctx.arc(x, y, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawYieldGate(x, y) {
  const open = game.yieldTime > 0;
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = open ? 0.3 : 1;
  ctx.strokeStyle = open ? "#baf49a" : "#235f3d";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-15, 20);
  ctx.bezierCurveTo(-22, -6, 14, -7, 3, -23);
  ctx.moveTo(14, 21);
  ctx.bezierCurveTo(20, -4, -12, -7, -2, -22);
  ctx.stroke();
  ctx.fillStyle = "#7de16c";
  for (const [lx, ly, rotation] of [[-10, -10, -0.8], [10, 2, 0.7], [-3, 9, -0.5]]) {
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  if (!open && game.phase === "playing") {
    const label = game.relicFound ? "YIELD TO RETURN" : "YIELD HERE";
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(5,29,42,0.94)";
    roundedRect(-48, -48, 96, 24, 12);
    ctx.fill();
    ctx.strokeStyle = "#c9ff9e";
    ctx.lineWidth = 2;
    ctx.stroke();
    drawText(label, 0, -35, 10, "#f3ffd8", "center", 900);
    ctx.fillStyle = "#c9ff9e";
    ctx.beginPath();
    ctx.moveTo(-6, -21); ctx.lineTo(6, -21); ctx.lineTo(0, -14); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function drawObjectives(now) {
  drawKeeper(level.keeper, now);
  for (const sprout of level.sprouts) drawSprout(sprout, now);
  if (level.memorySequence) level.memorySequence.forEach((tile, index) => drawMemoryEcho(tile, index, now));
  if (level.shardTiles) level.shardTiles.forEach((tile, index) => drawShardAttunement(tile, index, now));
  if (!game.relicFound) {
    if (level.signs.Relic === "Seed Vessel") drawSeedVessel(level.relic, now);
    else if (level.signs.Relic === "Ancient Rune") drawAncientRune(level.relic, now);
    else if (level.signs.Relic === "Kiribako") drawKiribako(level.relic, now);
    else if (level.signs.Relic === "Gate Key") drawGateKey(level.relic, now);
    else if (level.signs.Relic === "Lore Map") drawLoreMap(level.relic, now);
    else drawCompass(level.relic, now);
  }
  drawCore(level.core, now);
  drawBloom(level.bloom, now);
}

function drawShardAttunement(tile, index, now) {
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  const attuned = game.shardAttuned.has(`${tile.x},${tile.y}`);
  const pulse = reducedMotion ? 1 : 1 + Math.sin(now * 0.006 + index) * 0.1;
  ctx.save(); ctx.translate(x, y); ctx.scale(pulse, pulse);
  ctx.shadowColor = attuned ? "#baffdc" : "#77dcff"; ctx.shadowBlur = attuned ? 20 : 10;
  ctx.fillStyle = attuned ? "#70d8aa" : "#397da6";
  ctx.beginPath(); ctx.moveTo(0, -19); ctx.lineTo(13, -3); ctx.lineTo(7, 18); ctx.lineTo(-11, 12); ctx.lineTo(-14, -5); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = attuned ? "#efffd9" : "#b9edff"; ctx.lineWidth = 3; ctx.stroke();
  drawText(attuned ? "✓" : String(index + 1), 0, 3, 13, "white", "center", 950);
  ctx.restore();
}

function drawLoreMap(tile, now) {
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  ctx.save(); ctx.translate(x, y + (reducedMotion ? 0 : Math.sin(now * 0.0027) * 2)); ctx.rotate(-0.08);
  ctx.shadowColor = "#b9edff"; ctx.shadowBlur = 18;
  ctx.fillStyle = "#e9dfb0"; roundedRect(-21, -17, 42, 34, 5); ctx.fill();
  ctx.strokeStyle = "#7c6841"; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.strokeStyle = "#5798ad"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-15, 10); ctx.lineTo(-7, -5); ctx.lineTo(3, 4); ctx.lineTo(14, -10); ctx.stroke();
  ctx.fillStyle = "#e46f65"; ctx.beginPath(); ctx.arc(14, -10, 4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawGateKey(tile, now) {
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  ctx.save(); ctx.translate(x, y + (reducedMotion ? 0 : Math.sin(now * 0.003) * 2)); ctx.rotate(-0.45);
  ctx.shadowColor = "#ffe47c"; ctx.shadowBlur = 20; ctx.strokeStyle = "#f3c65e"; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.arc(-10, -8, 10, 0, Math.PI * 2); ctx.moveTo(-2, -1); ctx.lineTo(20, 21); ctx.moveTo(11, 12); ctx.lineTo(18, 5); ctx.stroke();
  ctx.strokeStyle = "#fff2ad"; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.arc(-10, -8, 5, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

function drawKiribako(tile, now) {
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  ctx.save(); ctx.translate(x, y + (reducedMotion ? 0 : Math.sin(now * 0.0028) * 2));
  ctx.shadowColor = "#ffd479"; ctx.shadowBlur = 18;
  ctx.fillStyle = "#8d4c38"; roundedRect(-20, -14, 40, 30, 6); ctx.fill();
  ctx.strokeStyle = "#f0bc62"; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = "#c77a48"; roundedRect(-21, -19, 42, 10, 4); ctx.fill();
  ctx.fillStyle = "#f3d27c"; ctx.beginPath(); ctx.arc(0, 1, 6, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#74402e"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-12, -10); ctx.lineTo(-12, 13); ctx.moveTo(12, -10); ctx.lineTo(12, 13); ctx.stroke();
  ctx.restore();
}

function drawMemoryEcho(tile, index, now) {
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  const awake = game.relicFound;
  const complete = game.memoryProgress > index;
  const next = awake && game.memoryProgress === index;
  const pulse = next && !reducedMotion ? 1 + Math.sin(now * 0.007) * 0.12 : 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(pulse, pulse);
  ctx.shadowColor = next ? "#e1c8ff" : "transparent"; ctx.shadowBlur = next ? 22 : 0;
  ctx.fillStyle = complete ? "#4f8d70" : awake ? "#6e5a8d" : "#4d5757";
  ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(17, 12); ctx.lineTo(-17, 12); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = complete ? "#caffb8" : awake ? "#ead8ff" : "#879493"; ctx.lineWidth = next ? 4 : 2.5; ctx.stroke();
  drawText(awake ? (complete ? "✓" : String(index + 1)) : "·", 0, 5, 17, "#ffffff", "center", 950);
  ctx.restore();
}

function drawAncientRune(tile, now) {
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  ctx.save();
  ctx.translate(x, y + (reducedMotion ? 0 : Math.sin(now * 0.0025) * 2));
  ctx.shadowColor = "#77dcff"; ctx.shadowBlur = 18;
  ctx.fillStyle = "#4c5960";
  ctx.beginPath(); ctx.moveTo(-17, 18); ctx.lineTo(-13, -19); ctx.lineTo(12, -23); ctx.lineTo(18, 17); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#9beaff"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, -15); ctx.lineTo(-8, -3); ctx.lineTo(6, 2); ctx.lineTo(-5, 15); ctx.moveTo(-8, -3); ctx.lineTo(10, -9); ctx.stroke();
  ctx.restore();
}

function nextGuidanceTarget() {
  const player = game.actorPosition(game.player);
  const nearest = (tiles) => tiles.reduce((best, tile) => {
    const distance = Math.abs(tile.x - player.x) + Math.abs(tile.y - player.y);
    return !best || distance < best.distance ? { tile, distance } : best;
  }, null)?.tile ?? null;
  const untended = level.sprouts.filter((tile) => !game.tended.has(`${tile.x},${tile.y}`));
  if (untended.length) return nearest(untended);
  if (game.lightsCollected < level.lightGoal && game.lights.size) {
    return nearest([...game.lights].map((key) => {
      const [x, y] = key.split(",").map(Number);
      return { x, y };
    }));
  }
  if (!game.relicFound) return level.relic;
  if (level.convergenceTiles) {
    const sleepingEchoes = level.convergenceTiles.filter((tile) => !game.convergenceAwakened.has(`${tile.x},${tile.y}`));
    if (sleepingEchoes.length) return nearest(sleepingEchoes);
  }
  if (level.memorySequence && game.memoryProgress < level.memorySequence.length) return level.memorySequence[game.memoryProgress];
  if (level.shardTiles) {
    const sleepingShards = level.shardTiles.filter((tile) => !game.shardAttuned.has(`${tile.x},${tile.y}`));
    if (sleepingShards.length) return nearest(sleepingShards);
  }
  if (level.requiresHarvest && !game.harvested) return level.bloom;
  return level.core;
}

function drawGuidance(now) {
  if (game.guidanceTime <= 0) return;
  const target = nextGuidanceTarget();
  if (!target) return;
  const player = game.actorPosition(game.player);
  const fromX = ORIGIN.x + (player.x + 0.5) * TILE;
  const fromY = ORIGIN.y + (player.y + 0.5) * TILE;
  const toX = ORIGIN.x + (target.x + 0.5) * TILE;
  const toY = ORIGIN.y + (target.y + 0.5) * TILE;
  const pulse = reducedMotion ? 0.75 : 0.62 + Math.sin(now * 0.008) * 0.18;
  ctx.save();
  ctx.globalAlpha = pulse;
  ctx.strokeStyle = "#ffe07a";
  ctx.lineWidth = 5;
  ctx.setLineDash([11, 10]);
  ctx.lineDashOffset = reducedMotion ? 0 : -now * 0.025;
  ctx.beginPath(); ctx.moveTo(fromX, fromY); ctx.lineTo(toX, toY); ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowColor = "#ffe07a";
  ctx.shadowBlur = 18;
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(toX, toY, 22, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

function drawKeeper(tile, now) {
  if (!tile) return;
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  const name = level.signs.Keeper;
  const image = keeperArt[name];
  const glow = name === "Satoby" ? "#ffd66e" : name === "Hush" ? "#d8dee5" : "#7bdcff";
  ctx.save();
  ctx.translate(x, y + (reducedMotion ? 0 : Math.sin(now * 0.0025) * 2));
  ctx.globalAlpha = game.keeperAwakened ? 0.88 : 1;
  ctx.shadowColor = glow;
  ctx.shadowBlur = game.keeperNearby || game.keeperAwakened ? 22 : 10;
  ctx.fillStyle = "rgba(3, 24, 31, 0.62)";
  ctx.beginPath(); ctx.ellipse(0, 19, 24, 8, 0, 0, Math.PI * 2); ctx.fill();
  if (image?.complete && image.naturalWidth) ctx.drawImage(image, -29, -32, 58, 58);
  else {
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, 21, 0, Math.PI * 2); ctx.fill();
  }
  if (game.keeperProgress > 0) {
    ctx.strokeStyle = "rgba(3, 24, 31, 0.7)";
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(0, 0, 33, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = glow;
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, 0, 33, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, game.keeperProgress)); ctx.stroke();
  }
  if (game.keeperAwakened) {
    ctx.fillStyle = "#173e33";
    ctx.beginPath(); ctx.arc(21, -20, 11, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#eaffc8";
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(16, -20); ctx.lineTo(20, -16); ctx.lineTo(27, -24); ctx.stroke();
  }
  ctx.restore();

  if (game.keeperNearby && !game.keeperAwakened) {
    ctx.save();
    ctx.fillStyle = "rgba(5,29,42,0.95)";
    roundedRect(x - 61, y - 55, 122, 24, 12); ctx.fill();
    ctx.strokeStyle = glow;
    ctx.lineWidth = 2;
    ctx.stroke();
    drawText("HOLD PATIENCE", x, y - 43, 10, "#f8fff4", "center", 900);
    ctx.restore();
  }
}

function drawSeedVessel(tile, now) {
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  ctx.save();
  ctx.translate(x, y + (reducedMotion ? 0 : Math.sin(now * 0.003) * 2));
  ctx.shadowColor = palette.gold;
  ctx.shadowBlur = 18;
  ctx.fillStyle = "#a66d2f";
  roundedRect(-14, -11, 28, 28, 9); ctx.fill();
  ctx.fillStyle = "#f3c56b";
  roundedRect(-18, -17, 36, 9, 4); ctx.fill();
  ctx.fillStyle = "#9ee36f";
  ctx.beginPath();
  ctx.ellipse(-5, -22, 9, 5, 0.55, 0, Math.PI * 2);
  ctx.ellipse(6, -24, 9, 5, -0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4c8b4f";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(0, -25); ctx.stroke();
  ctx.restore();
}

function drawSprout(tile, now) {
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  const tended = game.tended.has(`${tile.x},${tile.y}`);
  ctx.save();
  ctx.translate(x, y + 4);
  const sway = reducedMotion ? 0 : Math.sin(now * 0.002 + tile.x) * 0.08;
  ctx.rotate(sway);
  ctx.strokeStyle = tended ? "#b7ff80" : "#2f7548";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.lineTo(0, -8);
  ctx.stroke();
  ctx.fillStyle = tended ? "#a8ed6f" : "#64b85d";
  ctx.beginPath(); ctx.ellipse(-7, -8, 9, 5, 0.55, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(7, -12, 9, 5, -0.55, 0, Math.PI * 2); ctx.fill();
  if (tended) {
    ctx.shadowColor = "#caff9c";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#fff0a8";
    ctx.beginPath(); ctx.arc(0, -17, 5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawCompass(tile, now) {
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(reducedMotion ? -0.2 : now * 0.00045);
  ctx.shadowColor = palette.gold;
  ctx.shadowBlur = 16;
  ctx.fillStyle = "#9a6928";
  ctx.beginPath(); ctx.arc(0, 0, 19, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#ffe79a";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#6ddaf4";
  ctx.beginPath();
  ctx.moveTo(0, -15); ctx.lineTo(6, 0); ctx.lineTo(0, 15); ctx.lineTo(-6, 0); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawCore(tile, now) {
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  const ready = game.requirementsMet();
  ctx.save();
  ctx.translate(x, y);
  const scale = reducedMotion ? 1 : 1 + Math.sin(now * 0.003) * 0.07;
  ctx.scale(scale, scale);
  const frostveil = activeStage.theme.terrain === "frostveil" || activeStage.theme.terrain === "mapfrost";
  const stillwater = activeStage.theme.terrain === "stillwater" || activeStage.theme.terrain === "veilwater";
  const cloudwake = activeStage.theme.terrain === "cloudwake";
  const sporegrove = activeStage.theme.terrain === "sporegrove";
  const emberreach = activeStage.theme.terrain === "emberreach";
  const mossmere = activeStage.theme.terrain === "mossmere";
  const meadow = activeStage.theme.terrain === "meadow";
  if (meadow) {
    ctx.shadowColor = ready ? "#ff9a8d" : "#a86167"; ctx.shadowBlur = ready ? 30 : 11;
    ctx.fillStyle = ready ? "#ef6f72" : "#8b4f59";
    ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(21, 17); ctx.lineTo(-21, 17); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = ready ? "#ffe4c2" : "#d49a91"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = ready ? "#ffd28c" : "#bd7968";
    ctx.beginPath(); ctx.arc(0, 5, 6, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }
  if (mossmere) {
    ctx.shadowColor = ready ? "#c9ff91" : "#6d9d76"; ctx.shadowBlur = ready ? 28 : 10;
    ctx.fillStyle = ready ? "#9ee45f" : "#567b57";
    ctx.beginPath(); ctx.moveTo(0, -23); ctx.bezierCurveTo(17, -15, 19, 8, 0, 22); ctx.bezierCurveTo(-19, 8, -17, -15, 0, -23); ctx.fill();
    ctx.strokeStyle = ready ? "#efffc4" : "#a4c38f"; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = "rgba(241,255,208,0.7)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -17); ctx.lineTo(0, 16); ctx.moveTo(0, 1); ctx.lineTo(-10, -6); ctx.moveTo(0, 7); ctx.lineTo(10, -1); ctx.stroke();
    ctx.restore(); return;
  }
  if (emberreach) {
    ctx.shadowColor = ready ? "#ffcf75" : "#b65b42"; ctx.shadowBlur = ready ? 28 : 11;
    ctx.fillStyle = ready ? "#f0a54f" : "#8b4b43";
    ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(18, -8); ctx.lineTo(13, 16); ctx.lineTo(0, 23); ctx.lineTo(-13, 16); ctx.lineTo(-18, -8); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = ready ? "#fff0b5" : "#d98a61"; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = ready ? "#fff3bf" : "#d98555";
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
    ctx.restore(); return;
  }
  if (sporegrove) {
    ctx.shadowColor = ready ? "#7fe5ff" : "#4b91b4";
    ctx.shadowBlur = ready ? 30 : 12;
    ctx.fillStyle = ready ? "#70d8ff" : "#347797";
    ctx.beginPath(); ctx.moveTo(0, -25); ctx.lineTo(15, -6); ctx.lineTo(7, 22); ctx.lineTo(-11, 14); ctx.lineTo(-16, -5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = ready ? "#e0faff" : "#79b8cc"; ctx.lineWidth = 3; ctx.stroke();
    ctx.strokeStyle = "rgba(232,252,255,0.72)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(1, 15); ctx.moveTo(-12, -4); ctx.lineTo(1, 2); ctx.lineTo(12, -5); ctx.stroke();
    ctx.restore();
    return;
  }
  if (cloudwake) {
    ctx.shadowColor = ready ? "#d7b7ff" : "#7d68ad";
    ctx.shadowBlur = ready ? 28 : 11;
    ctx.fillStyle = ready ? "#38205f" : "#20243c";
    ctx.beginPath(); ctx.arc(0, 0, 21, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = ready ? "#ffe59b" : "#9989c3";
    ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = ready ? "#ffd66e" : "#6f668d";
    ctx.beginPath(); ctx.arc(7, -4, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ready ? "#38205f" : "#20243c";
    ctx.beginPath(); ctx.arc(12, -8, 13, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    return;
  }
  ctx.shadowColor = ready ? (frostveil ? "#adf5ff" : stillwater ? "#ffe38f" : "#9aff82") : (frostveil ? "#6f9bdd" : stillwater ? "#d5a84d" : "#65b883");
  ctx.shadowBlur = ready ? 25 : 9;
  ctx.fillStyle = ready ? (frostveil ? "#9deaff" : stillwater ? "#f6c95d" : "#90ee73") : (frostveil ? "#586eb5" : stillwater ? "#92743b" : "#377958");
  ctx.beginPath();
  ctx.moveTo(0, -20); ctx.lineTo(15, -5); ctx.lineTo(10, 17); ctx.lineTo(-10, 17); ctx.lineTo(-15, -5); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = ready ? "#f3ffff" : (frostveil ? "#b0c8f4" : stillwater ? "#f2d58b" : "#86bb86");
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}

function drawBloom(tile, now) {
  const x = ORIGIN.x + (tile.x + 0.5) * TILE;
  const y = ORIGIN.y + (tile.y + 0.5) * TILE;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(reducedMotion ? 0 : now * 0.0007);
  ctx.fillStyle = game.resonanceTime > 0 ? "rgba(180,120,225,0.25)" : "#d9a6ff";
  for (let index = 0; index < 6; index += 1) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath(); ctx.ellipse(0, -11, 5, 11, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = palette.gold;
  ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawToby(now) {
  const position = game.actorPosition(game.player);
  const x = ORIGIN.x + (position.x + 0.5) * TILE;
  const y = ORIGIN.y + (position.y + 0.5) * TILE;
  const bob = reducedMotion ? 0 : Math.sin(now * 0.015) * (game.player.moving ? 2.5 : 1);
  const facing = game.player.direction === "left" ? -1 : 1;
  ctx.save();
  ctx.translate(x, y + bob);
  if (game.patienceHeld) {
    const breath = reducedMotion ? 0.5 : (Math.sin(now * 0.006) + 1) / 2;
    const aura = ctx.createRadialGradient(0, 0, 8, 0, 0, 42 + breath * 7);
    aura.addColorStop(0, "rgba(255,177,167,0.18)");
    aura.addColorStop(1, "rgba(239,74,67,0)");
    ctx.fillStyle = aura;
    ctx.beginPath(); ctx.arc(0, 0, 49, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(255,177,167,${0.46 + breath * 0.28})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, 0, 32 + breath * 7, 0, Math.PI * 2); ctx.stroke();
  }
  if (game.resonanceTime > 0) {
    const resonance = reducedMotion ? 0.5 : (Math.sin(now * 0.009) + 1) / 2;
    ctx.strokeStyle = `rgba(233,194,255,${0.5 + resonance * 0.3})`;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 39 + resonance * 8, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "rgba(255,240,168,0.62)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, 48 - resonance * 5, 0, Math.PI * 2); ctx.stroke();
  }
  if (game.invulnerableTime > 0 && Math.floor(now / 90) % 2 === 0) ctx.globalAlpha = 0.32;
  if (game.resonanceTime > 0) { ctx.shadowColor = "#e9c2ff"; ctx.shadowBlur = 22; }
  if (level.keeperAbility === "ward" && game.invulnerableTime > 2.25) { ctx.shadowColor = "#7bdcff"; ctx.shadowBlur = 26; }
  ctx.fillStyle = "rgba(2,20,28,0.35)";
  ctx.beginPath(); ctx.ellipse(0, 19, 23, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.scale(facing, 1);
  if (tobyArt.complete && tobyArt.naturalWidth) {
    ctx.drawImage(tobyArt, -31, -33, 62, 62);
  } else {
    ctx.fillStyle = "#39aeea";
    ctx.beginPath(); ctx.ellipse(0, 0, 23, 21, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f6fff0";
    ctx.beginPath(); ctx.ellipse(2, 7, 17, 13, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function drawThreats(now) {
  for (const threat of game.threats) {
    const position = game.actorPosition(threat);
    const x = ORIGIN.x + (position.x + 0.5) * TILE;
    const y = ORIGIN.y + (position.y + 0.5) * TILE;
    ctx.save();
    ctx.translate(x, y);
    const resonance = game.resonanceTime > 0;
    const quieted = threat.stunned > 0;
    const color = resonance ? "#a782ca" : quieted ? "#879ca5" : threat.kind === "listener" ? "#ef6158" : "#df8b52";
    ctx.fillStyle = "rgba(4,18,27,0.35)";
    ctx.beginPath(); ctx.ellipse(0, 17, 19, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-18, 12); ctx.lineTo(-16, -10); ctx.quadraticCurveTo(0, -26, 16, -10); ctx.lineTo(18, 12);
    ctx.lineTo(10, 7); ctx.lineTo(3, 14); ctx.lineTo(-5, 7); ctx.lineTo(-12, 14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#132431";
    ctx.beginPath(); ctx.arc(-6, -6, 4, 0, Math.PI * 2); ctx.arc(7, -6, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = resonance ? "#fff0a8" : "white";
    ctx.beginPath(); ctx.arc(-7, -7, 1.5, 0, Math.PI * 2); ctx.arc(6, -7, 1.5, 0, Math.PI * 2); ctx.fill();
    if (game.patienceHeld || quieted) {
      ctx.strokeStyle = palette.patience;
      if (quieted) ctx.strokeStyle = "#dce8eb";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.7 + Math.sin(now * 0.006) * 0.2;
      ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }
}

function drawHUD() {
  ctx.save();
  ctx.shadowColor = "rgba(0, 8, 14, 0.48)";
  ctx.shadowBlur = 18;
  ctx.fillStyle = activeStage.theme.hudPanel;
  roundedRect(24, 20, 954, 100, 20); ctx.fill();
  ctx.fillStyle = activeStage.theme.hudPanel;
  roundedRect(1000, 20, 256, 676, 20); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(142,219,220,0.32)";
  ctx.lineWidth = 2;
  roundedRect(24, 20, 954, 100, 20); ctx.stroke();
  roundedRect(1000, 20, 256, 676, 20); ctx.stroke();

  drawText(`LORE LAND DEED #${activeStage.id}`, 46, 48, 18, palette.sky, "left", 800);
  drawText(activeStage.isSandbox ? "GENERATED SANDBOX · NO CAMPAIGN SAVE" : "IMAGINED BY TOADAID", 470, 48, 12, palette.gold, "left", 900);
  drawText(`${level.signs.Background.toUpperCase()} · ${level.signs.Land.toUpperCase()} · ${level.signs.Core.toUpperCase()}`, 46, 77, 24, palette.ink, "left", 900);
  const keeperState = game.keeperAwakened
    ? (level.keeperAbility === "quiet" ? " · LAND QUIET" : level.keeperAbility === "ward" ? " · SKY WARD" : level.keeperAbility === "welcome" ? " · WELCOMED" : " · GUIDING")
    : (game.keeperNearby ? " · LISTEN" : "");
  drawText(`KEEPER: ${level.signs.Keeper.toUpperCase()}${keeperState}`, 46, 101, 13, palette.gold, "left", 800);
  if (activeStage.isSandbox && level.signs.Core === "Rootbound") {
    drawText(`ROOTBOUND CORE: ${game.tended.size} / ${level.sprouts.length} SPROUTS`, 470, 101, 13, game.tended.size === level.sprouts.length ? "#baff95" : "#d7ff9a", "left", 900);
  } else if (activeStage.isSandbox && level.signs.Core === "Sato") {
    drawText(`SATO CORE: ${game.crossedFarSide ? "FAR SIDE CROSSED" : "CROSS AND RETURN"}`, 470, 101, 13, game.crossedFarSide ? "#baff95" : "#ffe7a0", "left", 900);
  } else if (activeStage.isSandbox && level.signs.Core === "Taboshi") {
    drawText(`TABOSHI CORE: ${game.harvested ? "HARVEST REMEMBERED" : "SEEK PURPLE BLOOM"}`, 470, 101, 13, game.harvested ? "#baff95" : "#e1c8ff", "left", 900);
  } else if (activeStage.isSandbox && level.signs.Core === "Eclipse") {
    drawText(`ECLIPSE BALANCE: ${game.eclipseSides.size} / 2 SIDES LIT`, 470, 101, 13, game.eclipseSides.size === 2 ? "#baff95" : "#ffe7a0", "left", 900);
  } else if (activeStage.isSandbox && level.signs.Core === "Shard") {
    drawText(`SHARD ATTUNEMENT: ${game.shardAttuned.size} / ${level.shardTiles.length}`, 470, 101, 13, game.shardAttuned.size === level.shardTiles.length ? "#baff95" : "#b9edff", "left", 900);
  } else if (activeStage.isSandbox && level.signs.Core === "Patience") {
    drawText(`PATIENCE CORE: ${game.coreAwakened ? "AWAKE" : "HOLD STILL AT CORE"}`, 470, 101, 13, game.coreAwakened ? "#baff95" : "#ffb1a7", "left", 900);
  } else if (level.sporeCycleSeconds) {
    drawText(`SPORE PATHS: ${game.areSporesOpen() ? "OPEN" : "RESTING"}`, 470, 101, 13, game.areSporesOpen() ? "#fff0a6" : "#ff9a78", "left", 900);
  } else if (level.emberCycleSeconds) {
    const heatState = game.relicFound ? "RUNE-COOLED" : game.isEmberSurging() ? "SURGE" : "COOL";
    drawText(`EMBER TIDE: ${heatState}`, 470, 101, 13, game.isEmberSurging() ? "#ff9a78" : "#a9efff", "left", 900);
  } else if (level.memorySequence) {
    const memoryState = game.relicFound ? `${game.memoryProgress} / ${level.memorySequence.length}` : "SEALED";
    drawText(`MEMORY ECHOES: ${memoryState}`, 470, 101, 13, game.memoryProgress === level.memorySequence.length ? "#baff95" : "#dbc6ff", "left", 900);
  } else if (level.submergedRevealSeconds) {
    const waterState = !game.keeperAwakened ? "LISTEN TO HUSH" : game.areSubmergedPathsRevealed() ? `REVEALED ${Math.ceil(game.submergedRevealTime)}s` : "HOLD STILL";
    drawText(`SUBMERGED PATHS: ${waterState}`, 470, 101, 13, game.areSubmergedPathsRevealed() ? "#e8ffc9" : "#a9efff", "left", 900);
  } else if (level.convergenceTiles) {
    const echoState = !game.relicFound ? "FIND WAYFINDER" : `${game.convergenceAwakened.size} / ${level.convergenceTiles.length} AWAKE`;
    drawText(`DOOR ECHOES: ${echoState}`, 470, 101, 13, game.convergenceAwakened.size === level.convergenceTiles.length ? "#baffdc" : "#ffe7a0", "left", 900);
  } else if (level.pondThresholdSeconds) {
    const pondState = game.pondWelcomed ? "WELCOMED" : game.arePondThresholdsOpen() ? `OPEN ${Math.ceil(game.pondThresholdTime)}s` : "BREATHE BESIDE RING";
    drawText(`POND THRESHOLD: ${pondState}`, 470, 101, 13, game.arePondThresholdsOpen() ? "#baffdc" : "#a9efff", "left", 900);
  } else if (level.signs.Relic === "Gate Key") {
    drawText(`MEADOW GATES: ${game.relicFound ? "OPEN" : "LOCKED"}`, 470, 101, 13, game.relicFound ? "#baff95" : "#ffe18a", "left", 900);
  } else if (level.signs.Relic === "Lore Map") {
    drawText(`LORE MAP: ${game.relicFound ? "CHARTING" : "LOST IN FROST"}`, 470, 101, 13, game.relicFound ? "#b9edff" : "#d4d9e8", "left", 900);
  }

  drawHeart(665, 52, game.hearts >= 1);
  drawHeart(699, 52, game.hearts >= 2);
  drawHeart(733, 52, game.hearts >= 3);
  drawText(String(Math.ceil(game.remaining)).padStart(3, "0"), 925, 66, 32, game.remaining < 20 ? palette.danger : palette.gold, "right", 950);
  drawText("TIME", 925, 98, 11, palette.muted, "right", 800);

  drawText("TENDING THE LAND", 1018, 55, 14, palette.gold, "left", 900);
  drawObjective("LORE LIGHTS", `${Math.min(game.lightsCollected, level.lightGoal)} / ${level.lightGoal}`, game.lightsCollected >= level.lightGoal, 94);
  drawObjective("SPROUTS TENDED", `${game.tended.size} / ${level.sprouts.length}`, game.tended.size === level.sprouts.length, 152);
  drawObjective(level.signs.Relic.toUpperCase(), game.relicFound ? "FOUND" : "SEEK", game.relicFound, 210);

  drawText("PATIENCE", 1018, 295, 12, palette.ink, "left", 900);
  drawMeter(1018, 310, 214, 18, game.patience / 100, palette.patience, palette.patienceDark);
  drawText(game.patienceHeld ? "TIME MOVES QUIETLY" : "HOLD TO BREATHE", 1018, 348, 11, game.patienceHeld ? "#ffb1a7" : palette.muted, "left", 800);

  drawText("YIELD", 1018, 397, 12, palette.ink, "left", 900);
  drawMeter(1018, 412, 214, 18, game.yieldTime > 0 ? game.yieldTime / 5.5 : game.yieldCharges / 3, palette.leaf, palette.leafDark);
  drawText(game.yieldTime > 0 ? "THE GATE IS OPEN" : `${game.yieldCharges} LEAF CHARGES`, 1018, 450, 11, game.yieldTime > 0 ? "#baff95" : palette.muted, "left", 800);

  ctx.fillStyle = game.resonanceTime > 0 ? "rgba(151, 92, 190, 0.72)" : activeStage.theme.hudCard;
  roundedRect(1018, 466, 214, 25, 8); ctx.fill();
  drawText(`TABOSHI HARVEST: ${game.resonanceTime > 0 ? `${Math.ceil(game.resonanceTime)}s · EAT GHOSTS` : "FIND BLOOM"}`, 1028, 479, 10, game.resonanceTime > 0 ? "#fff0a8" : palette.muted, "left", 900);

  drawText("SCORE", 1018, 507, 11, palette.muted, "left", 800);
  drawText(String(game.score).padStart(6, "0"), 1232, 538, 28, palette.ink, "right", 950);
  ctx.strokeStyle = "rgba(142,219,220,0.22)";
  ctx.beginPath(); ctx.moveTo(1018, 565); ctx.lineTo(1232, 565); ctx.stroke();
  drawText("THE CORE", 1018, 601, 11, palette.muted, "left", 800);
  const ritualReady = activeStage.isSandbox && game.baseRequirementsMet() && !game.requirementsMet();
  drawText(game.requirementsMet() ? "READY TO WAKE" : ritualReady ? "HOLD PATIENCE HERE" : "STILL DREAMING", 1018, 630, 17, game.requirementsMet() || ritualReady ? "#baff95" : palette.sky, "left", 950);
  drawText(`Return to the ${level.signs.Core} Core`, 1018, 660, 12, palette.muted, "left", 600);

  if (game.tendingKey) {
    const position = game.actorPosition(game.player);
    const x = ORIGIN.x + (position.x + 0.5) * TILE;
    const y = ORIGIN.y + (position.y + 0.5) * TILE;
    ctx.strokeStyle = "rgba(4,20,28,0.45)";
    ctx.lineWidth = 8;
    ctx.beginPath(); ctx.arc(x, y, 31, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "#d7ff9a";
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(x, y, 31, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, game.tendProgress / 1.35)); ctx.stroke();
  }
  ctx.restore();
}

function drawObjective(label, value, complete, y) {
  ctx.fillStyle = complete ? "rgba(65,145,75,0.55)" : activeStage.theme.hudCard;
  roundedRect(1016, y - 23, 218, 48, 11); ctx.fill();
  ctx.fillStyle = complete ? "#aef185" : "#6b9aa5";
  ctx.beginPath(); ctx.arc(1034, y, 6, 0, Math.PI * 2); ctx.fill();
  if (complete) {
    ctx.strokeStyle = "#f4ffd9"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(1030, y); ctx.lineTo(1033, y + 3); ctx.lineTo(1039, y - 4); ctx.stroke();
  }
  drawText(label, 1049, y - 7, 10, palette.muted, "left", 800);
  drawText(value, 1218, y + 10, 15, complete ? "#c9fba1" : palette.ink, "right", 900);
}

function drawMeter(x, y, width, height, ratio, color, track) {
  ctx.fillStyle = track;
  roundedRect(x, y, width, height, height / 2); ctx.fill();
  const fillWidth = Math.max(0, (width - 4) * Math.max(0, Math.min(1, ratio)));
  if (fillWidth > 0) {
    ctx.fillStyle = color;
    roundedRect(x + 2, y + 2, fillWidth, height - 4, (height - 4) / 2); ctx.fill();
  }
}

function drawHeart(x, y, active) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = active ? palette.patience : "#3c5b64";
  ctx.beginPath();
  ctx.moveTo(0, 10); ctx.bezierCurveTo(-20, -4, -11, -19, 0, -9); ctx.bezierCurveTo(11, -19, 20, -4, 0, 10); ctx.fill();
  ctx.restore();
}

function drawParticles() {
  for (const particle of particles) {
    const x = ORIGIN.x + (particle.x + 0.5) * TILE;
    const y = ORIGIN.y + (particle.y + 0.5) * TILE;
    ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    ctx.fillStyle = particle.color;
    ctx.beginPath(); ctx.arc(x, y, particle.size, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function spawnBurst(tileX, tileY, color, count) {
  if (reducedMotion) count = Math.min(count, 8);
  for (let index = 0; index < count; index += 1) {
    const angle = (index / count) * Math.PI * 2 + Math.random() * 0.25;
    const speed = 0.8 + Math.random() * 2.4;
    particles.push({
      x: tileX,
      y: tileY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.8,
      life: 0.45 + Math.random() * 0.45,
      maxLife: 0.9,
      size: 2 + Math.random() * 4,
      color,
    });
  }
}

function drawOverlay(title, detail) {
  ctx.fillStyle = "rgba(3,17,27,0.76)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawText(title, WIDTH / 2, HEIGHT / 2 - 20, 52, palette.gold, "center", 950);
  drawText(detail, WIDTH / 2, HEIGHT / 2 + 34, 18, palette.ink, "center", 700);
}

function drawEndOverlay(title, detail) {
  ctx.fillStyle = "rgba(3,17,27,0.66)";
  roundedRect(270, 250, 680, 220, 28); ctx.fill();
  ctx.strokeStyle = "rgba(255,227,126,0.6)"; ctx.lineWidth = 2;
  roundedRect(270, 250, 680, 220, 28); ctx.stroke();
  drawText(title, WIDTH / 2, 320, 46, palette.gold, "center", 950);
  drawText(detail, WIDTH / 2, 380, 18, palette.ink, "center", 700);
  drawText(`SCORE ${String(game.score).padStart(6, "0")}`, WIDTH / 2, 427, 20, palette.sky, "center", 900);
}

function drawText(text, x, y, size, color, align = "left", weight = 700) {
  ctx.font = `${weight} ${size}px "Trebuchet MS", "Avenir Next", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function roundedRect(x, y, width, height, radius) {
  const safeRadius = Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2);
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, safeRadius);
}

function ensureAudio() {
  const stageId = activeStage.audioProfileId ?? activeStage.id;
  if (!reactiveAudio.ensure()) return false;
  if (reactiveAudio.stageId !== stageId) reactiveAudio.setStage(stageId);
  return true;
}

function tone(frequency, duration, type = "sine", gainAmount = 0.04, endMultiplier = 1) {
  reactiveAudio.tone(frequency, duration, type, gainAmount, endMultiplier);
}

function victoryChord() {
  [0, 0.12, 0.26].forEach((delay, index) => window.setTimeout(() => tone([330, 440, 660][index], 0.34, "sine", 0.05, 1.02), delay * 1000));
}

function directionFromKey(key) {
  return ({ ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" })[key] ?? null;
}

function handleKeyDown(event) {
  if (event.key === "Escape" && !event.repeat) {
    event.preventDefault();
    if (!aboutPanel.hidden) {
      closeAboutPanel();
    } else if (!communityPanel.hidden) {
      closeCommunityPanel();
    } else if (!deedWandererPanel.hidden) {
      closeDeedWanderer();
    } else if (!howPanel.hidden) {
      howPanel.hidden = true;
      howButton.setAttribute("aria-expanded", "false");
      startButton.focus();
    } else if (!pausePanel.hidden) resumeFromMenu();
    else openPauseMenu();
    return;
  }
  if (event.key === "Tab" && trapModalFocus(event)) return;
  if (!deedWandererPanel.hidden || !aboutPanel.hidden || !communityPanel.hidden) return;
  if ((event.key === "p" || event.key === "P") && !event.repeat) {
    if (!howPanel.hidden || !aboutPanel.hidden || !communityPanel.hidden || game.phase !== "playing") return;
    event.preventDefault();
    if (!pausePanel.hidden) resumeFromMenu();
    else togglePause();
    return;
  }
  if (!pausePanel.hidden || !howPanel.hidden || game.paused) return;
  const direction = directionFromKey(event.key);
  if (direction) {
    event.preventDefault();
    game.queueDirection(direction);
  }
  if ((event.key === "q" || event.key === "Q") && !event.repeat) game.activateYield();
  if (event.code === "Space") { event.preventDefault(); game.setPatience(true); }
  if (event.key === "Enter" && (game.phase === "won" || game.phase === "lost")) advanceOrRestart();
  if (event.key === "Enter" && game.phase === "ready" && !titleScreen.hidden) startGame();
}

function trapModalFocus(event) {
  const panel = [communityPanel, aboutPanel, deedWandererPanel, howPanel, pausePanel].find((candidate) => !candidate.hidden);
  if (!panel) return false;
  const focusable = [...panel.querySelectorAll('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')];
  if (!focusable.length) return false;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
  return true;
}

function visibleModalPanel() {
  return [communityPanel, aboutPanel, deedWandererPanel, howPanel, pausePanel].find((panel) => !panel.hidden) ?? null;
}

function moveModalFocus(panel, step) {
  const focusable = [...panel.querySelectorAll('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')];
  if (!focusable.length) return;
  const current = focusable.indexOf(document.activeElement);
  const next = current < 0 ? 0 : (current + step + focusable.length) % focusable.length;
  focusable[next].focus();
}

function releaseGamepadControls() {
  if (gamepadDirection) game.releaseDirection(gamepadDirection);
  if (gamepadState.confirm) game.setPatience(false);
  gamepadDirection = null;
}

function pollGamepad() {
  const pads = typeof navigator.getGamepads === "function" ? [...navigator.getGamepads()] : [];
  const pad = pads.find((candidate) => candidate?.connected && candidate.mapping === "standard") ?? pads.find((candidate) => candidate?.connected);
  if (!pad) {
    if (gamepadConnected) releaseGamepadControls();
    gamepadConnected = false;
    gamepadState = {};
    return;
  }

  const input = readStandardGamepad(pad, gamepadState);
  const previous = gamepadState;
  gamepadState = input.held;
  if (!gamepadConnected) {
    gamepadConnected = true;
    liveStatus.textContent = "Controller connected. Use the D-pad or left stick to move, A for Patience, B for Yield, and Menu to pause.";
  }

  const modal = visibleModalPanel();
  if (modal) {
    releaseGamepadControls();
    if (input.directionPressed === "up" || input.directionPressed === "left") moveModalFocus(modal, -1);
    if (input.directionPressed === "down" || input.directionPressed === "right") moveModalFocus(modal, 1);
    if (input.confirmPressed && modal.contains(document.activeElement) && typeof document.activeElement.click === "function") document.activeElement.click();
    if (input.menuPressed && modal === pausePanel) resumeFromMenu();
    return;
  }

  if (input.menuPressed && game.phase === "playing") {
    if (game.paused) resumeFromMenu();
    else openPauseMenu();
    return;
  }
  if (input.confirmPressed && !titleScreen.hidden && game.phase === "ready") {
    startGame();
    return;
  }
  if (input.confirmPressed && (game.phase === "won" || game.phase === "lost")) {
    advanceOrRestart();
    return;
  }
  if (game.phase !== "playing" || game.paused) {
    releaseGamepadControls();
    return;
  }

  if (input.held.direction !== gamepadDirection) {
    if (gamepadDirection) game.releaseDirection(gamepadDirection);
    gamepadDirection = input.held.direction;
    if (gamepadDirection) game.queueDirection(gamepadDirection);
  }
  if (input.held.confirm !== Boolean(previous.confirm)) game.setPatience(input.held.confirm);
  if (input.yieldPressed) game.activateYield();
}

function loadDeedArchive() {
  if (!deedArchivePromise) {
    deedArchivePromise = fetch("./data/lore-lands.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Archive request failed (${response.status})`);
        return response.json();
      })
      .then((archive) => {
        if (!Array.isArray(archive?.lands) || archive.lands.length !== 2869) throw new Error("Canonical archive index is incomplete");
        return archive.lands;
      })
      .catch((error) => {
        deedArchivePromise = null;
        throw error;
      });
  }
  return deedArchivePromise;
}

function openDeedWanderer(initialValue = "") {
  howPanel.hidden = true;
  howButton.setAttribute("aria-expanded", "false");
  aboutPanel.hidden = true;
  aboutButton.setAttribute("aria-expanded", "false");
  communityPanel.hidden = true;
  communityButton.setAttribute("aria-expanded", "false");
  deedWandererPanel.hidden = false;
  deedWandererButton.setAttribute("aria-expanded", "true");
  if (initialValue) deedLookupInput.value = initialValue;
  deedLookupInput.focus();
}

function openAboutPanel() {
  howPanel.hidden = true;
  howButton.setAttribute("aria-expanded", "false");
  deedWandererPanel.hidden = true;
  deedWandererButton.setAttribute("aria-expanded", "false");
  communityPanel.hidden = true;
  communityButton.setAttribute("aria-expanded", "false");
  aboutPanel.hidden = false;
  aboutButton.setAttribute("aria-expanded", "true");
  closeAboutButton.focus();
}

function closeAboutPanel() {
  aboutPanel.hidden = true;
  aboutButton.setAttribute("aria-expanded", "false");
  aboutButton.focus();
}

function openCommunityPanel() {
  howPanel.hidden = true;
  howButton.setAttribute("aria-expanded", "false");
  deedWandererPanel.hidden = true;
  deedWandererButton.setAttribute("aria-expanded", "false");
  aboutPanel.hidden = true;
  aboutButton.setAttribute("aria-expanded", "false");
  communityPanel.hidden = false;
  communityButton.setAttribute("aria-expanded", "true");
  firstCommunityLink.focus();
}

function closeCommunityPanel() {
  communityPanel.hidden = true;
  communityButton.setAttribute("aria-expanded", "false");
  communityButton.focus();
}

function closeDeedWanderer() {
  deedWandererPanel.hidden = true;
  deedWandererButton.setAttribute("aria-expanded", "false");
  if (window.history?.replaceState) {
    const url = new URL(window.location.href);
    url.searchParams.delete("lookup");
    window.history.replaceState({}, "", url);
  }
  deedWandererButton.focus();
}

async function lookupCanonicalDeed(rawValue) {
  const normalizedId = normalizeDeedId(rawValue);
  deedLookupResult.hidden = true;
  selectedArchiveDeed = null;
  enterDeedSandboxButton.disabled = true;
  deedVisualRequestId += 1;
  deedLookupImage.hidden = true;
  deedLookupImage.removeAttribute("src");
  deedLookupVisualFrame.classList.remove("is-unavailable");
  if (!normalizedId) {
    deedLookupInput.setAttribute("aria-invalid", "true");
    deedLookupStatus.textContent = "Enter a whole deed number from 1 through 4000.";
    deedLookupInput.focus();
    return false;
  }

  deedLookupInput.removeAttribute("aria-invalid");
  deedLookupSubmit.disabled = true;
  deedLookupForm.setAttribute("aria-busy", "true");
  deedLookupSubmit.textContent = "READING…";
  deedLookupStatus.textContent = "Reading the canonical archive…";
  try {
    const lands = await loadDeedArchive();
    const deed = findCanonicalDeed(lands, normalizedId);
    if (!deed) {
      deedLookupStatus.textContent = `Deed #${Number(normalizedId)} is not present in the local 2,869-deed archive.`;
      return false;
    }
    selectedArchiveDeed = deed;
    enterDeedSandboxButton.disabled = false;
    deedLookupNumber.textContent = `#${Number(deed.id)}`;
    for (const [name, value] of Object.entries(deed.signs)) {
      const field = deedLookupResult.querySelector(`[data-archive-sign="${name}"]`);
      if (field) field.textContent = value;
    }
    const sandboxProfile = createDeedSandboxProfile(deed);
    deedSandboxRecipe.hidden = !sandboxProfile;
    if (sandboxProfile) {
      deedSandboxSeed.textContent = `RECIPE ${sandboxProfile.seed.toString(16).toUpperCase().padStart(8, "0")}`;
      for (const [name, value] of Object.entries({
        Layout: sandboxProfile.layout,
        Traversal: sandboxProfile.traversal,
        Atmosphere: sandboxProfile.atmosphere,
        Audio: sandboxProfile.audio,
        Objective: sandboxProfile.objective,
        Relic: sandboxProfile.relicRule,
        Keeper: `${sandboxProfile.keeperAbility} — ${sandboxProfile.keeperRule}`,
      })) {
        const field = deedSandboxRecipe.querySelector(`[data-sandbox-rule="${name}"]`);
        if (field) field.textContent = value;
      }
    }
    deedLookupResult.hidden = false;
    deedLookupStatus.textContent = `Canonical signs found for Deed #${Number(deed.id)}.`;
    const archiveThumbnail = `./assets/deed-thumbnails/${deed.id}.webp`;
    const bundledVisual = getStage(deed.id)?.art?.canonical;
    const visualCandidates = [archiveThumbnail, bundledVisual, ...ipfsGatewayUrls(deed.image)].filter(Boolean);
    if (visualCandidates.length) {
      const requestId = deedVisualRequestId;
      let candidateIndex = 0;
      deedLookupImage.alt = `Canonical artwork for Lore Land Deed #${Number(deed.id)}`;
      const tryNextVisual = () => {
        if (requestId !== deedVisualRequestId) return;
        const visualUrl = visualCandidates[candidateIndex];
        const isArchiveThumbnail = visualUrl === archiveThumbnail;
        const isBundledVisual = visualUrl === bundledVisual;
        deedLookupVisualStatus.textContent = isArchiveThumbnail
          ? "Loading local canonical thumbnail…"
          : isBundledVisual
          ? "Loading bundled campaign visual…"
          : "Loading canonical visual from an IPFS fallback…";
        deedLookupImage.onload = () => {
          if (requestId !== deedVisualRequestId || deedLookupImage.src !== new URL(visualUrl, window.location.href).href) return;
          deedLookupImage.hidden = false;
          deedLookupVisualFrame.classList.remove("is-unavailable");
          deedLookupVisualStatus.textContent = isArchiveThumbnail
            ? "Canonical visual · preserved in the local deed archive."
            : isBundledVisual
            ? "Canonical visual · bundled with this campaign door."
            : "Canonical metadata visual · delivered through IPFS.";
        };
        deedLookupImage.onerror = () => {
          if (requestId !== deedVisualRequestId) return;
          candidateIndex += 1;
          if (candidateIndex < visualCandidates.length) {
            tryNextVisual();
            return;
          }
          deedLookupImage.hidden = true;
          deedLookupVisualFrame.classList.add("is-unavailable");
          deedLookupVisualStatus.textContent = "Visual gateways unavailable; canonical signs remain available.";
        };
        deedLookupImage.src = visualUrl;
      };
      tryNextVisual();
    } else {
      deedLookupVisualFrame.classList.add("is-unavailable");
      deedLookupVisualStatus.textContent = "No valid IPFS visual URI is recorded for this deed.";
    }
    if (window.history?.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set("lookup", String(Number(deed.id)));
      window.history.replaceState({}, "", url);
    }
    return true;
  } catch {
    deedLookupStatus.textContent = "The deed archive could not be read. Serve the game over HTTP, then try again.";
    return false;
  } finally {
    deedLookupSubmit.disabled = false;
    deedLookupForm.removeAttribute("aria-busy");
    deedLookupSubmit.textContent = "FIND DOOR";
  }
}

function enterSelectedDeedSandbox() {
  const stage = createDeedSandboxStage(selectedArchiveDeed);
  if (!stage) {
    deedLookupStatus.textContent = "This deed could not be prepared as a generated sandbox.";
    return false;
  }
  deedWandererPanel.hidden = true;
  deedWandererButton.setAttribute("aria-expanded", "false");
  selectStage(stage);
  liveStatus.textContent = `Generated sandbox for Deed #${Number(stage.id)}. Campaign progress will not be changed.`;
  return true;
}

async function openDeedSandbox(rawValue) {
  const normalizedId = normalizeDeedId(rawValue);
  if (!normalizedId) return false;
  try {
    const deed = findCanonicalDeed(await loadDeedArchive(), normalizedId);
    if (!deed) return false;
    selectedArchiveDeed = deed;
    return enterSelectedDeedSandbox();
  } catch {
    openDeedWanderer(rawValue);
    deedLookupStatus.textContent = "The sandbox could not be prepared. Serve the game over HTTP, then try again.";
    return false;
  }
}

function handleKeyUp(event) {
  const direction = directionFromKey(event.key);
  if (direction) {
    event.preventDefault();
    game.releaseDirection(direction);
  }
  if (event.code === "Space") game.setPatience(false);
}

function bindDirectionButton(button) {
  const direction = button.dataset.direction;
  const press = (event) => {
    event.preventDefault();
    ensureAudio();
    button.classList.add("is-pressed");
    game.queueDirection(direction);
  };
  const release = (event) => {
    event.preventDefault();
    button.classList.remove("is-pressed");
    game.releaseDirection(direction);
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
}

function bindHoldButton(button, onPress, onRelease) {
  const press = (event) => { event.preventDefault(); ensureAudio(); button.classList.add("is-pressed"); onPress(); };
  const release = (event) => { event.preventDefault(); button.classList.remove("is-pressed"); onRelease(); };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
}

canvas.addEventListener("pointerdown", (event) => {
  if (soundEnabled) ensureAudio();
  if (game.phase === "won" || game.phase === "lost") { advanceOrRestart(); return; }
  if (game.phase === "playing" && game.paused && pausePanel.hidden) { swipeStart = null; togglePause(); return; }
  swipeStart = { x: event.clientX, y: event.clientY };
  canvas.setPointerCapture?.(event.pointerId);
});
canvas.addEventListener("pointerup", (event) => {
  if (!swipeStart) return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.hypot(dx, dy) < 24) return;
  game.queueDirection(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
});

startButton.addEventListener("click", startGame);
stageButtons.forEach((button) => button.addEventListener("click", () => {
  const stage = getStage(button.dataset.stage);
  if (!selectStage(stage, { focus: false })) return;
  liveStatus.textContent = `Selected Deed #${activeStage.id}: ${activeStage.title}.`;
}));
pauseButton.addEventListener("click", () => {
  if (!pausePanel.hidden || (game.phase === "playing" && game.paused)) resumeFromMenu();
  else openPauseMenu();
});
fullscreenButton.addEventListener("click", () => { void toggleFullscreen(); });
document.addEventListener("fullscreenchange", syncFullscreenButton);
document.addEventListener("webkitfullscreenchange", syncFullscreenButton);
resumeButton.addEventListener("click", resumeFromMenu);
restartButton.addEventListener("click", restartGame);
quitButton.addEventListener("click", quitToTitle);
audioLevelButtons.forEach((button) => button.addEventListener("click", () => {
  setAudioLevel(button.dataset.audioChannel, button.dataset.audioLevel);
}));
hapticsSettingButtons.forEach((button) => button.addEventListener("click", () => {
  setHapticsEnabled(button.dataset.hapticsSetting === "on");
}));
visualEffectsButtons.forEach((button) => button.addEventListener("click", () => {
  setVisualEffects(button.dataset.visualEffects);
}));
soundButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) ensureAudio();
  reactiveAudio.setEnabled(soundEnabled);
  soundButton.setAttribute("aria-pressed", String(soundEnabled));
  soundButton.setAttribute("aria-label", soundEnabled ? "Turn sound off" : "Turn sound on");
  liveStatus.textContent = soundEnabled ? "Sound on." : "Sound off.";
  if (soundEnabled) tone(360, 0.12, "sine", 0.035, 1.4);
});
hapticsButton.addEventListener("click", () => {
  setHapticsEnabled(!hapticsEnabled);
});
howButton.addEventListener("click", () => {
  deedWandererPanel.hidden = true;
  deedWandererButton.setAttribute("aria-expanded", "false");
  aboutPanel.hidden = true;
  aboutButton.setAttribute("aria-expanded", "false");
  communityPanel.hidden = true;
  communityButton.setAttribute("aria-expanded", "false");
  howPanel.hidden = false;
  howButton.setAttribute("aria-expanded", "true");
  closeHowButton.focus();
});
deedWandererButton.addEventListener("click", () => openDeedWanderer());
communityButton.addEventListener("click", openCommunityPanel);
closeCommunityButton.addEventListener("click", closeCommunityPanel);
aboutButton.addEventListener("click", openAboutPanel);
closeAboutButtons.forEach((button) => button.addEventListener("click", closeAboutPanel));
closeDeedWandererButton.addEventListener("click", closeDeedWanderer);
deedLookupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  void lookupCanonicalDeed(deedLookupInput.value);
});
enterDeedSandboxButton.addEventListener("click", enterSelectedDeedSandbox);
closeHowButton.addEventListener("click", () => {
  howPanel.hidden = true;
  howButton.setAttribute("aria-expanded", "false");
  startButton.focus();
});

document.querySelectorAll("[data-direction]").forEach(bindDirectionButton);
bindHoldButton(patienceButton, () => game.setPatience(true), () => game.setPatience(false));
bindHoldButton(yieldButton, () => game.activateYield(), () => {});
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
document.addEventListener("pointerdown", () => {
  if (soundEnabled && reactiveAudio.context && reactiveAudio.context.state !== "running") reactiveAudio.ensure();
}, { capture: true, passive: true });
window.addEventListener("blur", () => {
  game.releaseDirection();
  game.setPatience(false);
  if (!fullscreenTransitioning && game.phase === "playing" && !game.paused) togglePause();
});
reducedMotionMedia.addEventListener?.("change", (event) => {
  if (visualEffectsPreference !== null) return;
  visualEffects = event.matches ? "reduced" : "full";
  syncVisualEffects();
});
lowResolutionArt.addEventListener?.("change", syncArtworkResolution);

function loop(now) {
  const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
  lastTime = now;
  pollGamepad();
  update(dt);
  draw(now);
  requestAnimationFrame(loop);
}

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

if (query.get("sandbox") !== "1" && !testMode && requestedStage && !isStageUnlocked(campaignProgress, requestedStage.id) && window.history?.replaceState) {
  const url = new URL(window.location.href);
  url.searchParams.set("deed", String(Number(activeStage.id)));
  window.history.replaceState({}, "", url);
}
syncStageLanding();
syncHapticsButton();
syncAudioLevelButtons();
syncVisualEffects();
syncFullscreenButton();
if (query.get("sandbox") === "1" && query.get("deed")) {
  void openDeedSandbox(query.get("deed"));
} else if (query.get("lookup")) {
  openDeedWanderer(query.get("lookup"));
  void lookupCanonicalDeed(query.get("lookup"));
}
draw(performance.now());
requestAnimationFrame(loop);

export { game };
