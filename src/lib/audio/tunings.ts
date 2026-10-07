import { parseNote, type Note } from "./pitch";

export type Instrument = "guitar" | "ukulele";

export type Tuning = {
  id: string;
  label: string;
  /** Подписи струн на кнопках, от толстой к тонкой */
  names: string[];
  strings: Note[];
};

function tuning(id: string, label: string, notes: string[], names: string[]): Tuning {
  return { id, label, names, strings: notes.map(parseNote) };
}

export const tunings: Record<Instrument, Tuning[]> = {
  guitar: [
    tuning("standard", "Стандартный · E A D G B E", ["E2", "A2", "D3", "G3", "B3", "E4"], ["E", "A", "D", "G", "B", "e"]),
    tuning("drop-d", "Drop D · D A D G B E", ["D2", "A2", "D3", "G3", "B3", "E4"], ["D", "A", "D", "G", "B", "e"]),
    tuning(
      "half-down",
      "Полтона ниже · E♭ A♭ D♭ G♭ B♭ E♭",
      ["D#2", "G#2", "C#3", "F#3", "A#3", "D#4"],
      ["E♭", "A♭", "D♭", "G♭", "B♭", "e♭"],
    ),
  ],
  ukulele: [tuning("standard", "Стандартный · G C E A", ["G4", "C4", "E4", "A4"], ["G", "C", "E", "A"])],
};
