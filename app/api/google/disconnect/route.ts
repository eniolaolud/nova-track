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

  await supabase.from("google_calendar_tokens").delete().eq("user_id", user.id);

  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/profile?calendar=disconnected`, {
    status: 303,
  });
}
