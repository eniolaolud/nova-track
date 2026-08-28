import Link from "next/link";
import * as React from "react";

const PURPLE = "#7C5CBF";

export default function OnboardingPage() {
  const page: React.CSSProperties = {
    minHeight: "100vh",
    background: "#F8F5FF",
    display: "flex",
    flexDirection: "column",
  };

  const header: React.CSSProperties = {
    background: `linear-gradient(135deg, ${PURPLE} 0%, #A47ED4 55%, #D9C8FF 100%)`,
    padding: "56px 20px 40px",
    color: "white",
    display: "flex",
    justifyContent: "center",
  };

  const headerInner: React.CSSProperties = {
    width: "100%",
    maxWidth: 560,
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  };

  const subtitle: React.CSSProperties = {
    margin: "10px 0 0",
    fontSize: 16,
    opacity: 0.94,
    lineHeight: 1.5,
  };

  const content: React.CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "22px 20px 44px",
  };

  const cardWrap: React.CSSProperties = {
    width: "100%",
    maxWidth: 560,
    background: "white",
    borderRadius: 20,
    padding: 18,
    boxShadow: "0 16px 40px rgba(124, 92, 191, 0.12)",
    border: "1px solid rgba(124, 92, 191, 0.12)",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

  const optionCardBase: React.CSSProperties = {
    borderRadius: 16,
    padding: "18px 16px",
    textDecoration: "none",
    display: "block",
    transition: "transform 120ms ease, box-shadow 120ms ease",
  };

  const firstCard: React.CSSProperties = {
    ...optionCardBase,
    background: "#EDE7F6",
    border: `2px solid ${PURPLE}`,
    boxShadow: "0 10px 24px rgba(124, 92, 191, 0.16)",
  };

  const secondCard: React.CSSProperties = {
    ...optionCardBase,
    background: "white",
    border: "1.5px solid #E5DCF5",
  };

  const cardTitle: React.CSSProperties = {
    margin: 0,
    color: "#2D2145",
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.25,
  };

  const cardDescription: React.CSSProperties = {
    margin: "8px 0 0",
    color: "rgba(45, 33, 69, 0.8)",
    fontSize: 14,
    lineHeight: 1.6,
  };

  const bottomLink: React.CSSProperties = {
    marginTop: 4,
    alignSelf: "center",
    color: PURPLE,
    fontSize: 14,
    fontWeight: 700,
    textDecoration: "none",
  };

  return (
    <main style={page}>
      <header style={header}>
        <div style={headerInner}>
          <h1 style={title}>You&apos;re all set! 🎉</h1>
          <p style={subtitle}>What would you like to start with?</p>
        </div>
      </header>

      <section style={content}>
        <div style={cardWrap}>
          <Link href="/habits" style={firstCard}>
            <h2 style={cardTitle}>🔴 Track a Habit</h2>
            <p style={cardDescription}>
              Break bad habits or build new ones. Set reminders and track your
              streaks.
            </p>
          </Link>

          <Link href="/todos" style={secondCard}>
            <h2 style={cardTitle}>📋 Make a To-Do List</h2>
            <p style={cardDescription}>
              Add tasks with due dates and sync with your calendar.
            </p>
          </Link>

          <Link href="/dashboard" style={bottomLink}>
            I&apos;ll explore on my own →
          </Link>
        </div>
      </section>
    </main>
  );
}

