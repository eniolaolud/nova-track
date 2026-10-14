import { createClient } from "@/lib/supabase/server";
import { getGoogleOAuthClient } from "@/lib/google/oauth";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${origin}/profile?calendar=denied`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  try {
    const oauth2Client = getGoogleOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const me = await oauth2.userinfo.get();

    const { error: upsertError } = await supabase
      .from("google_calendar_tokens")
      .upsert({
        user_id: user.id,
        access_token: tokens.access_token ?? "",
        refresh_token: tokens.refresh_token ?? null,
        expiry_date: tokens.expiry_date ?? null,
        email: me.data.email ?? null,
        updated_at: new Date().toISOString(),
      });

    if (upsertError) {
      return NextResponse.redirect(
        `${origin}/profile?calendar=error&message=${encodeURIComponent(upsertError.message)}`,
      );
    }

    return NextResponse.redirect(`${origin}/profile?calendar=connected`);
  } catch (err) {
    const message = err instanceof Error ? err.message : "OAuth failed";
    return NextResponse.redirect(
      `${origin}/profile?calendar=error&message=${encodeURIComponent(message)}`,
    );
  }
}
