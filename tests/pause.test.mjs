import test from "node:test";
import assert from "node:assert/strict";
import { createPauseController, routeDialogKey } from "../src/pause.mjs";

class FakeDialog {
  constructor() { this.open = false; this.returnValue = ""; this.listeners = new Map(); }
  addEventListener(name, listener) { this.listeners.set(name, listener); }
  showModal() { this.open = true; }
  close(value = "") { this.returnValue = value; this.open = false; this.listeners.get("close")?.(); }
  cancel() {
    let prevented = false;
    this.listeners.get("cancel")?.({ preventDefault: () => { prevented = true; } });
    return prevented;
  }
  unexpectedClose() { this.returnValue = ""; this.open = false; this.listeners.get("close")?.(); }
}

function harness() {
  const dialog = new FakeDialog();
  const events = [];
  let resumable = true;
  const controller = createPauseController({
    dialog,
    resumeButton: { focus: () => events.push("focus-resume") },
    canvas: { focus: () => events.push("focus-canvas") },
    canResume: () => resumable,
    setPlaying: (value) => events.push(`playing-${value}`),
    clearHeldInput: () => events.push("clear-input"),
  });
  return { controller, dialog, events, setResumable: (value) => { resumable = value; } };
}

test("pause and explicit resume restore gameplay and canvas focus", () => {
  const { controller, dialog, events } = harness();
  assert.equal(controller.pause(), true);
  assert.equal(dialog.open, true);
  assert.deepEqual(events, ["clear-input", "playing-false", "focus-resume"]);
  controller.resume();
  assert.equal(dialog.open, false);
  assert.deepEqual(events.slice(-3), ["clear-input", "playing-true", "focus-canvas"]);
});

test("Escape cancellation is prevented and resumes through the same safe path", () => {
  const { controller, dialog, events } = harness();
  controller.pause();
  assert.equal(dialog.cancel(), true);
  assert.equal(dialog.open, false);
  assert.deepEqual(events.slice(-3), ["clear-input", "playing-true", "focus-canvas"]);
});

test("an unexpected dialog close cannot leave resumable gameplay stuck", () => {
  const { controller, dialog, events } = harness();
  controller.pause();
  dialog.unexpectedClose();
  assert.deepEqual(events.slice(-3), ["clear-input", "playing-true", "focus-canvas"]);
});

test("restart and title close paths do not briefly resume or steal focus", () => {
  for (const intent of ["restart", "title"]) {
    const { controller, events } = harness();
    controller.pause();
    controller.closeFor(intent);
    assert.equal(events.includes("playing-true"), false);
    assert.equal(events.includes("focus-canvas"), false);
  }
});

test("a completed or hidden game cannot be resumed", () => {
  const { controller, events, setResumable } = harness();
  setResumable(false);
  assert.equal(controller.pause(), false);
  controller.resume();
  assert.equal(events.includes("playing-true"), false);
});

test("dialog keyboard routing reserves gameplay shortcuts and toggles Escape", () => {
  assert.equal(routeDialogKey({ key: "Escape", pauseOpen: true, communityOpen: false }), "resume");
  assert.equal(routeDialogKey({ key: "ArrowUp", pauseOpen: true, communityOpen: false }), "ignore");
  assert.equal(routeDialogKey({ key: "q", pauseOpen: false, communityOpen: true }), "ignore");
  assert.equal(routeDialogKey({ key: "ArrowUp", pauseOpen: false, communityOpen: false }), "game");
});
