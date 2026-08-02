"use client";

import { motion } from "framer-motion";
import { Clock, NotebookPen, BookOpenCheck, LayoutDashboard, ListChecks, type LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  hex: string;
}

const FEATURES: Feature[] = [
  {
    icon: Clock,
    title: "Today",
    description: "A live countdown to exam day, a stopwatch that logs your hours as you go, and a focus timer with custom durations.",
    hex: "#8B5CF6",
  },
  {
    icon: NotebookPen,
    title: "Study Log",
    description: "Every day shows up — even the ones you didn't study. Hours by date, a heatmap, streaks, and daily goals.",
    hex: "#FFD64D",
  },
  {
    icon: BookOpenCheck,
    title: "Planner",
    description: "All the NCERT chapters across Physics, Chemistry, and Biology, with revision counts, difficulty tags, and subtopics.",
    hex: "#46FFE8",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Study hours, chapter progress, and revision streaks — pulled into one view so you know exactly where you stand.",
    hex: "#41FF72",
  },
  {
    icon: ListChecks,
    title: "Question Practice",
    description: "Dedicated per-subject practice sites, linked in once each one is ready.",
    hex: "#C7F12D",
  },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-12 max-w-[560px]"
      >
        <h2 className="text-[28px] font-semibold text-[#F6F4FF] sm:text-[34px]">Everything in one place</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-white/50">
          No more juggling a countdown app, a notes app, and a separate revision tracker.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="rounded-[24px] border border-white/[0.08] bg-white/[0.04] p-6"
            style={{ boxShadow: `0 20px 45px ${f.hex}14` }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: `${f.hex}1f` }}>
              <f.icon size={20} strokeWidth={1.75} style={{ color: f.hex }} />
            </span>
            <h3 className="mt-4 text-[17px] font-medium text-white">{f.title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/50">{f.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
