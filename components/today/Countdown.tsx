"use client";

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { LiquidGlassCard } from "@/components/ui/LiquidGlassCard";
import { parseKey, pad } from "@/lib/date-utils";

interface CountdownProps {
  examDate: string;
  startDate: string;
  onSetExamDate: (v: string) => void;
}

export function Countdown({ examDate, startDate, onSetExamDate }: CountdownProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <LiquidGlassCard delay={0} className="min-h-[280px]"><span /></LiquidGlassCard>;

  let days = "—";
  let hh = "00";
  let mm = "00";
  let ss = "00";
  let label = "set your exam date below";
  let pct = 0;

  if (examDate) {
    const target = new Date(`${examDate}T23:59:59`);
    const diff = target.getTime() - now.getTime();
    label = "days to go";
    if (diff <= 0) {
      days = "0";
      label = "exam day!";
      pct = 100;
    } else {
      const totalSecs = Math.floor(diff / 1000);
      days = String(Math.floor(totalSecs / 86400));
      hh = pad(Math.floor((totalSecs % 86400) / 3600));
      mm = pad(Math.floor((totalSecs % 3600) / 60));
      ss = pad(totalSecs % 60);
      const start = parseKey(startDate);
      const totalSpan = target.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      pct = totalSpan > 0 ? Math.min(100, Math.max(0, (elapsed / totalSpan) * 100)) : 0;
    }
  }

  return (
    <LiquidGlassCard delay={0}>
      <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#D8B4FE]/30 bg-[#A855F7]/15 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.14em] text-[#D8B4FE]">
        <CalendarClock size={11} strokeWidth={1.75} /> target exam
      </span>
      <h2 className="text-[16px] font-medium text-[#F6F4FF]">NEET UG Countdown</h2>
      <label className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-wide text-white/40">
        exam date
        <input
          type="date"
          value={examDate}
          onChange={(e) => onSetExamDate(e.target.value)}
          className="rounded border-0 border-b border-dashed border-white/30 bg-transparent px-1 py-0.5 text-[11px] text-white/70 outline-none focus:border-[#D8B4FE]"
        />
      </label>

      <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="font-tabular text-[60px] font-bold leading-none text-[#F6F4FF]" style={{ textShadow: "0 0 34px rgba(192,132,252,0.55)" }}>
        {days}
      </div>
      <div className="mb-4 text-[9px] uppercase tracking-[0.25em] text-white/40">{label}</div>

      <div className="mb-4 flex items-center gap-0">
        {[
          { v: hh, u: "hrs" },
          { v: mm, u: "min" },
          { v: ss, u: "sec" },
        ].map((b, i) => (
          <div key={b.u} className="flex items-center">
            <div className="flex min-w-[52px] flex-col items-center">
              <span className="font-tabular text-[22px] font-bold text-[#D8B4FE]">{b.v}</span>
              <span className="mt-0.5 text-[8px] uppercase tracking-wide text-white/40">{b.u}</span>
            </div>
            {i < 2 && <span className="pb-2.5 text-lg text-[#A855F7]/50">:</span>}
          </div>
        ))}
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full border border-white/10 bg-black/25">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg,#6d28d9,#D8B4FE)" }}
        />
      </div>
    </LiquidGlassCard>
  );
}
