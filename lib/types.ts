export type Subject = "phy" | "chem" | "bio";
export type Difficulty = "easy" | "medium" | "hard" | null;

export interface ChapterState {
  done?: boolean;
  revCount?: number;
  lastRevised?: string | null; // YYYY-MM-DD
  diff?: Difficulty;
}

export interface TrackerState {
  startDate: string; // YYYY-MM-DD
  examDate: string; // YYYY-MM-DD or ""
  dailyGoalHours: number;
  studentName: string;
  targetExam: string;
  log: Record<string, number>; // date -> hours
  planner: Record<string, ChapterState>; // "phy_11_0" -> state
  subtopics: Record<string, boolean>; // "phy_11_0_2" -> done
  stopwatchRunningSince: number | null; // epoch ms when the current session started; drives the display, never touched by checkpoints
  stopwatchLastFlushAt: number | null; // epoch ms of the last committed checkpoint; bookkeeping only
  stopwatchSessions: number;
  timerDurationMs: number;
  timerRemainingMs: number; // valid when timerEndAt is null (paused/reset)
  timerEndAt: number | null; // epoch ms when it should complete; null = not running
}

export interface SubjectStats {
  done: number;
  rev: number;
  total: number;
  dueRevision: { subj: Subject; name: string; days: number | null }[];
}

export interface Streaks {
  current: number;
  best: number;
}
