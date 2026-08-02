"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Log your hours",
    description: "Start the stopwatch when you sit down to study, or run the focus timer for a set block. Every session lands on today's date automatically.",
  },
  {
    n: "02",
    title: "Work through chapters",
    description: "Check off chapters as you finish them, tag their difficulty, and tap Revise every time you go back over one.",
  },
  {
    n: "03",
    title: "Watch it add up",
    description: "The dashboard pulls it all together — total hours, streaks, chapter completion, and what's overdue for revision.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 sm:py-24">
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-[28px] font-semibold text-[#F6F4FF] sm:text-[34px]"
      >
        How it works
      </motion.h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <span className="font-mono text-[13px] font-medium text-[#D8B4FE]/60">{s.n}</span>
            <h3 className="mt-2 text-[18px] font-medium text-white">{s.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-white/50">{s.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
