export const GAMEPAD_DEADZONE = 0.55;

function pressed(gamepad, index) {
  const button = gamepad?.buttons?.[index];
  return Boolean(typeof button === "number" ? button > 0.5 : button?.pressed || button?.value > 0.5);
}

function axis(gamepad, index) {
  const value = Number(gamepad?.axes?.[index]);
  return Number.isFinite(value) ? value : 0;
}

function readDirection(gamepad) {
  if (pressed(gamepad, 12)) return "up";
  if (pressed(gamepad, 13)) return "down";
  if (pressed(gamepad, 14)) return "left";
  if (pressed(gamepad, 15)) return "right";

  const horizontal = axis(gamepad, 0);
  const vertical = axis(gamepad, 1);
  if (Math.max(Math.abs(horizontal), Math.abs(vertical)) < GAMEPAD_DEADZONE) return null;
  if (Math.abs(horizontal) > Math.abs(vertical)) return horizontal < 0 ? "left" : "right";
  return vertical < 0 ? "up" : "down";
}

export function readStandardGamepad(gamepad, previous = {}) {
  const held = Object.freeze({
    direction: readDirection(gamepad),
    confirm: pressed(gamepad, 0),
    yield: pressed(gamepad, 1),
    menu: pressed(gamepad, 9),
  });
  return Object.freeze({
    held,
    directionPressed: held.direction && held.direction !== previous.direction ? held.direction : null,
    confirmPressed: held.confirm && !previous.confirm,
    yieldPressed: held.yield && !previous.yield,
    menuPressed: held.menu && !previous.menu,
  });
}
