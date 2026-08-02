"use client";

import Link from "next/link";
import { Flame } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { SUBJECT_ACCENT, ACCENT_HEX } from "@/lib/data";
import type { Subject } from "@/lib/types";

interface StreakPromoCardProps {
  currentStreak: number;
  bestStreak: number;
  totalDone: number;
}

const SUBJECTS: Subject[] = ["phy", "chem", "bio"];
const INITIAL: Record<Subject, string> = { phy: "P", chem: "C", bio: "B" };

export function StreakPromoCard({ currentStreak, bestStreak, totalDone }: StreakPromoCardProps) {
  return (
    <LiquidGlassCard delay={0.1} glow="orange" className="flex h-full flex-col justify-between">
      <div>
        <span className="mb-3 inline-flex items-center justify-center rounded-full bg-[#A855F7]/20 p-2">
          <Flame size={16} strokeWidth={1.75} className="text-[#D8B4FE]" />
        </span>
        <h2 className="text-[17px] font-medium leading-snug text-[#F6F4FF]">
          {currentStreak > 0 ? `${currentStreak}-day streak` : "Start a streak"}
        </h2>
        <p className="mt-1.5 text-[11px] leading-relaxed text-white/45">
          {currentStreak > 0
            ? `Keep it going — your best run so far is ${bestStreak} days.`
            : "Log some study time today to kick one off."}
        </p>
      </div>

      <div>
        <div className="my-4 flex -space-x-2.5">
          {SUBJECTS.map((s) => {
            const hex = ACCENT_HEX[SUBJECT_ACCENT[s]];
            return (
              <span
                key={s}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#171224] text-[11px] font-semibold text-black"
                style={{ background: hex }}
              >
                {INITIAL[s]}
              </span>
            );
          })}
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#171224] bg-white/10 text-[10px] font-medium text-white/70">
            +{totalDone}
          </span>
        </div>

        <Link
          href="/planner"
          className="flex w-full items-center justify-center rounded-full bg-[#F6F4FF] px-4 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
        >
          Open planner
        </Link>
      </div>
    </LiquidGlassCard>
  );
}
