"use client";

import { Flame, Trophy, CalendarCheck, Timer } from "lucide-react";
import { GlowCard } from "@/components/ui/GlowCard";
import { StatCard } from "@/components/ui/StatCard";
import { Heatmap } from "./Heatmap";
import { HoursBarChart } from "./HoursBarChart";
import { Ledger } from "./Ledger";
import { useTrackerState } from "@/lib/useTrackerState";
import { fmtHrs } from "@/lib/date-utils";

export function StudyLogSection() {
  const { state, hydrated, setLogEntry, setDailyGoalHours, streaks, totalDays, totalHoursLogged, daysStudied } =
    useTrackerState();

  if (!hydrated) {
    return <div className="py-24 text-center text-sm text-[#a3a3a3]">Loading your log…</div>;
  }

  const avgPerStudied = daysStudied > 0 ? totalHoursLogged / daysStudied : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-5">
        <StatCard label="Current streak" value={streaks.current} suffix="d" sub={`best: ${streaks.best}d`} icon={Flame} accent="lime" delay={0} />
        <StatCard
          label="Total logged"
          value={totalHoursLogged}
          decimals={1}
          suffix="h"
          sub={`since ${state.startDate}`}
          icon={Trophy}
          accent="gold"
          delay={0.05}
        />
        <StatCard
          label="Days studied"
          value={daysStudied}
          suffix={`/${totalDays}`}
          sub={`${Math.round((daysStudied / totalDays) * 100)}% of days`}
          icon={CalendarCheck}
          accent="purple"
          delay={0.1}
        />
        <StatCard
          label="Avg / studied day"
          value={avgPerStudied}
          decimals={1}
          suffix="h"
          sub={`${fmtHrs(totalHoursLogged / totalDays)} / calendar day`}
          icon={Timer}
          accent="cyan"
          delay={0.15}
        />
      </div>

      <GlowCard accent="gold" delay={0.2}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-medium text-white">Activity</h2>
            <p className="text-[11px] text-[#a3a3a3]">Hours logged by date, and your daily goal</p>
          </div>
          <label className="flex items-center gap-2 text-[11px] text-[#a3a3a3]">
            Daily goal
            <input
              type="number"
              step="0.5"
              min="0"
              value={state.dailyGoalHours}
              onChange={(e) => setDailyGoalHours(parseFloat(e.target.value))}
              className="w-14 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-right font-tabular text-xs text-[#FFD64D] outline-none focus:border-white/20"
            />
            h
          </label>
        </div>

        <Heatmap log={state.log} startDate={state.startDate} dailyGoalHours={state.dailyGoalHours} />

        <div className="my-6 h-px w-full bg-white/[0.05]" />

        <h3 className="mb-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#a3a3a3]">Last 14 days</h3>
        <HoursBarChart log={state.log} dailyGoalHours={state.dailyGoalHours} />
      </GlowCard>

      <GlowCard delay={0.25}>
        <h2 className="mb-4 text-[15px] font-medium text-white">Daily ledger</h2>
        <Ledger log={state.log} startDate={state.startDate} dailyGoalHours={state.dailyGoalHours} onChange={setLogEntry} />
      </GlowCard>
    </div>
  );
}
