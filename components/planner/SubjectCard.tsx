"use client";

import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts";
import { GlowCard } from "@/components/ui/GlowCard";
import { ChapterRowBet } from "./ChapterRowBet";
import { ChapterRowMinimal } from "./ChapterRowMinimal";
import { ChapterRowLeaderboard } from "./ChapterRowLeaderboard";
import { CHAPTERS, SUBTOPICS, SUBJECT_ACCENT, SUBJECT_NAME, ACCENT_HEX } from "@/lib/data";
import type { Subject } from "@/lib/types";
import { useTrackerState } from "@/lib/useTrackerState";

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  const { getChapterState, toggleDone, bumpRevision, resetRevision, cycleDifficulty, getSubjectStats, isSubtopicDone, toggleSubtopic } =
    useTrackerState();

  const accent = SUBJECT_ACCENT[subject];
  const accentHex = ACCENT_HEX[accent];
  const { done, rev, total } = getSubjectStats(subject);
  const donePct = total > 0 ? Math.round((done / total) * 100) : 0;
  const revPct = total > 0 ? Math.round((rev / total) * 100) : 0;

  const radialData = [{ name: "done", value: donePct, fill: accentHex }];

  let nextKey: string | null = null;
  if (subject === "chem") {
    for (const cls of [11, 12] as const) {
      for (let i = 0; i < CHAPTERS[subject][cls].length; i++) {
        if (!getChapterState(subject, cls, i).done) {
          nextKey = `${cls}_${i}`;
          break;
        }
      }
      if (nextKey) break;
    }
  }

  return (
    <GlowCard accent={accent}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: accentHex }}>
            chapter tracker
          </span>
          <h2 className="mt-1 text-[18px] font-medium text-white">{SUBJECT_NAME[subject]}</h2>
          <p className="text-[11px] text-[#a3a3a3]">Class 11 &amp; 12 · NCERT order</p>
        </div>

        <div className="relative h-[92px] w-[92px]">
          <RadialBarChart
            width={92}
            height={92}
            innerRadius={34}
            outerRadius={44}
            data={radialData}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: "rgba(255,255,255,0.06)" }} dataKey="value" cornerRadius={8} angleAxisId={0} />
          </RadialBarChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-tabular text-[16px] font-semibold text-white">{donePct}%</span>
            <span className="text-[8px] uppercase tracking-wide text-[#a3a3a3]">done</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-[11px] text-[#a3a3a3]">
        <span>{done}/{total} chapters done</span>
        <span className="text-white/20">·</span>
        <span>{rev}/{total} revised ({revPct}%)</span>
      </div>
      <div className="mt-2 h-[4px] w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full" style={{ width: `${revPct}%`, background: accentHex, opacity: 0.55 }} />
      </div>

      <div className="mt-6 space-y-4">
        {([11, 12] as const).map((cls) => (
          <div key={cls}>
            <div className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#737373]">
              Class {cls}
            </div>
            <div className={subject === "phy" || subject === "chem" ? "space-y-3" : "space-y-1.5"}>
              {CHAPTERS[subject][cls].map((name, i) => {
                const chState = getChapterState(subject, cls, i);
                const handlers = {
                  onToggleDone: () => toggleDone(subject, cls, i),
                  onBumpRevision: () => bumpRevision(subject, cls, i),
                  onResetRevision: () => resetRevision(subject, cls, i),
                  onCycleDifficulty: () => cycleDifficulty(subject, cls, i),
                };

                if (subject === "bio") {
                  const subtopics = SUBTOPICS.bio?.[cls]?.[i];
                  return (
                    <ChapterRowBet
                      key={i}
                      index={i}
                      name={name}
                      state={chState}
                      subtopics={subtopics}
                      isSubtopicDone={subtopics ? (subIdx) => isSubtopicDone(subject, cls, i, subIdx) : undefined}
                      onToggleSubtopic={subtopics ? (subIdx) => toggleSubtopic(subject, cls, i, subIdx) : undefined}
                      {...handlers}
                    />
                  );
                }
                if (subject === "phy") {
                  return <ChapterRowMinimal key={i} index={i} name={name} state={chState} {...handlers} />;
                }
                return (
                  <ChapterRowLeaderboard
                    key={i}
                    index={i}
                    name={name}
                    state={chState}
                    isNext={nextKey === `${cls}_${i}`}
                    {...handlers}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </GlowCard>
  );
}
