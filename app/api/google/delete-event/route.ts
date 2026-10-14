import { getAuthorizedCalendarClient } from "@/lib/google/calendar";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type DeleteAttempt = "deleted" | "not_found" | "error";

function getErrorStatus(err: unknown) {
  const e = err as {
    code?: number;
    status?: number;
    response?: { status?: number };
  };
  return e.code ?? e.status ?? e.response?.status;
}

async function tryDeleteEvent(
  calendar: NonNullable<Awaited<ReturnType<typeof getAuthorizedCalendarClient>>>,
  calendarId: string,
  eventId: string,
): Promise<DeleteAttempt> {
  try {
    await calendar.events.delete({
      calendarId,
      eventId,
      sendUpdates: "all",
    });
    return "deleted";
  } catch (err) {
    const status = getErrorStatus(err);
    // Not on this calendar — keep searching other calendars
    if (status === 404 || status === 410) return "not_found";
    return "error";
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    todoId?: string;
    eventId?: string;
    calendarId?: string;
  };

  let eventId = body.eventId?.trim() || null;
  let calendarId = body.calendarId?.trim() || null;

  // Always re-read from DB so we have the latest event link
  if (body.todoId) {
    const { data: todo } = await supabase
      .from("todos")
      .select("google_event_id, google_calendar_id")
      .eq("id", body.todoId)
      .eq("user_id", user.id)
      .maybeSingle();

    eventId = todo?.google_event_id || eventId;
    calendarId = todo?.google_calendar_id || calendarId;
  }

  if (!eventId) {
    return NextResponse.json({ ok: true, skipped: true, reason: "no_event_id" });
  }

  const calendar = await getAuthorizedCalendarClient(user.id);
  if (!calendar) {
    return NextResponse.json({
      ok: false,
      skipped: true,
      code: "NOT_CONNECTED",
      error: "Google Calendar not connected",
    });
  }

  const tried = new Set<string>();
  const candidates: string[] = [];
  if (calendarId) candidates.push(calendarId);
  candidates.push("primary");

  try {
    const list = await calendar.calendarList.list({ minAccessRole: "writer" });
    for (const item of list.data.items ?? []) {
      if (item.id) candidates.push(item.id);
    }
  } catch {
    // continue with known candidates
  }

  let sawError = false;

  for (const id of candidates) {
    if (tried.has(id)) continue;
    tried.add(id);

    const result = await tryDeleteEvent(calendar, id, eventId);
    if (result === "deleted") {
      return NextResponse.json({ ok: true, deletedFrom: id });
    }
    if (result === "error") sawError = true;
  }

  // Event wasn't on any calendar we can write to (already removed)
  if (!sawError) {
    return NextResponse.json({ ok: true, skipped: true, reason: "not_found" });
  }

  return NextResponse.json(
    {
      ok: false,
      error: "Could not remove Google Calendar event",
    },
    { status: 500 },
  );
}
