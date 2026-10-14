"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Globe,
  MessageCircle,
  PenLine,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import * as React from "react";

const PURPLE = "#7C5CBF";
const LAVENDER = "#EDE7F6";

type FeedPost = {
  id: string;
  content: string;
  streak_badge: string | null;
  claps_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  username: string;
  full_name: string;
  clapped: boolean;
};

type CommentRow = {
  id: string;
  content: string;
  created_at: string;
  username: string;
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommunityPage() {
  const [posts, setPosts] = React.useState<FeedPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [streakBadge, setStreakBadge] = React.useState("");
  const [posting, setPosting] = React.useState(false);
  const [expandedPostId, setExpandedPostId] = React.useState<string | null>(null);
  const [comments, setComments] = React.useState<Record<string, CommentRow[]>>({});
  const [commentDrafts, setCommentDrafts] = React.useState<Record<string, string>>({});
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  const loadFeed = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);

      const { data: postRows, error: postsError } = await supabase
        .from("posts")
        .select("id, content, streak_badge, claps_count, comments_count, created_at, user_id")
        .order("created_at", { ascending: false });

      if (postsError) {
        setError(postsError.message);
        setPosts([]);
        setLoading(false);
        return;
      }

      const rows = postRows ?? [];
      const userIds = [...new Set(rows.map((p) => p.user_id))];

      const [{ data: profiles }, { data: myClaps }] = await Promise.all([
        userIds.length
          ? supabase.from("profiles").select("id, username, full_name").in("id", userIds)
          : Promise.resolve({ data: [] as { id: string; username: string | null; full_name: string | null }[] }),
        user
          ? supabase.from("post_claps").select("post_id").eq("user_id", user.id)
          : Promise.resolve({ data: [] as { post_id: string }[] }),
      ]);

      const profileMap = new Map(
        (profiles ?? []).map((p) => [p.id, p] as const),
      );
      const clappedSet = new Set((myClaps ?? []).map((c) => c.post_id));

      const feed: FeedPost[] = rows.map((p) => {
        const profile = profileMap.get(p.user_id);
        return {
          ...p,
          username: profile?.username ? `@${profile.username}` : "@user",
          full_name: profile?.full_name || "NovaTrack User",
          clapped: clappedSet.has(p.id),
        };
      });

      setPosts(feed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load community.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  async function handleCreatePost() {
    if (!draft.trim()) {
      setError("Write something before posting.");
      return;
    }

    setPosting(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please log in to post.");
      setPosting(false);
      return;
    }

    const { error: insertError } = await supabase.from("posts").insert({
      user_id: user.id,
      content: draft.trim(),
      streak_badge: streakBadge.trim() || null,
    });

    setPosting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setDraft("");
    setStreakBadge("");
    setComposerOpen(false);
    await loadFeed();
  }

  async function handleDeletePost(post: FeedPost) {
    if (!currentUserId || post.user_id !== currentUserId) {
      setError("You can only delete your own posts.");
      return;
    }

    const confirmed = window.confirm("Delete this post? This can't be undone.");
    if (!confirmed) return;

    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id)
      .eq("user_id", currentUserId);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    if (expandedPostId === post.id) setExpandedPostId(null);
  }

  async function handleClap(post: FeedPost) {
    if (!currentUserId) {
      setError("Please log in to clap.");
      return;
    }

    const supabase = createClient();

    if (post.clapped) {
      // remove clap
      const { error: delError } = await supabase
        .from("post_claps")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", currentUserId);

      if (delError) {
        setError(delError.message);
        return;
      }

      await supabase
        .from("posts")
        .update({ claps_count: Math.max(0, post.claps_count - 1) })
        .eq("id", post.id);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                clapped: false,
                claps_count: Math.max(0, p.claps_count - 1),
              }
            : p,
        ),
      );
      return;
    }

    const { error: clapError } = await supabase.from("post_claps").insert({
      post_id: post.id,
      user_id: currentUserId,
    });

    if (clapError) {
      setError(clapError.message);
      return;
    }

    await supabase
      .from("posts")
      .update({ claps_count: post.claps_count + 1 })
      .eq("id", post.id);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, clapped: true, claps_count: p.claps_count + 1 }
          : p,
      ),
    );
  }

  async function loadComments(postId: string) {
    const supabase = createClient();
    const { data, error: commentsError } = await supabase
      .from("post_comments")
      .select("id, content, created_at, user_id")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (commentsError) {
      setError(commentsError.message);
      return;
    }

    const rows = data ?? [];
    const userIds = [...new Set(rows.map((c) => c.user_id))];
    const { data: profiles } = userIds.length
      ? await supabase.from("profiles").select("id, username").in("id", userIds)
      : { data: [] as { id: string; username: string | null }[] };

    const map = new Map((profiles ?? []).map((p) => [p.id, p.username]));
    setComments((prev) => ({
      ...prev,
      [postId]: rows.map((c) => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        username: map.get(c.user_id) ? `@${map.get(c.user_id)}` : "@user",
      })),
    }));
  }

  async function toggleComments(postId: string) {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);
    await loadComments(postId);
  }

  async function handleAddComment(postId: string) {
    const text = (commentDrafts[postId] || "").trim();
    if (!text) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please log in to comment.");
      return;
    }

    const { error: insertError } = await supabase.from("post_comments").insert({
      post_id: postId,
      user_id: user.id,
      content: text,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    const post = posts.find((p) => p.id === postId);
    if (post) {
      await supabase
        .from("posts")
        .update({ comments_count: post.comments_count + 1 })
        .eq("id", postId);
    }

    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p,
      ),
    );
    await loadComments(postId);
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

  const titleRow: React.CSSProperties = {
    margin: 0,
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: "-0.01em",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const postBtn: React.CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 900,
    color: "white",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: 999,
    padding: "8px 12px",
    cursor: "pointer",
  };

  const feed: React.CSSProperties = {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  };

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

  const empty: React.CSSProperties = {
    ...card,
    color: "rgba(45, 33, 69, 0.75)",
    fontSize: 14,
    lineHeight: 1.5,
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

  const input: React.CSSProperties = {
    width: "100%",
    borderRadius: 12,
    border: "1.5px solid #E6DDF7",
    background: "#FAF7FF",
    padding: "12px 14px",
    fontSize: 14,
    color: "#2D2145",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const primaryBtn: React.CSSProperties = {
    height: 44,
    borderRadius: 12,
    border: "none",
    background: PURPLE,
    color: "white",
    fontWeight: 900,
    cursor: "pointer",
  };

  return (
    <main style={page}>
      <div style={container}>
        <header style={topBar}>
          <div style={topRow}>
            <h1 style={titleRow}>
              <span>Community</span>
              <Globe size={18} strokeWidth={2.25} aria-hidden="true" />
            </h1>
            <button type="button" style={postBtn} onClick={() => setComposerOpen(true)}>
              <PenLine size={15} strokeWidth={2.25} aria-hidden="true" />
              <span>Post</span>
            </button>
          </div>
        </header>

        <section style={feed}>
          {error ? <p style={errorBox}>{error}</p> : null}

          {composerOpen ? (
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ color: "#2D2145" }}>New post</strong>
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  style={{ border: "none", background: "transparent", cursor: "pointer" }}
                  aria-label="Close composer"
                >
                  <X size={18} />
                </button>
              </div>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Share a win, streak update, or tip..."
                rows={4}
                style={input}
              />
              <input
                value={streakBadge}
                onChange={(e) => setStreakBadge(e.target.value)}
                placeholder="Optional badge (e.g. 14-day streak)"
                style={input}
              />
              <button
                type="button"
                style={primaryBtn}
                onClick={handleCreatePost}
                disabled={posting}
              >
                {posting ? "Posting..." : "Share to Community"}
              </button>
            </div>
          ) : null}

          {loading ? (
            <p style={empty}>Loading community...</p>
          ) : posts.length === 0 ? (
            <p style={empty}>
              No posts yet. Tap <strong>Post</strong> and be the first to share.
            </p>
          ) : (
            posts.map((post) => (
              <article key={post.id} style={card}>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 999,
                        background: "#D8D8D8",
                      }}
                      aria-hidden="true"
                    />
                    <div>
                      <p style={{ margin: 0, fontWeight: 900, color: "#2D2145" }}>
                        {post.username}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: "rgba(45,33,69,0.64)",
                        }}
                      >
                        {timeAgo(post.created_at)}
                      </p>
                    </div>
                  </div>

                  {currentUserId === post.user_id ? (
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post)}
                      aria-label="Delete post"
                      style={{
                        border: "none",
                        background: "rgba(192, 57, 43, 0.08)",
                        color: "#C0392B",
                        borderRadius: 10,
                        width: 34,
                        height: 34,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={16} strokeWidth={2.25} />
                    </button>
                  ) : null}
                </div>

                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "rgba(45,33,69,0.9)" }}>
                  {post.content}
                </p>

                {post.streak_badge ? (
                  <span
                    style={{
                      alignSelf: "flex-start",
                      padding: "7px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 900,
                      color: PURPLE,
                      background: LAVENDER,
                      border: "1px solid rgba(124, 92, 191, 0.20)",
                    }}
                  >
                    {post.streak_badge}
                  </span>
                ) : null}

                <div style={{ display: "flex", gap: 14, fontWeight: 800, fontSize: 13 }}>
                  <button
                    type="button"
                    onClick={() => handleClap(post)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: post.clapped ? PURPLE : "rgba(45, 33, 69, 0.78)",
                      fontWeight: 800,
                      padding: 0,
                    }}
                  >
                    <ThumbsUp size={15} strokeWidth={2.25} />
                    <span>{post.claps_count}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleComments(post.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      color: "rgba(45, 33, 69, 0.78)",
                      fontWeight: 800,
                      padding: 0,
                    }}
                  >
                    <MessageCircle size={15} strokeWidth={2.25} />
                    <span>{post.comments_count}</span>
                  </button>
                </div>

                {expandedPostId === post.id ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(comments[post.id] ?? []).map((c) => (
                      <div
                        key={c.id}
                        style={{
                          background: "#FAF7FF",
                          borderRadius: 12,
                          padding: "10px 12px",
                          border: "1px solid #E6DDF7",
                        }}
                      >
                        <p style={{ margin: 0, fontWeight: 800, fontSize: 13, color: PURPLE }}>
                          {c.username}
                        </p>
                        <p style={{ margin: "4px 0 0", fontSize: 14, color: "#2D2145" }}>
                          {c.content}
                        </p>
                      </div>
                    ))}

                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        value={commentDrafts[post.id] || ""}
                        onChange={(e) =>
                          setCommentDrafts((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        placeholder="Write a comment..."
                        style={{ ...input, flex: 1 }}
                      />
                      <button
                        type="button"
                        style={{ ...primaryBtn, padding: "0 14px", height: 46 }}
                        onClick={() => handleAddComment(post.id)}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
