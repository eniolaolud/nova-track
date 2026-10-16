import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function newToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("ics_feed_token")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ token: data?.ics_feed_token ?? null });
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = newToken();
  const { data: updated, error } = await supabase
    .from("profiles")
    .update({ ics_feed_token: token })
    .eq("id", user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message.includes("ics_feed_token")
            ? "Run apple_calendar_ics.sql in Supabase first."
            : error.message,
      },
      { status: 500 },
    );
  }

  if (!updated) {
    const metaName =
      (user.user_metadata?.full_name as string | undefined) ||
      user.email?.split("@")[0] ||
      "NovaTrack User";
    const metaUsername =
      (user.user_metadata?.username as string | undefined) ||
      `user_${user.id.slice(0, 8)}`;

    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      full_name: metaName,
      username: metaUsername,
      ics_feed_token: token,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ token });
}
