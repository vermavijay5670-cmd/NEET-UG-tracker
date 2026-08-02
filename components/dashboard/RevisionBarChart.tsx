"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { addDays, dateKey, parseKey } from "@/lib/date-utils";
import type { ChapterState, Subject } from "@/lib/types";
import { CHAPTERS } from "@/lib/data";

interface RevisionBarChartProps {
  getChapterState: (subj: Subject, cls: 11 | 12, i: number) => ChapterState;
}

type Period = "week" | "month";

export function RevisionBarChart({ getChapterState }: RevisionBarChartProps) {
  const [period, setPeriod] = useState<Period>("week");

  const revisionDates = useMemo(() => {
    const dates: string[] = [];
    (["phy", "chem", "bio"] as Subject[]).forEach((subj) => {
      ([11, 12] as const).forEach((cls) => {
        CHAPTERS[subj][cls].forEach((_, i) => {
          const st = getChapterState(subj, cls, i);
          if (st.lastRevised) dates.push(st.lastRevised);
        });
      });
    });
    return dates;
  }, [getChapterState]);

  const data = useMemo(() => {
    const today = new Date();
    const buckets = period === "week" ? 6 : 6;
    const bucketSize = period === "week" ? 7 : 30;

    return Array.from({ length: buckets }, (_, i) => {
      const bucketEnd = addDays(today, -(buckets - 1 - i) * bucketSize);
      const bucketStart = addDays(bucketEnd, -(bucketSize - 1));
      const count = revisionDates.filter((d) => {
        const dk = parseKey(d).getTime();
        return dk >= parseKey(dateKey(bucketStart)).getTime() && dk <= parseKey(dateKey(bucketEnd)).getTime();
      }).length;
      const label =
        period === "week"
          ? bucketEnd.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : bucketEnd.toLocaleDateString("en-US", { month: "short" });
      return { label, count };
    });
  }, [revisionDates, period]);

  const maxCount = Math.max(1, ...data.map((d) => d.count));
  const totalThisPeriod = data[data.length - 1]?.count ?? 0;

  return (
    <LiquidGlassCard delay={0.12} glow="red">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[14px] font-medium text-white/60">Revision activity</h2>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-tabular text-[22px] font-bold text-[#F6F4FF]">{totalThisPeriod}</span>
            <span className="text-[11px] text-white/40">this {period}</span>
          </div>
        </div>
        <div className="flex gap-1 rounded-full border border-white/10 bg-black/20 p-1">
          {(["week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium capitalize transition-colors ${
                period === p ? "bg-white text-black" : "text-white/50 hover:text-white/80"
              }`}
            >
              {p}ly
            </button>
          ))}
        </div>
      </div>

      <div className="h-[170px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "#171224",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14,
                fontSize: 12,
                color: "#F6F4FF",
              }}
              formatter={(v: number) => [`${v}`, "Chapters revised"]}
            />
            <Bar dataKey="count" radius={[8, 8, 8, 8]} maxBarSize={34}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.count === maxCount && maxCount > 0 ? "#C084FC" : "rgba(192,132,252,0.28)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </LiquidGlassCard>
  );
}
