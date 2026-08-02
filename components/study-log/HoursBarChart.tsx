"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { addDays, dateKey, weekdayShort } from "@/lib/date-utils";
import { ACCENT_HEX } from "@/lib/data";

interface HoursBarChartProps {
  log: Record<string, number>;
  dailyGoalHours: number;
}

export function HoursBarChart({ log, dailyGoalHours }: HoursBarChartProps) {
  const today = new Date();
  const data = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(today, -(13 - i));
    const key = dateKey(d);
    return { day: weekdayShort(d), hours: Math.round((log[key] ?? 0) * 10) / 10, goal: dailyGoalHours };
  });

  const gold = ACCENT_HEX.gold;

  return (
    <div className="h-[160px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a3a3a3", fontSize: 10 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              fontSize: 12,
              color: "#fff",
            }}
            formatter={(v: number) => [`${v}h`, "Studied"]}
            labelFormatter={() => ""}
          />
          <Bar dataKey="hours" radius={[6, 6, 6, 6]} fill={gold} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
