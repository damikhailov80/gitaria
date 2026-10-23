const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

export type Note = {
  name: NoteName;
  octave: number;
  /** MIDI number: A4 = 69 */
  midi: number;
};

/** Note frequency by MIDI number. */
export function midiToFrequency(midi: number, a4 = 440): number {
  return a4 * 2 ** ((midi - 69) / 12);
}

/** Note by MIDI number. */
export function midiToNote(midi: number): Note {
  return {
    name: NOTE_NAMES[((midi % 12) + 12) % 12],
    octave: Math.floor(midi / 12) - 1,
    midi,
  };
}

/** Parses notation like "E2", "C#4". */
export function parseNote(note: string): Note {
  const match = /^([A-G]#?)(-?\d)$/.exec(note);
  if (!match) throw new Error(`Не удалось разобрать ноту: ${note}`);
  const index = NOTE_NAMES.indexOf(match[1] as NoteName);
  const octave = Number(match[2]);
  return midiToNote((octave + 1) * 12 + index);
}

/** Deviation of a frequency from the target, in cents. */
export function centsOff(frequency: number, target: number): number {
  return 1200 * Math.log2(frequency / target);
}

/** Nearest note of the chromatic scale and the deviation from it. */
export function frequencyToNote(frequency: number, a4 = 440): { note: Note; cents: number } {
  const midi = Math.round(69 + 12 * Math.log2(frequency / a4));
  return { note: midiToNote(midi), cents: centsOff(frequency, midiToFrequency(midi, a4)) };
}

/** Nearest string of the tuning and the deviation from it. */
export function nearestString(
  frequency: number,
  strings: readonly Note[],
  a4 = 440,
): { index: number; string: Note; cents: number } {
  let best = 0;
  let bestCents = Infinity;
  strings.forEach((string, index) => {
    const cents = centsOff(frequency, midiToFrequency(string.midi, a4));
    if (Math.abs(cents) < Math.abs(bestCents)) {
      best = index;
      bestCents = cents;
    }
  });
  return { index: best, string: strings[best], cents: bestCents };
}
