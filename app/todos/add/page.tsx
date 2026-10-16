"use client";

import { preferredCalendarMethod } from "@/lib/calendar/prefer";
import { createClient } from "@/lib/supabase/client";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

const PURPLE = "#7C5CBF";
const FIELD_BG = "#F8F5FF";

function toDateInputValue(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(value: string) {
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDisplayTime(value: string) {
  const [hRaw, mRaw] = value.split(":");
  const hours = Number(hRaw);
  const minutes = Number(mRaw);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export default function AddTodoPage() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [dueDate, setDueDate] = React.useState(() => toDateInputValue());
  const [dueTime, setDueTime] = React.useState("20:00");
  const [addToCalendar, setAddToCalendar] = React.useState(true);
  const [googleConnected, setGoogleConnected] = React.useState(false);
  const [calendars, setCalendars] = React.useState<
    { id: string; summary: string; primary: boolean }[]
  >([]);
  const [selectedCalendarId, setSelectedCalendarId] = React.useState("");
  const [calendarsError, setCalendarsError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);

  const method = preferredCalendarMethod();
  const needsGoogle = addToCalendar && method === "google";

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const calendar = params.get("calendar");
    if (calendar === "connected") {
      setInfo("Google Calendar connected. Turn on Add to Calendar and save your task.");
      setAddToCalendar(true);
    } else if (calendar === "denied") {
      setError("Google Calendar permission was denied.");
    } else if (calendar === "error") {
      setError(params.get("message") || "Google Calendar connection failed.");
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function loadGoogleState() {
      try {
        const res = await fetch("/api/google/calendars");
        const payload = (await res.json()) as {
          calendars?: { id: string; summary: string; primary: boolean }[];
          code?: string;
          error?: string;
        };

        if (cancelled) return;

        if (res.ok) {
          const list = payload.calendars ?? [];
          setGoogleConnected(true);
          setCalendars(list);
          setCalendarsError(null);
          setSelectedCalendarId(
            list.find((c) => c.primary)?.id || list[0]?.id || "",
          );
          return;
        }

        setGoogleConnected(false);
        setCalendars([]);
        if (payload.code !== "NOT_CONNECTED") {
          setCalendarsError(payload.error || null);
        }
      } catch {
        if (!cancelled) {
          setGoogleConnected(false);
          setCalendars([]);
        }
      }
    }

    void loadGoogleState();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("You need to be logged in to add a task.");
        setIsSaving(false);
        return;
      }

      const displayDate = formatDisplayDate(dueDate);
      const displayTime = formatDisplayTime(dueTime);

      const { data: created, error: insertError } = await supabase
        .from("todos")
        .insert({
          user_id: user.id,
          title: title.trim(),
          due_date: displayDate,
          due_time: displayTime,
          completed: false,
          add_to_calendar: addToCalendar,
        })
        .select("id")
        .single();

      if (insertError) {
        setError(insertError.message);
        setIsSaving(false);
        return;
      }

      if (addToCalendar && created?.id) {
        if (method === "google") {
          if (!googleConnected || !selectedCalendarId) {
            setError(
              "Task saved, but Google Calendar is not connected yet. Tap Connect Google Calendar above, then add again with the toggle on.",
            );
            setIsSaving(false);
            return;
          }

          const calRes = await fetch("/api/google/create-event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: title.trim(),
              dueDate,
              dueTime,
              todoId: created.id,
              calendarId: selectedCalendarId,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            }),
          });

          const payload = (await calRes.json()) as {
            error?: string;
            htmlLink?: string;
          };

          if (!calRes.ok) {
            setError(
              payload.error ||
                "Task saved, but Google Calendar sync failed. Try Connect Google Calendar again.",
            );
            setIsSaving(false);
            return;
          }

          if (payload.htmlLink) {
            window.open(payload.htmlLink, "_blank", "noopener,noreferrer");
          }
        } else {
          // Apple only — open Calendar via .ics
          window.open(
            `/api/calendar/ics/${created.id}`,
            "_blank",
            "noopener,noreferrer",
          );
        }
      }

      router.push("/todos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsSaving(false);
    }
  }

  const page: React.CSSProperties = {
    minHeight: "100vh",
    background: "#F8F5FF",
    paddingBottom: 40,
  };

  const container: React.CSSProperties = {
    width: "100%",
    maxWidth: 720,
    margin: "0 auto",
  };

  const topBar: React.CSSProperties = {
    background: PURPLE,
    color: "white",
    padding: "18px",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    boxShadow: "0 14px 28px rgba(124, 92, 191, 0.22)",
  };

  const topTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: "-0.01em",
    textDecoration: "none",
    color: "white",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const bodyWrap: React.CSSProperties = {
    padding: "18px",
  };

  const card: React.CSSProperties = {
    background: "white",
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(124, 92, 191, 0.10)",
    boxShadow: "0 10px 24px rgba(45, 33, 69, 0.06)",
  };

  const form: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const label: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 7,
  };

  const labelText: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    color: "#2D2145",
  };

  const input: React.CSSProperties = {
    width: "100%",
    height: 46,
    borderRadius: 12,
    border: "1.5px solid rgba(124, 92, 191, 0.28)",
    background: FIELD_BG,
    padding: "0 14px",
    fontSize: 14,
    color: "#2D2145",
    outline: "none",
    boxSizing: "border-box",
  };

  const pickerRow: React.CSSProperties = {
    width: "100%",
    height: 46,
    borderRadius: 12,
    border: "1.5px solid rgba(124, 92, 191, 0.28)",
    background: FIELD_BG,
    padding: "0 12px 0 14px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  };

  const pickerField: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    border: "none",
    background: "transparent",
    padding: 0,
    margin: 0,
    height: "100%",
    fontSize: 14,
    fontWeight: 600,
    color: "#2D2145",
    outline: "none",
    cursor: "pointer",
  };

  const toggleRow: React.CSSProperties = {
    marginTop: 2,
    width: "100%",
    height: 50,
    borderRadius: 12,
    border: "1.5px solid rgba(124, 92, 191, 0.28)",
    background: FIELD_BG,
    padding: "0 12px 0 14px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  };

  const toggleTextRow: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    color: "#2D2145",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const toggle: React.CSSProperties = {
    width: 46,
    height: 26,
    borderRadius: 999,
    background: addToCalendar ? PURPLE : "#D6D0E0",
    display: "flex",
    alignItems: "center",
    justifyContent: addToCalendar ? "flex-end" : "flex-start",
    padding: 3,
    boxSizing: "border-box",
    border: "none",
    cursor: "pointer",
    boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.2)",
  };

  const toggleKnob: React.CSSProperties = {
    width: 20,
    height: 20,
    borderRadius: 999,
    background: "white",
  };

  const button: React.CSSProperties = {
    marginTop: 6,
    width: "100%",
    height: 50,
    borderRadius: 14,
    border: "none",
    background: PURPLE,
    color: "white",
    fontSize: 15,
    fontWeight: 950,
    cursor: isSaving ? "not-allowed" : "pointer",
    opacity: isSaving ? 0.75 : 1,
    boxShadow: "0 10px 22px rgba(124, 92, 191, 0.28)",
  };

  const errorBox: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 12,
    background: "#FFF0F0",
    border: "1px solid #FFCCCC",
    color: "#9B2C2C",
    fontSize: 13,
    lineHeight: 1.45,
  };

  return (
    <main style={page}>
      <div style={container}>
        <header style={topBar}>
          <Link href="/todos" style={topTitle}>
            <span aria-hidden="true">←</span>
            <span>Add New Task</span>
          </Link>
        </header>

        <section style={bodyWrap}>
          <div style={card}>
            <form style={form} onSubmit={handleAddTask}>
              <label style={label}>
                <p style={labelText}>Task Title</p>
                <input
                  type="text"
                  placeholder="e.g., Finish wireframes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={input}
                />
              </label>

              <label style={label}>
                <p style={labelText}>Due Date</p>
                <div style={pickerRow}>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={pickerField}
                    aria-label="Due date"
                  />
                  <Calendar
                    size={16}
                    strokeWidth={2.25}
                    color={PURPLE}
                    aria-hidden="true"
                  />
                </div>
              </label>

              <label style={label}>
                <p style={labelText}>Due Time</p>
                <div style={pickerRow}>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    style={pickerField}
                    aria-label="Due time"
                  />
                  <Clock
                    size={16}
                    strokeWidth={2.25}
                    color={PURPLE}
                    aria-hidden="true"
                  />
                </div>
              </label>

              <div style={toggleRow}>
                <p style={toggleTextRow}>
                  <Calendar
                    size={16}
                    strokeWidth={2.25}
                    color={PURPLE}
                    aria-hidden="true"
                  />
                  <span>Add to Calendar</span>
                </p>
                <button
                  type="button"
                  style={toggle}
                  onClick={() => setAddToCalendar((v) => !v)}
                  aria-label={
                    addToCalendar
                      ? "Add to Calendar enabled"
                      : "Add to Calendar disabled"
                  }
                >
                  <div style={toggleKnob} />
                </button>
              </div>

              {addToCalendar ? (
                <>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "rgba(45,33,69,0.7)",
                      lineHeight: 1.4,
                    }}
                  >
                    {method === "apple"
                      ? "On your device, this opens Calendar so you can add the event in one step."
                      : googleConnected
                        ? "This will add the event to your Google Calendar."
                        : "Connect Google Calendar once to sync tasks on this device."}
                  </p>

                  {needsGoogle && googleConnected ? (
                    <label style={label}>
                      <p style={labelText}>Which calendar?</p>
                      <select
                        value={selectedCalendarId}
                        onChange={(e) => setSelectedCalendarId(e.target.value)}
                        disabled={calendars.length === 0}
                        style={{
                          ...input,
                          appearance: "none" as const,
                          WebkitAppearance: "none" as const,
                          cursor:
                            calendars.length === 0 ? "not-allowed" : "pointer",
                          opacity: calendars.length === 0 ? 0.7 : 1,
                        }}
                      >
                        {calendars.length === 0 ? (
                          <option value="">Loading calendars...</option>
                        ) : (
                          calendars.map((cal) => (
                            <option key={cal.id} value={cal.id}>
                              {cal.summary}
                            </option>
                          ))
                        )}
                      </select>
                    </label>
                  ) : null}

                  {needsGoogle && !googleConnected ? (
                    <a
                      href="/api/google/connect"
                      style={{
                        height: 44,
                        borderRadius: 12,
                        border: "none",
                        background: PURPLE,
                        color: "white",
                        fontWeight: 900,
                        fontSize: 14,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 14px",
                      }}
                    >
                      Connect Google Calendar
                    </a>
                  ) : null}
                </>
              ) : null}

              {info ? (
                <p
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: "rgba(124, 92, 191, 0.10)",
                    border: "1px solid rgba(124, 92, 191, 0.22)",
                    color: PURPLE,
                    fontSize: 13,
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  {info}
                </p>
              ) : null}

              {error ? <p style={errorBox}>{error}</p> : null}

              <button type="submit" style={button} disabled={isSaving}>
                {isSaving ? "Saving..." : "Add Task"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
