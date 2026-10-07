export type ClickSound = "click" | "wood";

export type MetronomeOptions = {
  bpm: number;
  beatsPerBar: number;
  sound: ClickSound;
  /** Вызывается в момент звучания доли (0 — первая доля такта). */
  onBeat?: (beat: number) => void;
};

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD_S = 0.1;

/**
 * Метроном с lookahead-планировщиком: таймер раз в 25 мс ставит звуки
 * на 100 мс вперёд по часам AudioContext, поэтому темп не плывёт.
 */
export class Metronome {
  private ctx: AudioContext | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private nextNoteTime = 0;
  private beat = 0;
  private visualTimers = new Set<ReturnType<typeof setTimeout>>();

  constructor(private options: MetronomeOptions) {}

  get running(): boolean {
    return this.timer !== null;
  }

  update(options: Partial<MetronomeOptions>): void {
    this.options = { ...this.options, ...options };
  }

  async start(): Promise<void> {
    if (this.running) return;
    this.ctx ??= new AudioContext();
    await this.ctx.resume();
    this.beat = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.timer = setInterval(() => this.schedule(), LOOKAHEAD_MS);
    this.schedule();
  }

  stop(): void {
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
    this.visualTimers.forEach(clearTimeout);
    this.visualTimers.clear();
  }

  async dispose(): Promise<void> {
    this.stop();
    await this.ctx?.close();
    this.ctx = null;
  }

  private schedule(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    while (this.nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD_S) {
      const beat = this.beat;
      this.playAt(beat, this.nextNoteTime);
      this.notifyAt(beat, this.nextNoteTime);
      this.nextNoteTime += 60 / this.options.bpm;
      this.beat = (beat + 1) % this.options.beatsPerBar;
    }
  }

  private notifyAt(beat: number, time: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.options.onBeat) return;
    const delay = Math.max(0, (time - ctx.currentTime) * 1000);
    const id = setTimeout(() => {
      this.visualTimers.delete(id);
      this.options.onBeat?.(beat);
    }, delay);
    this.visualTimers.add(id);
  }

  private playAt(beat: number, time: number): void {
    const ctx = this.ctx!;
    const accent = beat === 0;
    switch (this.options.sound) {
      case "click":
        return playClick(ctx, time, accent);
      case "wood":
        return playWood(ctx, time, accent);
    }
  }
}

function playClick(ctx: AudioContext, time: number, accent: boolean): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = accent ? 1500 : 1000;
  gain.gain.setValueAtTime(accent ? 1 : 0.6, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  osc.connect(gain).connect(ctx.destination);
  osc.start(time);
  osc.stop(time + 0.06);
}

function playWood(ctx: AudioContext, time: number, accent: boolean): void {
  const length = Math.floor(ctx.sampleRate * 0.04);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = accent ? 2200 : 1600;
  filter.Q.value = 6;
  const gain = ctx.createGain();
  gain.gain.value = accent ? 3 : 2;
  source.connect(filter).connect(gain).connect(ctx.destination);
  source.start(time);
}


/** Темп по интервалам между нажатиями Tap (среднее по последним). */
export function tapTempo(taps: number[], min = 30, max = 300): number | null {
  if (taps.length < 2) return null;
  const recent = taps.slice(-5);
  const intervals = recent.slice(1).map((t, i) => t - recent[i]);
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  return Math.min(max, Math.max(min, Math.round(60000 / avg)));
}
