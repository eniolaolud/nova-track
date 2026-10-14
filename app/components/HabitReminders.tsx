"use client";

import { createClient } from "@/lib/supabase/client";
import { nextReminderDate, todayKey } from "@/lib/habits/time";
import * as React from "react";

const PURPLE = "#7C5CBF";

type HabitReminder = {
  id: string;
  name: string;
  habit_type: "break" | "build";
  reminder_time: string | null;
  streak_days: number;
  last_checked_at?: string | null;
};

type PromptState = {
  habit: HabitReminder;
  source: "notification" | "manual";
};

function notifiedKey(habitId: string, day: string) {
  return `novatrack-notified-${habitId}-${day}`;
}

function alreadyNotified(habitId: string, day: string) {
  try {
    return localStorage.getItem(notifiedKey(habitId, day)) === "1";
  } catch {
    return false;
  }
}

function markNotified(habitId: string, day: string) {
  try {
    localStorage.setItem(notifiedKey(habitId, day), "1");
  } catch {
    // ignore
  }
}

export default function HabitReminders() {
  const [prompt, setPrompt] = React.useState<PromptState | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);
  const timersRef = React.useRef<number[]>([]);

  const clearTimers = React.useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  }, []);

  const openCheckIn = React.useCallback((habit: HabitReminder, source: PromptState["source"]) => {
    setPrompt({ habit, source });
  }, []);

  const scheduleHabits = React.useCallback(
    (habits: HabitReminder[]) => {
      clearTimers();
      const day = todayKey();

      for (const habit of habits) {
        if (!habit.reminder_time) continue;
        if (habit.last_checked_at === day) continue;
        if (alreadyNotified(habit.id, day)) continue;

        const when = nextReminderDate(habit.reminder_time);
        if (!when) continue;

        const delay = when.getTime() - Date.now();
        if (delay <= 0 || delay > 24 * 60 * 60 * 1000) continue;

        const timerId = window.setTimeout(() => {
          markNotified(habit.id, day);

          const title =
            habit.habit_type === "break"
              ? `Check in: ${habit.name}`
              : `Reminder: ${habit.name}`;
          const body =
            habit.habit_type === "break"
              ? "How are you doing with this habit today?"
              : "Time to check in on your habit.";

          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            try {
              new Notification(title, {
                body,
                tag: `habit-${habit.id}-${day}`,
              });
            } catch {
              // ignore notification errors
            }
          }

          openCheckIn(habit, "notification");
        }, delay);

        timersRef.current.push(timerId);
      }
    },
    [clearTimers, openCheckIn],
  );

  React.useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user || cancelled) return;

        const { data } = await supabase
          .from("habits")
          .select(
            "id, name, habit_type, reminder_time, streak_days, last_checked_at",
          );

        if (cancelled) return;
        scheduleHabits((data as HabitReminder[]) ?? []);
      } catch {
        // If last_checked_at column is missing, retry without it
        try {
          const supabase = createClient();
          const { data } = await supabase
            .from("habits")
            .select("id, name, habit_type, reminder_time, streak_days");
          if (cancelled) return;
          scheduleHabits((data as HabitReminder[]) ?? []);
        } catch {
          // ignore
        }
      }
    }

    void boot();

    const onFocus = () => void boot();
    window.addEventListener("focus", onFocus);

    return () => {
      cancelled = true;
      clearTimers();
      window.removeEventListener("focus", onFocus);
    };
  }, [clearTimers, scheduleHabits]);

  async function ensurePermission() {
    if (typeof Notification === "undefined") {
      setStatus("This browser does not support notifications.");
      return false;
    }
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") {
      setStatus("Notifications are blocked. Enable them in browser settings.");
      return false;
    }
    const result = await Notification.requestPermission();
    if (result !== "granted") {
      setStatus("Notifications not enabled. You'll still get in-app check-ins.");
      return false;
    }
    setStatus("Daily habit reminders enabled.");
    return true;
  }

  async function submitCheckIn(keptGoing: boolean) {
    if (!prompt) return;
    setSaving(true);
    setStatus(null);

    const day = todayKey();
    const habit = prompt.habit;
    const nextStreak = keptGoing ? (habit.streak_days ?? 0) + 1 : 0;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("habits")
        .update({
          streak_days: nextStreak,
          last_checked_at: day,
        })
        .eq("id", habit.id);

      if (error) {
        // Column may not exist yet — still update streak
        const { error: streakOnlyError } = await supabase
          .from("habits")
          .update({ streak_days: nextStreak })
          .eq("id", habit.id);
        if (streakOnlyError) {
          setStatus(streakOnlyError.message);
          setSaving(false);
          return;
        }
      }

      markNotified(habit.id, day);
      setStatus(
        keptGoing
          ? `Nice — ${habit.name} is now at ${nextStreak} day${nextStreak === 1 ? "" : "s"}.`
          : `Reset recorded for ${habit.name}. Tomorrow is a fresh start.`,
      );
      setPrompt(null);
      window.dispatchEvent(new Event("novatrack-habits-updated"));
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not save check-in.");
    } finally {
      setSaving(false);
    }
  }

  // Expose a tiny global hook so Habits page can open a check-in / enable notices
  React.useEffect(() => {
    const enable = () => void ensurePermission();
    const open = (event: Event) => {
      const custom = event as CustomEvent<HabitReminder>;
      if (custom.detail?.id) openCheckIn(custom.detail, "manual");
    };
    window.addEventListener("novatrack-enable-habit-reminders", enable);
    window.addEventListener("novatrack-open-habit-checkin", open as EventListener);
    return () => {
      window.removeEventListener("novatrack-enable-habit-reminders", enable);
      window.removeEventListener(
        "novatrack-open-habit-checkin",
        open as EventListener,
      );
    };
  }, [openCheckIn]);

  if (!prompt && !status) return null;

  return (
    <>
      {status ? (
        <div
          style={{
            position: "fixed",
            left: 16,
            right: 16,
            bottom: 88,
            zIndex: 60,
            maxWidth: 720,
            margin: "0 auto",
            padding: "12px 14px",
            borderRadius: 14,
            background: "#2D2145",
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 10px 24px rgba(45,33,69,0.25)",
          }}
          role="status"
        >
          {status}
          <button
            type="button"
            onClick={() => setStatus(null)}
            style={{
              marginLeft: 10,
              border: "none",
              background: "transparent",
              color: "rgba(255,255,255,0.85)",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {prompt ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 70,
            background: "rgba(45, 33, 69, 0.45)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Habit check-in"
            style={{
              width: "100%",
              maxWidth: 420,
              background: "white",
              borderRadius: 18,
              padding: 18,
              boxShadow: "0 18px 40px rgba(45,33,69,0.28)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 900,
                color: "#2D2145",
              }}
            >
              {prompt.habit.habit_type === "break"
                ? `Check in: ${prompt.habit.name}`
                : `Did you do ${prompt.habit.name}?`}
            </p>
            <p
              style={{
                margin: "8px 0 0",
                fontSize: 14,
                color: "rgba(45,33,69,0.75)",
                lineHeight: 1.5,
              }}
            >
              {prompt.habit.habit_type === "break"
                ? "Did you stay on track with this habit today?"
                : "Mark today if you completed this habit."}
            </p>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <button
                type="button"
                disabled={saving}
                onClick={() => void submitCheckIn(true)}
                style={{
                  height: 46,
                  borderRadius: 12,
                  border: "none",
                  background: PURPLE,
                  color: "white",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {prompt.habit.habit_type === "break"
                  ? "Yes — still on track"
                  : "Yes — I did it"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void submitCheckIn(false)}
                style={{
                  height: 46,
                  borderRadius: 12,
                  border: "1px solid rgba(192,57,43,0.25)",
                  background: "rgba(192,57,43,0.06)",
                  color: "#C0392B",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                {prompt.habit.habit_type === "break"
                  ? "I slipped today"
                  : "Not today"}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => setPrompt(null)}
                style={{
                  height: 42,
                  borderRadius: 12,
                  border: "none",
                  background: "transparent",
                  color: "rgba(45,33,69,0.7)",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Later
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
