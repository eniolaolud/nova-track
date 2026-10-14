import { getAuthorizedCalendarClient } from "@/lib/google/calendar";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const calendar = await getAuthorizedCalendarClient(user.id);
  if (!calendar) {
    return NextResponse.json(
      { error: "Google Calendar not connected", code: "NOT_CONNECTED" },
      { status: 400 },
    );
  }

  try {
    const res = await calendar.calendarList.list({
      minAccessRole: "writer",
    });

    const calendars = (res.data.items ?? [])
      .filter((item) => item.id)
      .map((item) => ({
        id: item.id as string,
        summary: item.summary || item.id || "Calendar",
        primary: Boolean(item.primary),
      }))
      .sort((a, b) => Number(b.primary) - Number(a.primary));

    return NextResponse.json({ calendars });
  } catch (err) {
    const googleErr = err as {
      message?: string;
      code?: number;
      errors?: { reason?: string }[];
      response?: { data?: { error?: { message?: string; status?: string } } };
    };
    const message =
      googleErr.response?.data?.error?.message ||
      googleErr.message ||
      "Failed to list calendars";
    const insufficient =
      message.toLowerCase().includes("insufficient") ||
      message.toLowerCase().includes("access") ||
      googleErr.code === 403;

    return NextResponse.json(
      {
        error: insufficient
          ? "Calendar list permission missing. Disconnect and reconnect Google Calendar in Profile."
          : message,
        code: insufficient ? "NEED_RECONNECT" : "LIST_FAILED",
      },
      { status: 500 },
    );
  }
}
