"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export type LiquidGlow = "purple" | "green" | "red" | "yellow" | "cyan" | "orange";

interface GlowTokens {
  a1: string; // outer glow, resting
  a2: string; // outer glow , resting
  b1: string; // outer glow, pulsed
  b2: string; // outer glow , pulsed
  spot: string; // cursor spotlight
  edge: string; // bottom edge line
}

const GLOW_MAP: Record<LiquidGlow, GlowTokens> = {
  purple: {
    a1: "rgba(168,85,247,0.18)",
    a2: "rgba(192,132,252,0.20)",
    b1: "rgba(168,85,247,0.28)",
    b2: "rgba(192,132,252,0.30)",
    spot: "rgba(192,132,252,0.22)",
    edge: "rgba(232,121,249,0.35)",
  },
  green: {
    a1: "rgba(34,197,94,0.18)",
    a2: "rgba(74,222,128,0.20)",
    b1: "rgba(34,197,94,0.30)",
    b2: "rgba(74,222,128,0.32)",
    spot: "rgba(74,222,128,0.22)",
    edge: "rgba(74,222,128,0.35)",
  },
  red: {
    a1: "rgba(239,68,68,0.16)",
    a2: "rgba(248,113,113,0.18)",
    b1: "rgba(239,68,68,0.26)",
    b2: "rgba(248,113,113,0.28)",
    spot: "rgba(248,113,113,0.2)",
    edge: "rgba(248,113,113,0.32)",
  },
  yellow: {
    a1: "rgba(234,179,8,0.18)",
    a2: "rgba(250,204,21,0.2)",
    b1: "rgba(234,179,8,0.28)",
    b2: "rgba(250,204,21,0.3)",
    spot: "rgba(250,204,21,0.22)",
    edge: "rgba(250,204,21,0.35)",
  },
  cyan: {
    a1: "rgba(6,182,212,0.18)",
    a2: "rgba(103,232,249,0.2)",
    b1: "rgba(6,182,212,0.28)",
    b2: "rgba(103,232,249,0.3)",
    spot: "rgba(103,232,249,0.22)",
    edge: "rgba(103,232,249,0.35)",
  },
  orange: {
    a1: "rgba(249,115,22,0.18)",
    a2: "rgba(253,186,116,0.2)",
    b1: "rgba(249,115,22,0.28)",
    b2: "rgba(253,186,116,0.3)",
    spot: "rgba(253,186,116,0.22)",
    edge: "rgba(253,186,116,0.35)",
  },
};

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  glow?: LiquidGlow;
}

export function LiquidGlassCard({ children, className = "", delay = 0, glow = "purple" }: LiquidGlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(35);
  const tokens = GLOW_MAP[glow];

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  }
  function handleMouseLeave() {
    mx.set(50);
    my.set(35);
  }

  const glowBackground = useTransform([mx, my], ([x, y]) =>
    `radial-gradient(circle at ${x}% ${y}%, ${tokens.spot} 0%, transparent 55%)`
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay }}
      className={`liquid-card relative overflow-hidden rounded-[28px] border border-white/[0.15] p-5 sm:p-6 ${className}`}
      style={
        {
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(30px) saturate(160%)",
          WebkitBackdropFilter: "blur(30px) saturate(160%)",
          boxShadow: `0 10px 50px ${tokens.a1}, 0 0 30px ${tokens.a2}, inset 0 1px 1px rgba(255,255,255,0.30)`,
          animation: "liquidCardPulse 7s ease-in-out infinite",
          "--glow-a1": tokens.a1,
          "--glow-a2": tokens.a2,
          "--glow-b1": tokens.b1,
          "--glow-b2": tokens.b2,
        } as React.CSSProperties
      }
    >
      {/* top sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: "linear-gradient(165deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 30%, transparent 55%)" }}
      />
      {/* bottom edge glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[6%] right-[6%] h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${tokens.edge}, transparent)` }}
      />
      {/* cursor spotlight */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glowBackground }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
