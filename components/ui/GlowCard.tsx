"use client";

import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { Accent } from "@/lib/data";
import { ACCENT_HEX } from "@/lib/data";

const GLOW_SHADOW: Record<Accent, string> = {
  lime: "0 35px 70px rgba(199, 241, 45, 0.18), 0 25px 60px rgba(0, 0, 0, 0.36)",
  purple: "0 35px 70px rgba(124, 77, 255, 0.14), 0 25px 60px rgba(0, 0, 0, 0.34)",
  cyan: "0 35px 70px rgba(70, 255, 233, 0.19), 0 25px 60px rgba(0, 0, 0, 0.31)",
  emerald: "0 35px 70px rgba(65, 255, 113, 0.16), 0 25px 60px rgba(0, 0, 0, 0.29)",
  gold: "0 35px 70px rgba(255, 213, 77, 0.16), 0 25px 60px rgba(0, 0, 0, 0.26)",
};

interface GlowCardProps {
  accent?: Accent;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function GlowCard({ accent, children, className = "", delay = 0 }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  const shadow = accent ? GLOW_SHADOW[accent] : "0 25px 60px rgba(0,0,0,0.45)";
  const accentHex = accent ? ACCENT_HEX[accent] : "rgba(255,255,255,0.06)";
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(circle at ${x} ${y}, ${accentHex}22 0%, transparent 60%)`
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, delay }}
      style={{ boxShadow: shadow }}
      className={`group relative overflow-hidden rounded-[28px] border border-white/[0.05] bg-[#202020] p-5 sm:p-7 ${className}`}
    >
      {/* ambient light that follows the cursor */}
      {accent && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glowBackground }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
