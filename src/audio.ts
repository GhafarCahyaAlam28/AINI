/**
 * Pure Web Audio API celestial ambient synthesizer
 * Zero external audio files required - works offline and anywhere.
 */
class CelestialAmbientAudio {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private masterGain: GainNode | null = null;

  private notes = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
  ];

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.scheduleNextChime();
  }

  private scheduleNextChime() {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    // Play a gentle bell/music-box chime
    const note = this.notes[Math.floor(Math.random() * this.notes.length)];
    this.triggerChime(note);

    // Occasionally play a soft harmonic pair
    if (Math.random() > 0.4) {
      const note2 = this.notes[Math.floor(Math.random() * this.notes.length)];
      setTimeout(() => {
        if (this.isPlaying) this.triggerChime(note2);
      }, 240);
    }

    // Schedule next in 2.2 to 4.5 seconds
    const nextInterval = 2200 + Math.random() * 2300;
    this.timer = window.setTimeout(() => {
      this.scheduleNextChime();
    }, nextInterval);
  }

  private triggerChime(freq: number) {
    if (!this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Sine wave with soft harmonic
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 2.9);
    } catch {
      // Ignore audio errors gracefully
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const celestialAudio = new CelestialAmbientAudio();
