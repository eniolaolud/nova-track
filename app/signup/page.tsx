"use client";

import Link from "next/link";
import * as React from "react";

const PURPLE = "#7C5CBF";

export default function SignUpPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    // Placeholder: wire up your auth provider here.
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

  const brandRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
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

  const link: React.CSSProperties = {
    color: PURPLE,
    fontWeight: 750,
    textDecoration: "none",
  };

  return (
    <main style={page}>
      <header style={header}>
        <div style={headerInner}>
          <div style={brandRow}>
            <h1 style={brand}>NovaTrack</h1>
          </div>
          <p style={subtitle}>
            Create your account to start tracking progress with a clean, focused
            routine.
          </p>
        </div>
      </header>

      <section style={contentWrap}>
        <div style={card}>
          <h2 style={title}>Sign up</h2>
          <p style={hint}>Join in a minute — we’ll get you set up fast.</p>

          <form style={form} onSubmit={onSubmit}>
            <label style={label}>
              <span style={labelText}>Full Name</span>
              <input
                name="fullName"
                type="text"
                autoComplete="name"
                required
                placeholder="Jane Doe"
                style={input}
              />
            </label>

            <label style={label}>
              <span style={labelText}>Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="jane@domain.com"
                style={input}
              />
            </label>

            <label style={label}>
              <span style={labelText}>Username</span>
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="janedoe"
                style={input}
              />
            </label>

            <label style={label}>
              <span style={labelText}>Password</span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="••••••••"
                style={input}
              />
            </label>

            <button type="submit" style={button} disabled={isSubmitting}>
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div style={bottom}>
            <span>Already have an account?</span>
            <Link href="/login" style={link}>
              Log in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}