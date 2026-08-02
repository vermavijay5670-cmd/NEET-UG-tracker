"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, LayoutDashboard, NotebookPen, BookOpenCheck, ListChecks, LogOut } from "lucide-react";
import { ProfileChip } from "./ProfileChip";
import { useTrackerState } from "@/lib/useTrackerState";
import { useRouter } from "next/navigation";

const NAV = [
  { href: "/today", label: "Today", icon: Clock },
  { href: "/study-log", label: "Study Log", icon: NotebookPen },
  { href: "/planner", label: "Planner", icon: BookOpenCheck },
  { href: "/question-practice", label: "Question Practice", icon: ListChecks },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state, hydrated } = useTrackerState();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {
      // ignore and still redirect
    }
    router.replace("/auth");
  }

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 sm:py-10 md:px-12 md:py-[48px]">
      <header className="mb-8 sm:mb-10">
        <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
          <Link href="/" className="block">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#737373]">NEET UG PREP</p>
            <h1 className="mt-1 text-[20px] font-medium text-white sm:text-[22px]">Study Tracker</h1>
          </Link>

          <div className="flex items-center gap-2">
            {hydrated && <ProfileChip studentName={state.studentName} targetExam={state.targetExam} />}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-[12px] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <LogOut size={14} strokeWidth={1.75} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <nav className="-mx-4 flex gap-1.5 overflow-x-auto rounded-full border border-white/[0.06] bg-white/[0.03] p-1.5 px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-1.5 [&::-webkit-scrollbar]:hidden">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} className="relative flex-shrink-0">
                {active && (
                  <motion.span
                    layoutId="main-nav-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.08]"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-medium text-white sm:px-4">
                  <Icon size={15} strokeWidth={1.75} />
                  <span className="hidden sm:inline">{label}</span>
                </span>
              </Link>
            );
          })}
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}
