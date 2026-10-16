import Link from "next/link";

const PURPLE = "#7C5CBF";

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p style={{ lineHeight: 1.6, color: "rgba(45,33,69,0.8)" }}>
          NovaTrack is provided as-is for personal productivity and learning
          use. You are responsible for the content you post and the calendar
          events you create. Do not use the app for illegal activity. Features
          may change as the product develops.
        </p>
        <p style={{ lineHeight: 1.6, color: "rgba(45,33,69,0.8)" }}>
          Contact: the email shown on the NovaTrack Google OAuth consent screen.
        </p>
      </div>
    </main>
  );
}