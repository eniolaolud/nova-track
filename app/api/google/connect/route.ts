import { createClient } from "@/lib/supabase/server";
import {
  getGoogleOAuthClient,
  GOOGLE_CALENDAR_SCOPES,
} from "@/lib/google/oauth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  try {
    const oauth2Client = getGoogleOAuthClient();
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: GOOGLE_CALENDAR_SCOPES,
      state: user.id,
    });
    return NextResponse.redirect(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Missing Google env vars";
    return NextResponse.redirect(
      `${origin}/todos/add?calendar=error&message=${encodeURIComponent(message)}`,
    );
  }
}
