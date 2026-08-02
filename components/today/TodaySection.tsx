"use client";

import { Countdown } from "./Countdown";
import { Stopwatch } from "./Stopwatch";
import { Timer } from "./Timer";
import { useTrackerState } from "@/lib/useTrackerState";
import { todayKey } from "@/lib/date-utils";

export function TodaySection() {
  const {
    state,
    hydrated,
    setExamDate,
    addLogHours,
    setDailyGoalHours,
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
  } = useTrackerState();

  if (!hydrated) {
    return <div className="py-24 text-center text-sm text-white/50">Loading…</div>;
  }

  const todayHours = state.log[todayKey()] ?? 0;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <Countdown examDate={state.examDate} startDate={state.startDate} onSetExamDate={setExamDate} />
      <Stopwatch
        todayHours={todayHours}
        dailyGoalHours={state.dailyGoalHours}
        stopwatchRunningSince={state.stopwatchRunningSince}
        stopwatchSessions={state.stopwatchSessions}
        onStart={startStopwatch}
        onPause={pauseStopwatch}
        onReset={resetStopwatchSessions}
        onCheckpoint={checkpointStopwatch}
        onFlushOnUnmount={flushStopwatchOnUnmount}
        onSetGoal={setDailyGoalHours}
      />
      <div className="sm:col-span-2 lg:col-span-1">
        <Timer
          timerDurationMs={state.timerDurationMs}
          timerRemainingMs={state.timerRemainingMs}
          timerEndAt={state.timerEndAt}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
          onSetDuration={setTimerDuration}
          onComplete={completeTimer}
          onAddHours={addLogHours}
        />
      </div>
    </div>
  );
}
