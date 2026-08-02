"use client";

import Link from "next/link";

interface ProfileChipProps {
  studentName: string;
  targetExam: string;
}

export function ProfileChip({ studentName, targetExam }: ProfileChipProps) {
  if (!studentName) {
    return (
      <Link
        href="/#profile-form"
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-[12px] text-white/40 transition-colors hover:text-white/70"
      >
        + Add your name
      </Link>
    );
  }

  const initial = studentName.trim().charAt(0).toUpperCase() || "?";

  return (
    <Link
      href="/#profile-form"
      className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-3.5 transition-colors hover:bg-white/[0.06]"
    >
      <span
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-black"
        style={{ background: "linear-gradient(135deg,#A855F7,#38BDF8)" }}
      >
        {initial}
      </span>
      <span className="min-w-0 text-left">
        <span className="block max-w-[120px] truncate text-[13px] font-medium text-white">{studentName}</span>
        {targetExam && <span className="block max-w-[120px] truncate text-[10px] text-white/40">{targetExam}</span>}
      </span>
    </Link>
  );
}
