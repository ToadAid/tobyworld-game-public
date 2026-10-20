import test from "node:test";
import assert from "node:assert/strict";
import { GAMEPAD_DEADZONE, readStandardGamepad } from "../src/gamepad.mjs";

function gamepad({ axes = [0, 0], buttons = {} } = {}) {
  return {
    axes,
    buttons: Array.from({ length: 16 }, (_, index) => ({ pressed: Boolean(buttons[index]), value: buttons[index] ? 1 : 0 })),
  };
}

test("standard gamepad maps D-pad and dominant left-stick axes to cardinal movement", () => {
  assert.equal(readStandardGamepad(gamepad({ buttons: { 12: true } })).held.direction, "up");
  assert.equal(readStandardGamepad(gamepad({ buttons: { 15: true } })).held.direction, "right");
  assert.equal(readStandardGamepad(gamepad({ axes: [-0.9, 0.6] })).held.direction, "left");
  assert.equal(readStandardGamepad(gamepad({ axes: [0.6, 0.9] })).held.direction, "down");
  assert.equal(readStandardGamepad(gamepad({ axes: [GAMEPAD_DEADZONE - 0.01, 0] })).held.direction, null);
});

test("standard gamepad exposes A, B, and Menu as edge-triggered actions", () => {
  const first = readStandardGamepad(gamepad({ buttons: { 0: true, 1: true, 9: true } }));
  assert.equal(first.confirmPressed, true);
  assert.equal(first.yieldPressed, true);
  assert.equal(first.menuPressed, true);
  const held = readStandardGamepad(gamepad({ buttons: { 0: true, 1: true, 9: true } }), first.held);
  assert.equal(held.confirmPressed, false);
  assert.equal(held.yieldPressed, false);
  assert.equal(held.menuPressed, false);
});

test("direction edges fire only when the controller changes direction", () => {
  const first = readStandardGamepad(gamepad({ buttons: { 14: true } }));
  assert.equal(first.directionPressed, "left");
  assert.equal(readStandardGamepad(gamepad({ buttons: { 14: true } }), first.held).directionPressed, null);
  assert.equal(readStandardGamepad(gamepad({ buttons: { 13: true } }), first.held).directionPressed, "down");
});
