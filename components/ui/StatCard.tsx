"use client";

import type { LucideIcon } from "lucide-react";
import { GlowCard } from "./GlowCard";
import type { Accent } from "@/lib/data";
import { ACCENT_HEX } from "@/lib/data";
import { useCountUp } from "@/lib/useCountUp";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  sub?: string;
  icon: LucideIcon;
  accent: Accent;
  delay?: number;
}

export function StatCard({ label, value, suffix = "", decimals = 0, sub, icon: Icon, accent, delay = 0 }: StatCardProps) {
  const animated = useCountUp(value);
  const display = decimals > 0 ? animated.toFixed(decimals) : Math.round(animated).toString();

  return (
    <GlowCard accent={accent} delay={delay} className="min-w-[140px] flex-1">
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#a3a3a3]">{label}</span>
        <Icon size={16} strokeWidth={1.75} style={{ color: ACCENT_HEX[accent] }} className="opacity-80" />
      </div>
      <div className="mt-3 font-tabular text-[28px] font-semibold text-white">
        {display}
        {suffix}
      </div>
      {sub && <div className="mt-1 text-[11px] text-[#a3a3a3]">{sub}</div>}
    </GlowCard>
  );
}
