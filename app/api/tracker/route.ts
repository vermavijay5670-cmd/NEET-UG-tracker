import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type TrackerPayload = {
  startDate?: string;
  examDate?: string;
  dailyGoalHours?: number;
  studentName?: string;
  targetExam?: string;
  log?: Record<string, number>;
  planner?: Record<string, unknown>;
  subtopics?: Record<string, boolean>;
  stopwatchRunningSince?: number | null;
  stopwatchLastFlushAt?: number | null;
  stopwatchSessions?: number;
  timerDurationMs?: number;
  timerRemainingMs?: number;
  timerEndAt?: number | null;
};

function toTrackerPayload(body: TrackerPayload | null | undefined) {
  return {
    start_date: body?.startDate ?? "",
    exam_date: body?.examDate ?? "",
    daily_goal_hours: body?.dailyGoalHours ?? 6,
    student_name: body?.studentName ?? "",
    target_exam: body?.targetExam ?? "",
    log: body?.log ?? {},
    planner: body?.planner ?? {},
    subtopics: body?.subtopics ?? {},
    stopwatch_running_since: body?.stopwatchRunningSince ?? null,
    stopwatch_last_flush_at: body?.stopwatchLastFlushAt ?? null,
    stopwatch_sessions: body?.stopwatchSessions ?? 0,
    timer_duration_ms: body?.timerDurationMs ?? 25 * 60_000,
    timer_remaining_ms: body?.timerRemainingMs ?? 25 * 60_000,
    timer_end_at: body?.timerEndAt ?? null,
  };
}

async function getSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Ignore cookie write errors in route handlers
          }
        },
      },
    }
  );
}

export async function GET() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("tracker_state")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? null);
}

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const payload = toTrackerPayload(body);

  const { data, error } = await supabase
    .from("tracker_state")
    .upsert(
      {
        user_id: user.id,
        ...payload,
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
