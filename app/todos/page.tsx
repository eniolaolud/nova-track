"use client";

import { createClient } from "@/lib/supabase/client";
import { Calendar, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import * as React from "react";

const PURPLE = "#7C5CBF";
const LAVENDER = "#EDE7F6";

type TodoItem = {
  id: string;
  title: string;
  due_date: string | null;
  due_time: string | null;
  completed: boolean;
  google_event_id?: string | null;
  google_calendar_id?: string | null;
};

type TodoRowProps = {
  title: string;
  time: string;
  completed?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
};

function TodoRow({
  title,
  time,
  completed = false,
  onToggle,
  onDelete,
}: TodoRowProps) {
  const row: React.CSSProperties = {
    background: "white",
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(124, 92, 191, 0.10)",
    boxShadow: "0 10px 24px rgba(45, 33, 69, 0.06)",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  };

  const checkboxWrap: React.CSSProperties = {
    width: 22,
    height: 22,
    flex: "0 0 auto",
    marginTop: 1,
    position: "relative",
  };

  const checkbox: React.CSSProperties = {
    width: 22,
    height: 22,
    borderRadius: 7,
    border: completed
      ? `2px solid ${PURPLE}`
      : "2px solid rgba(45, 33, 69, 0.18)",
    background: completed ? PURPLE : "white",
    display: "grid",
    placeItems: "center",
    appearance: "none",
    WebkitAppearance: "none",
    outline: "none",
    cursor: "pointer",
    margin: 0,
  };

  const checkMark: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    opacity: completed ? 1 : 0,
  };

  const textWrap: React.CSSProperties = {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 15,
    fontWeight: 900,
    color: "#2D2145",
    letterSpacing: "-0.01em",
    lineHeight: 1.25,
    textDecoration: completed ? "line-through" : "none",
    opacity: completed ? 0.75 : 1,
  };

  const timeStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 13,
    color: "rgba(45, 33, 69, 0.7)",
  };

  const deleteBtn: React.CSSProperties = {
    marginLeft: "auto",
    border: "none",
    background: "rgba(192, 57, 43, 0.08)",
    color: "#C0392B",
    borderRadius: 10,
    width: 34,
    height: 34,
    flex: "0 0 auto",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <div style={row}>
      <div style={checkboxWrap}>
        <input
          type="checkbox"
          checked={completed}
          onChange={onToggle}
          aria-label={completed ? "Completed" : "Not completed"}
          style={checkbox}
        />
        <span style={checkMark} aria-hidden="true">
          <Check size={14} strokeWidth={3} color="white" />
        </span>
      </div>
      <div style={textWrap}>
        <p style={titleStyle}>{title}</p>
        <p style={timeStyle}>{time}</p>
      </div>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${title}`}
        style={deleteBtn}
      >
        <Trash2 size={16} strokeWidth={2.25} />
      </button>
    </div>
  );
}

export default function TodosPage() {
  const [todos, setTodos] = React.useState<TodoItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [calendarConnected, setCalendarConnected] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function loadTodos() {
      setLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const [{ data, error: fetchError }, auth] = await Promise.all([
          supabase
            .from("todos")
            .select(
              "id, title, due_date, due_time, completed, google_event_id, google_calendar_id",
            )
            .order("created_at", { ascending: false }),
          supabase.auth.getUser(),
        ]);

        if (cancelled) return;

        if (fetchError) {
          setError(fetchError.message);
          setTodos([]);
        } else {
          setTodos((data as TodoItem[]) ?? []);
        }

        const userId = auth.data.user?.id;
        if (userId) {
          const { data: token } = await supabase
            .from("google_calendar_tokens")
            .select("user_id")
            .eq("user_id", userId)
            .maybeSingle();
          if (!cancelled) setCalendarConnected(Boolean(token));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load tasks.");
          setTodos([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTodos();
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggleCompleted(todo: TodoItem) {
    const nextValue = !todo.completed;

    // Optimistic UI update (feels instant)
    setTodos((prev) =>
      prev.map((t) => (t.id === todo.id ? { ...t, completed: nextValue } : t)),
    );

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("todos")
      .update({ completed: nextValue })
      .eq("id", todo.id);

    if (updateError) {
      // Revert if save fails
      setTodos((prev) =>
        prev.map((t) =>
          t.id === todo.id ? { ...t, completed: todo.completed } : t,
        ),
      );
      setError(updateError.message);
    }
  }

  async function deleteTodo(todo: TodoItem) {
    const confirmed = window.confirm(
      `Delete "${todo.title}"? This also removes it from Google Calendar if linked.`,
    );
    if (!confirmed) return;

    const previous = todos;
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    setError(null);

    try {
      // Always ask the server first (it looks up the Google event id)
      const calRes = await fetch("/api/google/delete-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          todoId: todo.id,
          eventId: todo.google_event_id,
          calendarId: todo.google_calendar_id,
        }),
      });

      const calPayload = (await calRes.json()) as {
        ok?: boolean;
        error?: string;
        skipped?: boolean;
      };

      if (!calRes.ok && !calPayload.skipped) {
        setTodos(previous);
        setError(
          calPayload.error ||
            "Could not remove the Google Calendar event. Task was not deleted.",
        );
        return;
      }

      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from("todos")
        .delete()
        .eq("id", todo.id);

      if (deleteError) {
        setTodos(previous);
        setError(deleteError.message);
      }
    } catch (err) {
      setTodos(previous);
      setError(err instanceof Error ? err.message : "Could not delete task.");
    }
  }

  // Group tasks by due_date text (simple for learning)
  const grouped = React.useMemo(() => {
    const map = new Map<string, TodoItem[]>();
    for (const todo of todos) {
      const key = todo.due_date?.trim() || "No due date";
      const list = map.get(key) ?? [];
      list.push(todo);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [todos]);

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

  const topBarRow: React.CSSProperties = {
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

  const addBtn: React.CSSProperties = {
    height: 32,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid rgba(255, 255, 255, 0.40)",
    background: "rgba(255, 255, 255, 0.18)",
    color: "white",
    fontWeight: 900,
    fontSize: 13,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
  };

  const body: React.CSSProperties = {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

  const banner: React.CSSProperties = {
    background: LAVENDER,
    border: "1px solid rgba(124, 92, 191, 0.16)",
    borderRadius: 16,
    padding: "12px 14px",
    color: "#2D2145",
    fontWeight: 850,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  };

  const sectionLabel: React.CSSProperties = {
    margin: "4px 0 0",
    fontSize: 14,
    fontWeight: 950,
    color: "#2D2145",
    letterSpacing: "-0.01em",
  };

  const list: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 10,
  };

  const sectionCard: React.CSSProperties = {
    background: "transparent",
    borderRadius: 18,
  };

  const empty: React.CSSProperties = {
    background: "white",
    borderRadius: 18,
    padding: 18,
    border: "1px solid rgba(124, 92, 191, 0.10)",
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

  return (
    <main style={page}>
      <div style={container}>
        <header style={topBar}>
          <div style={topBarRow}>
            <h1 style={title}>To-Do List</h1>
            <Link href="/todos/add" style={addBtn}>
              + Add
            </Link>
          </div>
        </header>

        <section style={body}>
          <div style={banner}>
            <Calendar
              size={16}
              strokeWidth={2.25}
              color={PURPLE}
              aria-hidden="true"
            />
            <span>
              {calendarConnected
                ? "Google Calendar connected"
                : "Google Calendar not connected — connect in Profile"}
            </span>
          </div>

          {error ? <p style={errorBox}>{error}</p> : null}

          {loading ? (
            <p style={empty}>Loading your tasks...</p>
          ) : todos.length === 0 ? (
            <p style={empty}>
              No tasks yet. Tap <strong>+ Add</strong> to create one.
            </p>
          ) : (
            grouped.map(([dueDate, items]) => (
              <div key={dueDate} style={sectionCard}>
                <p style={sectionLabel}>{dueDate}</p>
                <div style={list} aria-label={`Tasks for ${dueDate}`}>
                  {items.map((todo) => (
                    <TodoRow
                      key={todo.id}
                      title={todo.title}
                      time={todo.due_time || "No time set"}
                      completed={todo.completed}
                      onToggle={() => toggleCompleted(todo)}
                      onDelete={() => deleteTodo(todo)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
