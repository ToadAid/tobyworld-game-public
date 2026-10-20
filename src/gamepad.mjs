export function readGamepad(pad, previous = {}) {
  if (!pad) return {};
  const pressed = (index) => Boolean(pad.buttons?.[index]?.pressed);
  const axisX = pad.axes?.[0] ?? 0;
  const axisY = pad.axes?.[1] ?? 0;
  const next = {
    left: pressed(14) || axisX < -0.55,
    right: pressed(15) || axisX > 0.55,
    up: pressed(12) || axisY < -0.55,
    down: pressed(13) || axisY > 0.55,
    patience: pressed(0),
    yield: pressed(1),
    pause: pressed(9),
  };
  return Object.fromEntries(Object.entries(next).map(([name, value]) => [name, value && !previous[name]]));
}
