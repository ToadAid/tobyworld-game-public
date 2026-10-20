import test from "node:test";
import assert from "node:assert/strict";
import { WORLDS } from "../src/worlds.mjs";

test("three wholly sample worlds are present", () => {
  assert.equal(WORLDS.length, 3);
  assert.deepEqual(WORLDS.map((world) => world.id), ["moonlit-garden", "reedwater-crossing", "sunrise-terrace"]);
});

test("sample metadata contains no canonical deed claims", () => {
  const serialized = JSON.stringify(WORLDS);
  assert.doesNotMatch(serialized, /deed|toby|taboshi|keeper|2869|2,869/i);
});
