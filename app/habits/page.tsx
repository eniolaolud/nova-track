"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Ban,
  BookOpen,
  Cigarette,
  Droplets,
  Flame,
  Footprints,
  Salad,
  Smartphone,
  Sprout,
  Trash2,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { todayKey } from "@/lib/habits/time";
import Link from "next/link";
import * as React from "react";

const PURPLE = "#7C5CBF";
const LAVENDER = "#EDE7F6";
const BREAK_RED = "#E74C3C";
const BUILD_GREEN = "#22C55E";

type HabitRow = {
  id: string;
  name: string;
  habit_type: "break" | "build";
  streak_days: number;
  reminder_time: string | null;
  last_checked_at?: string | null;
};

function iconForHabit(name: string): LucideIcon {
  const key = name.toLowerCase();
  if (key.includes("smok")) return Cigarette;
  if (key.includes("scroll") || key.includes("phone")) return Smartphone;
  if (key.includes("junk") || key.includes("food") || key.includes("salad"))
    return Salad;
  if (key.includes("alcohol") || key.includes("drink") && key.includes("no"))
    return Wine;
  if (key.includes("run") || key.includes("walk")) return Footprints;
  if (key.includes("water")) return Droplets;
  if (key.includes("read")) return BookOpen;
  if (key.includes("meditat")) return Sprout;
  return Flame;
}

type HabitCardProps = {
  Icon: LucideIcon;
  name: string;
  days: number;
  reminderTime?: string | null;
  checkedInToday?: boolean;
  onCheckIn?: () => void;
  onDelete?: () => void;
};

function HabitCard({
  Icon,
  name,
  days,
  reminderTime,
  checkedInToday,
  onCheckIn,
  onDelete,
}: HabitCardProps) {
  const card: React.CSSProperties = {
    background: "white",
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(124, 92, 191, 0.10)",
    boxShadow: "0 10px 24px rgba(45, 33, 69, 0.06)",
  };

  const topRow: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  };

  const left: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  };

  const iconWrap: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 14,
    background: "rgba(124, 92, 191, 0.08)",
    border: "1px solid rgba(124, 92, 191, 0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "0 0 auto",
  };

  const nameText: React.CSSProperties = {
    margin: 0,
    fontSize: 16,
    fontWeight: 900,
    color: "#2D2145",
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const right: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: "0 0 auto",
  };

  const streakPill: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(124, 92, 191, 0.08)",
    border: "1px solid rgba(124, 92, 191, 0.16)",
    color: PURPLE,
    fontWeight: 900,
    fontSize: 13,
  };

  const deleteBtn: React.CSSProperties = {
    border: "none",
    background: "rgba(192, 57, 43, 0.08)",
    color: "#C0392B",
    borderRadius: 10,
    width: 34,
    height: 34,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  const desc: React.CSSProperties = {
    margin: "10px 0 0",
    color: "rgba(45, 33, 69, 0.78)",
    fontSize: 14,
    lineHeight: 1.55,
  };

  const barTrack: React.CSSProperties = {
    marginTop: 14,
    height: 8,
    borderRadius: 999,
    background: "rgba(124, 92, 191, 0.14)",
    overflow: "hidden",
  };

  const progress = Math.min(1, Math.max(0, days / 21));
  const barFill: React.CSSProperties = {
    height: "100%",
    width: `${Math.round(progress * 100)}%`,
    background: "rgba(124, 92, 191, 0.55)",
    borderRadius: 999,
  };

  return (
    <div style={card}>
      <div style={topRow}>
        <div style={left}>
          <div style={iconWrap}>
            <Icon size={18} strokeWidth={2} color={PURPLE} aria-hidden="true" />
          </div>
          <p style={nameText}>{name}</p>
        </div>

        <div style={right}>
          <div style={streakPill} aria-label={`${days} day streak`}>
            <Flame
              size={14}
              strokeWidth={2.25}
              color={PURPLE}
              aria-hidden="true"
            />
            <span>{days} days</span>
          </div>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${name}`}
            style={deleteBtn}
          >
            <Trash2 size={16} strokeWidth={2.25} />
          </button>
        </div>
      </div>

      <p style={desc}>
        {reminderTime
          ? `Reminder set for ${reminderTime}. Keep showing up — consistency builds the streak.`
          : "Keep showing up — consistency builds the streak."}
      </p>

      <div style={barTrack} aria-hidden="true">
        <div style={barFill} />
      </div>

      <button
        type="button"
        onClick={onCheckIn}
        disabled={checkedInToday}
        style={{
          marginTop: 12,
          width: "100%",
          height: 40,
          borderRadius: 12,
          border: checkedInToday
            ? "1px solid rgba(124, 92, 191, 0.18)"
            : "none",
          background: checkedInToday ? "rgba(124, 92, 191, 0.08)" : PURPLE,
          color: checkedInToday ? PURPLE : "white",
          fontWeight: 900,
          fontSize: 13,
          cursor: checkedInToday ? "default" : "pointer",
        }}
      >
        {checkedInToday ? "Checked in today" : "Check in"}
      </button>
    </div>
  );
}

function TabLabel({
  Icon,
  label,
  color,
}: {
  Icon: LucideIcon;
  label: string;
  color: string;
}) {
  const row: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
  };

  return (
    <span style={row}>
      <Icon size={16} strokeWidth={2.25} color={color} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export default function HabitsPage() {
  const [activeTab, setActiveTab] = React.useState<"break" | "build">("break");
  const [habits, setHabits] = React.useState<HabitRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function loadHabits() {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        let { data, error: fetchError } = await supabase
          .from("habits")
          .select(
            "id, name, habit_type, streak_days, reminder_time, last_checked_at",
          )
          .order("created_at", { ascending: false });

        // Fallback if last_checked_at column isn't added yet
        if (fetchError) {
          const retry = await supabase
            .from("habits")
            .select("id, name, habit_type, streak_days, reminder_time")
            .order("created_at", { ascending: false });
          data = retry.data;
          fetchError = retry.error;
        }

        if (cancelled) return;

        if (fetchError) {
          setError(fetchError.message);
          setHabits([]);
        } else {
          setHabits((data as HabitRow[]) ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load habits.");
          setHabits([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadHabits();
    const reload = () => void loadHabits();
    window.addEventListener("novatrack-habits-updated", reload);
    return () => {
      cancelled = true;
      window.removeEventListener("novatrack-habits-updated", reload);
    };
  }, []);

  async function deleteHabit(habit: HabitRow) {
    const confirmed = window.confirm(`Delete "${habit.name}"?`);
    if (!confirmed) return;

    const previous = habits;
    setHabits((prev) => prev.filter((h) => h.id !== habit.id));
    setError(null);

    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("habits")
      .delete()
      .eq("id", habit.id);

    if (deleteError) {
      setHabits(previous);
      setError(deleteError.message);
    }
  }

  const visibleHabits = habits.filter((h) => h.habit_type === activeTab);

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

  const topBarRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: "-0.01em",
  };

  const addBtn: React.CSSProperties = {
    height: 32,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid rgba(255, 255, 255, 0.40)",
    background: "rgba(255, 255, 255, 0.18)",
    color: "white",
    fontWeight: 900,
    fontSize: 13,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  };

  const body: React.CSSProperties = {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

  const tabs: React.CSSProperties = {
    display: "flex",
    gap: 10,
  };

  const tabBase: React.CSSProperties = {
    flex: 1,
    padding: "12px 12px",
    borderRadius: 14,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 14,
    letterSpacing: "-0.01em",
    userSelect: "none",
    cursor: "pointer",
    border: "none",
  };

  const list: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const empty: React.CSSProperties = {
    background: "white",
    borderRadius: 18,
    padding: 18,
    border: "1px solid rgba(124, 92, 191, 0.10)",
    color: "rgba(45, 33, 69, 0.75)",
    fontSize: 14,
    lineHeight: 1.5,
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
          <div style={topBarRow}>
            <h1 style={title}>My Habits</h1>
            <Link href="/habits/add" style={addBtn}>
              + Add
            </Link>
          </div>
        </header>

        <section style={body}>
          <div style={tabs} aria-label="Habit type tabs">
            <button
              type="button"
              onClick={() => setActiveTab("break")}
              style={{
                ...tabBase,
                background: activeTab === "break" ? LAVENDER : "white",
                border:
                  activeTab === "break"
                    ? `2px solid ${PURPLE}`
                    : "1.5px solid rgba(124, 92, 191, 0.18)",
                color: "#2D2145",
              }}
            >
              <TabLabel Icon={Ban} label="Break It" color={BREAK_RED} />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("build")}
              style={{
                ...tabBase,
                background: activeTab === "build" ? LAVENDER : "white",
                border:
                  activeTab === "build"
                    ? `2px solid ${PURPLE}`
                    : "1.5px solid rgba(124, 92, 191, 0.18)",
                color: "#2D2145",
              }}
            >
              <TabLabel Icon={Sprout} label="Build It" color={BUILD_GREEN} />
            </button>
          </div>

          {error ? <p style={errorBox}>{error}</p> : null}

          <div
            style={{
              ...empty,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <p style={{ margin: 0, flex: 1 }}>
              Enable browser popups for daily habit check-ins (works best while
              NovaTrack is open).
            </p>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new Event("novatrack-enable-habit-reminders"),
                )
              }
              style={{
                height: 36,
                padding: "0 12px",
                borderRadius: 10,
                border: "none",
                background: PURPLE,
                color: "white",
                fontWeight: 900,
                fontSize: 13,
                cursor: "pointer",
                flex: "0 0 auto",
              }}
            >
              Enable
            </button>
          </div>

          <div style={list} aria-label="Habits list">
            {loading ? (
              <p style={empty}>Loading your habits...</p>
            ) : visibleHabits.length === 0 ? (
              <p style={empty}>
                No {activeTab === "break" ? "Break It" : "Build It"} habits yet.
                Tap <strong>+ Add</strong> to create one.
              </p>
            ) : (
              visibleHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  Icon={iconForHabit(habit.name)}
                  name={habit.name}
                  days={habit.streak_days}
                  reminderTime={habit.reminder_time}
                  checkedInToday={habit.last_checked_at === todayKey()}
                  onCheckIn={() =>
                    window.dispatchEvent(
                      new CustomEvent("novatrack-open-habit-checkin", {
                        detail: habit,
                      }),
                    )
                  }
                  onDelete={() => deleteHabit(habit)}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
