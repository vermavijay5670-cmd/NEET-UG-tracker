"use client";

import { motion } from "framer-motion";
import { Stethoscope, HeartPulse, Pill, Syringe, Microscope, Activity, Dna, Thermometer } from "lucide-react";

const ICONS = [
  { Icon: Stethoscope, top: "8%", left: "6%", size: 120, rotate: -12, delay: 0 },
  { Icon: HeartPulse, top: "18%", left: "82%", size: 90, rotate: 8, delay: 0.5 },
  { Icon: Pill, top: "60%", left: "4%", size: 80, rotate: 20, delay: 1 },
  { Icon: Syringe, top: "74%", left: "86%", size: 100, rotate: -16, delay: 1.5 },
  { Icon: Microscope, top: "42%", left: "92%", size: 110, rotate: 10, delay: 0.8 },
  { Icon: Activity, top: "88%", left: "30%", size: 130, rotate: 0, delay: 0.3 },
  { Icon: Dna, top: "6%", left: "46%", size: 140, rotate: -6, delay: 1.2 },
  { Icon: Thermometer, top: "50%", left: "50%", size: 70, rotate: 18, delay: 0.6 },
];

export function MedicalBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(10, 10, 14, 0.1) 0%, rgba(17, 17, 24, 0.35) 45%, rgba(10, 10, 14, 0.15) 100%)",
        }}
      />
      {ICONS.map(({ Icon, top, left, size, rotate, delay }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top, left, opacity: 0.12, color: "#D8B4FE" }}
          initial={{ y: 0, rotate }}
          animate={{ y: [0, -12, 0], rotate: [rotate, rotate + 2, rotate] }}
          transition={{ duration: 10 + i, repeat: Infinity, ease: "easeInOut", delay }}
        >
          <Icon size={size} strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}
