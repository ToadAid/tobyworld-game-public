export const SOUND_PROFILES = Object.freeze({
  "0715": Object.freeze({
    name: "Verdant Veil",
    tempo: 72,
    notes: Object.freeze([220, 330, 392, 330, 247, 330, 440, 392]),
    drone: Object.freeze([55, 82.41]),
    filter: 920,
    ambience: 0.035,
    music: 0.15,
    noise: 0.11,
    step: Object.freeze([105, 126]),
    wave: "sine",
  }),
  "0716": Object.freeze({
    name: "Violet Dusk",
    tempo: 64,
    notes: Object.freeze([261.63, 392, 523.25, 392, 293.66, 440, 587.33, 440]),
    drone: Object.freeze([65.41, 98]),
    filter: 1650,
    ambience: 0.03,
    music: 0.12,
    noise: 0.16,
    step: Object.freeze([620, 780]),
    wave: "triangle",
  }),
  "0717": Object.freeze({
    name: "Gilded Dawn",
    tempo: 68,
    notes: Object.freeze([196, 293.66, 369.99, 293.66, 220, 329.63, 440, 329.63]),
    drone: Object.freeze([49, 73.42]),
    filter: 720,
    ambience: 0.038,
    music: 0.14,
    noise: 0.13,
    step: Object.freeze([155, 196]),
    wave: "sine",
  }),
  "0718": Object.freeze({
    name: "Cloudwake",
    tempo: 76,
    notes: Object.freeze([293.66, 440, 587.33, 440, 329.63, 493.88, 659.25, 493.88]),
    drone: Object.freeze([73.42, 110]),
    filter: 1380,
    ambience: 0.032,
    music: 0.13,
    noise: 0.18,
    step: Object.freeze([245, 311]),
    wave: "triangle",
  }),
  "0340": Object.freeze({
    name: "Gilded Sporegrove",
    tempo: 70,
    notes: Object.freeze([233.08, 349.23, 466.16, 349.23, 261.63, 392, 523.25, 392]),
    drone: Object.freeze([58.27, 87.31]),
    filter: 1080,
    ambience: 0.042,
    music: 0.135,
    noise: 0.2,
    step: Object.freeze([118, 148]),
    wave: "sine",
  }),
  "0378": Object.freeze({
    name: "Cloudwake Emberreach",
    tempo: 78,
    notes: Object.freeze([164.81, 246.94, 329.63, 246.94, 185, 277.18, 369.99, 277.18]),
    drone: Object.freeze([41.2, 61.74]),
    filter: 1280,
    ambience: 0.04,
    music: 0.14,
    noise: 0.24,
    step: Object.freeze([132, 176]),
    wave: "triangle",
  }),
  "0118": Object.freeze({
    name: "Violet Mossmere",
    tempo: 66,
    notes: Object.freeze([207.65, 311.13, 415.3, 311.13, 233.08, 349.23, 466.16, 349.23]),
    drone: Object.freeze([51.91, 77.78]),
    filter: 840,
    ambience: 0.044,
    music: 0.13,
    noise: 0.17,
    step: Object.freeze([96, 120]),
    wave: "sine",
  }),
  "0182": Object.freeze({
    name: "Gilded Meadow",
    tempo: 74,
    notes: Object.freeze([277.18, 415.3, 554.37, 415.3, 311.13, 466.16, 622.25, 466.16]),
    drone: Object.freeze([69.3, 103.83]),
    filter: 1160,
    ambience: 0.038,
    music: 0.145,
    noise: 0.14,
    step: Object.freeze([142, 184]),
    wave: "triangle",
  }),
  "0887": Object.freeze({
    name: "Cloudwake Frost Map", tempo: 62,
    notes: Object.freeze([246.94, 369.99, 493.88, 369.99, 277.18, 415.3, 554.37, 415.3]),
    drone: Object.freeze([61.74, 92.5]), filter: 1540, ambience: 0.034, music: 0.125, noise: 0.2,
    step: Object.freeze([540, 690]), wave: "triangle",
  }),
  "1091": Object.freeze({
    name: "Verdant Stillwater Below", tempo: 60,
    notes: Object.freeze([174.61, 261.63, 349.23, 261.63, 196, 293.66, 392, 293.66]),
    drone: Object.freeze([43.65, 65.41]), filter: 680, ambience: 0.042, music: 0.12, noise: 0.15,
    step: Object.freeze([138, 174]), wave: "sine",
  }),
  "0969": Object.freeze({
    name: "Cloudwake Pond Welcome", tempo: 69,
    notes: Object.freeze([220, 329.63, 440, 329.63, 246.94, 369.99, 493.88, 369.99]),
    drone: Object.freeze([55, 82.41]), filter: 980, ambience: 0.046, music: 0.13, noise: 0.12,
    step: Object.freeze([172, 220]), wave: "sine",
  }),
  "0094": Object.freeze({
    name: "Verdant Pond Convergence", tempo: 65,
    notes: Object.freeze([196, 293.66, 392, 493.88, 440, 329.63, 261.63, 392]),
    drone: Object.freeze([49, 73.42]), filter: 1120, ambience: 0.048, music: 0.14, noise: 0.1,
    step: Object.freeze([184, 246]), wave: "triangle",
  }),
});

const DEFAULT_STAGE = "0715";
export const AUDIO_MIX = Object.freeze({
  master: 0.92,
  ambience: 1.2,
  music: 3.4,
  effects: 1.15,
});

export const AUDIO_LEVELS = Object.freeze({
  low: 0.45,
  medium: 0.72,
  high: 1,
});

export const AUDIO_PREFERENCES_KEY = "tobyworld-audio-levels";
const DEFAULT_AUDIO_PREFERENCES = Object.freeze({ music: "high", effects: "high" });

function normalizeAudioLevel(value) {
  return Object.hasOwn(AUDIO_LEVELS, value) ? value : "high";
}

export function loadAudioPreferences(storage = globalThis.localStorage) {
  try {
    const saved = JSON.parse(storage?.getItem(AUDIO_PREFERENCES_KEY) ?? "null");
    return {
      music: normalizeAudioLevel(saved?.music),
      effects: normalizeAudioLevel(saved?.effects),
    };
  } catch {
    return { ...DEFAULT_AUDIO_PREFERENCES };
  }
}

export function saveAudioPreferences(preferences, storage = globalThis.localStorage) {
  const normalized = {
    music: normalizeAudioLevel(preferences?.music),
    effects: normalizeAudioLevel(preferences?.effects),
  };
  try {
    storage?.setItem(AUDIO_PREFERENCES_KEY, JSON.stringify(normalized));
    return true;
  } catch {
    return false;
  }
}

function setSmooth(parameter, value, now, speed = 0.08) {
  parameter.cancelScheduledValues(now);
  parameter.setTargetAtTime(value, now, speed);
}

export class ReactiveAudioEngine {
  constructor(contextFactory = null) {
    this.contextFactory = contextFactory;
    this.context = null;
    this.enabled = true;
    this.stageId = DEFAULT_STAGE;
    this.profile = SOUND_PROFILES[DEFAULT_STAGE];
    this.sequenceIndex = 0;
    this.nextNoteTime = 0;
    this.stepIndex = 0;
    this.patienceActive = false;
    this.audioLevels = { ...DEFAULT_AUDIO_PREFERENCES };
  }

  ensure() {
    if (this.context) {
      this.resumeIfNeeded();
      return true;
    }

    const Context = globalThis.AudioContext ?? globalThis.webkitAudioContext;
    if (!this.contextFactory && !Context) return false;
    try {
      this.context = this.contextFactory ? this.contextFactory() : new Context();
    } catch {
      this.context = null;
      return false;
    }
    if (!this.context) return false;
    this.buildGraph();
    this.setStage(this.stageId);
    this.setEnabled(this.enabled);
    this.resumeIfNeeded();
    return true;
  }

  resumeIfNeeded() {
    if (!this.context || this.context.state === "running" || this.context.state === "closed" || typeof this.context.resume !== "function") return;
    try {
      const attempt = this.context.resume();
      attempt?.catch?.(() => {});
    } catch {
      // A later player gesture will retry. Mobile browsers may reject stale activation.
    }
  }

  buildGraph() {
    const context = this.context;
    this.master = context.createGain();
    this.musicBus = context.createGain();
    this.ambienceBus = context.createGain();
    this.effectsBus = context.createGain();
    this.compressor = context.createDynamicsCompressor();
    this.ambienceFilter = context.createBiquadFilter();
    this.noiseGain = context.createGain();
    this.droneGains = [context.createGain(), context.createGain()];
    this.drones = [context.createOscillator(), context.createOscillator()];

    this.master.gain.value = 0;
    this.musicBus.gain.value = 0;
    this.ambienceBus.gain.value = 0;
    this.effectsBus.gain.value = AUDIO_MIX.effects * AUDIO_LEVELS[this.audioLevels.effects];
    this.ambienceFilter.type = "lowpass";
    this.ambienceFilter.Q.value = 0.7;
    this.noiseGain.gain.value = 0.1;
    this.compressor.threshold.value = -20;
    this.compressor.knee.value = 16;
    this.compressor.ratio.value = 5;
    this.compressor.attack.value = 0.008;
    this.compressor.release.value = 0.2;

    this.musicBus.connect(this.master);
    this.ambienceBus.connect(this.master);
    this.effectsBus.connect(this.master);
    this.master.connect(this.compressor).connect(context.destination);

    this.drones.forEach((oscillator, index) => {
      oscillator.type = index ? "triangle" : "sine";
      this.droneGains[index].gain.value = index ? 0.035 : 0.055;
      oscillator.connect(this.droneGains[index]).connect(this.ambienceFilter);
      oscillator.start();
    });

    const noiseBuffer = context.createBuffer(1, Math.max(1, Math.floor(context.sampleRate * 2)), context.sampleRate);
    const noise = noiseBuffer.getChannelData(0);
    let previous = 0;
    for (let index = 0; index < noise.length; index += 1) {
      previous = previous * 0.985 + (Math.random() * 2 - 1) * 0.015;
      noise[index] = previous;
    }
    this.noiseSource = context.createBufferSource();
    this.noiseSource.buffer = noiseBuffer;
    this.noiseSource.loop = true;
    this.noiseSource.connect(this.noiseGain).connect(this.ambienceFilter);
    this.noiseSource.start();
    this.ambienceFilter.connect(this.ambienceBus);
  }

  setStage(stageId) {
    this.stageId = SOUND_PROFILES[stageId] ? stageId : DEFAULT_STAGE;
    this.profile = SOUND_PROFILES[this.stageId];
    this.sequenceIndex = 0;
    this.nextNoteTime = this.context ? this.context.currentTime + 0.12 : 0;
    if (!this.context) return;
    const now = this.context.currentTime;
    this.drones.forEach((oscillator, index) => setSmooth(oscillator.frequency, this.profile.drone[index] * 2, now, 0.3));
    setSmooth(this.ambienceFilter.frequency, this.profile.filter, now, 0.25);
    setSmooth(this.noiseGain.gain, this.profile.noise, now, 0.2);
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    if (!this.context) return;
    setSmooth(this.master.gain, this.enabled ? AUDIO_MIX.master : 0, this.context.currentTime, 0.035);
  }

  setMix(preferences = {}) {
    this.audioLevels = {
      music: normalizeAudioLevel(preferences.music ?? this.audioLevels.music),
      effects: normalizeAudioLevel(preferences.effects ?? this.audioLevels.effects),
    };
    if (this.context && this.effectsBus) {
      setSmooth(
        this.effectsBus.gain,
        AUDIO_MIX.effects * AUDIO_LEVELS[this.audioLevels.effects],
        this.context.currentTime,
        0.035,
      );
    }
    return { ...this.audioLevels };
  }

  update({ playing = false, paused = false, patience = false, danger = false } = {}) {
    if (!this.context) return;
    const now = this.context.currentTime;
    const active = this.enabled && playing && !paused;
    const breathing = active && patience;
    if (breathing !== this.patienceActive) {
      this.patienceActive = breathing;
      if (breathing) this.patienceStart();
      else if (active) this.patienceRelease();
    }
    const musicScale = AUDIO_LEVELS[this.audioLevels.music];
    const ambienceLevel = active ? this.profile.ambience * AUDIO_MIX.ambience * musicScale * (patience ? 1.12 : 1) : 0;
    const musicLevel = active ? this.profile.music * AUDIO_MIX.music * musicScale * (danger ? 0.72 : patience ? 0.92 : 1) : 0;
    setSmooth(this.ambienceBus.gain, ambienceLevel, now, 0.12);
    setSmooth(this.musicBus.gain, musicLevel, now, 0.12);
    setSmooth(this.ambienceFilter.frequency, danger ? this.profile.filter * 0.58 : this.profile.filter, now, 0.18);

    if (!active) {
      this.nextNoteTime = now + 0.12;
      return;
    }

    const beat = 60 / this.profile.tempo;
    while (this.nextNoteTime < now + 0.18) {
      const frequency = this.profile.notes[this.sequenceIndex % this.profile.notes.length];
      this.scheduleMusicNote(frequency * (danger && this.sequenceIndex % 4 === 3 ? 0.5 : 1), this.nextNoteTime, beat * 0.78, this.sequenceIndex);
      this.sequenceIndex += 1;
      this.nextNoteTime += beat;
    }
  }

  scheduleMusicVoice(frequency, startTime, duration, type, peak) {
    if (!this.context || !this.enabled) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(peak, startTime + Math.min(0.045, duration * 0.18));
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    oscillator.connect(gain).connect(this.musicBus);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.04);
  }

  scheduleMusicNote(frequency, startTime, duration, step = 0) {
    if (!this.context || !this.enabled) return;
    this.scheduleMusicVoice(frequency, startTime, duration, this.profile.wave, 0.105);
    this.scheduleMusicVoice(frequency * 2, startTime + duration * 0.52, duration * 0.4, "sine", 0.042);
    if (step % 2 === 0) this.scheduleMusicVoice(frequency * 1.5, startTime + 0.06, duration * 0.62, "sine", 0.032);
    if (step % 4 === 0) this.scheduleMusicVoice(frequency * 0.5, startTime, duration * 0.46, "triangle", 0.038);
  }

  tone(frequency, duration, type = "sine", gainAmount = 0.04, endMultiplier = 1, delay = 0) {
    if (!this.context || !this.enabled) return;
    const start = this.context.currentTime + Math.max(0, delay);
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(30, frequency), start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, frequency * endMultiplier), start + duration);
    gain.gain.setValueAtTime(Math.max(0.0001, gainAmount), start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(this.effectsBus);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  footstep() {
    if (!this.context || !this.enabled) return;
    const frequency = this.profile.step[this.stepIndex % this.profile.step.length];
    this.stepIndex += 1;
    const crystalline = this.stageId === "0716" || this.stageId === "0718" || this.stageId === "0887";
    this.tone(frequency, crystalline ? 0.055 : 0.075, crystalline ? "triangle" : "sine", 0.025, this.stageId === "0717" || this.stageId === "1091" ? 0.72 : 0.58);
  }

  light(collected = 0) {
    const note = this.profile.notes[collected % this.profile.notes.length] * 2;
    this.tone(note, 0.11, "sine", 0.035, 1.18);
  }

  patienceStart() {
    this.tone(174.61, 0.34, "sine", 0.038, 1.5);
    this.tone(261.63, 0.28, "sine", 0.026, 1.18, 0.07);
  }

  patienceRelease() {
    this.tone(293.66, 0.18, "sine", 0.022, 0.78);
  }

  harvest() {
    this.tone(285, 0.42, "sine", 0.065, 2.1);
    this.tone(427.5, 0.36, "triangle", 0.045, 1.55, 0.07);
    this.tone(570, 0.5, "sine", 0.038, 1.3, 0.14);
  }
}
