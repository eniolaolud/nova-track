 "use client";

import Link from "next/link";
import * as React from "react";

const PURPLE = "#7C5CBF";
const LAVENDER = "#EDE7F6";

export default function AddHabitPage() {
  const [habitType, setHabitType] = React.useState<"break" | "build">("break");

  const presetHabits =
    habitType === "break"
      ? [
          { name: "No Smoking", emoji: "🚬" },
          { name: "No Scrolling", emoji: "📱" },
          { name: "No Junk Food", emoji: "🍟" },
          { name: "No Alcohol", emoji: "🍺" },
        ]
      : [
          { name: "Morning Run", emoji: "🏃" },
          { name: "Drink Water", emoji: "💧" },
          { name: "Read Daily", emoji: "📚" },
          { name: "Meditate", emoji: "🧘" },
        ];

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

  const typeTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 16,
    fontWeight: 950,
    color: "#2D2145",
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
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

  const presetRow: React.CSSProperties = {
    padding: "12px 12px",
    borderRadius: 14,
    background: LAVENDER,
    border: "1px solid rgba(124, 92, 191, 0.16)",
    color: "#2D2145",
    fontWeight: 850,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  };

  const presetLeft: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
  };

  const rowRight: React.CSSProperties = {
    color: "rgba(45, 33, 69, 0.55)",
    fontWeight: 900,
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
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(124, 92, 191, 0.28)",
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
                onClick={() => setHabitType("break")}
                style={{
                  ...typeCardBase,
                  background: habitType === "break" ? "#FFF0F0" : "white",
                  border:
                    habitType === "break"
                      ? "2px solid #FF4D4D"
                      : "1.5px solid rgba(124, 92, 191, 0.18)",
                }}
              >
                <p style={typeTitle}>🔴 Break It</p>
                <p style={typeDesc}>Stop a bad habit</p>
              </button>

              <button
                type="button"
                onClick={() => setHabitType("build")}
                style={{
                  ...typeCardBase,
                  background: habitType === "build" ? "#F0FFF4" : "white",
                  border:
                    habitType === "build"
                      ? "2px solid #22C55E"
                      : "1.5px solid rgba(124, 92, 191, 0.18)",
                }}
              >
                <p style={typeTitle}>🟢 Build It</p>
                <p style={typeDesc}>Start a good habit</p>
              </button>
            </div>
          </div>

          <div style={cardBase}>
            <p style={sectionTitle}>Choose a habit</p>
            <div style={rowList}>
              {presetHabits.map((h) => (
                <div key={h.name} style={presetRow}>
                  <span style={presetLeft}>
                    <span aria-hidden="true">{h.emoji}</span>
                    <span>{h.name}</span>
                  </span>
                  <span style={rowRight} aria-hidden="true">
                    →
                  </span>
                </div>
              ))}
            </div>

            <label style={inputLabel}>
              <span style={inputTitle}>Or create your own</span>
              <input
                type="text"
                placeholder="e.g., Read 10 pages"
                style={input}
              />
            </label>

            <div style={reminderRow}>
              <div style={reminderLeft}>
                <p style={inputTitle}>Set Reminder Time</p>
                <p style={reminderMeta}>Daily reminder</p>
              </div>
              <div style={clock}>
                <span aria-hidden="true">🕒</span>
                <span style={reminderValue}>08:00 PM</span>
              </div>
            </div>

            <button type="button" style={bottomButton}>
              Add Habit
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

