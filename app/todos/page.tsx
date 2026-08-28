import Link from "next/link";
import * as React from "react";

const PURPLE = "#7C5CBF";
const LAVENDER = "#EDE7F6";

type TodoRowProps = {
  title: string;
  time: string;
  completed?: boolean;
};

function TodoRow({ title, time, completed = false }: TodoRowProps) {
  const row: React.CSSProperties = {
    background: "white",
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(124, 92, 191, 0.10)",
    boxShadow: "0 10px 24px rgba(45, 33, 69, 0.06)",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  };

  const checkboxWrap: React.CSSProperties = {
    width: 22,
    height: 22,
    flex: "0 0 auto",
    marginTop: 1,
  };

  const checkbox: React.CSSProperties = {
    width: 22,
    height: 22,
    borderRadius: 7,
    border: completed
      ? `2px solid ${PURPLE}`
      : "2px solid rgba(45, 33, 69, 0.18)",
    background: completed ? PURPLE : "white",
    display: "grid",
    placeItems: "center",
    appearance: "none",
    WebkitAppearance: "none",
    outline: "none",
    cursor: "default",
    margin: 0,
  };

  const checkMark: React.CSSProperties = {
    color: "white",
    fontSize: 14,
    fontWeight: 900,
    lineHeight: 1,
    opacity: completed ? 1 : 0,
    transform: completed ? "scale(1)" : "scale(0.8)",
    pointerEvents: "none",
  };

  const textWrap: React.CSSProperties = {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 15,
    fontWeight: 900,
    color: "#2D2145",
    letterSpacing: "-0.01em",
    lineHeight: 1.25,
    textDecoration: completed ? "line-through" : "none",
    opacity: completed ? 0.75 : 1,
  };

  const timeStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 13,
    color: "rgba(45, 33, 69, 0.7)",
  };

  return (
    <div style={row}>
      <div style={checkboxWrap}>
        <input
          type="checkbox"
          checked={completed}
          readOnly
          aria-label={completed ? "Completed" : "Not completed"}
          style={checkbox}
        />
        <span style={checkMark} aria-hidden="true">
          ✓
        </span>
      </div>
      <div style={textWrap}>
        <p style={titleStyle}>{title}</p>
        <p style={timeStyle}>{time}</p>
      </div>
    </div>
  );
}

export default function TodosPage() {
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

  const banner: React.CSSProperties = {
    background: LAVENDER,
    border: "1px solid rgba(124, 92, 191, 0.16)",
    borderRadius: 16,
    padding: "12px 14px",
    color: "#2D2145",
    fontWeight: 850,
  };

  const sectionLabel: React.CSSProperties = {
    margin: "4px 0 0",
    fontSize: 14,
    fontWeight: 950,
    color: "#2D2145",
    letterSpacing: "-0.01em",
  };

  const list: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
  };

  const sectionCard: React.CSSProperties = {
    background: "transparent",
    borderRadius: 18,
  };

  return (
    <main style={page}>
      <div style={container}>
        <header style={topBar}>
          <div style={topBarRow}>
            <h1 style={title}>To-Do List</h1>
            <Link href="/todos/add" style={addBtn}>
              + Add
            </Link>
          </div>
        </header>

        <section style={body}>
          <div style={banner}>📅 Synced with Google Calendar</div>

          <div style={sectionCard}>
            <p style={sectionLabel}>Today — April 10</p>
            <div style={list} aria-label="Today's tasks">
              <TodoRow
                title="Submit project report"
                time="10:00 AM"
                completed
              />
              <TodoRow title="Call the dentist" time="4:30 PM" />
            </div>
          </div>

          <div style={sectionCard}>
            <p style={sectionLabel}>Tomorrow — April 11</p>
            <div style={list} aria-label="Tomorrow's tasks">
              <TodoRow title="Team standup meeting" time="9:00 AM" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

