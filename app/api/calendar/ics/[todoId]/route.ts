import { buildCalendar } from "@/lib/calendar/ics";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ todoId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { todoId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: todo, error } = await supabase
    .from("todos")
    .select("id, title, due_date, due_time")
    .eq("id", todoId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !todo) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const body = buildCalendar([todo], todo.title);
  const filename = `${todo.title.replace(/[^\w\-]+/g, "_").slice(0, 40) || "task"}.ics`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
