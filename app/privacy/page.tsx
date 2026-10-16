import Link from "next/link";

const PURPLE = "#7C5CBF";

export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F8F5FF",
        padding: "32px 18px 48px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", color: "#2D2145" }}>
        <Link
          href="/"
          style={{ color: PURPLE, fontWeight: 800, textDecoration: "none" }}
        >
          ← NovaTrack
        </Link>
        <h1 style={{ marginTop: 18, fontSize: 28, fontWeight: 900 }}>
          Privacy Policy
        </h1>
        <p style={{ lineHeight: 1.6, color: "rgba(45,33,69,0.8)" }}>
          NovaTrack stores your account details, habits, tasks, and community
          posts so you can use the app. If you connect Google Calendar, we use
          Google OAuth only to create or remove calendar events you choose to
          sync. We do not sell your personal data. You can disconnect Google or
          delete your account data by contacting the developer.
        </p>
        <p style={{ lineHeight: 1.6, color: "rgba(45,33,69,0.8)" }}>
          Contact: the email shown on the NovaTrack Google OAuth consent screen.
        </p>
      </div>
    </main>
  );
}
