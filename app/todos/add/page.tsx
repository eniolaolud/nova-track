import Link from "next/link";
import * as React from "react";

const PURPLE = "#7C5CBF";
const FIELD_BG = "#F8F5FF";

export default function AddTodoPage() {
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

  const pickerValue: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 700,
    color: "rgba(45, 33, 69, 0.85)",
  };

  const pickerIcon: React.CSSProperties = {
    fontSize: 16,
    color: PURPLE,
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

  const toggleText: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    color: "#2D2145",
  };

  const toggle: React.CSSProperties = {
    width: 46,
    height: 26,
    borderRadius: 999,
    background: PURPLE,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 3,
    boxSizing: "border-box",
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
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(124, 92, 191, 0.28)",
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
            <form style={form}>
              <label style={label}>
                <p style={labelText}>Task Title</p>
                <input type="text" placeholder="e.g., Finish wireframes" style={input} />
              </label>

              <label style={label}>
                <p style={labelText}>Due Date</p>
                <div style={pickerRow}>
                  <p style={pickerValue}>April 10, 2026</p>
                  <span style={pickerIcon} aria-hidden="true">
                    📅
                  </span>
                </div>
              </label>

              <label style={label}>
                <p style={labelText}>Due Time</p>
                <div style={pickerRow}>
                  <p style={pickerValue}>08:00 PM</p>
                  <span style={pickerIcon} aria-hidden="true">
                    🕒
                  </span>
                </div>
              </label>

              <div style={toggleRow}>
                <p style={toggleText}>📅 Add to Calendar</p>
                <div style={toggle} aria-label="Add to Calendar enabled">
                  <div style={toggleKnob} />
                </div>
              </div>

              <button type="button" style={button}>
                Add Task
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

