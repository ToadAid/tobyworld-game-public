import test from "node:test";
import assert from "node:assert/strict";
import {
  AUDIO_LEVELS,
  AUDIO_MIX,
  AUDIO_PREFERENCES_KEY,
  ReactiveAudioEngine,
  SOUND_PROFILES,
  loadAudioPreferences,
  saveAudioPreferences,
} from "../src/audio.mjs";

test("every playable deed has a distinct reactive sound profile", () => {
  assert.deepEqual(new Set(Object.keys(SOUND_PROFILES)), new Set(["0715", "0716", "0717", "0718", "0340", "0378", "0118", "0182", "0887", "1091", "0969", "0094"]));
  assert.equal(new Set(Object.values(SOUND_PROFILES).map(({ name }) => name)).size, 12);
  assert.equal(new Set(Object.values(SOUND_PROFILES).map(({ tempo }) => tempo)).size, 12);
  for (const profile of Object.values(SOUND_PROFILES)) {
    assert.equal(profile.notes.length, 8);
    assert.equal(profile.drone.length, 2);
    assert.ok(profile.tempo >= 60 && profile.tempo <= 80);
  }
});

test("the background mix remains clearly audible beside gameplay effects", () => {
  assert.equal(AUDIO_MIX.master, 0.92);
  assert.equal(AUDIO_MIX.ambience, 1.2);
  assert.equal(AUDIO_MIX.music, 3.4);
  assert.equal(AUDIO_MIX.effects, 1.15);
});

test("music and effects levels are normalized and persist independently", () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  assert.deepEqual(loadAudioPreferences(storage), { music: "high", effects: "high" });
  assert.equal(saveAudioPreferences({ music: "low", effects: "medium" }, storage), true);
  assert.equal(values.has(AUDIO_PREFERENCES_KEY), true);
  assert.deepEqual(loadAudioPreferences(storage), { music: "low", effects: "medium" });
  values.set(AUDIO_PREFERENCES_KEY, JSON.stringify({ music: "unexpected", effects: "low" }));
  assert.deepEqual(loadAudioPreferences(storage), { music: "high", effects: "low" });
  assert.deepEqual(AUDIO_LEVELS, { low: 0.45, medium: 0.72, high: 1 });
});

test("audio levels can be selected before the browser creates an audio context", () => {
  const audio = new ReactiveAudioEngine();
  assert.deepEqual(audio.setMix({ music: "low", effects: "medium" }), { music: "low", effects: "medium" });
  assert.deepEqual(audio.audioLevels, { music: "low", effects: "medium" });
  assert.deepEqual(audio.setMix({ music: "invalid" }), { music: "high", effects: "medium" });
});

test("background music schedules melody, bell, harmony, and pulse voices", () => {
  const starts = [];
  const parameter = { setValueAtTime() {}, exponentialRampToValueAtTime() {} };
  const context = {
    createOscillator() {
      return { frequency: parameter, connect(node) { return node; }, start(time) { starts.push(time); }, stop() {} };
    },
    createGain() {
      return { gain: parameter, connect(node) { return node; } };
    },
  };
  const audio = new ReactiveAudioEngine(() => context);
  audio.context = context;
  audio.musicBus = {};
  audio.scheduleMusicNote(220, 1, 0.7, 0);
  assert.equal(starts.length, 4);
  assert.ok(starts.some((time) => time > 1), "the bell reply should follow the lead note");
});

test("the audio engine degrades safely where Web Audio is unavailable", () => {
  const audio = new ReactiveAudioEngine(() => null);
  assert.equal(audio.ensure(), false);
  audio.setStage("0717");
  audio.setEnabled(false);
  audio.update({ playing: true, danger: true });
  audio.footstep();
  audio.light(3);
  audio.patienceStart();
  audio.patienceRelease();
  audio.harvest();
  assert.equal(audio.stageId, "0717");
  assert.equal(audio.enabled, false);
});

test("a newly created suspended mobile audio context is resumed immediately", () => {
  let resumeCalls = 0;
  const context = {
    state: "suspended",
    resume() { resumeCalls += 1; return Promise.resolve(); },
  };
  const audio = new ReactiveAudioEngine(() => context);
  audio.buildGraph = () => {};
  audio.setStage = (stageId) => { audio.stageId = stageId; };
  audio.setEnabled = (enabled) => { audio.enabled = enabled; };
  assert.equal(audio.ensure(), true);
  assert.equal(resumeCalls, 1);
});

test("later player gestures retry suspended or interrupted mobile audio", () => {
  let resumeCalls = 0;
  const audio = new ReactiveAudioEngine();
  audio.context = {
    state: "interrupted",
    resume() { resumeCalls += 1; return Promise.resolve(); },
  };
  assert.equal(audio.ensure(), true);
  assert.equal(resumeCalls, 1);
});
