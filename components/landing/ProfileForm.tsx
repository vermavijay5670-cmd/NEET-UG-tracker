"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, UserRound } from "lucide-react";
import { useTrackerState } from "@/lib/useTrackerState";

export function ProfileForm() {
  const { state, hydrated, setProfile } = useTrackerState();
  const router = useRouter();
  const [name, setName] = useState("");
  const [exam, setExam] = useState("");

  // pre-fill with whatever's already saved, once hydrated (lets people come back and edit)
  useEffect(() => {
    if (!hydrated) return;
    if (state.studentName) setName(state.studentName);
    if (state.targetExam) setExam(state.targetExam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

    function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanExam = (exam || "NEET UG").trim();
    setProfile(cleanName, cleanExam);
    // write through immediately — the 200ms debounce can lose the save on navigation
    try {
      const raw = window.localStorage.getItem("neet_tracker_v1");
      const parsed = raw ? JSON.parse(raw) : {};
      window.localStorage.setItem(
        "neet_tracker_v1",
        JSON.stringify({ ...parsed, studentName: cleanName, targetExam: cleanExam })
      );
    } catch {}
    router.push("/today");
  }


  return (
    <section id="profile-form" className="mx-auto max-w-[1120px] px-4 py-16 sm:px-6 sm:py-24">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-[520px] overflow-hidden rounded-[28px] border border-white/[0.15] p-8 sm:p-10"
        style={{
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(30px) saturate(160%)",
          boxShadow: "0 10px 50px rgba(168,85,247,0.18), 0 0 30px rgba(192,132,252,0.2), inset 0 1px 1px rgba(255,255,255,0.3)",
        }}
      >
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#D8B4FE]/30 bg-[#A855F7]/15 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#D8B4FE]">
          <UserRound size={11} strokeWidth={1.75} /> Set up your profile
        </span>
        <h2 className="text-[24px] font-semibold text-[#F6F4FF] sm:text-[28px]">Tell us who&apos;s studying</h2>
        <p className="mt-2 text-[13.5px] text-white/50">
          Just so the app can greet you properly — nothing here is sent anywhere, it stays on your device.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-wide text-white/40">Your name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vijay"
              className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-[15px] text-white outline-none placeholder:text-white/25 focus:border-[#D8B4FE]/50"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[11px] uppercase tracking-wide text-white/40">Target exam</span>
            <input
              type="text"
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              placeholder="e.g. NEET UG 2027"
              className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-[15px] text-white outline-none placeholder:text-white/25 focus:border-[#D8B4FE]/50"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#F6F4FF] px-6 py-3.5 text-[15px] font-medium text-black transition-transform hover:scale-[1.02]"
        >
          Start Studying
          <ArrowRight size={16} strokeWidth={2} />
        </button>
      </motion.form>
    </section>
  );
}
