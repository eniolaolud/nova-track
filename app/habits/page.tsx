import Link from "next/link";
import * as React from "react";

const PURPLE = "#7C5CBF";
const LAVENDER = "#EDE7F6";

type HabitCardProps = {
  emoji: string;
  name: string;
  days: number;
  description: string;
  progress: number; // 0..1
};

function HabitCard({ emoji, name, days, description, progress }: HabitCardProps) {
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

  const icon: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 14,
    background: "rgba(124, 92, 191, 0.08)",
    border: "1px solid rgba(124, 92, 191, 0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
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
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(124, 92, 191, 0.08)",
    border: "1px solid rgba(124, 92, 191, 0.16)",
    color: PURPLE,
    fontWeight: 900,
    fontSize: 13,
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

  const clamped = Math.max(0, Math.min(1, progress));
  const barFill: React.CSSProperties = {
    height: "100%",
    width: `${Math.round(clamped * 100)}%`,
    background: "rgba(124, 92, 191, 0.55)",
    borderRadius: 999,
  };

  return (
    <div style={card}>
      <div style={topRow}>
        <div style={left}>
          <div style={icon} aria-hidden="true">
            {emoji}
          </div>
          <p style={nameText}>{name}</p>
        </div>

        <div style={right} aria-label={`${days} day streak`}>
          <span aria-hidden="true">🔥</span>
          <span>{days} days</span>
        </div>
      </div>

      <p style={desc}>{description}</p>

      <div style={barTrack} aria-hidden="true">
        <div style={barFill} />
      </div>
    </div>
  );
}

export default function HabitsPage() {
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
  };

  const tabActive: React.CSSProperties = {
    ...tabBase,
    background: LAVENDER,
    border: `2px solid ${PURPLE}`,
    color: "#2D2145",
  };

  const tabInactive: React.CSSProperties = {
    ...tabBase,
    background: "white",
    border: "1.5px solid rgba(124, 92, 191, 0.18)",
    color: "rgba(45, 33, 69, 0.86)",
  };

  const list: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 12,
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
            <div style={tabActive}>🔴 Break It</div>
            <div style={tabInactive}>🟢 Build It</div>
          </div>

          <div style={list} aria-label="Habits list">
            <HabitCard
              emoji="🚭"
              name="No Smoking"
              days={14}
              description="Skip the cravings today. Your lungs and energy are thanking you."
              progress={14 / 21}
            />
            <HabitCard
              emoji="📵"
              name="No Scrolling"
              days={3}
              description="Stay present. Replace scrolling with a short walk or a quick stretch."
              progress={3 / 7}
            />
            <HabitCard
              emoji="🥗"
              name="No Junk Food"
              days={7}
              description="Choose something nourishing. Consistency beats perfection."
              progress={7 / 14}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
