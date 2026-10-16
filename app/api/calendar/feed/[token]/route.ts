import { buildCalendar } from "@/lib/calendar/ics";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ token: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { token } = await params;
  const trimmed = token?.trim();

  if (!trimmed || trimmed.length < 16) {
    return NextResponse.json({ error: "Invalid feed token" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("todos_for_ics_token", {
    p_token: trimmed,
  });

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message.includes("todos_for_ics_token")
            ? "Apple Calendar feed is not set up yet. Run apple_calendar_ics.sql in Supabase."
            : error.message,
      },
      { status: 500 },
    );
  }

  const todos = (data as {
    id: string;
    title: string;
    due_date: string | null;
    due_time: string | null;
  }[]) ?? [];

  const body = buildCalendar(todos, "NovaTrack Tasks");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="novatrack.ics"',
      "Cache-Control": "no-cache",
    },
  });
}
