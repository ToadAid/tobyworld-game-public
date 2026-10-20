// These lines are Toadaid story adaptations, not quotations from canonical lore.
export const KEEPER_WHISPERS = Object.freeze({
  Hush: Object.freeze({
    lines: Object.freeze([
      "Stillness is another way of hearing.",
      "Let the water finish speaking before you cross.",
      "Quiet does not hide the path. It makes room for it.",
      "Release the next step until the land offers it back.",
      "What waits beneath the surface answers a patient breath.",
    ]),
    adapted: true,
  }),
  Satoby: Object.freeze({
    lines: Object.freeze([
      "The way reveals itself when it is not forced.",
      "A welcomed path remembers the feet that approached gently.",
      "Tend what is near, and the far door will become visible.",
      "The compass points clearly when the heart stops pulling it.",
      "Every crossing begins by honoring the shore beneath you.",
    ]),
    adapted: true,
  }),
  OG: Object.freeze({
    lines: Object.freeze([
      "Courage is shelter enough for the next step.",
      "Stand beneath the open sky; fear cannot keep every direction.",
      "A guarded heart can still choose the gentlest road.",
      "Carry your courage lightly. The path must breathe too.",
      "The storm is not asking you to hurry—only to continue.",
    ]),
    adapted: true,
  }),
});

function stableIndex(value, length) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % length;
}

export function getKeeperWhisper(name, context = "") {
  const lines = KEEPER_WHISPERS[name]?.lines;
  if (!lines?.length) return "Listen. The land remembers patience.";
  return lines[context ? stableIndex(`${name}|${context}`, lines.length) : 0];
}
