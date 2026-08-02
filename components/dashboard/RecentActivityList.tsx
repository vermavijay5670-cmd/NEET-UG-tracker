"use client";

import Link from "next/link";
import { Clock3, RefreshCw } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { SUBJECT_ACCENT, ACCENT_HEX } from "@/lib/data";
import type { Subject } from "@/lib/types";
import { relDays } from "@/lib/date-utils";

type Activity =
  | { type: "log"; date: string; hours: number }
  | { type: "revision"; date: string; subject: Subject; chapter: string };

export function RecentActivityList({ activity }: { activity: Activity[] }) {
  return (
    <LiquidGlassCard delay={0.15} glow="yellow">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-medium text-[#F6F4FF]">Recent activity</h2>
        <Link href="/study-log" className="text-[11px] text-white/40 hover:text-white/70">
          View all
        </Link>
      </div>

      {activity.length === 0 ? (
        <p className="py-6 text-center text-[11px] text-white/35">Nothing logged yet — get started on Today.</p>
      ) : (
        <div className="space-y-1">
          {activity.map((a, i) => {
            if (a.type === "log") {
              return (
                <div key={i} className="flex items-center gap-3 rounded-xl px-1 py-2">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                    <Clock3 size={14} strokeWidth={1.75} className="text-white/60" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12.5px] text-white/85">Study session</div>
                    <div className="text-[10px] text-white/35">{relDays(a.date)}</div>
                  </div>
                  <span className="flex-shrink-0 font-tabular text-[12.5px] font-medium text-[#7CFFA0]">
                    +{a.hours.toFixed(1)}h
                  </span>
                </div>
              );
            }
            const hex = ACCENT_HEX[SUBJECT_ACCENT[a.subject]];
            return (
              <div key={i} className="flex items-center gap-3 rounded-xl px-1 py-2">
                <span
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ background: `${hex}22` }}
                >
                  <RefreshCw size={14} strokeWidth={1.75} style={{ color: hex }} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] text-white/85">{a.chapter}</div>
                  <div className="text-[10px] text-white/35">{relDays(a.date)}</div>
                </div>
                <span className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ color: hex, background: `${hex}1a` }}>
                  Revised
                </span>
              </div>
            );
          })}
        </div>
      )}
    </LiquidGlassCard>
  );
}
