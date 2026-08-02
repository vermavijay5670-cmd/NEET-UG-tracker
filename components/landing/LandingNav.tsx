"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function LandingNav() {
  return (
    <header className="mx-auto flex max-w-[1120px] items-center justify-between px-4 py-6 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#8B5CF6]/20">
          <GraduationCap size={16} strokeWidth={1.75} className="text-[#D8B4FE]" />
        </span>
        <span className="text-[15px] font-medium text-white">Study Tracker</span>
      </div>

      <Link
        href="/auth"
        className="rounded-full border border-[#D8B4FE]/30 bg-[#A855F7]/15 px-4 py-2 text-[13px] font-medium text-[#D8B4FE] transition-colors hover:bg-[#A855F7]/25"
      >
        Get Started
      </Link>
    </header>
  );
}
