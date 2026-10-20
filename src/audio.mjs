export class GardenAudio {
  constructor() { this.context = null; this.enabled = true; this.profile = null; }
  ensure() {
    const AudioContext = globalThis.AudioContext ?? globalThis.webkitAudioContext;
    if (!this.context && AudioContext) this.context = new AudioContext();
    this.context?.resume?.().catch?.(() => {});
    return Boolean(this.context);
  }
  setWorld(world) { this.profile = world.sound; }
  setEnabled(enabled) { this.enabled = Boolean(enabled); }
  tone(frequency, duration = 0.12, gainValue = 0.035, delay = 0) {
    if (!this.enabled || !this.ensure()) return;
    const start = this.context.currentTime + delay;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(gainValue, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(start); oscillator.stop(start + duration + 0.02);
  }
  cue(name, step = 0) {
    const profile = this.profile ?? { root: 196, notes: [293.66, 392, 440] };
    const frequency = name === "step" ? profile.root : profile.notes[step % profile.notes.length];
    const durations = { step: 0.05, light: 0.15, tend: 0.35, beacon: 0.28, gate: 0.4, complete: 0.65 };
    this.tone(frequency * (name === "complete" ? 2 : 1), durations[name] ?? 0.12, name === "step" ? 0.018 : 0.045);
    if (name === "complete") this.tone(frequency * 2.5, 0.7, 0.035, 0.1);
  }
}
