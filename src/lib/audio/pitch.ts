const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"] as const;

export type NoteName = (typeof NOTE_NAMES)[number];

export type Note = {
  name: NoteName;
  octave: number;
  /** MIDI-номер: A4 = 69 */
  midi: number;
};

/** Частота ноты по MIDI-номеру. */
export function midiToFrequency(midi: number, a4 = 440): number {
  return a4 * 2 ** ((midi - 69) / 12);
}

/** Нота по MIDI-номеру. */
export function midiToNote(midi: number): Note {
  return {
    name: NOTE_NAMES[((midi % 12) + 12) % 12],
    octave: Math.floor(midi / 12) - 1,
    midi,
  };
}

/** Парсит запись вида "E2", "C#4". */
export function parseNote(note: string): Note {
  const match = /^([A-G]#?)(-?\d)$/.exec(note);
  if (!match) throw new Error(`Не удалось разобрать ноту: ${note}`);
  const index = NOTE_NAMES.indexOf(match[1] as NoteName);
  const octave = Number(match[2]);
  return midiToNote((octave + 1) * 12 + index);
}

/** Отклонение частоты от целевой в центах. */
export function centsOff(frequency: number, target: number): number {
  return 1200 * Math.log2(frequency / target);
}

/** Ближайшая нота хроматической шкалы и отклонение от неё. */
export function frequencyToNote(frequency: number, a4 = 440): { note: Note; cents: number } {
  const midi = Math.round(69 + 12 * Math.log2(frequency / a4));
  return { note: midiToNote(midi), cents: centsOff(frequency, midiToFrequency(midi, a4)) };
}

/** Ближайшая струна строя и отклонение от неё. */
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
