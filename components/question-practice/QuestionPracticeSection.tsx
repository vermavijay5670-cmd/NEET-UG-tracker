"use client";

import Link from "next/link";
import { ArrowUpRight, Atom, Dna, FlaskConical } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { SUBJECT_NAME, SUBJECT_ACCENT, ACCENT_HEX, QUESTION_PRACTICE_LINKS } from "@/lib/data";
import type { Subject } from "@/lib/types";

const SUBJECTS: Subject[] = ["phy", "chem", "bio"];

const SUBJECT_ICON: Record<Subject, typeof Atom> = {
  phy: Atom,
  chem: FlaskConical,
  bio: Dna,
};

export function QuestionPracticeSection() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {SUBJECTS.map((subject, i) => {
        const accent = SUBJECT_ACCENT[subject];
        const accentHex = ACCENT_HEX[accent];
        const href = QUESTION_PRACTICE_LINKS[subject];
        const Icon = SUBJECT_ICON[subject];
        const ready = Boolean(href);

        return (
          <GlowCard key={subject} accent={accent} delay={i * 0.05} className="flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: `${accentHex}1a` }}
                >
                  <Icon size={20} strokeWidth={1.75} style={{ color: accentHex }} />
                </span>
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide"
                  style={{
                    background: ready ? `${accentHex}1a` : "rgba(255,255,255,0.06)",
                    color: ready ? accentHex : "#a3a3a3",
                  }}
                >
                  {ready ? "Live" : "Coming soon"}
                </span>
              </div>

              <h2 className="mt-4 text-[17px] font-medium text-white">{SUBJECT_NAME[subject]}</h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[#a3a3a3]">
                {ready
                  ? `Practice ${SUBJECT_NAME[subject]} questions on the dedicated site.`
                  : `${SUBJECT_NAME[subject]} question practice is being built separately — it'll link here once it's ready.`}
              </p>
            </div>

            {ready ? (
              <Link
                href={href as string}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-medium transition-colors"
                style={{ background: `${accentHex}1f`, color: accentHex, border: `1px solid ${accentHex}55` }}
              >
                Open practice site <ArrowUpRight size={14} strokeWidth={1.75} />
              </Link>
            ) : (
              <span className="mt-6 flex items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.02] py-2.5 text-sm font-medium text-white/30">
                Not available yet
              </span>
            )}
          </GlowCard>
        );
      })}
    </div>
  );
}
