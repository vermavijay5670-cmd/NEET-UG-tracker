"use client";

import { motion } from "framer-motion";
import { Check, FlaskConical } from "lucide-react";
import type { ChapterState, Difficulty } from "@/lib/types";

interface ChapterRowLeaderboardProps {
  index: number;
  name: string;
  state: ChapterState;
  isNext: boolean;
  onToggleDone: () => void;
  onBumpRevision: () => void;
  onResetRevision: () => void;
  onCycleDifficulty: () => void;
}

// decorative avatar chip — cycles through a fixed palette, purely visual variety like the reference rows
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#7B4DFF,#38BDF8)",
  "linear-gradient(135deg,#F87171,#7C3AED)",
  "linear-gradient(135deg,#38BDF8,#22C55E)",
  "linear-gradient(135deg,#EC4899,#6366F1)",
  "linear-gradient(135deg,#FB923C,#EC4899)",
  "linear-gradient(135deg,#64748B,#334155)",
];

const DIFF_DOT: Record<Exclude<Difficulty, null>, string> = {
  easy: "#4ADE80",
  medium: "#FACC15",
  hard: "#F87171",
};

export function ChapterRowLeaderboard({
  index,
  name,
  state,
  isNext,
  onToggleDone,
  onBumpRevision,
  onResetRevision,
  onCycleDifficulty,
}: ChapterRowLeaderboardProps) {
  const revCount = state.revCount ?? 0;
  const diff = state.diff ?? null;
  const avatar = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 20) * 0.025, type: "spring", stiffness: 280, damping: 26 }}
      whileHover={{ y: -2 }}
      className="relative flex items-center gap-3 rounded-full py-2 pl-2 pr-4"
      style={{
        background: isNext
          ? "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)"
          : state.done
            ? "rgba(255,255,255,0.025)"
            : "#15151d",
        boxShadow: isNext
          ? "0 0 44px rgba(37,99,235,0.45), 0 12px 26px rgba(0,0,0,0.5)"
          : "0 6px 14px rgba(0,0,0,0.35)",
      }}
    >
      {/* avatar chip */}
      <div
        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full"
        style={{ background: avatar, opacity: state.done && !isNext ? 0.55 : 1 }}
      >
        <FlaskConical size={18} strokeWidth={1.75} className="text-white/85" />
      </div>

      {/* name + subtitle */}
      <button onClick={onToggleDone} className="min-w-0 flex-1 text-left">
        <div
          className={`truncate text-[15px] font-semibold ${
            state.done && !isNext ? "text-white/40 line-through" : "text-white"
          }`}
        >
          {name}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[12px]" style={{ color: isNext ? "rgba(219,234,254,0.8)" : "rgba(255,255,255,0.4)" }}>
          Chapter {index + 1}
          {diff && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onCycleDifficulty();
              }}
              className="flex items-center gap-1 capitalize"
            >
              · <span className="h-1.5 w-1.5 rounded-full" style={{ background: DIFF_DOT[diff] }} /> {diff}
            </span>
          )}
        </div>
      </button>

      {!diff && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCycleDifficulty();
          }}
          className="hidden flex-shrink-0 text-[11px] text-white/30 hover:text-white/60 sm:block"
        >
          + difficulty
        </button>
      )}

      {/* revision count, styled like the reference's +$ amount */}
      <button
        onClick={onBumpRevision}
        onDoubleClick={onResetRevision}
        title="Click to log a revision · double-click to reset"
        className="flex-shrink-0 font-tabular text-[16px] font-bold"
        style={{ color: revCount > 0 ? "#4ADE80" : isNext ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)" }}
      >
        +{revCount}
      </button>

      {/* done toggle */}
      <button
        onClick={onToggleDone}
        aria-label={state.done ? "Mark chapter not done" : "Mark chapter done"}
        className="ml-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border transition-colors"
        style={{
          borderColor: state.done ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.15)",
          background: state.done ? "rgba(74,222,128,0.18)" : "transparent",
        }}
      >
        {state.done && <Check size={12} strokeWidth={2.5} className="text-[#4ADE80]" />}
      </button>
    </motion.div>
  );
}
