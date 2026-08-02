"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[28px] border border-white/[0.15] p-10 text-center sm:p-16"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(30px) saturate(160%)",
          boxShadow: "0 10px 50px rgba(168,85,247,0.18), 0 0 30px rgba(192,132,252,0.2), inset 0 1px 1px rgba(255,255,255,0.3)",
        }}
      >
        <h2 className="text-[26px] font-semibold text-[#F6F4FF] sm:text-[32px]">
          Ready to actually stick with a study plan?
        </h2>
        <p className="mx-auto mt-3 max-w-[420px] text-[14.5px] text-white/50">
          It&apos;s free, it works offline, and there&apos;s nothing to sign up for.
        </p>
        <Link
          href="/today"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#F6F4FF] px-7 py-3.5 text-[15px] font-medium text-black transition-transform hover:scale-[1.03]"
        >
          Open Study Tracker
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </motion.div>
    </section>
  );
}
