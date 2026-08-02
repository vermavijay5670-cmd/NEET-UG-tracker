"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Lock } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto max-w-[1120px] px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#D8B4FE]/30 bg-[#A855F7]/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#D8B4FE]">
            Built for NEET UG
          </span>
          <h1 className="text-[36px] font-semibold leading-[1.1] text-[#F6F4FF] sm:text-[48px] lg:text-[56px]">
            Your NEET prep, <span className="text-[#D8B4FE]">finally organized.</span>
          </h1>
          <p className="mt-5 max-w-[520px] text-[16px] leading-relaxed text-white/55 sm:text-[17px]">
            Track study hours, revise every NCERT chapter on schedule, and watch your progress build —
            countdown, stopwatch, planner, and dashboard, all in one place.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/today"
              className="group flex items-center gap-2 rounded-full bg-[#F6F4FF] px-6 py-3.5 text-[15px] font-medium text-black transition-transform hover:scale-[1.03]"
            >
              Open Study Tracker
              <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <span className="flex items-center gap-1.5 text-[13px] text-white/40">
              <Lock size={13} strokeWidth={1.75} />
              Free, no sign-up — your data stays on your device
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div
            className="relative overflow-hidden rounded-[28px] border border-white/[0.15] p-6"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(30px) saturate(160%)",
              boxShadow: "0 10px 50px rgba(168,85,247,0.18), 0 0 30px rgba(192,132,252,0.2), inset 0 1px 1px rgba(255,255,255,0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wide text-white/40">Current streak</span>
              <Flame size={14} strokeWidth={1.75} className="text-[#D8B4FE]" />
            </div>
            <div className="mt-2 font-mono text-[40px] font-bold text-[#F6F4FF]" style={{ textShadow: "0 0 24px rgba(192,132,252,0.5)" }}>
              12<span className="text-[18px] font-medium text-white/40">d</span>
            </div>
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-black/25">
              <div className="h-full w-[68%] rounded-full" style={{ background: "linear-gradient(90deg,#6d28d9,#D8B4FE)" }} />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {[
                { label: "Physics", pct: 71, hex: "#7B4DFF" },
                { label: "Chemistry", pct: 54, hex: "#46FFE8" },
                { label: "Biology", pct: 88, hex: "#41FF72" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-black/20 p-2.5 text-center">
                  <div className="text-[9px] uppercase tracking-wide text-white/40">{s.label}</div>
                  <div className="mt-1 text-[15px] font-semibold" style={{ color: s.hex }}>
                    {s.pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 -z-10 h-40 w-40 rounded-full bg-[#8B5CF6]/25 blur-3xl" />
          <div className="absolute -right-8 -top-8 -z-10 h-32 w-32 rounded-full bg-[#C084FC]/20 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}
