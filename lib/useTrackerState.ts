"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CHAPTERS } from "./data";
import { addDays, daysBetween, dateKey, parseKey, todayKey } from "./date-utils";
import type { ChapterState, Difficulty, Subject, SubjectStats, Streaks, TrackerState } from "./types";

const STORAGE_KEY = "neet_tracker_v1";

const DEFAULT_TIMER_MS = 25 * 60_000;

function defaultState(): TrackerState {
  return {
    startDate: todayKey(),
    examDate: "",
    dailyGoalHours: 6,
    studentName: "",
    targetExam: "",
    log: {},
    planner: {},
    subtopics: {},
    stopwatchRunningSince: null,
    stopwatchLastFlushAt: null,
    stopwatchSessions: 0,
    timerDurationMs: DEFAULT_TIMER_MS,
    timerRemainingMs: DEFAULT_TIMER_MS,
    timerEndAt: null,
  };
}

function normalizeState(parsed: Partial<TrackerState> | null | undefined): TrackerState {
  return {
    ...defaultState(),
    ...parsed,
    log: parsed?.log ?? {},
    planner: parsed?.planner ?? {},
    subtopics: parsed?.subtopics ?? {},
  };
}

function loadState(): TrackerState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return normalizeState(JSON.parse(raw));
  } catch {
    return defaultState();
  }
}

export function useTrackerState() {
  const [state, setState] = useState<TrackerState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  const persistState = useCallback(async (nextState: TrackerState) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch {
      /* storage may be unavailable — fail silently */
    }

    try {
      const response = await fetch("/api/tracker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextState),
      });

      if (!response.ok) {
        const message = await response.text();
        console.error("Failed to persist tracker state", message);
      }
    } catch (error) {
      console.error("Failed to persist tracker state", error);
    }
  }, []);

  // Hydrate from localStorage first, then try the authenticated Supabase snapshot.
  useEffect(() => {
    let cancelled = false;

    const initialState = loadState();
    setState(initialState);
    setHydrated(true);

    const loadRemoteState = async () => {
      try {
        const response = await fetch("/api/tracker", { cache: "no-store" });
        if (!response.ok) {
          if (response.status === 401) return;
          throw new Error(`Failed to load tracker state (${response.status})`);
        }
        const payload = await response.json();
        if (!cancelled && payload) {
          setState(normalizeState(payload));
        }
      } catch (error) {
        console.error("Unable to load tracker snapshot", error);
      }
    };

    void loadRemoteState();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      void persistState(state);
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [state, hydrated, persistState]);

  const setDailyGoalHours = useCallback((hours: number) => {
    setState((s) => ({ ...s, dailyGoalHours: Number.isFinite(hours) ? hours : 0 }));
  }, []);

  const setExamDate = useCallback((v: string) => {
    setState((s) => ({ ...s, examDate: v }));
  }, []);

  const setProfile = useCallback((name: string, exam: string) => {
    setState((s) => ({ ...s, studentName: name.trim(), targetExam: exam.trim() }));
  }, []);

  const setLogEntry = useCallback((key: string, hours: number | null) => {
    setState((s) => {
      const log = { ...s.log };
      if (hours === null || Number.isNaN(hours)) {
        delete log[key];
      } else {
        log[key] = Math.max(0, hours);
      }
      const startDate = key < s.startDate ? key : s.startDate;
      return { ...s, log, startDate };
    });
  }, []);

  const addLogHours = useCallback((key: string, hoursDelta: number) => {
    setState((s) => {
      const log = { ...s.log };
      log[key] = Math.round(((log[key] ?? 0) + hoursDelta) * 1000) / 1000;
      return { ...s, log };
    });
  }, []);

  const getChapterState = useCallback(
    (subj: Subject, cls: 11 | 12, i: number): ChapterState => {
      return state.planner[`${subj}_${cls}_${i}`] ?? {};
    },
    [state.planner]
  );

  const setChapterState = useCallback((subj: Subject, cls: 11 | 12, i: number, patch: Partial<ChapterState>) => {
    setState((s) => {
      const key = `${subj}_${cls}_${i}`;
      return { ...s, planner: { ...s.planner, [key]: { ...s.planner[key], ...patch } } };
    });
  }, []);

  const toggleDone = useCallback(
    (subj: Subject, cls: 11 | 12, i: number) => {
      const cur = getChapterState(subj, cls, i);
      setChapterState(subj, cls, i, { done: !cur.done });
    },
    [getChapterState, setChapterState]
  );

  const bumpRevision = useCallback(
    (subj: Subject, cls: 11 | 12, i: number) => {
      const cur = getChapterState(subj, cls, i);
      setChapterState(subj, cls, i, { revCount: (cur.revCount ?? 0) + 1, lastRevised: todayKey() });
    },
    [getChapterState, setChapterState]
  );

  const resetRevision = useCallback(
    (subj: Subject, cls: 11 | 12, i: number) => {
      setChapterState(subj, cls, i, { revCount: 0, lastRevised: null });
    },
    [setChapterState]
  );

  const cycleDifficulty = useCallback(
    (subj: Subject, cls: 11 | 12, i: number) => {
      const order: Difficulty[] = [null, "easy", "medium", "hard"];
      const cur = getChapterState(subj, cls, i);
      const next = order[(order.indexOf(cur.diff ?? null) + 1) % order.length];
      setChapterState(subj, cls, i, { diff: next });
    },
    [getChapterState, setChapterState]
  );

  const isSubtopicDone = useCallback(
    (subj: Subject, cls: 11 | 12, chapterIdx: number, subIdx: number) => {
      return Boolean(state.subtopics[`${subj}_${cls}_${chapterIdx}_${subIdx}`]);
    },
    [state.subtopics]
  );

  const toggleSubtopic = useCallback((subj: Subject, cls: 11 | 12, chapterIdx: number, subIdx: number) => {
    setState((s) => {
      const key = `${subj}_${cls}_${chapterIdx}_${subIdx}`;
      const subtopics = { ...s.subtopics, [key]: !s.subtopics[key] };
      return { ...s, subtopics };
    });
  }, []);

  // ---- Stopwatch: persisted so it survives navigating to another page ----
  // stopwatchRunningSince anchors the *display* (time since Start) and is only ever
  // touched by Start/Pause/Reset. stopwatchLastFlushAt is separate bookkeeping used
  // purely to know how much *new* time to commit into the log at each checkpoint —
  // if these were the same field, every checkpoint would visually reset the timer.
  const startStopwatch = useCallback(() => {
    setState((s) => {
      const now = Date.now();
      return { ...s, stopwatchRunningSince: now, stopwatchLastFlushAt: now, stopwatchSessions: s.stopwatchSessions + 1 };
    });
  }, []);

  const pauseStopwatch = useCallback(() => {
    setState((s) => {
      if (s.stopwatchRunningSince == null) return s;
      const now = Date.now();
      const since = s.stopwatchLastFlushAt ?? s.stopwatchRunningSince;
      const elapsedHours = (now - since) / 3_600_000;
      const key = todayKey();
      const log = { ...s.log };
      log[key] = Math.round(((log[key] ?? 0) + elapsedHours) * 1000) / 1000;
      return { ...s, log, stopwatchRunningSince: null, stopwatchLastFlushAt: null };
    });
  }, []);

  const resetStopwatchSessions = useCallback(() => {
    setState((s) => {
      let next = s;
      if (s.stopwatchRunningSince != null) {
        const now = Date.now();
        const since = s.stopwatchLastFlushAt ?? s.stopwatchRunningSince;
        const elapsedHours = (now - since) / 3_600_000;
        const key = todayKey();
        const log = { ...s.log };
        log[key] = Math.round(((log[key] ?? 0) + elapsedHours) * 1000) / 1000;
        next = { ...s, log, stopwatchRunningSince: null, stopwatchLastFlushAt: null };
      }
      return { ...next, stopwatchSessions: 0 };
    });
  }, []);

  // Periodic safety checkpoint while running (called every ~30s AND once on mount) —
  // commits elapsed time into today's log. Deliberately does NOT touch stopwatchRunningSince,
  // so the on-screen timer keeps counting up smoothly instead of jumping back on every checkpoint.
  const checkpointStopwatch = useCallback(() => {
    setState((s) => {
      if (s.stopwatchRunningSince == null) return s;
      const now = Date.now();
      const since = s.stopwatchLastFlushAt ?? s.stopwatchRunningSince;
      const elapsedHours = (now - since) / 3_600_000;
      if (elapsedHours <= 0) return s;
      const key = todayKey();
      const log = { ...s.log };
      log[key] = Math.round(((log[key] ?? 0) + elapsedHours) * 1000) / 1000;
      return { ...s, log, stopwatchLastFlushAt: now };
    });
  }, []);

  // Last-resort direct localStorage flush for the moment a page unmounts (navigation away).
  // Bypasses React state entirely so it can't be clobbered by a stale in-flight render.
  // Same rule applies: only stopwatchLastFlushAt is updated, runningSince (display anchor) is left alone.
  const flushStopwatchOnUnmount = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.stopwatchRunningSince) {
        const now = Date.now();
        const since = parsed.stopwatchLastFlushAt ?? parsed.stopwatchRunningSince;
        const elapsedHours = (now - since) / 3_600_000;
        const key = todayKey();
        parsed.log = parsed.log ?? {};
        parsed.log[key] = Math.round(((parsed.log[key] ?? 0) + elapsedHours) * 1000) / 1000;
        parsed.stopwatchLastFlushAt = now;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch {
      /* best-effort — a missed flush just means a few seconds of unlogged time */
    }
  }, []);

  // ---- Timer: persisted as an absolute end timestamp so it keeps counting down correctly
  // regardless of which page is mounted. ----
  const startTimer = useCallback(() => {
    setState((s) => {
      if (s.timerRemainingMs <= 0) return s;
      return { ...s, timerEndAt: Date.now() + s.timerRemainingMs };
    });
  }, []);

  const pauseTimer = useCallback(() => {
    setState((s) => {
      if (s.timerEndAt == null) return s;
      const remaining = Math.max(0, s.timerEndAt - Date.now());
      return { ...s, timerEndAt: null, timerRemainingMs: remaining };
    });
  }, []);

  const resetTimer = useCallback(() => {
    setState((s) => ({ ...s, timerEndAt: null, timerRemainingMs: s.timerDurationMs }));
  }, []);

  const setTimerDuration = useCallback((ms: number) => {
    setState((s) => (s.timerEndAt != null ? s : { ...s, timerDurationMs: ms, timerRemainingMs: ms }));
  }, []);

  const completeTimer = useCallback(() => {
    setState((s) => (s.timerEndAt == null ? s : { ...s, timerEndAt: null, timerRemainingMs: 0 }));
  }, []);

  const streaks: Streaks = useMemo(() => {
    const studied = new Set(Object.keys(state.log).filter((k) => state.log[k] > 0));
    let current = 0;
    let cursor = new Date();
    if (!studied.has(dateKey(cursor))) cursor = addDays(cursor, -1);
    while (studied.has(dateKey(cursor))) {
      current++;
      cursor = addDays(cursor, -1);
    }
    let best = 0;
    let run = 0;
    let iter = parseKey(state.startDate);
    const end = new Date();
    while (iter <= end) {
      if (studied.has(dateKey(iter))) {
        run++;
        best = Math.max(best, run);
      } else {
        run = 0;
      }
      iter = addDays(iter, 1);
    }
    return { current, best };
  }, [state.log, state.startDate]);

  const totalDays = useMemo(
    () => Math.max(1, daysBetween(parseKey(state.startDate), new Date()) + 1),
    [state.startDate]
  );

  const totalHoursLogged = useMemo(
    () => Object.values(state.log).reduce((a, b) => a + b, 0),
    [state.log]
  );

  const daysStudied = useMemo(
    () => Object.values(state.log).filter((h) => h > 0).length,
    [state.log]
  );

  const getSubjectStats = useCallback(
    (subj: Subject): SubjectStats => {
      let done = 0;
      let rev = 0;
      let total = 0;
      const dueRevision: SubjectStats["dueRevision"] = [];
      ([11, 12] as const).forEach((cls) => {
        CHAPTERS[subj][cls].forEach((name, i) => {
          total++;
          const st = getChapterState(subj, cls, i);
          if (st.done) done++;
          if ((st.revCount ?? 0) > 0) rev++;
          if (st.done) {
            const staleDays = st.lastRevised ? daysBetween(parseKey(st.lastRevised), new Date()) : Infinity;
            if (staleDays >= 7) {
              dueRevision.push({ subj, name, days: st.lastRevised ? staleDays : null });
            }
          }
        });
      });
      return { done, rev, total, dueRevision };
    },
    [getChapterState]
  );

  const getRecentActivity = useCallback(
    (limit = 6) => {
      type Activity =
        | { type: "log"; date: string; hours: number }
        | { type: "revision"; date: string; subject: Subject; chapter: string };

      const logActivities: Activity[] = Object.entries(state.log)
        .filter(([, hours]) => hours > 0)
        .map(([date, hours]) => ({ type: "log" as const, date, hours }));

      const revisionActivities: Activity[] = [];
      (["phy", "chem", "bio"] as Subject[]).forEach((subj) => {
        ([11, 12] as const).forEach((cls) => {
          CHAPTERS[subj][cls].forEach((name, i) => {
            const st = getChapterState(subj, cls, i);
            if (st.lastRevised) {
              revisionActivities.push({ type: "revision", date: st.lastRevised, subject: subj, chapter: name });
            }
          });
        });
      });

      return [...logActivities, ...revisionActivities].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, limit);
    },
    [state.log, getChapterState]
  );

  return {
    state,
    hydrated,
    setDailyGoalHours,
    setExamDate,
    setProfile,
    setLogEntry,
    addLogHours,
    getChapterState,
    toggleDone,
    bumpRevision,
    resetRevision,
    cycleDifficulty,
    streaks,
    totalDays,
    totalHoursLogged,
    daysStudied,
    getSubjectStats,
    getRecentActivity,
    isSubtopicDone,
    toggleSubtopic,
    startStopwatch,
    pauseStopwatch,
    resetStopwatchSessions,
    checkpointStopwatch,
    flushStopwatchOnUnmount,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerDuration,
    completeTimer,
  };
}
