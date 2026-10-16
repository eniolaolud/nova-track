/** Prefer Apple (.ics) on Apple devices; Google elsewhere when connected. */
export function isAppleDevice() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const platform = navigator.platform || "";
  return (
    /iPhone|iPad|iPod|Macintosh/.test(ua) ||
    platform === "MacIntel" ||
    platform === "iPhone" ||
    platform === "iPad"
  );
}

export type CalendarMethod = "apple" | "google";

export function preferredCalendarMethod(
  googleConnected: boolean,
): CalendarMethod {
  if (isAppleDevice()) return "apple";
  if (googleConnected) return "google";
  // Fallback: .ics still opens in many calendar apps
  return "apple";
}
