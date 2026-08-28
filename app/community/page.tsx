import * as React from "react";

const PURPLE = "#7C5CBF";
const LAVENDER = "#EDE7F6";

type PostCardProps = {
  username: string;
  time: string;
  text: string;
  streakBadge?: string;
  claps: number;
  comments: number;
};

function PostCard({
  username,
  time,
  text,
  streakBadge,
  claps,
  comments,
}: PostCardProps) {
  const card: React.CSSProperties = {
    background: "white",
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(124, 92, 191, 0.10)",
    boxShadow: "0 10px 24px rgba(45, 33, 69, 0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  const header: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  const avatar: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: 999,
    background: "#D8D8D8",
    border: "1px solid #CFCFCF",
    flex: "0 0 auto",
  };

  const userWrap: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    minWidth: 0,
  };

  const user: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    color: "#2D2145",
    lineHeight: 1.2,
  };

  const posted: React.CSSProperties = {
    margin: 0,
    fontSize: 12,
    color: "rgba(45, 33, 69, 0.64)",
    lineHeight: 1.2,
  };

  const bodyText: React.CSSProperties = {
    margin: 0,
    fontSize: 15,
    lineHeight: 1.6,
    color: "rgba(45, 33, 69, 0.9)",
  };

  const badge: React.CSSProperties = {
    alignSelf: "flex-start",
    padding: "7px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    color: PURPLE,
    background: LAVENDER,
    border: "1px solid rgba(124, 92, 191, 0.20)",
  };

  const reactions: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    color: "rgba(45, 33, 69, 0.78)",
    fontSize: 13,
    fontWeight: 800,
  };

  const reactionItem: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };

  return (
    <article style={card}>
      <div style={header}>
        <div style={avatar} aria-hidden="true" />
        <div style={userWrap}>
          <p style={user}>{username}</p>
          <p style={posted}>{time}</p>
        </div>
      </div>

      <p style={bodyText}>{text}</p>

      {streakBadge ? <span style={badge}>{streakBadge}</span> : null}

      <div style={reactions}>
        <span style={reactionItem}>
          <span aria-hidden="true">👏</span>
          <span>{claps}</span>
        </span>
        <span style={reactionItem}>
          <span aria-hidden="true">💬</span>
          <span>{comments}</span>
        </span>
      </div>
    </article>
  );
}

export default function CommunityPage() {
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
    padding: "18px",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    boxShadow: "0 14px 28px rgba(124, 92, 191, 0.22)",
  };

  const topRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: "-0.01em",
  };

  const postBtn: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    color: "white",
  };

  const feed: React.CSSProperties = {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

  return (
    <main style={page}>
      <div style={container}>
        <header style={topBar}>
          <div style={topRow}>
            <h1 style={title}>Community 🌍</h1>
            <span style={postBtn}>✏️ Post</span>
          </div>
        </header>

        <section style={feed}>
          <PostCard
            username="@jasmine_k"
            time="2h ago"
            text="Day 30 of no smoking!! 🎉🔥 Never thought I'd make it this far. NovaTrack kept me going!"
            streakBadge="30-day streak"
            claps={42}
            comments={8}
          />

          <PostCard
            username="@marcus_fit"
            time="5h ago"
            text="Week 2 of morning runs ✅🟢 Feeling stronger every day. Who else is building this habit?"
            claps={27}
            comments={5}
          />
        </section>
      </div>
    </main>
  );
}

