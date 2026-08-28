"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

const PURPLE = "#7C5CBF";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "🏠" },
  { href: "/habits", label: "Habits", icon: "🔥" },
  { href: "/todos", label: "To-Dos", icon: "📋" },
  { href: "/community", label: "Community", icon: "🌍" },
  { href: "/profile", label: "Profile", icon: "👤" },
] as const;

const HIDDEN_PREFIXES = ["/login", "/signup", "/onboardingchoice"];
const HIDDEN_EXACT = new Set(["/"]);

export default function BottomNav() {
  const pathname = usePathname();

  const hideNav =
    HIDDEN_EXACT.has(pathname) ||
    HIDDEN_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    ) ||
    pathname.endsWith("/add");

  if (hideNav) return null;

  const nav: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    background: "white",
    borderTop: "1px solid rgba(124, 92, 191, 0.14)",
    boxShadow: "0 -8px 24px rgba(45, 33, 69, 0.06)",
    padding: "8px 10px calc(8px + env(safe-area-inset-bottom))",
    zIndex: 50,
  };

  const inner: React.CSSProperties = {
    maxWidth: 720,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  };

  const linkBase: React.CSSProperties = {
    flex: 1,
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    padding: "6px 4px",
    borderRadius: 12,
    minWidth: 0,
  };

  const icon: React.CSSProperties = {
    fontSize: 18,
    lineHeight: 1,
  };

  const label: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 800,
    lineHeight: 1.1,
    whiteSpace: "nowrap",
  };

  return (
    <nav style={nav} aria-label="Main navigation">
      <div style={inner}>
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...linkBase,
                color: active ? PURPLE : "rgba(45, 33, 69, 0.68)",
                background: active ? "rgba(124, 92, 191, 0.10)" : "transparent",
              }}
            >
              <span style={icon} aria-hidden="true">
                {item.icon}
              </span>
              <span style={label}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
