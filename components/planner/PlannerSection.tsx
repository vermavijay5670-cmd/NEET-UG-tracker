"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SubjectCard } from "./SubjectCard";
import { SUBJECT_ACCENT, SUBJECT_NAME, ACCENT_HEX } from "@/lib/data";
import type { Subject } from "@/lib/types";

const SUBJECTS: Subject[] = ["phy", "chem", "bio"];

export function PlannerSection() {
  const [active, setActive] = useState<Subject>("phy");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2.5">
        {SUBJECTS.map((s) => {
          const accentHex = ACCENT_HEX[SUBJECT_ACCENT[s]];
          const isActive = active === s;
          return (
            <button key={s} onClick={() => setActive(s)} className="relative">
              {isActive && (
                <motion.span
                  layoutId="planner-tab-pill"
                  className="absolute inset-0 rounded-full"
                  style={{ background: `${accentHex}1a`, border: `1px solid ${accentHex}55` }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span
                className="relative z-10 block rounded-full px-5 py-2 text-sm font-medium transition-colors"
                style={{ color: isActive ? accentHex : "#a3a3a3" }}
              >
                {SUBJECT_NAME[s]}
              </span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <SubjectCard subject={active} />
      </motion.div>
    </div>
  );
}
