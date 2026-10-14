"use client";

import { LogOut } from "lucide-react";
import * as React from "react";

const DANGER = "#C0392B";

export default function SignOutRow() {
  const row: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "14px 14px",
    borderRadius: 14,
    border: "1px solid rgba(45, 33, 69, 0.08)",
    background: "white",
    width: "100%",
    cursor: "pointer",
    font: "inherit",
  };

  const left: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    color: DANGER,
    fontSize: 15,
    fontWeight: 850,
  };

  return (
    <form action="/auth/signout" method="post" style={{ margin: 0 }}>
      <button type="submit" style={row}>
        <span style={left}>
          <LogOut size={18} strokeWidth={2} color={DANGER} aria-hidden="true" />
          <span>Log Out</span>
        </span>
        <span
          style={{
            color: "rgba(45, 33, 69, 0.45)",
            fontSize: 18,
            fontWeight: 900,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          ›
        </span>
      </button>
    </form>
  );
}
