"use client";

import { motion } from "framer-motion";
import type { Accent } from "@/lib/data";
import { ACCENT_HEX } from "@/lib/data";

interface CapsuleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  accent?: Accent;
  variant?: "solid" | "ghost";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}

export function CapsuleButton({
  children,
  onClick,
  accent,
  variant = "ghost",
  className = "",
  type = "button",
  disabled = false,
  ...rest
}: CapsuleButtonProps) {
  const accentHex = accent ? ACCENT_HEX[accent] : null;

  const solidStyle = accentHex
    ? {
        background: `${accentHex}1f`,
        borderColor: `${accentHex}55`,
        color: accentHex,
        boxShadow: `0 8px 24px ${accentHex}26, inset 0 1px 1px rgba(255,255,255,0.06)`,
      }
    : {};

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -3, filter: "brightness(1.12)" }}
      whileTap={disabled ? undefined : { scale: 0.94, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      style={variant === "solid" ? solidStyle : undefined}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide transition-shadow disabled:cursor-not-allowed disabled:opacity-50 ${
        variant === "ghost"
          ? "border-white/[0.08] bg-white/[0.03] text-[#e5e5e5] hover:bg-white/[0.06]"
          : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
