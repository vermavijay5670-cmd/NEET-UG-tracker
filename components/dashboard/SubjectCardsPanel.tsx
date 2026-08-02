"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, GraduationCap } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { SUBJECT_NAME, SUBJECT_ACCENT, ACCENT_HEX } from "@/lib/data";
import type { Subject, SubjectStats } from "@/lib/types";

interface SubjectCardsPanelProps {
  perSubject: (SubjectStats & { subject: Subject })[];
}

export function SubjectCardsPanel({ perSubject }: SubjectCardsPanelProps) {
  // default to whichever subject has the lowest completion — most useful "front card"
  const sortedByNeed = [...perSubject].sort((a, b) => a.done / a.total - b.done / b.total);
  const [frontSubject, setFrontSubject] = useState<Subject>(sortedByNeed[0]?.subject ?? "phy");

  const front = perSubject.find((s) => s.subject === frontSubject) ?? perSubject[0];
  const others = perSubject.filter((s) => s.subject !== frontSubject);
  const accentHex = ACCENT_HEX[SUBJECT_ACCENT[front.subject]];
  const pct = front.total > 0 ? Math.round((front.done / front.total) * 100) : 0;

  return (
    <LiquidGlassCard delay={0.05} glow="green">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-[#F6F4FF]">Subjects</h2>
        <Link href="/planner" className="text-[11px] text-white/40 hover:text-white/70">
          Open planner →
        </Link>
      </div>

      {/* switcher pills for the other two subjects — plain flow, no overlap */}
      <div className="mb-3 flex gap-2">
        {others.map((s) => {
          const hex = ACCENT_HEX[SUBJECT_ACCENT[s.subject]];
          const p = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
          return (
            <button
              key={s.subject}
              onClick={() => setFrontSubject(s.subject)}
              className="flex flex-1 items-center justify-between rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-left transition-colors hover:bg-white/[0.08]"
            >
              <span className="text-[11px] text-white/55">{SUBJECT_NAME[s.subject]}</span>
              <span className="font-tabular text-[11px] font-medium" style={{ color: hex }}>
                {p}%
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={front.subject}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="rounded-2xl border p-4"
          style={{
            background: `linear-gradient(145deg, ${accentHex}26, rgba(20,14,32,0.9))`,
            borderColor: `${accentHex}45`,
            boxShadow: `0 20px 40px ${accentHex}22`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-white/60">
              <GraduationCap size={13} strokeWidth={1.75} style={{ color: accentHex }} />
              {SUBJECT_NAME[front.subject]}
            </span>
            <span className="rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase" style={{ color: accentHex }}>
              NEET
            </span>
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-wide text-white/40">Chapters done</div>
              <div className="font-tabular text-[22px] font-bold text-[#F6F4FF]">
                {front.done}/{front.total}
              </div>
            </div>
            <span
              className="rounded-full px-2 py-1 text-[11px] font-medium"
              style={{ background: `${accentHex}22`, color: accentHex }}
            >
              {pct}%
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex gap-2">
        <Link
          href="/study-log"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[#e5e5e5] transition-colors hover:bg-white/[0.06]"
        >
          <ArrowDownLeft size={14} strokeWidth={1.75} /> Log hours
        </Link>
        <Link
          href="/planner"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors"
          style={{
            background: "rgba(34,197,94,0.18)",
            borderColor: "rgba(74,222,128,0.4)",
            color: "#4ADE80",
          }}
        >
          <ArrowUpRight size={14} strokeWidth={1.75} /> Revise
        </Link>
      </div>
    </LiquidGlassCard>
  );
}
