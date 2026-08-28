"use client";

import Link from "next/link";
import * as React from "react";

const PURPLE = "#7C5CBF";

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    // Placeholder: connect your auth flow here.
    window.setTimeout(() => setIsSubmitting(false), 600);
  }

  const page: React.CSSProperties = {
    minHeight: "100vh",
    background: "#F8F5FF",
    display: "flex",
    flexDirection: "column",
  };

  const header: React.CSSProperties = {
    background: `linear-gradient(135deg, ${PURPLE} 0%, #A47ED4 55%, #D9C8FF 100%)`,
    padding: "56px 20px 36px",
    display: "flex",
    justifyContent: "center",
  };

  const headerInner: React.CSSProperties = {
    width: "100%",
    maxWidth: 520,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    color: "white",
  };

  const brand: React.CSSProperties = {
    margin: 0,
    fontSize: 28,
    letterSpacing: "-0.02em",
    fontWeight: 800,
    lineHeight: 1.1,
  };

  const subtitle: React.CSSProperties = {
    margin: 0,
    opacity: 0.92,
    fontSize: 14,
    lineHeight: 1.5,
    maxWidth: 440,
  };

  const contentWrap: React.CSSProperties = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "18px 20px 40px",
  };

  const card: React.CSSProperties = {
    width: "100%",
    maxWidth: 520,
    background: "white",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 16px 40px rgba(124, 92, 191, 0.14)",
    border: "1px solid rgba(124, 92, 191, 0.14)",
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: "#2D2145",
    letterSpacing: "-0.01em",
  };

  const hint: React.CSSProperties = {
    margin: "6px 0 0",
    color: "rgba(45, 33, 69, 0.72)",
    fontSize: 14,
    lineHeight: 1.6,
  };

  const form: React.CSSProperties = {
    marginTop: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const label: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  };

  const labelText: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 650,
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

  const forgotRow: React.CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: -2,
  };

  const forgotLink: React.CSSProperties = {
    color: PURPLE,
    fontSize: 13,
    fontWeight: 700,
    textDecoration: "none",
  };

  const button: React.CSSProperties = {
    marginTop: 6,
    height: 48,
    borderRadius: 12,
    border: "none",
    background: PURPLE,
    color: "white",
    fontWeight: 800,
    fontSize: 15,
    cursor: isSubmitting ? "not-allowed" : "pointer",
    boxShadow: "0 10px 22px rgba(124, 92, 191, 0.28)",
  };

  const bottom: React.CSSProperties = {
    marginTop: 14,
    display: "flex",
    justifyContent: "center",
    gap: 6,
    fontSize: 14,
    color: "rgba(45, 33, 69, 0.78)",
  };

  const authLink: React.CSSProperties = {
    color: PURPLE,
    fontWeight: 750,
    textDecoration: "none",
  };

  return (
    <main style={page}>
      <header style={header}>
        <div style={headerInner}>
          <h1 style={brand}>NovaTrack</h1>
          <p style={subtitle}>Welcome back! Ready to keep going?</p>
        </div>
      </header>

      <section style={contentWrap}>
        <div style={card}>
          <h2 style={title}>Log in</h2>
          <p style={hint}>Pick up right where you left off.</p>

          <form style={form} onSubmit={onSubmit}>
            <label style={label}>
              <span style={labelText}>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@domain.com"
                style={input}
              />
            </label>

            <label style={label}>
              <span style={labelText}>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                style={input}
              />
            </label>

            <div style={forgotRow}>
              <Link href="/forgot-password" style={forgotLink}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" style={button} disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div style={bottom}>
            <span>Don&apos;t have an account?</span>
            <Link href="/signup" style={authLink}>
              Sign up
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
