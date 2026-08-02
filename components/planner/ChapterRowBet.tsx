"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Dna } from "lucide-react";
import type { ChapterState, Difficulty } from "@/lib/types";
import { daysBetween, parseKey, relDays } from "@/lib/date-utils";

interface ChapterRowBetProps {
  index: number;
  name: string;
  state: ChapterState;
  onToggleDone: () => void;
  onBumpRevision: () => void;
  onResetRevision: () => void;
  onCycleDifficulty: () => void;
  subtopics?: string[];
  isSubtopicDone?: (subIdx: number) => boolean;
  onToggleSubtopic?: (subIdx: number) => void;
}

// decorative avatar chip — cycles through a fixed palette, purely visual variety like the reference rows
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#7B4DFF,#C084FC)",
  "linear-gradient(135deg,#FB923C,#F87171)",
  "linear-gradient(135deg,#38BDF8,#6366F1)",
  "linear-gradient(135deg,#2DD4BF,#22C55E)",
  "linear-gradient(135deg,#EC4899,#A855F7)",
  "linear-gradient(135deg,#64748B,#334155)",
];

const DIFF_DOT: Record<Exclude<Difficulty, null>, string> = {
  easy: "#4ADE80",
  medium: "#FACC15",
  hard: "#F87171",
};

type Status = "new" | "readyToRevise" | "fresh" | "stale";

function getStatus(state: ChapterState): Status {
  if (!state.done) return "new";
  const revCount = state.revCount ?? 0;
  if (revCount === 0) return "readyToRevise";
  const staleDays = state.lastRevised ? daysBetween(parseKey(state.lastRevised), new Date()) : Infinity;
  return staleDays >= 7 ? "stale" : "fresh";
}

const STATUS_STYLE: Record<Status, { wash: string; text: string; pillBg: string; pillText: string }> = {
  new: {
    wash: "linear-gradient(90deg, rgba(255,255,255,0.05), transparent 55%)",
    text: "rgba(163,163,163,0.8)",
    pillBg: "rgba(255,255,255,0.06)",
    pillText: "#a3a3a3",
  },
  readyToRevise: {
    wash: "linear-gradient(90deg, rgba(56,189,248,0.16), transparent 55%)",
    text: "#7DD3FC",
    pillBg: "rgba(56,189,248,0.16)",
    pillText: "#7DD3FC",
  },
  fresh: {
    wash: "linear-gradient(90deg, rgba(45,212,191,0.24), rgba(34,197,94,0.10) 42%, transparent 68%)",
    text: "#5EEAD4",
    pillBg: "rgba(45,212,191,0.22)",
    pillText: "#5EEAD4",
  },
  stale: {
    wash: "linear-gradient(90deg, rgba(251,146,60,0.24), rgba(248,113,113,0.12) 42%, transparent 68%)",
    text: "#FDBA74",
    pillBg: "rgba(251,146,60,0.22)",
    pillText: "#FDBA74",
  },
};

export function ChapterRowBet({
  index,
  name,
  state,
  onToggleDone,
  onBumpRevision,
  onResetRevision,
  onCycleDifficulty,
  subtopics,
  isSubtopicDone,
  onToggleSubtopic,
}: ChapterRowBetProps) {
  const [expanded, setExpanded] = useState(false);
  const revCount = state.revCount ?? 0;
  const diff = state.diff ?? null;
  const status = getStatus(state);
  const s = STATUS_STYLE[status];
  const avatar = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  const hasSubtopics = Boolean(subtopics && subtopics.length > 0 && isSubtopicDone && onToggleSubtopic);
  const subDoneCount = hasSubtopics ? subtopics!.filter((_, i) => isSubtopicDone!(i)).length : 0;

  let statusLabel: string;
  if (status === "new") statusLabel = "Not started";
  else if (status === "readyToRevise") statusLabel = "Ready to revise";
  else if (status === "fresh") statusLabel = `Revised ${relDays(state.lastRevised) ?? ""}`.trim();
  else statusLabel = `${relDays(state.lastRevised)} · due`;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.05] bg-[#141118]">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: Math.min(index, 20) * 0.02 }}
        className="relative flex items-center gap-3 px-3 py-2.5"
      >
        <div className="pointer-events-none absolute inset-0" style={{ background: s.wash }} />

        {/* avatar chip */}
        <div
          className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white/90"
          style={{ background: avatar }}
        >
          {index + 1}
        </div>

        {/* chapter label + difficulty tag */}
        <div
          onClick={onToggleDone}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onToggleDone();
          }}
          className="relative z-10 flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
        >
          <span className="flex-shrink-0 font-tabular text-[10px] text-white/35">Ch {index + 1}</span>
          <span className={`truncate text-[13px] ${state.done ? "text-white/40 line-through" : "text-white/90"}`}>{name}</span>
          {diff && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCycleDifficulty();
              }}
              className="flex flex-shrink-0 items-center gap-1 rounded-full border border-white/10 bg-black/25 px-2 py-0.5 text-[9px] capitalize text-white/60"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: DIFF_DOT[diff] }} />
              {diff}
            </button>
          )}
        </div>

        {!diff && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCycleDifficulty();
            }}
            className="relative z-10 hidden flex-shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[9px] text-white/35 sm:block"
          >
            + difficulty
          </button>
        )}

        {/* status text, mirrors the $ amount column */}
        <span className="relative z-10 hidden w-[104px] flex-shrink-0 text-right font-tabular text-[11px] font-medium sm:block" style={{ color: s.text }}>
          {statusLabel}
        </span>

        {/* multiplier-style pill = revision count */}
        <button
          onClick={onBumpRevision}
          onDoubleClick={onResetRevision}
          title="Click to log a revision · double-click to reset"
          className="relative z-10 flex-shrink-0 rounded-full px-3 py-1 font-tabular text-[11px] font-semibold"
          style={{ background: s.pillBg, color: s.pillText }}
        >
          {revCount > 0 ? `×${revCount}` : "Revise"}
        </button>

        {/* done toggle */}
        <button
          onClick={onToggleDone}
          aria-label={state.done ? "Mark chapter not done" : "Mark chapter done"}
          className="relative z-10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border transition-colors"
          style={{
            borderColor: state.done ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.12)",
            background: state.done ? "rgba(74,222,128,0.18)" : "transparent",
          }}
        >
          {state.done ? <Check size={13} strokeWidth={2.5} className="text-[#4ADE80]" /> : <Dna size={12} strokeWidth={1.75} className="text-white/25" />}
        </button>

        {/* expand subtopics */}
        {hasSubtopics && (
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? "Hide subtopics" : "Show subtopics"}
            className="relative z-10 flex flex-shrink-0 items-center gap-1 rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/40 transition-colors hover:text-white/70"
          >
            <span className="font-tabular">
              {subDoneCount}/{subtopics!.length}
            </span>
            <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={12} strokeWidth={2} />
            </motion.span>
          </button>
        )}
      </motion.div>

      <AnimatePresence initial={false}>
        {hasSubtopics && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.05] bg-black/20"
          >
            <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-2">
              {subtopics!.map((topic, i) => {
                const done = isSubtopicDone!(i);
                return (
                  <button
                    key={i}
                    onClick={() => onToggleSubtopic!(i)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <span
                      className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border"
                      style={{
                        borderColor: done ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.15)",
                        background: done ? "rgba(74,222,128,0.18)" : "transparent",
                      }}
                    >
                      {done && <Check size={9} strokeWidth={3} className="text-[#4ADE80]" />}
                    </span>
                    <span className={`truncate text-[12px] ${done ? "text-white/40 line-through" : "text-white/70"}`}>
                      {topic}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
