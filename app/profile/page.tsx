"use client";

import SignOutRow from "@/app/components/SignOutRow";
import { createClient } from "@/lib/supabase/client";
import {
  Calendar,
  CheckCircle2,
  Flame,
  ListChecks,
  Trophy,
} from "lucide-react";
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

function formatMemberSince(iso?: string | null) {
  if (!iso) return "Member recently";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Member recently";
  return `Member since ${date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  })}`;
}

export default function ProfilePage() {
  const [fullName, setFullName] = React.useState("Loading...");
  const [username, setUsername] = React.useState("@...");
  const [memberSince, setMemberSince] = React.useState("...");
  const [activeHabits, setActiveHabits] = React.useState(0);
  const [tasksDone, setTasksDone] = React.useState(0);
  const [bestStreak, setBestStreak] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [calendarConnected, setCalendarConnected] = React.useState(false);
  const [calendarEmail, setCalendarEmail] = React.useState<string | null>(null);
  const [calendarMessage, setCalendarMessage] = React.useState<string | null>(null);
  const [icsToken, setIcsToken] = React.useState<string | null>(null);
  const [icsBusy, setIcsBusy] = React.useState(false);
  const [icsMessage, setIcsMessage] = React.useState<string | null>(null);
  const [origin, setOrigin] = React.useState("");

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const calendar = params.get("calendar");
    if (calendar === "connected") {
      setCalendarMessage("Google Calendar connected successfully.");
    } else if (calendar === "disconnected") {
      setCalendarMessage("Google Calendar disconnected.");
    } else if (calendar === "denied") {
      setCalendarMessage("Google Calendar permission was denied.");
    } else if (calendar === "error") {
      setCalendarMessage(params.get("message") || "Calendar connection failed.");
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setError(null);

      try {
        const supabase = createClient();

        // 1) Who is logged in?
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          if (!cancelled) setError("Please log in to view your profile.");
          return;
        }

        // 2) Try reading from profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, username, created_at")
          .eq("id", user.id)
          .maybeSingle();

        // Fallback to signup metadata if profile row is missing
        const metaName =
          (user.user_metadata?.full_name as string | undefined) ||
          user.email?.split("@")[0] ||
          "NovaTrack User";
        const metaUsername =
          (user.user_metadata?.username as string | undefined) || "user";

        if (!cancelled) {
          if (profileError) {
            // Common if permissions weren't granted yet
            setError(profileError.message);
            setFullName(metaName);
            setUsername(`@${metaUsername}`);
            setMemberSince(formatMemberSince(user.created_at));
          } else if (profile) {
            setFullName(profile.full_name || metaName);
            setUsername(`@${profile.username || metaUsername}`);
            setMemberSince(formatMemberSince(profile.created_at));
          } else {
            // No profile row yet — create one from auth metadata
            await supabase.from("profiles").upsert({
              id: user.id,
              full_name: metaName,
              username: metaUsername,
            });
            setFullName(metaName);
            setUsername(`@${metaUsername}`);
            setMemberSince(formatMemberSince(user.created_at));
          }
        }

        // 3) Real counts from habits + todos
        const [{ data: habits }, { data: todos }] = await Promise.all([
          supabase.from("habits").select("streak_days"),
          supabase.from("todos").select("completed"),
        ]);

        if (cancelled) return;

        const habitRows = habits ?? [];
        const todoRows = todos ?? [];
        const maxStreak = habitRows.reduce(
          (max, h) => Math.max(max, h.streak_days ?? 0),
          0,
        );

        setActiveHabits(habitRows.length);
        setTasksDone(todoRows.filter((t) => t.completed).length);
        setBestStreak(maxStreak);

        const { data: googleToken } = await supabase
          .from("google_calendar_tokens")
          .select("email")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!cancelled) {
          setCalendarConnected(Boolean(googleToken));
          setCalendarEmail(googleToken?.email ?? null);
        }

        const tokenRes = await fetch("/api/calendar/feed-token");
        if (tokenRes.ok) {
          const tokenPayload = (await tokenRes.json()) as { token?: string | null };
          if (!cancelled) setIcsToken(tokenPayload.token ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load profile.");
        }
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  async function enableAppleFeed() {
    setIcsBusy(true);
    setIcsMessage(null);
    try {
      const res = await fetch("/api/calendar/feed-token", { method: "POST" });
      const payload = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !payload.token) {
        setIcsMessage(payload.error || "Could not create Apple Calendar feed.");
        return;
      }
      setIcsToken(payload.token);
      setIcsMessage("Apple Calendar feed ready. Copy the link below.");
    } catch (err) {
      setIcsMessage(
        err instanceof Error ? err.message : "Could not create Apple Calendar feed.",
      );
    } finally {
      setIcsBusy(false);
    }
  }

  async function copyAppleFeedLink() {
    if (!icsToken) return;
    const httpsUrl = `${window.location.origin}/api/calendar/feed/${icsToken}`;
    try {
      await navigator.clipboard.writeText(httpsUrl);
      setIcsMessage("Feed link copied. In Apple Calendar: File → New Calendar Subscription → paste.");
    } catch {
      setIcsMessage(httpsUrl);
    }
  }

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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: 900,
    color: "#2D2145",
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

  const memberSinceStyle: React.CSSProperties = {
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

  const sectionTitleRow: React.CSSProperties = {
    margin: 0,
    color: "#2D2145",
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: "-0.01em",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const badgeRow: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    alignItems: "stretch",
    gap: 10,
    flexWrap: "wrap",
  };

  const achievementCard = (earned: boolean): React.CSSProperties => ({
    flex: "1 1 120px",
    minWidth: 110,
    borderRadius: 14,
    padding: "12px 10px",
    border: earned
      ? "1px solid rgba(124, 92, 191, 0.28)"
      : "1px solid rgba(45, 33, 69, 0.08)",
    background: earned ? "rgba(124, 92, 191, 0.08)" : "#F5F3F8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    textAlign: "center",
    opacity: earned ? 1 : 0.55,
  });

  const achievementLabel: React.CSSProperties = {
    margin: 0,
    fontSize: 12,
    fontWeight: 800,
    color: "#2D2145",
    lineHeight: 1.25,
  };

  const settingsWrap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  };

  const errorBox: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 12,
    background: "#FFF0F0",
    border: "1px solid #FFCCCC",
    color: "#9B2C2C",
    fontSize: 13,
    lineHeight: 1.45,
  };

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <main style={page}>
      <div style={container}>
        <header style={header}>
          <div style={avatar} aria-hidden="true">
            {initials || "NT"}
          </div>
          <h1 style={name}>{fullName}</h1>
          <p style={handle}>{username}</p>
          <p style={memberSinceStyle}>{memberSince}</p>
        </header>

        <section style={body}>
          {error ? <p style={errorBox}>{error}</p> : null}

          <div style={whiteCard}>
            <div style={statsRow}>
              <StatBlock value={String(bestStreak)} label="Best Streak" />
              <div style={divider} />
              <StatBlock value={String(activeHabits)} label="Active Habits" />
              <div style={divider} />
              <StatBlock value={String(tasksDone)} label="Tasks Done" />
            </div>
          </div>

          <div style={whiteCard}>
            <h2 style={sectionTitleRow}>
              <Trophy
                size={18}
                strokeWidth={2.25}
                color={PURPLE}
                aria-hidden="true"
              />
              <span>Achievements</span>
            </h2>
            <div style={badgeRow}>
              <div
                style={achievementCard(activeHabits >= 1)}
                aria-label={
                  activeHabits >= 1
                    ? "First habit earned"
                    : "First habit locked"
                }
              >
                <Flame
                  size={20}
                  strokeWidth={2.25}
                  color={activeHabits >= 1 ? PURPLE : "#9A93A8"}
                />
                <p style={achievementLabel}>First Habit</p>
              </div>
              <div
                style={achievementCard(bestStreak >= 7)}
                aria-label={
                  bestStreak >= 7
                    ? "7-day streak earned"
                    : "7-day streak locked"
                }
              >
                <Trophy
                  size={20}
                  strokeWidth={2.25}
                  color={bestStreak >= 7 ? PURPLE : "#9A93A8"}
                />
                <p style={achievementLabel}>7-Day Streak</p>
              </div>
              <div
                style={achievementCard(tasksDone >= 1)}
                aria-label={
                  tasksDone >= 1
                    ? "First task done earned"
                    : "First task done locked"
                }
              >
                <CheckCircle2
                  size={20}
                  strokeWidth={2.25}
                  color={tasksDone >= 1 ? PURPLE : "#9A93A8"}
                />
                <p style={achievementLabel}>Task Finisher</p>
              </div>
              <div
                style={achievementCard(tasksDone >= 5)}
                aria-label={
                  tasksDone >= 5
                    ? "5 tasks done earned"
                    : "5 tasks done locked"
                }
              >
                <ListChecks
                  size={20}
                  strokeWidth={2.25}
                  color={tasksDone >= 5 ? PURPLE : "#9A93A8"}
                />
                <p style={achievementLabel}>5 Tasks Done</p>
              </div>
            </div>
          </div>

          <div style={settingsWrap}>
            <div
              style={{
                background: "white",
                borderRadius: 14,
                border: "1px solid rgba(45, 33, 69, 0.08)",
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#2D2145",
                  fontWeight: 850,
                }}
              >
                <Calendar size={18} strokeWidth={2} color="#2D2145" />
                <span>Calendar Sync</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(45,33,69,0.7)" }}>
                {calendarConnected
                  ? `Connected${calendarEmail ? ` as ${calendarEmail}` : ""}. New tasks with "Add to Calendar" will sync.`
                  : "Connect Google Calendar so tasks can be added to your calendar."}
              </p>
              {calendarMessage ? (
                <p style={{ margin: 0, fontSize: 13, color: PURPLE }}>{calendarMessage}</p>
              ) : null}
              {calendarConnected ? (
                <form action="/api/google/disconnect" method="post">
                  <button
                    type="submit"
                    style={{
                      height: 40,
                      borderRadius: 10,
                      border: "1px solid rgba(124,92,191,0.25)",
                      background: "white",
                      color: PURPLE,
                      fontWeight: 800,
                      cursor: "pointer",
                      padding: "0 12px",
                    }}
                  >
                    Disconnect Calendar
                  </button>
                </form>
              ) : (
                <a
                  href="/api/google/connect"
                  style={{
                    height: 40,
                    borderRadius: 10,
                    border: "none",
                    background: PURPLE,
                    color: "white",
                    fontWeight: 800,
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 12px",
                  }}
                >
                  Connect Google Calendar
                </a>
              )}
            </div>

            <div
              style={{
                background: "white",
                borderRadius: 14,
                border: "1px solid rgba(45, 33, 69, 0.08)",
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: "#2D2145",
                  fontWeight: 850,
                }}
              >
                <Calendar size={18} strokeWidth={2} color="#2D2145" />
                <span>Apple Calendar (.ics)</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(45,33,69,0.7)" }}>
                Subscribe once to keep open NovaTrack tasks in Apple Calendar.
                You can also download a single task with the download icon on
                To-Dos.
              </p>
              {icsToken ? (
                <>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 12,
                      color: "rgba(45,33,69,0.65)",
                      wordBreak: "break-all",
                    }}
                  >
                    {origin
                      ? `${origin}/api/calendar/feed/${icsToken}`
                      : `/api/calendar/feed/${icsToken}`}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => void copyAppleFeedLink()}
                      style={{
                        height: 40,
                        borderRadius: 10,
                        border: "none",
                        background: PURPLE,
                        color: "white",
                        fontWeight: 800,
                        cursor: "pointer",
                        padding: "0 12px",
                      }}
                    >
                      Copy subscribe link
                    </button>
                    <button
                      type="button"
                      onClick={() => void enableAppleFeed()}
                      disabled={icsBusy}
                      style={{
                        height: 40,
                        borderRadius: 10,
                        border: "1px solid rgba(124,92,191,0.25)",
                        background: "white",
                        color: PURPLE,
                        fontWeight: 800,
                        cursor: "pointer",
                        padding: "0 12px",
                        opacity: icsBusy ? 0.7 : 1,
                      }}
                    >
                      Reset link
                    </button>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => void enableAppleFeed()}
                  disabled={icsBusy}
                  style={{
                    height: 40,
                    borderRadius: 10,
                    border: "none",
                    background: PURPLE,
                    color: "white",
                    fontWeight: 800,
                    cursor: "pointer",
                    padding: "0 12px",
                    opacity: icsBusy ? 0.7 : 1,
                    alignSelf: "flex-start",
                  }}
                >
                  {icsBusy ? "Creating..." : "Enable Apple Calendar feed"}
                </button>
              )}
              {icsMessage ? (
                <p style={{ margin: 0, fontSize: 13, color: PURPLE }}>{icsMessage}</p>
              ) : null}
            </div>

            <SignOutRow />
          </div>
        </section>
      </div>
    </main>
  );
}
