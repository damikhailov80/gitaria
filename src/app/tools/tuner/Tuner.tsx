"use client";

import { PitchDetector } from "pitchy";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { nearestString } from "@/lib/audio/pitch";
import { tunings, type Instrument } from "@/lib/audio/tunings";
import styles from "./Tuner.module.css";

/** "In tune" tolerance, cents */
const IN_TUNE_CENTS = 5;
/** Needle scale: ±50 cents → ±72° */
const MAX_CENTS = 50;
const MAX_ANGLE = 72;
const MIN_CLARITY = 0.9;
const MIN_RMS = 0.01;

type MicState = "off" | "starting" | "on" | "denied" | "unsupported";

type Reading = { frequency: number; stringIndex: number; cents: number };

export function Tuner() {
  const [instrument, setInstrument] = useState<Instrument>("guitar");
  const [tuningId, setTuningId] = useState("standard");
  const [mic, setMic] = useState<MicState>("off");
  const [reading, setReading] = useState<Reading | null>(null);
  /** Manually selected string; null — auto-detect */
  const [manualString, setManualString] = useState<number | null>(null);
  const [tuned, setTuned] = useState<Set<number>>(new Set());

  const tuning = tunings[instrument].find((t) => t.id === tuningId) ?? tunings[instrument][0];

  const audioRef = useRef<{ ctx: AudioContext; stream: MediaStream; raf: number; cleanup: () => void } | null>(
    null,
  );
  /** Number of the latest start: a stale start (left the page, turned off) must not turn on the microphone */
  const startIdRef = useRef(0);
  const settingsRef = useRef({ strings: tuning.strings, manualString });
  const historyRef = useRef<number[]>([]);
  /** Until this moment (performance.now) the microphone is ignored — the "in tune" beep is playing */
  const mutedUntilRef = useRef(0);
  const inTuneSinceRef = useRef<{ index: number; since: number; confirmed: boolean } | null>(null);

  useEffect(() => {
    settingsRef.current = { strings: tuning.strings, manualString };
  }, [tuning, manualString]);

  // The microphone turns on as soon as the tuner opens.
  useEffect(() => {
    void startMic();
    return () => stopMic();
    // Only on mount: startMic/stopMic work through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopMic() {
    startIdRef.current++;
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(audio.raf);
    audio.cleanup();
    audio.stream.getTracks().forEach((t) => t.stop());
    void audio.ctx.close();
    audioRef.current = null;
  }

  async function startMic() {
    if (!navigator.mediaDevices?.getUserMedia || typeof AudioContext === "undefined") {
      setMic("unsupported");
      return;
    }
    const startId = ++startIdRef.current;
    setMic("starting");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch {
      if (startId === startIdRef.current) setMic("denied");
      return;
    }
    if (startId !== startIdRef.current) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }

    const ctx = new AudioContext();
    // When the page is opened via a direct link, the browser may not allow starting audio
    // without a user gesture — then start it on the first click or key press.
    const resume = () => void ctx.resume();
    const cleanup = () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
    if (ctx.state === "suspended") {
      void ctx.resume();
      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
    }

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 4096;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const buffer = new Float32Array(analyser.fftSize);
    const detector = PitchDetector.forFloat32Array(analyser.fftSize);

    const tick = () => {
      analyser.getFloatTimeDomainData(buffer);
      const rms = Math.sqrt(buffer.reduce((sum, v) => sum + v * v, 0) / buffer.length);
      const [pitch, clarity] = detector.findPitch(buffer, ctx.sampleRate);
      const muted = performance.now() < mutedUntilRef.current;
      if (!muted && rms > MIN_RMS && clarity > MIN_CLARITY && pitch > 50 && pitch < 1200) {
        handlePitch(pitch);
      }
      audioRef.current!.raf = requestAnimationFrame(tick);
    };
    audioRef.current = { ctx, stream, raf: requestAnimationFrame(tick), cleanup };
    setMic("on");
  }

  function handlePitch(pitch: number) {
    // The median of recent values smooths needle jitter.
    const history = historyRef.current;
    history.push(pitch);
    if (history.length > 5) history.shift();
    const frequency = [...history].sort((a, b) => a - b)[Math.floor(history.length / 2)];

    const { strings, manualString } = settingsRef.current;
    const nearest = nearestString(frequency, strings);
    const stringIndex = manualString ?? nearest.index;
    const cents =
      manualString === null ? nearest.cents : nearestString(frequency, [strings[manualString]]).cents;
    setReading({ frequency, stringIndex, cents });

    // A string counts as tuned if it stays within tolerance for half a second.
    // At that moment a beep plays — once, until the string leaves the tolerance.
    const now = performance.now();
    if (Math.abs(cents) <= IN_TUNE_CENTS) {
      const since = inTuneSinceRef.current;
      if (since?.index !== stringIndex) {
        inTuneSinceRef.current = { index: stringIndex, since: now, confirmed: false };
      } else if (!since.confirmed && now - since.since > 500) {
        since.confirmed = true;
        setTuned((prev) => (prev.has(stringIndex) ? prev : new Set(prev).add(stringIndex)));
        if (audioRef.current) {
          // The microphone hears the beep from the speaker and skews readings — skip this time.
          const ms = playInTuneChime(audioRef.current.ctx) * 1000;
          mutedUntilRef.current = performance.now() + ms;
        }
      }
    } else {
      inTuneSinceRef.current = null;
    }
  }

  function toggleMic() {
    if (mic === "on") {
      stopMic();
      setMic("off");
      setReading(null);
    } else {
      void startMic();
    }
  }

  function resetStrings() {
    setTuned(new Set());
    setManualString(null);
    setReading(null);
    historyRef.current = [];
  }

  function changeInstrument(next: Instrument) {
    setInstrument(next);
    setTuningId(tunings[next][0].id);
    resetStrings();
  }

  const cents = reading ? Math.max(-MAX_CENTS, Math.min(MAX_CENTS, reading.cents)) : 0;
  const angle = (cents / MAX_CENTS) * MAX_ANGLE;
  const inTune = reading !== null && Math.abs(reading.cents) <= IN_TUNE_CENTS;
  const activeString = reading?.stringIndex ?? manualString;

  return (
    <div className={styles.layout}>
      <section className={styles.controls}>
        <h1 className={styles.title}>Тюнер</h1>
        <p className={styles.intro}>
          Разрешите доступ к микрофону и сыграйте открытую струну. Стрелка в зелёной зоне — струна настроена.
        </p>

        <p className="eyebrow">Инструмент и строй</p>
        <fieldset className="segmented">
          <legend className="sr-only">Инструмент</legend>
          {(["guitar", "ukulele"] as const).map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="instrument"
                checked={instrument === value}
                onChange={() => changeInstrument(value)}
              />
              {value === "guitar" ? "Гитара" : "Укулеле"}
            </label>
          ))}
        </fieldset>

        <label className="sr-only" htmlFor="tuning">
          Строй
        </label>
        <div className={styles.selectWrap}>
          <select
            id="tuning"
            className={`input ${styles.select}`}
            value={tuning.id}
            onChange={(e) => {
              setTuningId(e.target.value);
              resetStrings();
            }}
          >
            {tunings[instrument].map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className={`btn btn-secondary ${styles.micButton}`}
          onClick={toggleMic}
          disabled={mic === "starting"}
          aria-pressed={mic === "on"}
        >
          <Icon name="mic" size={22} />
          {mic === "on" ? "Микрофон включён" : "Включить микрофон"}
        </button>
        {mic === "denied" && (
          <p className={styles.error} role="alert">
            Нет доступа к микрофону. Разрешите его в настройках браузера и попробуйте снова.
          </p>
        )}
        {mic === "unsupported" && (
          <p className={styles.error} role="alert">
            Этот браузер не поддерживает доступ к микрофону. Откройте тюнер в Chrome, Safari или Firefox.
          </p>
        )}
      </section>

      <section className={styles.panel} aria-live="polite">
        <svg className={styles.gauge} viewBox="0 0 560 320" aria-hidden="true">
          <path d={arcPath(-80, 80, 250)} className={styles.track} />
          <path d={arcPath(-10, 10, 250)} className={styles.zone} />
          {[-72, -54, -36, -18, 0, 18, 36, 54, 72].map((a) => (
            <line
              key={a}
              {...polarLine(a, a === 0 ? 192 : 206, 232)}
              className={styles.tick}
            />
          ))}
          <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "280px 290px" }} className={styles.needle}>
            <line x1="280" y1="290" x2="280" y2="62" />
          </g>
          <circle cx="280" cy="290" r="24" className={styles.hub} />
        </svg>

        <p className={styles.note}>{activeString !== null ? tuning.names[activeString] : "—"}</p>
        <p className={styles.readout}>
          {reading ? (
            <>
              {reading.frequency.toFixed(1).replace(".", ",")} Гц ·{" "}
              <strong className={inTune ? styles.ok : styles.off}>
                {reading.cents > 0 ? "+" : reading.cents < 0 ? "−" : ""}
                {Math.abs(Math.round(reading.cents))} центов
              </strong>{" "}
              · {inTune ? "настроено" : reading.cents > 0 ? "чуть ослабьте" : "чуть подтяните"}
            </>
          ) : mic === "on" ? (
            "Сыграйте открытую струну"
          ) : (
            "Включите микрофон, чтобы начать"
          )}
        </p>

        <div className={styles.strings} role="group" aria-label="Струны">
          {tuning.names.map((name, i) => (
            <button
              key={`${tuning.id}-${i}`}
              type="button"
              className={`${styles.string} ${i === activeString ? styles.stringActive : tuned.has(i) ? styles.stringTuned : ""}`}
              aria-pressed={manualString === i}
              aria-label={`Струна ${name}${manualString === i ? ", выбрана вручную" : ""}`}
              onClick={() => setManualString((cur) => (cur === i ? null : i))}
            >
              {name}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * A short "string in tune" beep.
 * Returns how many seconds to ignore the microphone: beep duration,
 * audio output latency (noticeable with Bluetooth headphones) and a margin for echo.
 */
function playInTuneChime(ctx: AudioContext): number {
  const start = ctx.currentTime;
  [1568, 2093].forEach((freq, i) => {
    const t = start + i * 0.09;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.26);
  });
  return 0.35 + (ctx.baseLatency || 0) + (ctx.outputLatency || 0) + 0.15;
}

/** A point on the circle centered at (280, 290); angle 0° points up. */
function polar(angle: number, r: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: 280 + r * Math.sin(rad), y: 290 - r * Math.cos(rad) };
}

function arcPath(from: number, to: number, r: number) {
  const a = polar(from, r);
  const b = polar(to, r);
  return `M${a.x} ${a.y}A${r} ${r} 0 0 1 ${b.x} ${b.y}`;
}

function polarLine(angle: number, r1: number, r2: number) {
  const a = polar(angle, r1);
  const b = polar(angle, r2);
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}
