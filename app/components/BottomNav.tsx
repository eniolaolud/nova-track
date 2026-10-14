"use client";

import {
  ClipboardList,
  Flame,
  Globe,
  Home,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

const PURPLE = "#7C5CBF";
const INACTIVE = "rgba(45, 33, 69, 0.68)";

const NAV_ITEMS: {
  href: string;
  label: string;
  Icon: LucideIcon;
}[] = [
  { href: "/dashboard", label: "Home", Icon: Home },
  { href: "/habits", label: "Habits", Icon: Flame },
  { href: "/todos", label: "To-Dos", Icon: ClipboardList },
  { href: "/community", label: "Community", Icon: Globe },
  { href: "/profile", label: "Profile", Icon: User },
];

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
    gap: 4,
    padding: "6px 4px",
    borderRadius: 12,
    minWidth: 0,
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
        {NAV_ITEMS.map(({ href, label: itemLabel, Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          const color = active ? PURPLE : INACTIVE;

          return (
            <Link
              key={href}
              href={href}
              style={{
                ...linkBase,
                color,
                background: active ? "rgba(124, 92, 191, 0.10)" : "transparent",
              }}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.25 : 2}
                color={color}
                aria-hidden="true"
              />
              <span style={label}>{itemLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
