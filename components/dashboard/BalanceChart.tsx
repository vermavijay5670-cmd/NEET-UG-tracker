"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { addDays, dateKey, parseKey } from "@/lib/date-utils";

interface BalanceChartProps {
  log: Record<string, number>;
  startDate: string;
  totalHoursLogged: number;
  totalDays: number;
}

const RANGES = [
  { key: "7", label: "7 days" },
  { key: "30", label: "30 days" },
  { key: "90", label: "90 days" },
  { key: "all", label: "All time" },
] as const;

type RangeKey = (typeof RANGES)[number]["key"];

function sumHours(log: Record<string, number>, from: Date, to: Date): number {
  let total = 0;
  let cursor = new Date(from);
  while (cursor <= to) {
    total += log[dateKey(cursor)] ?? 0;
    cursor = addDays(cursor, 1);
  }
  return total;
}

export function BalanceChart({ log, startDate, totalHoursLogged, totalDays }: BalanceChartProps) {
  const [range, setRange] = useState<RangeKey>("30");

  const today = useMemo(() => new Date(), []);
  const start = parseKey(startDate);

  const windowDays = range === "all" ? totalDays : Math.min(Number(range), totalDays);

  const series = useMemo(() => {
    // cumulative sum from the very start, but only render the selected window
    const allDates: Date[] = [];
    let cursor = new Date(start);
    while (cursor <= today) {
      allDates.push(new Date(cursor));
      cursor = addDays(cursor, 1);
    }
    let running = 0;
    const withCumulative = allDates.map((d) => {
      running += log[dateKey(d)] ?? 0;
      return { date: d, cumulative: Math.round(running * 10) / 10, daily: log[dateKey(d)] ?? 0 };
    });
    const windowed = withCumulative.slice(-windowDays);
    return windowed.map((p) => ({
      label: p.date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      cumulative: p.cumulative,
      daily: p.daily,
    }));
  }, [log, start, today, windowDays]);

  const last7 = sumHours(log, addDays(today, -6), today);
  const prev7 = sumHours(log, addDays(today, -13), addDays(today, -7));
  const pct = prev7 > 0 ? ((last7 - prev7) / prev7) * 100 : last7 > 0 ? 100 : 0;
  const up = pct >= 0;

  const avgPerDay = totalDays > 0 ? totalHoursLogged / totalDays : 0;

  return (
    <LiquidGlassCard glow="cyan">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[14px] font-medium text-white/60">Total study hours</h2>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-tabular text-[34px] font-bold text-[#F6F4FF]">
              {totalHoursLogged.toFixed(1)}h
            </span>
            <span
              className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                up ? "bg-[#41FF72]/15 text-[#7CFFA0]" : "bg-white/10 text-white/50"
              }`}
            >
              {up ? <ArrowUpRight size={12} strokeWidth={2} /> : <ArrowDownRight size={12} strokeWidth={2} />}
              {Math.abs(pct).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex gap-1 rounded-full border border-white/10 bg-black/20 p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                range === r.key ? "bg-white text-black" : "text-white/50 hover:text-white/80"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 10, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C084FC" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#C084FC" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
              interval={Math.max(0, Math.floor(series.length / 6))}
            />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 }}
              contentStyle={{
                background: "#171224",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14,
                fontSize: 12,
                color: "#F6F4FF",
              }}
              formatter={(v: number) => [`${v}h`, "Total hours"]}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#C084FC"
              strokeWidth={2}
              fill="url(#balanceFill)"
              dot={false}
              activeDot={{ r: 4, fill: "#F6F4FF", stroke: "#C084FC", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/40">
        <span>Average pace &nbsp;{avgPerDay.toFixed(1)}h / day</span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-[#C084FC]" /> Cumulative hours logged
        </span>
      </div>
    </LiquidGlassCard>
  );
}
