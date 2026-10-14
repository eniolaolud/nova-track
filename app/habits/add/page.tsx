"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Ban,
  BookOpen,
  ChevronRight,
  Cigarette,
  Clock,
  Droplets,
  Footprints,
  Salad,
  Smartphone,
  Sprout,
  Wine,
  type LucideIcon,
} from "lucide-react";
import {
  formatReminderDisplay,
  toTimeInputValue,
} from "@/lib/habits/time";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

const PURPLE = "#7C5CBF";
const LAVENDER = "#EDE7F6";
const BREAK_RED = "#E74C3C";
const BUILD_GREEN = "#22C55E";

type PresetHabit = {
  name: string;
  Icon: LucideIcon;
};

function TypeTitle({
  Icon,
  label,
  color,
}: {
  Icon: LucideIcon;
  label: string;
  color: string;
}) {
  const row: React.CSSProperties = {
    margin: 0,
    fontSize: 16,
    fontWeight: 950,
    color: "#2D2145",
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <p style={row}>
      <Icon size={16} strokeWidth={2.25} color={color} aria-hidden="true" />
      <span>{label}</span>
    </p>
  );
}

export default function AddHabitPage() {
  const router = useRouter();

  // These are "state" values — React remembers them while you use the page.
  const [habitType, setHabitType] = React.useState<"break" | "build">("break");
  const [selectedName, setSelectedName] = React.useState("");
  const [customName, setCustomName] = React.useState("");
  const [reminderTime, setReminderTime] = React.useState("20:00");
  const reminderInputRef = React.useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const presetHabits: PresetHabit[] =
    habitType === "break"
      ? [
          { name: "No Smoking", Icon: Cigarette },
          { name: "No Scrolling", Icon: Smartphone },
          { name: "No Junk Food", Icon: Salad },
          { name: "No Alcohol", Icon: Wine },
        ]
      : [
          { name: "Morning Run", Icon: Footprints },
          { name: "Drink Water", Icon: Droplets },
          { name: "Read Daily", Icon: BookOpen },
          { name: "Meditate", Icon: Sprout },
        ];

  // Final habit name = custom text if typed, otherwise the preset you clicked.
  const habitName = customName.trim() || selectedName.trim();

  async function handleAddHabit() {
    setError(null);

    if (!habitName) {
      setError("Pick a preset habit or type your own name first.");
      return;
    }

    setIsSaving(true);

    try {
      const supabase = createClient();

      // 1) Who is logged in?
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("You need to be logged in to add a habit.");
        setIsSaving(false);
        return;
      }

      // 2) Save one row into the habits table
      const { error: insertError } = await supabase.from("habits").insert({
        user_id: user.id,
        name: habitName,
        habit_type: habitType,
        reminder_time: formatReminderDisplay(toTimeInputValue(reminderTime)),
        streak_days: 0,
      });

      if (insertError) {
        setError(insertError.message);
        setIsSaving(false);
        return;
      }

      // 3) Go back to the habits list
      router.push("/habits");
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

  const body: React.CSSProperties = {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

  const cardBase: React.CSSProperties = {
    borderRadius: 18,
    padding: 16,
    background: "white",
    border: "1px solid rgba(124, 92, 191, 0.10)",
    boxShadow: "0 10px 24px rgba(45, 33, 69, 0.06)",
  };

  const sectionTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 16,
    fontWeight: 900,
    color: "#2D2145",
    letterSpacing: "-0.01em",
  };

  const sectionHint: React.CSSProperties = {
    margin: "6px 0 0",
    fontSize: 13,
    color: "rgba(45, 33, 69, 0.7)",
    lineHeight: 1.45,
  };

  const typeGrid: React.CSSProperties = {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  };

  const typeCardBase: React.CSSProperties = {
    borderRadius: 16,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    cursor: "pointer",
    userSelect: "none",
  };

  const typeDesc: React.CSSProperties = {
    margin: 0,
    fontSize: 13,
    color: "rgba(45, 33, 69, 0.72)",
    lineHeight: 1.45,
  };

  const rowList: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const presetLeft: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
  };

  const inputLabel: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  const inputTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    color: "#2D2145",
  };

  const input: React.CSSProperties = {
    width: "100%",
    height: 46,
    borderRadius: 12,
    border: "1.5px solid #E6DDF7",
    background: "#FAF7FF",
    padding: "0 14px",
    fontSize: 14,
    color: "#2D2145",
    outline: "none",
    boxSizing: "border-box",
  };

  const reminderRow: React.CSSProperties = {
    marginTop: 12,
    padding: "12px 12px",
    borderRadius: 14,
    border: "1px solid rgba(124, 92, 191, 0.16)",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  };

  const reminderLeft: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  };

  const reminderValue: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    color: "#2D2145",
  };

  const reminderMeta: React.CSSProperties = {
    margin: 0,
    fontSize: 13,
    color: "rgba(45, 33, 69, 0.7)",
  };

  const clock: React.CSSProperties = {
    position: "relative",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(124, 92, 191, 0.08)",
    border: "1px solid rgba(124, 92, 191, 0.16)",
    color: PURPLE,
    fontWeight: 900,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    flex: "0 0 auto",
  };

  const bottomButton: React.CSSProperties = {
    marginTop: 6,
    height: 50,
    width: "100%",
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
    marginTop: 10,
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
          <Link href="/habits" style={topTitle}>
            <span aria-hidden="true">←</span>
            <span>Add New Habit</span>
          </Link>
        </header>

        <section style={body}>
          <div style={cardBase}>
            <p style={sectionTitle}>What type of habit?</p>
            <p style={sectionHint}>Choose whether you want to break or build.</p>

            <div style={typeGrid}>
              <button
                type="button"
                onClick={() => {
                  setHabitType("break");
                  setSelectedName("");
                }}
                style={{
                  ...typeCardBase,
                  background: habitType === "break" ? "#FFF0F0" : "white",
                  border:
                    habitType === "break"
                      ? "2px solid #FF4D4D"
                      : "1.5px solid rgba(124, 92, 191, 0.18)",
                }}
              >
                <TypeTitle Icon={Ban} label="Break It" color={BREAK_RED} />
                <p style={typeDesc}>Stop a bad habit</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setHabitType("build");
                  setSelectedName("");
                }}
                style={{
                  ...typeCardBase,
                  background: habitType === "build" ? "#F0FFF4" : "white",
                  border:
                    habitType === "build"
                      ? "2px solid #22C55E"
                      : "1.5px solid rgba(124, 92, 191, 0.18)",
                }}
              >
                <TypeTitle Icon={Sprout} label="Build It" color={BUILD_GREEN} />
                <p style={typeDesc}>Start a good habit</p>
              </button>
            </div>
          </div>

          <div style={cardBase}>
            <p style={sectionTitle}>Choose a habit</p>
            <div style={rowList}>
              {presetHabits.map((h) => {
                const isSelected = selectedName === h.name && !customName.trim();
                return (
                  <button
                    key={h.name}
                    type="button"
                    onClick={() => {
                      setSelectedName(h.name);
                      setCustomName("");
                    }}
                    style={{
                      padding: "12px 12px",
                      borderRadius: 14,
                      background: isSelected ? "#E0D4F7" : LAVENDER,
                      border: isSelected
                        ? `2px solid ${PURPLE}`
                        : "1px solid rgba(124, 92, 191, 0.16)",
                      color: "#2D2145",
                      fontWeight: 850,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      cursor: "pointer",
                      width: "100%",
                      textAlign: "left",
                    }}
                  >
                    <span style={presetLeft}>
                      <h.Icon
                        size={16}
                        strokeWidth={2}
                        color={PURPLE}
                        aria-hidden="true"
                      />
                      <span>{h.name}</span>
                    </span>
                    <ChevronRight
                      size={18}
                      strokeWidth={2.25}
                      color="rgba(45, 33, 69, 0.45)"
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            <label style={inputLabel}>
              <span style={inputTitle}>Or create your own</span>
              <input
                type="text"
                placeholder="e.g., Read 10 pages"
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value);
                  if (e.target.value.trim()) setSelectedName("");
                }}
                style={input}
              />
            </label>

            <div style={reminderRow}>
              <div style={reminderLeft}>
                <p style={inputTitle}>Set Reminder Time</p>
                <p style={reminderMeta}>Daily check-in reminder</p>
              </div>
              <button
                type="button"
                style={{ ...clock, cursor: "pointer", border: "1px solid rgba(124, 92, 191, 0.16)" }}
                onClick={() => {
                  const input = reminderInputRef.current;
                  if (!input) return;
                  try {
                    input.showPicker();
                  } catch {
                    input.click();
                  }
                }}
              >
                <Clock
                  size={16}
                  strokeWidth={2.25}
                  color={PURPLE}
                  aria-hidden="true"
                />
                <span style={reminderValue}>
                  {formatReminderDisplay(reminderTime)}
                </span>
                <input
                  ref={reminderInputRef}
                  type="time"
                  value={toTimeInputValue(reminderTime)}
                  onChange={(e) => setReminderTime(e.target.value)}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: 0,
                    height: 0,
                    pointerEvents: "none",
                  }}
                  tabIndex={-1}
                  aria-label="Reminder time"
                />
              </button>
            </div>

            {error ? <p style={errorBox}>{error}</p> : null}

            <button
              type="button"
              style={bottomButton}
              onClick={handleAddHabit}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Add Habit"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
