import { parseDueDateTime } from "@/lib/google/calendar";

export type IcsTodo = {
  id: string;
  title: string;
  due_date?: string | null;
  due_time?: string | null;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** ICS local datetime: YYYYMMDDTHHMMSS */
export function toIcsLocalDateTime(date: Date) {
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

export function toIcsUtcStamp(date = new Date()) {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

function escapeText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function foldLine(line: string) {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  parts.push(line.slice(0, 75));
  let rest = line.slice(75);
  while (rest.length > 0) {
    parts.push(` ${rest.slice(0, 74)}`);
    rest = rest.slice(74);
  }
  return parts.join("\r\n");
}

export function buildTodoEvent(todo: IcsTodo) {
  const start = parseDueDateTime(todo.due_date, todo.due_time);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const uid = `todo-${todo.id}@novatrack.app`;
  const summary = escapeText(todo.title.trim() || "NovaTrack task");

  const lines = [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsUtcStamp()}`,
    `DTSTART:${toIcsLocalDateTime(start)}`,
    `DTEND:${toIcsLocalDateTime(end)}`,
    `SUMMARY:${summary}`,
    "DESCRIPTION:Created from NovaTrack",
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${summary}`,
    "END:VALARM",
    "END:VEVENT",
  ];

  return lines.map(foldLine).join("\r\n");
}

export function buildCalendar(todos: IcsTodo[], calendarName = "NovaTrack Tasks") {
  const events = todos.map((todo) => buildTodoEvent(todo)).join("\r\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NovaTrack//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(calendarName)}`,
    events,
    "END:VCALENDAR",
  ];

  return `${lines.filter(Boolean).join("\r\n")}\r\n`;
}
