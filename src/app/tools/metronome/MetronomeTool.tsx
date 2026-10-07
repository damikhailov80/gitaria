"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { Metronome, tapTempo, type ClickSound } from "@/lib/audio/metronome";
import styles from "./MetronomeTool.module.css";

const MIN_BPM = 30;
const MAX_BPM = 300;
const STORAGE_KEY = "gitaria:metronome";

const signatures = [
  { id: "2/4", beats: 2 },
  { id: "3/4", beats: 3 },
  { id: "4/4", beats: 4 },
  { id: "6/8", beats: 6 },
] as const;

type SignatureId = (typeof signatures)[number]["id"];

const sounds: { id: ClickSound; label: string }[] = [
  { id: "click", label: "Клик" },
  { id: "wood", label: "Дерево" },
];

type Settings = { bpm: number; signature: SignatureId; sound: ClickSound };

const defaults: Settings = { bpm: 92, signature: "4/4", sound: "click" };

function loadSettings(): Settings {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as Partial<Settings> | null;
    if (!saved) return defaults;
    return {
      bpm: clampBpm(Number(saved.bpm) || defaults.bpm),
      signature: signatures.some((s) => s.id === saved.signature) ? saved.signature! : defaults.signature,
      sound: sounds.some((s) => s.id === saved.sound) ? saved.sound! : defaults.sound,
    };
  } catch {
    return defaults;
  }
}

function clampBpm(bpm: number) {
  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(bpm)));
}

function tempoName(bpm: number) {
  if (bpm < 40) return "Grave";
  if (bpm < 60) return "Largo";
  if (bpm < 66) return "Larghetto";
  if (bpm < 76) return "Adagio";
  if (bpm < 108) return "Andante";
  if (bpm < 120) return "Moderato";
  if (bpm < 168) return "Allegro";
  if (bpm < 200) return "Presto";
  return "Prestissimo";
}

export function MetronomeTool() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loaded, setLoaded] = useState(false);
  const [running, setRunning] = useState(false);
  const [beat, setBeat] = useState(0);
  const metronomeRef = useRef<Metronome | null>(null);
  const tapsRef = useRef<number[]>([]);

  const beats = signatures.find((s) => s.id === settings.signature)!.beats;

  // Настройки из localStorage читаем после монтирования, чтобы не было расхождения с SSR.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(loadSettings());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Хранилище недоступно (приватный режим) — просто не запоминаем.
    }
    metronomeRef.current?.update({ bpm: settings.bpm, beatsPerBar: beats, sound: settings.sound });
  }, [settings, beats, loaded]);

  useEffect(() => () => void metronomeRef.current?.dispose(), []);

  function update(patch: Partial<Settings>) {
    setSettings((s) => ({ ...s, ...patch }));
  }

  async function toggle() {
    if (running) {
      metronomeRef.current?.stop();
      setRunning(false);
      setBeat(0);
      return;
    }
    metronomeRef.current ??= new Metronome({ bpm: settings.bpm, beatsPerBar: beats, sound: settings.sound });
    metronomeRef.current.update({ bpm: settings.bpm, beatsPerBar: beats, sound: settings.sound, onBeat: setBeat });
    setRunning(true);
    await metronomeRef.current.start();
  }

  function tap() {
    const now = performance.now();
    const taps = tapsRef.current;
    // Пауза дольше 2 секунд — начинаем считать заново.
    if (taps.length && now - taps[taps.length - 1] > 2000) taps.length = 0;
    taps.push(now);
    const bpm = tapTempo(taps, MIN_BPM, MAX_BPM);
    if (bpm) update({ bpm });
  }

  return (
    <div className={styles.layout}>
      <section className={styles.controls}>
        <h1 className={styles.title}>Метроном</h1>
        <p className={styles.intro}>Начинайте медленно и прибавляйте по 4–5 ударов, когда упражнение звучит ровно.</p>

        <p className="eyebrow">Размер</p>
        <fieldset className="segmented">
          <legend className="sr-only">Размер</legend>
          {signatures.map((s) => (
            <label key={s.id}>
              <input
                type="radio"
                name="signature"
                checked={settings.signature === s.id}
                onChange={() => {
                  update({ signature: s.id });
                  setBeat(0);
                }}
              />
              {s.id}
            </label>
          ))}
        </fieldset>

        <p className={`eyebrow ${styles.soundLabel}`}>Звук</p>
        <fieldset className="segmented">
          <legend className="sr-only">Звук</legend>
          {sounds.map((s) => (
            <label key={s.id}>
              <input
                type="radio"
                name="sound"
                checked={settings.sound === s.id}
                onChange={() => update({ sound: s.id })}
              />
              {s.label}
            </label>
          ))}
        </fieldset>
      </section>

      <section className={styles.panel}>
        <div className={styles.beats} aria-hidden="true">
          {Array.from({ length: beats }, (_, i) => (
            <span key={i} className={`${styles.dot} ${i === beat ? styles.dotActive : ""}`} />
          ))}
        </div>

        <div className={styles.tempo}>
          <button
            type="button"
            className={styles.round}
            aria-label="Медленнее"
            onClick={() => update({ bpm: clampBpm(settings.bpm - 1) })}
          >
            <Icon name="minus" size={28} />
          </button>
          <output className={styles.bpm} htmlFor="bpm" aria-live="polite">
            {settings.bpm}
          </output>
          <button
            type="button"
            className={styles.round}
            aria-label="Быстрее"
            onClick={() => update({ bpm: clampBpm(settings.bpm + 1) })}
          >
            <Icon name="plus" size={28} />
          </button>
        </div>
        <p className={styles.tempoLabel}>Ударов в минуту · {tempoName(settings.bpm)}</p>

        <label className="sr-only" htmlFor="bpm">
          Темп
        </label>
        <input
          id="bpm"
          type="range"
          min={MIN_BPM}
          max={MAX_BPM}
          value={settings.bpm}
          onChange={(e) => update({ bpm: clampBpm(Number(e.target.value)) })}
          className={styles.slider}
          style={{ "--fill": `${((settings.bpm - MIN_BPM) / (MAX_BPM - MIN_BPM)) * 100}%` } as React.CSSProperties}
        />

        <div className={styles.buttons}>
          <button type="button" className={`btn btn-primary ${styles.start}`} onClick={toggle}>
            {running ? (
              "Стоп"
            ) : (
              <>
                <Icon name="play" size={26} />
                Старт
              </>
            )}
          </button>
          <button type="button" className={`btn btn-secondary ${styles.tap}`} onClick={tap}>
            Tap
          </button>
        </div>
      </section>
    </div>
  );
}
