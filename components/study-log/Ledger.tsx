"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { addDays, dateKey, daysBetween, parseKey, weekdayShort } from "@/lib/date-utils";
import { CapsuleButton } from "@/components/ui/CapsuleButton";

interface LedgerProps {
  log: Record<string, number>;
  startDate: string;
  dailyGoalHours: number;
  onChange: (key: string, hours: number | null) => void;
}

export function Ledger({ log, startDate, dailyGoalHours, onChange }: LedgerProps) {
  const [manualDate, setManualDate] = useState("");
  const [manualHours, setManualHours] = useState("");

  const today = new Date();
  const start = parseKey(startDate);
  const totalDays = daysBetween(start, today) + 1;
  const rows = Array.from({ length: totalDays }, (_, i) => addDays(today, -i));

  function submitManual() {
    if (!manualDate || manualHours === "") return;
    onChange(manualDate, parseFloat(manualHours));
    setManualHours("");
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <input
          type="date"
          value={manualDate}
          onChange={(e) => setManualDate(e.target.value)}
          className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs text-[#e5e5e5] outline-none focus:border-white/20"
        />
        <input
          type="number"
          step="0.1"
          min="0"
          placeholder="hrs"
          value={manualHours}
          onChange={(e) => setManualHours(e.target.value)}
          className="w-20 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs text-[#e5e5e5] outline-none focus:border-white/20"
        />
        <CapsuleButton onClick={submitManual} accent="gold" variant="solid">
          <Plus size={14} strokeWidth={1.75} /> Log this date
        </CapsuleButton>
      </div>

      <div className="max-h-[380px] overflow-auto rounded-2xl border border-white/[0.05] bg-black/20">
        {rows.map((d, i) => {
          const key = dateKey(d);
          const hours = log[key];
          const hit = hours !== undefined && dailyGoalHours > 0 && hours >= dailyGoalHours;
          const pct = dailyGoalHours > 0 ? Math.min(100, ((hours ?? 0) / dailyGoalHours) * 100) : hours ? 100 : 0;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i, 20) * 0.015 }}
              className={`flex min-w-[260px] items-center gap-2 border-b border-white/[0.04] px-3 py-2 last:border-b-0 sm:gap-3 sm:px-4 ${
                i === 0 ? "bg-[#FFD64D]/[0.04]" : ""
              }`}
            >
              <span className="min-w-[68px] flex-shrink-0 font-tabular text-xs text-[#e5e5e5]">{key}</span>
              <span className="min-w-[26px] flex-shrink-0 text-[10px] uppercase text-[#a3a3a3]">{weekdayShort(d)}</span>
              <span
                className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ background: hit ? "#41FF72" : "rgba(255,255,255,0.08)", boxShadow: hit ? "0 0 6px #41FF7288" : "none" }}
              />
              <div className="h-[5px] min-w-[24px] flex-[2] overflow-hidden rounded-full bg-white/[0.05]">
                <div className="h-full rounded-full bg-[#FFD64D]" style={{ width: `${pct}%` }} />
              </div>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="—"
                defaultValue={hours ?? ""}
                onBlur={(e) => {
                  const v = e.target.value;
                  onChange(key, v === "" ? null : parseFloat(v));
                }}
                className="w-[58px] flex-shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-right font-tabular text-xs text-[#FFD64D] outline-none focus:border-white/20"
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
