"use client";

import { motion } from "framer-motion";
import { addDays, dateKey, parseKey, fmtHrs } from "@/lib/date-utils";
import { ACCENT_HEX } from "@/lib/data";

interface HeatmapProps {
  log: Record<string, number>;
  startDate: string;
  dailyGoalHours: number;
  weeks?: number;
}

function levelFor(hours: number, goal: number): number {
  if (hours <= 0) return 0;
  if (goal <= 0) return 2;
  if (hours < goal * 0.5) return 1;
  if (hours < goal) return 2;
  return 3;
}

const LEVEL_OPACITY = [0.06, 0.28, 0.6, 1];

export function Heatmap({ log, startDate, dailyGoalHours, weeks = 16 }: HeatmapProps) {
  const today = new Date();
  const start = parseKey(startDate);
  const accent = ACCENT_HEX.lime;

  const columns = Array.from({ length: weeks }, (_, wFromLeft) => {
    const w = weeks - 1 - wFromLeft;
    return Array.from({ length: 7 }, (_, d) => {
      const day = addDays(today, -(w * 7) + d - today.getDay());
      const inRange = day <= today && day >= start;
      const key = dateKey(day);
      const hours = log[key] ?? 0;
      const level = inRange ? levelFor(hours, dailyGoalHours) : -1;
      return { key, hours, level, inRange };
    });
  });

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex gap-[3px]">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-[3px]">
            {col.map((cell, ri) =>
              cell.inRange ? (
                <motion.div
                  key={cell.key}
                  title={`${cell.key}: ${fmtHrs(cell.hours)}`}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (ci * 7 + ri) * 0.003, type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.35 }}
                  className="h-[12px] w-[12px] rounded-[3px]"
                  style={{
                    background: cell.level > 0 ? accent : "rgba(255,255,255,0.05)",
                    opacity: cell.level > 0 ? LEVEL_OPACITY[cell.level] : 1,
                    boxShadow: cell.level === 3 ? `0 0 6px ${accent}88` : "none",
                  }}
                />
              ) : (
                <div key={`${ci}-${ri}`} className="h-[12px] w-[12px]" />
              )
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[#a3a3a3]">
        <span>less</span>
        {LEVEL_OPACITY.map((op, i) => (
          <span
            key={i}
            className="h-[10px] w-[10px] rounded-[2px]"
            style={{ background: i === 0 ? "rgba(255,255,255,0.05)" : accent, opacity: i === 0 ? 1 : op }}
          />
        ))}
        <span>more &nbsp;·&nbsp; each column = 1 week, ending today</span>
      </div>
    </div>
  );
}
