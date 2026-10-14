/** Parse "20:00" or "08:00 PM" into hours/minutes */
export function parseReminderParts(value?: string | null) {
  if (!value?.trim()) return null;
  const raw = value.trim();

  const twentyFour = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFour) {
    const hours = Number(twentyFour[1]);
    const minutes = Number(twentyFour[2]);
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return { hours, minutes };
    }
  }

  const twelve = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelve) {
    let hours = Number(twelve[1]);
    const minutes = Number(twelve[2]);
    const meridiem = twelve[3].toUpperCase();
    if (hours < 1 || hours > 12 || minutes < 0 || minutes >= 60) return null;
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    return { hours, minutes };
  }

  return null;
}

export function formatReminderDisplay(value: string) {
  const parts = parseReminderParts(value);
  if (!parts) return value;
  const suffix = parts.hours >= 12 ? "PM" : "AM";
  const hour12 = parts.hours % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(parts.minutes).padStart(2, "0")} ${suffix}`;
}

export function toTimeInputValue(value?: string | null) {
  const parts = parseReminderParts(value || "20:00");
  if (!parts) return "20:00";
  return `${String(parts.hours).padStart(2, "0")}:${String(parts.minutes).padStart(2, "0")}`;
}

/** Next Date this reminder should fire (today if still ahead, else tomorrow) */
export function nextReminderDate(reminder?: string | null, from = new Date()) {
  const parts = parseReminderParts(reminder);
  if (!parts) return null;

  const next = new Date(from);
  next.setSeconds(0, 0);
  next.setHours(parts.hours, parts.minutes, 0, 0);
  if (next.getTime() <= from.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next;
}

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
