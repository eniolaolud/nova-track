"use client";

import { createClient } from "@/lib/supabase/client";
import { Calendar, Flame, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import * as React from "react";

const PURPLE = "#7C5CBF";
const LAVENDER = "#EDE7F6";

type HabitItem = {
  id: string;
  name: string;
  habit_type: "break" | "build";
  streak_days: number;
  reminder_time: string | null;
  created_at?: string | null;
};

type TodoItem = {
  id: string;
  title: string;
  due_date: string | null;
  due_time: string | null;
  completed: boolean;
  created_at?: string | null;
};

function greetingForNow() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function firstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "there";
}

function initialsFrom(fullName: string) {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function activityColor(count: number): string {
  if (count <= 0) return "#F1ECFB";
  if (count === 1) return "#E8E1FB";
  if (count === 2) return "#D7CBF8";
  if (count === 3) return "#C6B5F3";
  return PURPLE;
}

function lastSevenDayKeys() {
  const days: { key: string; label: string }[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return days;
}

const MOTIVATION_QUOTES = [
  "Small steps every day become big results. Keep going — you’re closer than you think.",
  "Consistency beats intensity. Show up again today.",
  "Progress isn’t loud. It’s the quiet choice to continue.",
  "One habit. One task. That’s enough for today.",
];

export default function DashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [displayName, setDisplayName] = React.useState("there");
  const [initials, setInitials] = React.useState("NT");
  const [currentStreak, setCurrentStreak] = React.useState(0);
  const [bestStreak, setBestStreak] = React.useState(0);
  const [habits, setHabits] = React.useState<HabitItem[]>([]);
  const [todos, setTodos] = React.useState<TodoItem[]>([]);
  const [activityCounts, setActivityCounts] = React.useState<number[]>(
    () => Array(7).fill(0),
  );

  const weekDays = lastSevenDayKeys();
  const monthLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const quote =
    MOTIVATION_QUOTES[new Date().getDate() % MOTIVATION_QUOTES.length];

  React.useEffect(() => {
    let cancelled = false;
    const days = lastSevenDayKeys();

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (!cancelled) {
            setError("Please log in to view your dashboard.");
            setLoading(false);
          }
          return;
        }

        const [{ data: profile }, { data: habitRows }, { data: todoRows }] =
          await Promise.all([
            supabase
              .from("profiles")
              .select("full_name")
              .eq("id", user.id)
              .maybeSingle(),
            supabase
              .from("habits")
              .select(
                "id, name, habit_type, streak_days, reminder_time, created_at",
              )
              .order("created_at", { ascending: false }),
            supabase
              .from("todos")
              .select("id, title, due_date, due_time, completed, created_at")
              .order("created_at", { ascending: false }),
          ]);

        if (cancelled) return;

        const name =
          profile?.full_name ||
          (user.user_metadata?.full_name as string | undefined) ||
          user.email?.split("@")[0] ||
          "NovaTrack User";

        const loadedHabits = (habitRows as HabitItem[]) ?? [];
        const loadedTodos = (todoRows as TodoItem[]) ?? [];
        const streaks = loadedHabits.map((h) => h.streak_days ?? 0);
        const best = streaks.reduce((max, n) => Math.max(max, n), 0);

        const mergedCounts = days.map(({ key }) => {
          const habitHits = loadedHabits.filter((h) =>
            Boolean(h.created_at?.startsWith(key)),
          ).length;
          const todoHits = loadedTodos.filter((t) =>
            Boolean(t.created_at?.startsWith(key)),
          ).length;
          return todoHits + habitHits;
        });

        setDisplayName(firstName(name));
        setInitials(initialsFrom(name) || "NT");
        setHabits(loadedHabits);
        setTodos(loadedTodos.filter((t) => !t.completed).slice(0, 5));
        setCurrentStreak(best);
        setBestStreak(best);
        setActivityCounts(mergedCounts);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load dashboard.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

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
    padding: "18px 18px",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    boxShadow: "0 14px 28px rgba(124, 92, 191, 0.22)",
  };

  const topBarRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  };

  const greeting: React.CSSProperties = {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: "-0.01em",
  };

  const avatar: React.CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: "rgba(255, 255, 255, 0.24)",
    border: "1px solid rgba(255, 255, 255, 0.38)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 800,
    userSelect: "none",
    color: "white",
    textDecoration: "none",
  };

  const sectionWrap: React.CSSProperties = {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

  const cardBase: React.CSSProperties = {
    borderRadius: 18,
    padding: 16,
    boxShadow: "0 10px 24px rgba(45, 33, 69, 0.06)",
    border: "1px solid rgba(124, 92, 191, 0.10)",
  };

  const streakCard: React.CSSProperties = {
    ...cardBase,
    background: `linear-gradient(135deg, ${PURPLE} 0%, #9A79D4 55%, #CBB8FF 100%)`,
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.22)",
  };

  const streakRow: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  };

  const streakLabelRow: React.CSSProperties = {
    margin: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 750,
    opacity: 0.95,
  };

  const streakValue: React.CSSProperties = {
    margin: "6px 0 0",
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
  };

  const motivationCard: React.CSSProperties = {
    ...cardBase,
    background: LAVENDER,
    border: "1px solid rgba(124, 92, 191, 0.18)",
  };

  const cardTitleRow: React.CSSProperties = {
    margin: 0,
    color: "#2D2145",
    fontSize: 14,
    fontWeight: 850,
    letterSpacing: "-0.01em",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const listTitleRow: React.CSSProperties = {
    margin: 0,
    color: "#2D2145",
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: "-0.01em",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const streakRightRow: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    textAlign: "right",
    fontSize: 14,
    fontWeight: 800,
    opacity: 0.95,
    marginTop: 2,
  };

  const quoteStyle: React.CSSProperties = {
    margin: "10px 0 0",
    color: "rgba(45, 33, 69, 0.82)",
    fontSize: 15,
    lineHeight: 1.6,
  };

  const whiteCard: React.CSSProperties = {
    ...cardBase,
    background: "white",
  };

  const calendarHeaderRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  };

  const calendarSquares: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  };

  const squareBase: React.CSSProperties = {
    width: 18,
    height: 18,
    borderRadius: 5,
    border: "1px solid rgba(45, 33, 69, 0.10)",
  };

  const listTitle: React.CSSProperties = {
    margin: 0,
    color: "#2D2145",
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: "-0.01em",
  };

  const row: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(45, 33, 69, 0.08)",
    background: "#FBFAFF",
  };

  const rowLeft: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  };

  const statusDot: React.CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: 999,
    flex: "0 0 auto",
  };

  const rowTextWrap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: 0,
  };

  const rowName: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 850,
    color: "#2D2145",
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const rowMeta: React.CSSProperties = {
    margin: 0,
    fontSize: 13,
    color: "rgba(45, 33, 69, 0.7)",
    lineHeight: 1.2,
  };

  const badge: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    border: "1px solid rgba(124, 92, 191, 0.16)",
    background: "rgba(124, 92, 191, 0.08)",
    color: PURPLE,
    flex: "0 0 auto",
  };

  const empty: React.CSSProperties = {
    marginTop: 12,
    fontSize: 13,
    color: "rgba(45, 33, 69, 0.7)",
    lineHeight: 1.45,
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

  const linkStyle: React.CSSProperties = {
    color: PURPLE,
    fontWeight: 800,
    textDecoration: "none",
  };

  return (
    <main style={page}>
      <div style={container}>
        <div style={topBar}>
          <div style={topBarRow}>
            <p style={greeting}>
              {greetingForNow()}, {displayName}
            </p>
            <Link href="/profile" style={avatar} aria-label="Profile">
              {initials}
            </Link>
          </div>
        </div>

        <div style={sectionWrap}>
          {error ? <p style={errorBox}>{error}</p> : null}

          <section style={streakCard} aria-label="Streak">
            <div style={streakRow}>
              <div>
                <p style={streakLabelRow}>
                  <Flame size={14} strokeWidth={2.25} aria-hidden="true" />
                  <span>Current Streak</span>
                </p>
                <p style={streakValue}>
                  {loading ? "…" : `${currentStreak} day${currentStreak === 1 ? "" : "s"}`}
                </p>
              </div>
              <div style={streakRightRow}>
                <span>Best {loading ? "…" : bestStreak}</span>
                <Trophy size={14} strokeWidth={2.25} aria-hidden="true" />
              </div>
            </div>
          </section>

          <section style={motivationCard} aria-label="Daily motivation">
            <p style={cardTitleRow}>
              <Sparkles
                size={16}
                strokeWidth={2.25}
                color={PURPLE}
                aria-hidden="true"
              />
              <span>Daily Motivation</span>
            </p>
            <p style={quoteStyle}>“{quote}”</p>
          </section>

          <section style={whiteCard} aria-label="Activity calendar">
            <div style={calendarHeaderRow}>
              <p style={listTitleRow}>
                <Calendar
                  size={16}
                  strokeWidth={2.25}
                  color={PURPLE}
                  aria-hidden="true"
                />
                <span>Activity — {monthLabel}</span>
              </p>
            </div>

            <div style={calendarSquares} aria-label="Last 7 days activity">
              {weekDays.map((day, index) => (
                <div
                  key={day.key}
                  title={`${day.label}: ${activityCounts[index] || 0} updates`}
                  style={{
                    ...squareBase,
                    background: activityColor(activityCounts[index] || 0),
                  }}
                />
              ))}
            </div>
            <p style={{ ...empty, marginTop: 8 }}>
              Last 7 days based on habits and tasks you added.
            </p>
          </section>

          <section style={whiteCard} aria-label="Today's habits">
            <p style={listTitle}>Your Habits</p>

            {loading ? (
              <p style={empty}>Loading habits...</p>
            ) : habits.length === 0 ? (
              <p style={empty}>
                No habits yet.{" "}
                <Link href="/habits/add" style={linkStyle}>
                  Add a habit
                </Link>
              </p>
            ) : (
              habits.slice(0, 5).map((habit) => (
                <div key={habit.id} style={row}>
                  <div style={rowLeft}>
                    <div
                      style={{
                        ...statusDot,
                        background:
                          habit.habit_type === "build" ? "#2ECC71" : "#E74C3C",
                      }}
                      aria-hidden="true"
                    />
                    <div style={rowTextWrap}>
                      <p style={rowName}>{habit.name}</p>
                      <p style={rowMeta}>
                        {habit.streak_days} day streak
                        {habit.reminder_time
                          ? ` • Reminder ${habit.reminder_time}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <span style={badge}>
                    {habit.habit_type === "build" ? "Build" : "Break"}
                  </span>
                </div>
              ))
            )}
          </section>

          <section style={whiteCard} aria-label="Upcoming to-dos">
            <p style={listTitle}>Upcoming To-Dos</p>

            {loading ? (
              <p style={empty}>Loading tasks...</p>
            ) : todos.length === 0 ? (
              <p style={empty}>
                No open tasks.{" "}
                <Link href="/todos/add" style={linkStyle}>
                  Add a task
                </Link>
              </p>
            ) : (
              todos.map((todo) => (
                <div key={todo.id} style={row}>
                  <div style={rowLeft}>
                    <div
                      style={{ ...statusDot, background: PURPLE }}
                      aria-hidden="true"
                    />
                    <div style={rowTextWrap}>
                      <p style={rowName}>{todo.title}</p>
                      <p style={rowMeta}>
                        {[todo.due_date, todo.due_time]
                          .filter(Boolean)
                          .join(" • ") || "No due date"}
                      </p>
                    </div>
                  </div>
                  <span style={badge}>Open</span>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
