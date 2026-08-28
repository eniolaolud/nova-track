import * as React from "react";

const PURPLE = "#7C5CBF";

type StatItem = {
  value: string;
  label: string;
};

function StatBlock({ value, label }: StatItem) {
  const block: React.CSSProperties = {
    flex: 1,
    textAlign: "center",
    padding: "12px 8px",
  };

  const valueStyle: React.CSSProperties = {
    margin: 0,
    color: PURPLE,
    fontSize: 24,
    fontWeight: 900,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
  };

  const labelStyle: React.CSSProperties = {
    margin: "6px 0 0",
    color: "rgba(45, 33, 69, 0.72)",
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1.25,
  };

  return (
    <div style={block}>
      <p style={valueStyle}>{value}</p>
      <p style={labelStyle}>{label}</p>
    </div>
  );
}

type SettingsRowProps = {
  icon: string;
  text: string;
  danger?: boolean;
};

function SettingsRow({ icon, text, danger = false }: SettingsRowProps) {
  const row: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "14px 14px",
    borderRadius: 14,
    border: "1px solid rgba(45, 33, 69, 0.08)",
    background: "white",
  };

  const left: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    color: danger ? "#C0392B" : "#2D2145",
    fontSize: 15,
    fontWeight: 850,
  };

  const arrow: React.CSSProperties = {
    color: "rgba(45, 33, 69, 0.45)",
    fontSize: 18,
    fontWeight: 900,
    lineHeight: 1,
  };

  return (
    <div style={row}>
      <span style={left}>
        <span aria-hidden="true">{icon}</span>
        <span>{text}</span>
      </span>
      <span style={arrow} aria-hidden="true">
        ›
      </span>
    </div>
  );
}

export default function ProfilePage() {
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

  const header: React.CSSProperties = {
    background: `linear-gradient(135deg, ${PURPLE} 0%, #9A79D4 55%, #CBB8FF 100%)`,
    color: "white",
    padding: "34px 18px 26px",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    boxShadow: "0 16px 32px rgba(124, 92, 191, 0.24)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  };

  const avatar: React.CSSProperties = {
    width: 88,
    height: 88,
    borderRadius: 999,
    background: "#D9D9D9",
    border: "2px solid rgba(255, 255, 255, 0.35)",
    boxShadow: "0 8px 18px rgba(45, 33, 69, 0.22)",
  };

  const name: React.CSSProperties = {
    margin: "14px 0 0",
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
  };

  const handle: React.CSSProperties = {
    margin: "6px 0 0",
    fontSize: 15,
    fontWeight: 700,
    opacity: 0.95,
  };

  const memberSince: React.CSSProperties = {
    margin: "8px 0 0",
    fontSize: 12,
    fontWeight: 650,
    opacity: 0.9,
  };

  const body: React.CSSProperties = {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

  const whiteCard: React.CSSProperties = {
    background: "white",
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(124, 92, 191, 0.10)",
    boxShadow: "0 10px 24px rgba(45, 33, 69, 0.06)",
  };

  const statsRow: React.CSSProperties = {
    display: "flex",
    alignItems: "stretch",
  };

  const divider: React.CSSProperties = {
    width: 1,
    background: "rgba(124, 92, 191, 0.12)",
  };

  const sectionTitle: React.CSSProperties = {
    margin: 0,
    color: "#2D2145",
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: "-0.01em",
  };

  const badgeRow: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    alignItems: "center",
    gap: 12,
  };

  const badge: React.CSSProperties = {
    width: 42,
    height: 42,
    borderRadius: 999,
    background: "#D7D7D7",
    border: "1px solid #CCCCCC",
  };

  const settingsWrap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  return (
    <main style={page}>
      <div style={container}>
        <header style={header}>
          <div style={avatar} aria-hidden="true" />
          <h1 style={name}>Eniola</h1>
          <p style={handle}>@eniola_nova</p>
          <p style={memberSince}>Member since April 2026</p>
        </header>

        <section style={body}>
          <div style={whiteCard}>
            <div style={statsRow}>
              <StatBlock value="14" label="Day Streak" />
              <div style={divider} />
              <StatBlock value="3" label="Active Habits" />
              <div style={divider} />
              <StatBlock value="12" label="Tasks Done" />
            </div>
          </div>

          <div style={whiteCard}>
            <h2 style={sectionTitle}>🏆 Achievements</h2>
            <div style={badgeRow}>
              <div style={badge} aria-label="Achievement badge placeholder 1" />
              <div style={badge} aria-label="Achievement badge placeholder 2" />
              <div style={badge} aria-label="Achievement badge placeholder 3" />
            </div>
          </div>

          <div style={settingsWrap}>
            <SettingsRow icon="🔔" text="Notifications" />
            <SettingsRow icon="📅" text="Calendar Sync" />
            <SettingsRow icon="🚪" text="Log Out" danger />
          </div>
        </section>
      </div>
    </main>
  );
}

