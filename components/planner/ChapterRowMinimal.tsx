"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ChapterState } from "@/lib/types";

interface ChapterRowMinimalProps {
  index: number;
  name: string;
  state: ChapterState;
  onToggleDone: () => void;
  onBumpRevision: () => void;
  onResetRevision: () => void;
  onCycleDifficulty: () => void;
}

export function ChapterRowMinimal({
  index,
  name,
  state,
  onToggleDone,
  onBumpRevision,
  onResetRevision,
  onCycleDifficulty,
}: ChapterRowMinimalProps) {
  const revCount = state.revCount ?? 0;
  const diff = state.diff ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 20) * 0.025 }}
      className="relative flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-2xl px-5 py-4"
      style={{
        background: "linear-gradient(180deg, #232323 0%, #171717 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 2px rgba(0,0,0,0.55), 0 10px 22px rgba(0,0,0,0.45)",
      }}
    >
      {/* subtle glossy top highlight, matching the reference bars */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.05), transparent)" }}
      />

      <button onClick={onToggleDone} className="relative z-10 flex min-w-0 flex-1 items-center gap-3 text-left">
        <span
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-white/10"
          style={{ background: state.done ? "rgba(255,255,255,0.14)" : "transparent" }}
        >
          {state.done && <Check size={12} strokeWidth={2.5} className="text-white/70" />}
        </span>
        <span className="min-w-0">
          <span className="block text-[9px] uppercase tracking-wide text-white/30">Chapter {index + 1}</span>
          <span className={`block truncate text-[14px] font-medium ${state.done ? "text-white/40 line-through" : "text-white/85"}`}>
            {name}
          </span>
        </span>
      </button>

      <div className="relative z-10 flex flex-shrink-0 items-center gap-2 text-[11px]">
        {revCount > 0 && (
          <span onClick={onResetRevision} title="Double-click to reset" className="cursor-pointer text-white/35">
            ×{revCount}
          </span>
        )}
        <button
          onClick={onBumpRevision}
          className="rounded-full border border-white/10 px-3 py-1.5 text-white/55 transition-colors hover:bg-white/[0.06]"
        >
          Revise
        </button>
        <button
          onClick={onCycleDifficulty}
          className="rounded-full border border-white/10 px-3 py-1.5 capitalize text-white/55 transition-colors hover:bg-white/[0.06]"
        >
          {diff ?? "Difficulty"}
        </button>
      </div>
    </motion.div>
  );
}
