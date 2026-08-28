import * as React from "react";

const PURPLE = "#7C5CBF";
const LAVENDER = "#EDE7F6";

export default function DashboardPage() {
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

  const streakLabel: React.CSSProperties = {
    margin: 0,
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

  const streakRight: React.CSSProperties = {
    textAlign: "right",
    fontSize: 14,
    fontWeight: 800,
    opacity: 0.95,
    marginTop: 2,
  };

  const motivationCard: React.CSSProperties = {
    ...cardBase,
    background: LAVENDER,
    border: "1px solid rgba(124, 92, 191, 0.18)",
  };

  const cardTitle: React.CSSProperties = {
    margin: 0,
    color: "#2D2145",
    fontSize: 14,
    fontWeight: 850,
    letterSpacing: "-0.01em",
  };

  const quote: React.CSSProperties = {
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

  return (
    <main style={page}>
      <div style={container}>
        <div style={topBar}>
          <div style={topBarRow}>
            <p style={greeting}>Good morning, Eniola 👋</p>
            <div style={avatar} aria-label="Avatar">
              EO
            </div>
          </div>
        </div>

        <div style={sectionWrap}>
          <section style={streakCard} aria-label="Streak">
            <div style={streakRow}>
              <div>
                <p style={streakLabel}>🔥 Current Streak</p>
                <p style={streakValue}>14 days</p>
              </div>
              <div style={streakRight}>Best 21 🏆</div>
            </div>
          </section>

          <section style={motivationCard} aria-label="Daily motivation">
            <p style={cardTitle}>✨ Daily Motivation</p>
            <p style={quote}>
              “Small steps every day become big results. Keep going — you’re
              closer than you think.”
            </p>
          </section>

          <section style={whiteCard} aria-label="Activity calendar">
            <div style={calendarHeaderRow}>
              <p style={listTitle}>📅 Activity — April 2026</p>
            </div>

            <div style={calendarSquares} aria-label="Activity squares">
              <div style={{ ...squareBase, background: "#E8E1FB" }} />
              <div style={{ ...squareBase, background: "#D7CBF8" }} />
              <div style={{ ...squareBase, background: "#C6B5F3" }} />
              <div style={{ ...squareBase, background: PURPLE }} />
              <div style={{ ...squareBase, background: "#B29AEF" }} />
              <div style={{ ...squareBase, background: "#EFEAFD" }} />
              <div style={{ ...squareBase, background: "#DBCFF9" }} />
            </div>
          </section>

          <section style={whiteCard} aria-label="Today's habits">
            <p style={listTitle}>Today&apos;s Habits</p>

            <div style={row}>
              <div style={rowLeft}>
                <div
                  style={{ ...statusDot, background: "#2ECC71" }}
                  aria-hidden="true"
                />
                <div style={rowTextWrap}>
                  <p style={rowName}>Drink 2L of water</p>
                  <p style={rowMeta}>Completed • 8:10 AM</p>
                </div>
              </div>
              <span style={badge}>Done</span>
            </div>

            <div style={row}>
              <div style={rowLeft}>
                <div
                  style={{ ...statusDot, background: "#F39C12" }}
                  aria-hidden="true"
                />
                <div style={rowTextWrap}>
                  <p style={rowName}>30 minutes deep work</p>
                  <p style={rowMeta}>In progress • 12 min left</p>
                </div>
              </div>
              <span style={badge}>In progress</span>
            </div>
          </section>

          <section style={whiteCard} aria-label="Upcoming to-dos">
            <p style={listTitle}>Upcoming To-Dos</p>

            <div style={row}>
              <div style={rowLeft}>
                <div
                  style={{ ...statusDot, background: PURPLE }}
                  aria-hidden="true"
                />
                <div style={rowTextWrap}>
                  <p style={rowName}>Submit project outline</p>
                  <p style={rowMeta}>Due tomorrow • 5:00 PM</p>
                </div>
              </div>
              <span style={badge}>Due soon</span>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
