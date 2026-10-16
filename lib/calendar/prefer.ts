/** Apple devices use .ics → Calendar app; everyone else uses Google Calendar. */
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

export function preferredCalendarMethod(): CalendarMethod {
  return isAppleDevice() ? "apple" : "google";
}
