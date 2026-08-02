"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Gauge } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { CapsuleButton } from "@/components/ui/CapsuleButton";
import { fmtHrs, pad } from "@/lib/date-utils";

interface StopwatchProps {
  todayHours: number;
  dailyGoalHours: number;
  stopwatchRunningSince: number | null;
  stopwatchSessions: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onCheckpoint: () => void;
  onFlushOnUnmount: () => void;
  onSetGoal: (hours: number) => void;
}

export function Stopwatch({
  todayHours,
  dailyGoalHours,
  stopwatchRunningSince,
  stopwatchSessions,
  onStart,
  onPause,
  onReset,
  onCheckpoint,
  onFlushOnUnmount,
  onSetGoal,
}: StopwatchProps) {
  const running = stopwatchRunningSince != null;
  const [, forceTick] = useState(0);
  const rafRef = useRef<number | null>(null);
  const checkpointIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // live display tick while running
  useEffect(() => {
    if (!running) return;
    function tick() {
      forceTick((n) => n + 1);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  // periodic safety checkpoint (every 30s) while running, plus one immediately on mount
  // (catches up any time that accrued while this component wasn't mounted at all)
  useEffect(() => {
    if (!running) return;
    onCheckpoint();
    checkpointIntervalRef.current = setInterval(onCheckpoint, 30_000);
    return () => {
      if (checkpointIntervalRef.current) clearInterval(checkpointIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // flush directly to storage the moment this component unmounts (e.g. navigating to another page)
  useEffect(() => {
    return () => {
      onFlushOnUnmount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const liveElapsedMs = running ? Date.now() - stopwatchRunningSince! : 0;
  const liveHours = todayHours + liveElapsedMs / 3_600_000;
  const goalPct = dailyGoalHours > 0 ? Math.min(100, (liveHours / dailyGoalHours) * 100) : 0;

  const totalSecs = Math.floor(liveElapsedMs / 1000);
  const hh = pad(Math.floor(totalSecs / 3600));
  const mm = pad(Math.floor((totalSecs % 3600) / 60));
  const ss = pad(totalSecs % 60);
  const centis = pad(Math.floor((liveElapsedMs % 1000) / 10));

  return (
    <LiquidGlassCard delay={0.08}>
      <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#D8B4FE]/30 bg-[#A855F7]/15 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#D8B4FE]">
        <Gauge size={11} strokeWidth={1.75} /> study session
      </span>
      <h2 className="text-[16px] font-medium text-[#F6F4FF]">Stopwatch</h2>

      <div className="mb-4 mt-1 flex items-center gap-1.5 text-[9px] uppercase tracking-wide text-white/40">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: running ? "#C084FC" : "rgba(192,132,252,0.25)",
            boxShadow: running ? "0 0 8px rgba(192,132,252,0.85)" : "none",
            animation: running ? "pulse 1.1s ease-in-out infinite" : "none",
          }}
        />
        {running ? "session running" : "ready to start"}
      </div>

      <div className="my-2 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="mb-1 flex items-end gap-0">
        {[
          { v: hh, u: "hrs" },
          { v: mm, u: "min" },
          { v: ss, u: "sec" },
        ].map((b, i) => (
          <div key={b.u} className="flex items-end">
            <div className="flex min-w-[58px] flex-col items-center">
              <span
                className="font-tabular text-[34px] font-bold leading-none text-[#F6F4FF]"
                style={{ textShadow: "0 0 24px rgba(192,132,252,0.5)" }}
              >
                {b.v}
              </span>
              <span className="mt-1 text-[8px] uppercase tracking-wide text-white/40">{b.u}</span>
            </div>
            {i < 2 && <span className="pb-3.5 text-2xl text-[#A855F7]/50">:</span>}
          </div>
        ))}
        <span className="pb-1.5 pl-1 font-tabular text-[16px] font-medium text-[#C084FC]/60">.{centis}</span>
      </div>

      <div className="mb-3 mt-2 flex justify-between text-[10px] uppercase tracking-wide text-white/40">
        <span>today: {fmtHrs(liveHours)}</span>
        <span>sessions: {stopwatchSessions}</span>
      </div>

      <div className="mb-4 flex gap-2">
        <CapsuleButton onClick={running ? onPause : onStart} accent="purple" variant="solid" className="flex-1 rounded-full">
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
        <CapsuleButton onClick={onReset} className="flex-1 rounded-full">
          <RotateCcw size={14} strokeWidth={1.75} /> Reset
        </CapsuleButton>
      </div>

      <div className="flex items-center justify-between text-[9px] uppercase tracking-wide text-white/40">
        <span>daily goal</span>
        <span className="flex items-center gap-1 font-tabular text-[#D8B4FE]">
          <input
            type="number"
            step="0.5"
            min="0"
            value={dailyGoalHours}
            onChange={(e) => onSetGoal(parseFloat(e.target.value))}
            className="w-10 border-0 border-b border-dashed border-[#D8B4FE]/45 bg-transparent text-right outline-none"
          />
          h
        </span>
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full border border-white/10 bg-black/25">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${goalPct}%`, background: "linear-gradient(90deg,#6d28d9,#E879F9)" }}
        />
      </div>
    </LiquidGlassCard>
  );
}
