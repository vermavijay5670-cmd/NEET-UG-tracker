// ── replace normalizeState + add a row mapper ─────────────────────────────
type TrackerRow = Record<string, unknown>;

// DB rows come back snake_case; the app state is camelCase.
// Without this mapping every remote load silently wipes studentName/targetExam.
function fromRow(row: TrackerRow | null | undefined): Partial<TrackerState> {
  if (!row) return {};
  const pick = <T,>(a: string, b: string): T | undefined =>
    (row[a] ?? row[b]) as T | undefined;
  return {
    startDate: pick<string>("start_date", "startDate"),
    examDate: pick<string>("exam_date", "examDate"),
    dailyGoalHours: pick<number>("daily_goal_hours", "dailyGoalHours"),
    studentName: pick<string>("student_name", "studentName"),
    targetExam: pick<string>("target_exam", "targetExam"),
    log: pick<Record<string, number>>("log", "log"),
    planner: pick<TrackerState["planner"]>("planner", "planner"),
    subtopics: pick<Record<string, boolean>>("subtopics", "subtopics"),
    stopwatchRunningSince: pick<number | null>("stopwatch_running_since", "stopwatchRunningSince"),
    stopwatchLastFlushAt: pick<number | null>("stopwatch_last_flush_at", "stopwatchLastFlushAt"),
    stopwatchSessions: pick<number>("stopwatch_sessions", "stopwatchSessions"),
    timerDurationMs: pick<number>("timer_duration_ms", "timerDurationMs"),
    timerRemainingMs: pick<number>("timer_remaining_ms", "timerRemainingMs"),
    timerEndAt: pick<number | null>("timer_end_at", "timerEndAt"),
  };
}

function normalizeState(parsed: Partial<TrackerState> | null | undefined): TrackerState {
  const base = defaultState();
  // drop undefined/empty keys so a sparse remote row can't blank local values
  const clean = Object.fromEntries(
    Object.entries(parsed ?? {}).filter(([, v]) => v !== undefined && v !== null)
  ) as Partial<TrackerState>;
  return {
    ...base,
    ...clean,
    log: clean.log ?? base.log,
    planner: clean.planner ?? base.planner,
    subtopics: clean.subtopics ?? base.subtopics,
  };
}
