"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, TimerReset, Plus, Check } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { CapsuleButton } from "@/components/ui/CapsuleButton";
import { pad, todayKey } from "@/lib/date-utils";

interface TimerProps {
  timerDurationMs: number;
  timerRemainingMs: number;
  timerEndAt: number | null;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSetDuration: (ms: number) => void;
  onComplete: () => void;
  onAddHours: (key: string, hoursDelta: number) => void;
}

const PRESETS_MIN = [5, 10, 15, 25, 45];

function playChime(ctx: AudioContext) {
  const now = ctx.currentTime;
  [880, 1108].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + i * 0.22);
    gain.gain.linearRampToValueAtTime(0.25, now + i * 0.22 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.22 + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.22);
    osc.stop(now + i * 0.22 + 0.4);
  });
}

function fmtDurationLabel(ms: number): string {
  const totalMin = Math.round(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function Timer({
  timerDurationMs,
  timerRemainingMs,
  timerEndAt,
  onStart,
  onPause,
  onReset,
  onSetDuration,
  onComplete,
  onAddHours,
}: TimerProps) {
  const running = timerEndAt != null;
  const [, forceTick] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [logged, setLogged] = useState(false);
  const [customHrs, setCustomHrs] = useState("");
  const [customMin, setCustomMin] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const chimedRef = useRef(false);

  function ensureAudio() {
    if (!audioRef.current) {
      try {
        audioRef.current = new AudioContext();
      } catch {
        /* Web Audio unsupported — timer still works, just silently */
      }
    }
    return audioRef.current;
  }

  // On mount: if the persisted end time has already passed (timer finished while
  // this component wasn't mounted), settle it immediately without a chime.
  useEffect(() => {
    if (running && timerEndAt! <= Date.now()) {
      onComplete();
      setCompleted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!running) return;
    chimedRef.current = false;
    const id = setInterval(() => {
      const remaining = timerEndAt! - Date.now();
      if (remaining <= 0) {
        forceTick((n) => n + 1);
        if (!chimedRef.current) {
          chimedRef.current = true;
          onComplete();
          setCompleted(true);
          const ctx = audioRef.current;
          if (ctx) playChime(ctx);
        }
      } else {
        forceTick((n) => n + 1);
      }
    }, 250);
    return () => clearInterval(id);
  }, [running, timerEndAt, onComplete]);

  function handleStart() {
    const ctx = ensureAudio();
    if (ctx && ctx.state === "suspended") ctx.resume();
    setCompleted(false);
    setLogged(false);
    onStart();
  }

  function handleReset() {
    setCompleted(false);
    setLogged(false);
    onReset();
  }

  function applyDuration(ms: number) {
    if (running) return;
    onSetDuration(ms);
    setCompleted(false);
    setLogged(false);
  }

  function applyCustom() {
    const h = parseInt(customHrs, 10) || 0;
    const m = parseInt(customMin, 10) || 0;
    const ms = (h * 3600 + m * 60) * 1000;
    if (ms <= 0) return;
    applyDuration(ms);
  }

  function logSession() {
    onAddHours(todayKey(), timerDurationMs / 3_600_000);
    setLogged(true);
  }

  const remainingMs = running ? Math.max(0, timerEndAt! - Date.now()) : timerRemainingMs;
  const totalSecs = Math.max(0, Math.ceil(remainingMs / 1000));
  const hh = pad(Math.floor(totalSecs / 3600));
  const mm = pad(Math.floor((totalSecs % 3600) / 60));
  const ss = pad(totalSecs % 60);
  const pct = timerDurationMs > 0 ? 100 - (remainingMs / timerDurationMs) * 100 : 0;

  return (
    <div className={`rounded-[30px] p-[2px] ${running ? "timer-border-frame" : ""}`}>
      <LiquidGlassCard delay={0.16}>
        <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#D8B4FE]/30 bg-[#A855F7]/15 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#D8B4FE]">
          <TimerReset size={11} strokeWidth={1.75} /> focus timer
        </span>
        <h2 className="text-[16px] font-medium text-[#F6F4FF]">Timer</h2>

        <div className="mb-4 mt-1 flex items-center gap-1.5 text-[9px] uppercase tracking-wide text-white/40">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background: completed ? "#4ADE80" : running ? "#C084FC" : "rgba(192,132,252,0.25)",
              boxShadow: completed ? "0 0 8px rgba(74,222,128,0.85)" : running ? "0 0 8px rgba(192,132,252,0.85)" : "none",
              animation: running ? "pulse 1.1s ease-in-out infinite" : "none",
            }}
          />
          {completed ? "time's up" : running ? "counting down" : "ready to start"}
        </div>

        <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        <div className="mb-3 flex items-end gap-0">
          {[
            { v: hh, u: "hrs" },
            { v: mm, u: "min" },
            { v: ss, u: "sec" },
          ].map((b, i) => (
            <div key={b.u} className="flex items-end">
              <div className="flex min-w-[52px] flex-col items-center">
                <span
                  className="font-tabular text-[28px] font-bold leading-none"
                  style={{
                    color: completed ? "#86EFAC" : "#F6F4FF",
                    textShadow: completed ? "0 0 24px rgba(74,222,128,0.5)" : "0 0 24px rgba(192,132,252,0.5)",
                  }}
                >
                  {b.v}
                </span>
                <span className="mt-1 text-[8px] uppercase tracking-wide text-white/40">{b.u}</span>
              </div>
              {i < 2 && <span className="pb-3 text-xl text-[#A855F7]/50">:</span>}
            </div>
          ))}
        </div>

        <div className="mb-4 h-1 w-full overflow-hidden rounded-full border border-white/10 bg-black/25">
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{
              width: `${pct}%`,
              background: completed ? "linear-gradient(90deg,#15803d,#4ADE80)" : "linear-gradient(90deg,#6d28d9,#D8B4FE)",
            }}
          />
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {PRESETS_MIN.map((min) => (
            <button
              key={min}
              onClick={() => applyDuration(min * 60_000)}
              disabled={running}
              className="rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors disabled:opacity-40"
              style={
                timerDurationMs === min * 60_000
                  ? { borderColor: "rgba(216,180,254,0.5)", background: "rgba(168,85,247,0.22)", color: "#F6F4FF" }
                  : { borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
              }
            >
              {min}m
            </button>
          ))}
          <button
            onClick={() => setShowCustom((v) => !v)}
            disabled={running}
            className="rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors disabled:opacity-40"
            style={
              showCustom
                ? { borderColor: "rgba(216,180,254,0.5)", background: "rgba(168,85,247,0.22)", color: "#F6F4FF" }
                : { borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }
            }
          >
            Custom
          </button>
        </div>

        {showCustom && !running && (
          <div className="mb-4 flex items-end gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-[8px] uppercase tracking-wide text-white/35">Hrs</span>
              <input
                type="number"
                min="0"
                max="12"
                placeholder="0"
                value={customHrs}
                onChange={(e) => setCustomHrs(e.target.value)}
                className="w-14 rounded-lg border border-white/10 bg-black/25 px-2 py-1.5 text-center font-tabular text-[13px] text-white/85 outline-none focus:border-[#D8B4FE]/50"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[8px] uppercase tracking-wide text-white/35">Min</span>
              <input
                type="number"
                min="0"
                max="59"
                placeholder="0"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                className="w-14 rounded-lg border border-white/10 bg-black/25 px-2 py-1.5 text-center font-tabular text-[13px] text-white/85 outline-none focus:border-[#D8B4FE]/50"
              />
            </label>
            <CapsuleButton onClick={applyCustom} className="!px-4 !py-2">
              <Check size={13} strokeWidth={2} /> Set
            </CapsuleButton>
          </div>
        )}

        {completed ? (
          <div className="mb-1 flex gap-2">
            <CapsuleButton onClick={handleReset} className="flex-1 rounded-full">
              <RotateCcw size={14} strokeWidth={1.75} /> Restart
            </CapsuleButton>
            <CapsuleButton onClick={logSession} accent="purple" variant="solid" className="flex-1 rounded-full" disabled={logged}>
              <Plus size={14} strokeWidth={1.75} /> {logged ? "Logged" : `Log ${fmtDurationLabel(timerDurationMs)}`}
            </CapsuleButton>
          </div>
        ) : (
          <div className="flex gap-2">
            <CapsuleButton onClick={running ? onPause : handleStart} accent="purple" variant="solid" className="flex-1 rounded-full">
              {running ? (
                <>
                  <Pause size={14} strokeWidth={1.75} /> Pause
                </>
              ) : (
                <>
                  <Play size={14} strokeWidth={1.75} /> Start
                </>
              )}
            </CapsuleButton>
            <CapsuleButton onClick={handleReset} className="flex-1 rounded-full">
              <RotateCcw size={14} strokeWidth={1.75} /> Reset
            </CapsuleButton>
          </div>
        )}
      </LiquidGlassCard>
    </div>
  );
}
