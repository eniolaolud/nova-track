import { createClient } from "@/lib/supabase/server";
import { getGoogleOAuthClient } from "@/lib/google/oauth";
import { google } from "googleapis";

type TokenRow = {
  access_token: string;
  refresh_token: string | null;
  expiry_date: number | null;
};

export async function getAuthorizedCalendarClient(userId: string) {
  const supabase = await createClient();
  const { data: tokenRow, error } = await supabase
    .from("google_calendar_tokens")
    .select("access_token, refresh_token, expiry_date")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !tokenRow) {
    return null;
  }

  const oauth2Client = getGoogleOAuthClient();
  oauth2Client.setCredentials({
    access_token: tokenRow.access_token,
    refresh_token: tokenRow.refresh_token,
    expiry_date: tokenRow.expiry_date ?? undefined,
  });

  oauth2Client.on("tokens", async (tokens) => {
    const updates: Partial<TokenRow> = {};
    if (tokens.access_token) updates.access_token = tokens.access_token;
    if (tokens.refresh_token) updates.refresh_token = tokens.refresh_token;
    if (tokens.expiry_date) updates.expiry_date = tokens.expiry_date;

    if (Object.keys(updates).length > 0) {
      await supabase
        .from("google_calendar_tokens")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    }
  });

  return google.calendar({ version: "v3", auth: oauth2Client });
}

/** Accepts "2026-04-10" + "20:00", or "April 10, 2026" + "08:00 PM" */
export function parseDueDateTime(dueDate?: string | null, dueTime?: string | null) {
  const datePart = dueDate?.trim();
  const timePart = dueTime?.trim() || "09:00";

  if (datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    const normalizedTime = /^\d{1,2}:\d{2}$/.test(timePart)
      ? timePart.padStart(5, "0")
      : "09:00";
    const parsed = new Date(`${datePart}T${normalizedTime}:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  const parsed = new Date(`${datePart || ""} ${timePart}`);
  if (Number.isNaN(parsed.getTime())) {
    return new Date(Date.now() + 60 * 60 * 1000);
  }
  return parsed;
}

/** Local wall-clock string for Google Calendar (no Z / no UTC shift) */
export function formatLocalDateTime(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}:00`;
}
