import { WORLDS, getWorld } from "./src/worlds.mjs";
import { createRun, holdPatience, move, objectives, readyForCore, yieldAtGate } from "./src/engine.mjs";
import { loadProgress, recordCompletion, saveProgress } from "./src/progress.mjs";
import { readGamepad } from "./src/gamepad.mjs";
import { GardenAudio } from "./src/audio.mjs";
import { createPauseController, routeDialogKey } from "./src/pause.mjs";

const $ = (selector) => document.querySelector(selector);
const canvas = $("#game-canvas");
const context = canvas.getContext("2d");
const titleScreen = $("#title-screen");
const gameScreen = $("#game-screen");
const communityDialog = $("#community-dialog");
const pauseDialog = $("#pause-dialog");
const audio = new GardenAudio();
let progress = loadProgress();
let worldIndex = 0;
let run = null;
let playing = false;
let patienceHeld = false;
let lastFrame = performance.now();
let lastPad = {};
let toastTimer = 0;
const pauseController = createPauseController({
  dialog: pauseDialog,
  resumeButton: $("#resume-button"),
  canvas,
  canResume: () => Boolean(run && !run.complete && !gameScreen.hidden),
  setPlaying: (value) => { playing = value; },
  clearHeldInput: () => { patienceHeld = false; },
});

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2100);
}

function renderWorldList() {
  const list = $("#world-list");
  list.replaceChildren(...WORLDS.map((world, index) => {
    const button = document.createElement("button");
    button.className = "world-card";
    button.type = "button";
    button.disabled = index >= progress.unlocked;
    button.innerHTML = `<span class="world-number">0${index + 1}</span><span><strong>${world.name}</strong><small>${world.subtitle}</small></span><span class="world-state">${progress.completed.includes(world.id) ? "TENDED" : button.disabled ? "LOCKED" : "OPEN"}</span>`;
    button.addEventListener("click", () => startWorld(index));
    return button;
  }));
  $("#continue-button").textContent = progress.completed.length ? "Continue the path" : "Begin the path";
}

function startWorld(index) {
  worldIndex = Math.max(0, Math.min(progress.unlocked - 1, index));
  run = createRun(getWorld(worldIndex));
  audio.setWorld(run.world);
  titleScreen.hidden = true;
  gameScreen.hidden = false;
  playing = true;
  $("#world-count").textContent = `${worldIndex + 1} / ${WORLDS.length}`;
  $("#world-name").textContent = run.world.name;
  $("#world-subtitle").textContent = run.world.subtitle;
  updateHud();
  draw();
  canvas.focus({ preventScroll: true });
  showToast(run.world.description);
}

function returnToTitle() {
  pauseController.closeFor("title");
  playing = false;
  gameScreen.hidden = true; titleScreen.hidden = false;
  renderWorldList();
  $("#continue-button").focus();
}

function updateHud() {
  if (!run) return;
  const status = objectives(run);
  const rows = [
    ["#lights-status", `${status.lights} / ${status.lightsGoal} lights gathered`, status.lights === status.lightsGoal],
    ["#sprouts-status", `${status.sprouts} / ${status.sproutsGoal} sprouts tended`, status.sprouts === status.sproutsGoal],
    ["#beacon-status", status.beacon ? "Beacon awakened" : "Find the beacon", status.beacon],
    ["#gate-status", status.gate ? "Yield gate opened" : `Yield at the gate (${run.yields} ready)`, status.gate],
  ];
  for (const [selector, label, done] of rows) {
    const row = $(selector); row.querySelector("span:last-child").textContent = label; row.classList.toggle("done", done);
  }
  canvas.setAttribute("aria-label", `${run.world.name}. Player at column ${run.player.x + 1}, row ${run.player.y + 1}. ${rows.map(([, label]) => label).join(". ")}`);
}

function performMove(dx, dy) {
  if (!playing || !run || pauseDialog.open) return;
  patienceHeld = false;
  const result = move(run, dx, dy);
  if (result.moved) audio.cue(result.event === "step" ? "step" : result.event, run.collected.size);
  if (result.event === "gate") showToast("The reed gate listens for Yield. Press Q or use the Yield control.");
  if (result.event === "core-locked") showToast("The Core is waiting for every objective.");
  if (result.event === "light") showToast("A garden light joins your path.");
  if (result.event === "beacon") showToast("The wayfinding beacon is awake.");
  if (result.event === "complete") completeWorld();
  updateHud(); draw();
}

function performYield() {
  if (!playing || !run || pauseDialog.open) return;
  if (yieldAtGate(run)) { audio.cue("gate"); showToast("You yield. The gate opens."); updateHud(); draw(); }
  else showToast(run.gateOpen ? "The gate is already open." : "Stand beside the reed gate before you Yield.");
}

function completeWorld() {
  playing = false;
  audio.cue("complete");
  progress = saveProgress(recordCompletion(progress, run.world.id, run.moves, worldIndex));
  draw();
  const final = worldIndex === WORLDS.length - 1;
  showToast(final ? "The sample path is complete. Every builder has a door." : "The Core wakes. The next garden is open.");
  setTimeout(() => {
    if (!run?.complete) return;
    if (final) returnToTitle(); else startWorld(worldIndex + 1);
  }, 2400);
}

function drawLandscape(world, time) {
  const { width, height } = canvas;
  const gradient = context.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, world.palette.sky); gradient.addColorStop(1, world.palette.water);
  context.fillStyle = gradient; context.fillRect(0, 0, width, height);
  context.globalAlpha = .2;
  for (let i = 0; i < 7; i += 1) {
    const x = (i * 157 + worldIndex * 83) % width;
    const y = 70 + (i % 3) * 54;
    const radius = 40 + (i % 4) * 18;
    context.fillStyle = i % 2 ? world.palette.glow : world.palette.accent;
    context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill();
  }
  context.globalAlpha = 1;
  context.fillStyle = world.palette.ground;
  context.beginPath(); context.moveTo(0, 250); context.quadraticCurveTo(220, 150, 450, 270); context.quadraticCurveTo(680, 360, width, 210); context.lineTo(width, height); context.lineTo(0, height); context.fill();
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    context.globalAlpha = .25 + Math.sin(time / 900) * .08; context.fillStyle = world.palette.glow;
    context.beginPath(); context.arc(width * .78, 92, 55, 0, Math.PI * 2); context.fill(); context.globalAlpha = 1;
  }
}

function tileCenter(point) { return { x: point.x * 60 + 30, y: point.y * 60 + 30 }; }
function drawDiamond(point, radius, color, fill = true) {
  const center = tileCenter(point); context.beginPath(); context.moveTo(center.x, center.y - radius); context.lineTo(center.x + radius, center.y); context.lineTo(center.x, center.y + radius); context.lineTo(center.x - radius, center.y); context.closePath();
  if (fill) { context.fillStyle = color; context.fill(); } else { context.strokeStyle = color; context.lineWidth = 4; context.stroke(); }
}

function draw(time = performance.now()) {
  if (!run) return;
  const world = run.world;
  drawLandscape(world, time);
  context.fillStyle = "rgba(4, 20, 19, .42)"; context.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < world.size.height; y += 1) for (let x = 0; x < world.size.width; x += 1) {
    const wall = world.walls.some((point) => point.x === x && point.y === y);
    if (wall) { context.fillStyle = "rgba(4, 22, 20, .77)"; context.fillRect(x * 60 + 2, y * 60 + 2, 56, 56); }
    else { context.fillStyle = `${world.palette.path}28`; context.fillRect(x * 60 + 5, y * 60 + 5, 50, 50); }
  }
  for (const light of world.lights) if (!run.collected.has(`${light.x},${light.y}`)) drawDiamond(light, 10, world.palette.accent);
  for (const sprout of world.sprouts) {
    const center = tileCenter(sprout); const tended = run.tended.has(`${sprout.x},${sprout.y}`);
    context.strokeStyle = tended ? world.palette.glow : "#8a936f"; context.lineWidth = 5; context.beginPath(); context.moveTo(center.x, center.y + 13); context.quadraticCurveTo(center.x - 5, center.y, center.x + 9, center.y - 13); context.stroke();
    context.fillStyle = tended ? world.palette.glow : "#66705a"; context.beginPath(); context.ellipse(center.x + 9, center.y - 10, 10, 5, -.5, 0, Math.PI * 2); context.fill();
  }
  const beacon = tileCenter(world.beacon); context.strokeStyle = run.beaconFound ? world.palette.glow : "#9aa69a"; context.lineWidth = 4; context.beginPath(); context.arc(beacon.x, beacon.y, 15, 0, Math.PI * 2); context.stroke(); context.beginPath(); context.moveTo(beacon.x, beacon.y - 21); context.lineTo(beacon.x, beacon.y + 21); context.stroke();
  const gate = tileCenter(world.gate); context.strokeStyle = run.gateOpen ? world.palette.glow : world.palette.accent; context.lineWidth = 6; context.beginPath(); context.moveTo(gate.x - 18, gate.y + 18); context.lineTo(gate.x - 18, gate.y - 18); context.lineTo(gate.x + 18, gate.y - 18); context.lineTo(gate.x + 18, gate.y + 18); context.stroke();
  if (run.gateOpen) { context.beginPath(); context.moveTo(gate.x + 18, gate.y - 18); context.lineTo(gate.x + 30, gate.y); context.lineTo(gate.x + 18, gate.y + 18); context.stroke(); }
  const core = tileCenter(world.core); context.fillStyle = readyForCore(run) ? world.palette.glow : "rgba(180,190,172,.55)"; context.beginPath(); context.arc(core.x, core.y, 21, 0, Math.PI * 2); context.fill(); context.strokeStyle = world.palette.accent; context.lineWidth = 4; context.beginPath(); context.arc(core.x, core.y, 29, 0, Math.PI * 2); context.stroke();
  const player = tileCenter(run.player); context.fillStyle = "#fff7cf"; context.beginPath(); context.arc(player.x, player.y, 15, 0, Math.PI * 2); context.fill(); context.fillStyle = world.palette.ground; context.beginPath(); context.arc(player.x - 6, player.y - 2, 3, 0, Math.PI * 2); context.arc(player.x + 6, player.y - 2, 3, 0, Math.PI * 2); context.fill(); context.strokeStyle = world.palette.ground; context.lineWidth = 2; context.beginPath(); context.arc(player.x, player.y + 2, 7, .2, Math.PI - .2); context.stroke();
  if (run.complete) { context.fillStyle = "rgba(4,20,19,.72)"; context.fillRect(0, 0, canvas.width, canvas.height); context.textAlign = "center"; context.fillStyle = world.palette.glow; context.font = "700 46px Georgia"; context.fillText("THE CORE IS AWAKE", canvas.width / 2, canvas.height / 2); }
}

function setPaused(paused) {
  if (paused) pauseController.pause();
  else pauseController.resume();
}

document.addEventListener("keydown", (event) => {
  const dialogAction = routeDialogKey({ key: event.key, pauseOpen: pauseDialog.open, communityOpen: communityDialog.open });
  if (dialogAction === "resume") { event.preventDefault(); setPaused(false); return; }
  if (dialogAction === "ignore") return;
  const moves = { ArrowUp: [0,-1], w: [0,-1], W: [0,-1], ArrowDown: [0,1], s: [0,1], S: [0,1], ArrowLeft: [-1,0], a: [-1,0], A: [-1,0], ArrowRight: [1,0], d: [1,0], D: [1,0] };
  if (moves[event.key]) { event.preventDefault(); performMove(...moves[event.key]); }
  if (event.code === "Space" && playing) { event.preventDefault(); patienceHeld = true; audio.ensure(); }
  if (event.key === "q" || event.key === "Q") { event.preventDefault(); performYield(); }
  if (event.key === "Escape" && !gameScreen.hidden) { event.preventDefault(); setPaused(true); }
});
document.addEventListener("keyup", (event) => { if (event.code === "Space") patienceHeld = false; });
document.querySelectorAll("[data-move]").forEach((button) => button.addEventListener("click", () => performMove(...button.dataset.move.split(",").map(Number))));
$("#yield-button").addEventListener("click", performYield);
for (const eventName of ["pointerdown", "pointerup", "pointercancel", "pointerleave"]) $("#patience-button").addEventListener(eventName, (event) => { patienceHeld = eventName === "pointerdown"; if (patienceHeld) { event.preventDefault(); audio.ensure(); } });
$("#continue-button").addEventListener("click", () => startWorld(Math.min(progress.unlocked - 1, progress.completed.length)));
$("#community-button").addEventListener("click", () => communityDialog.showModal());
$("[data-close]").addEventListener("click", () => communityDialog.close());
$("#pause-button").addEventListener("click", () => setPaused(true));
$("#resume-button").addEventListener("click", () => setPaused(false));
$("#restart-button").addEventListener("click", () => { pauseController.closeFor("restart"); startWorld(worldIndex); });
$("#title-button").addEventListener("click", returnToTitle);
$("#sound-button").addEventListener("click", (event) => { const enabled = event.currentTarget.getAttribute("aria-pressed") !== "true"; event.currentTarget.setAttribute("aria-pressed", String(enabled)); event.currentTarget.setAttribute("aria-label", enabled ? "Mute sound" : "Unmute sound"); audio.setEnabled(enabled); if (enabled) audio.ensure(); });
$("#fullscreen-button").addEventListener("click", async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { showToast("Fullscreen is not available in this browser."); } });
document.addEventListener("fullscreenchange", () => $("#fullscreen-button").setAttribute("aria-label", document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen"));
for (const dialog of [communityDialog, pauseDialog]) dialog.addEventListener("click", (event) => { if (event.target === dialog && dialog === communityDialog) dialog.close(); });

function frame(now) {
  const delta = Math.min(.1, (now - lastFrame) / 1000); lastFrame = now;
  if (playing && patienceHeld && run) {
    const result = holdPatience(run, delta);
    if (result.tended) { audio.cue("tend", run.tended.size); showToast("Patience helps a sprout rise."); updateHud(); }
  }
  const pad = navigator.getGamepads?.()[0];
  if (playing && pad) {
    const actions = readGamepad(pad, lastPad);
    const current = { left: pad.buttons?.[14]?.pressed || (pad.axes?.[0] ?? 0) < -.55, right: pad.buttons?.[15]?.pressed || (pad.axes?.[0] ?? 0) > .55, up: pad.buttons?.[12]?.pressed || (pad.axes?.[1] ?? 0) < -.55, down: pad.buttons?.[13]?.pressed || (pad.axes?.[1] ?? 0) > .55, patience: pad.buttons?.[0]?.pressed, yield: pad.buttons?.[1]?.pressed, pause: pad.buttons?.[9]?.pressed };
    if (actions.left) performMove(-1,0); if (actions.right) performMove(1,0); if (actions.up) performMove(0,-1); if (actions.down) performMove(0,1); if (actions.yield) performYield(); if (actions.pause) setPaused(true);
    patienceHeld = Boolean(current.patience); lastPad = current;
  }
  if (run && !gameScreen.hidden) draw(now);
  requestAnimationFrame(frame);
}

renderWorldList(); requestAnimationFrame(frame);
if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("./sw.js").catch(() => {});
