import {
  formatLocalDateTime,
  getAuthorizedCalendarClient,
  parseDueDateTime,
} from "@/lib/google/calendar";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    dueDate?: string;
    dueTime?: string;
    todoId?: string;
    calendarId?: string;
    timeZone?: string;
  };

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }

  const calendar = await getAuthorizedCalendarClient(user.id);
  if (!calendar) {
    return NextResponse.json(
      { error: "Google Calendar not connected", code: "NOT_CONNECTED" },
      { status: 400 },
    );
  }

  const start = parseDueDateTime(body.dueDate, body.dueTime);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const calendarId = body.calendarId?.trim() || "primary";
  const timeZone =
    body.timeZone?.trim() ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    "UTC";

  try {
    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: body.title.trim(),
        description: "Created from NovaTrack",
        start: {
          dateTime: formatLocalDateTime(start),
          timeZone,
        },
        end: {
          dateTime: formatLocalDateTime(end),
          timeZone,
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "popup", minutes: 30 },
            { method: "popup", minutes: 10 },
          ],
        },
      },
    });

    const eventId = event.data.id ?? null;
    const htmlLink = event.data.htmlLink ?? null;

    if (body.todoId && eventId) {
      const { error: updateError } = await supabase
        .from("todos")
        .update({
          google_event_id: eventId,
          google_calendar_id: calendarId,
        })
        .eq("id", body.todoId)
        .eq("user_id", user.id);

      // If calendar_id column isn't added yet, still save the event id
      if (updateError) {
        await supabase
          .from("todos")
          .update({ google_event_id: eventId })
          .eq("id", body.todoId)
          .eq("user_id", user.id);
      }
    }

    return NextResponse.json({
      ok: true,
      eventId,
      htmlLink,
      calendarId,
      start: formatLocalDateTime(start),
      timeZone,
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create calendar event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
