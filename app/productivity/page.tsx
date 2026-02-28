"use client";

import { useEffect, useMemo, useState, Dispatch, SetStateAction } from "react";
import { CheckCircle2, Flame, Percent, Target } from "lucide-react";

const TOTAL_DAYS = 90;
const PHASES = [
  { name: "Foundation", range: [1, 30] },
  { name: "Growth", range: [31, 60] },
  { name: "Scale", range: [61, 90] },
];

const MESSAGES = [
  { threshold: 0, text: "Suits on. Day one is the most important day." },
  { threshold: 5, text: "The foundation is being poured — keep the pace." },
  { threshold: 10, text: "Momentum feels good, doesn’t it?" },
  { threshold: 20, text: "Fueling up. You’re firmly in the habit zone." },
  { threshold: 30, text: "You’re no longer a beginner. Let’s keep going." },
  { threshold: 40, text: "Phase 2 is awakening. Growth is here." },
  { threshold: 55, text: "Mid-sprint energy: high. Don’t stop now." },
  { threshold: 70, text: "The finish line is now a plan, not a dream." },
  { threshold: 85, text: "You’re in the elite bracket. Just a bit more." },
  { threshold: 95, text: "Every day now is legendary status." },
];

type Todo = { id: string; text: string; done: boolean };

function useLocalState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : defaultValue;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default function ProductivityPage() {
  const [completedDays, setCompletedDays] = useLocalState<number[]>("mc:habit-days", []);
  const [todos, setTodos] = useLocalState<Todo[]>("mc:todos", []);
  const [notes, setNotes] = useLocalState<string[]>("mc:notes", ["", ""]);

  const [todayIndex, setTodayIndex] = useState(() => {
    const day = (new Date().getDay() + 1) % TOTAL_DAYS;
    return day;
  });

  useEffect(() => {
    // Real logic would map actual day count. For mock, randomize but stabilize.
    const start = new Date();
    const dayOfYear = Math.floor(
      (start.getTime() - new Date(start.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    setTodayIndex(Math.min(dayOfYear % TOTAL_DAYS, TOTAL_DAYS - 1));
  }, []);

  const stats = useMemo(() => {
    const daysCompleted = completedDays.length;
    const streak = completedDays
      .sort((a, b) => a - b)
      .reduce((streakCount, day, idx, arr) => {
        if (idx === 0) return day === todayIndex ? 1 : 0;
        const prev = arr[idx - 1];
        if (day === prev + 1) return streakCount + 1;
        if (day === todayIndex) return streakCount + 1;
        return streakCount;
      }, 0);
    const progress = Math.min(100, Math.round((daysCompleted / TOTAL_DAYS) * 100));
    const phase = PHASES.find(({ range }) => todayIndex + 1 >= range[0] && todayIndex + 1 <= range[1]);

    return {
      daysCompleted,
      streak,
      phase: phase?.name ?? "Foundation",
      progress,
    };
  }, [completedDays, todayIndex]);

  const motivational = useMemo(() => {
    const match = [...MESSAGES].reverse().find((msg) => stats.progress >= msg.threshold);
    return match?.text ?? MESSAGES[0].text;
  }, [stats.progress]);

  const toggleDay = (day: number) => {
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      done: false,
    };
    setTodos([newTodo, ...todos]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)));
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateNote = (index: number, text: string) => {
    setNotes((prev) => {
      const copy = [...prev];
      copy[index] = text;
      return copy;
    });
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Ritual Ops</p>
        <h1 className="text-3xl font-bold">Productivity</h1>
        <p className="text-secondary">Track streaks, habits, and the ritual phases that fuel your agent.</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Days Completed", value: stats.daysCompleted, icon: CheckCircle2 },
          { label: "Current Streak", value: stats.streak, icon: Flame },
          { label: "Current Phase", value: stats.phase, icon: Target },
          { label: "Progress", value: `${stats.progress}%`, icon: Percent },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{stat.label}</p>
              <stat.icon size={20} className="text-[var(--color-brand-blue)]" />
            </div>
            <p className="mt-4 text-3xl font-semibold">{stat.value}</p>
            <div className="mt-2 h-1 rounded-full bg-[var(--bg-hover)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand-blue)] via-[var(--color-brand-green)] to-[var(--color-brand-orange)]"
                style={{ width: stat.label === "Progress" ? `${stats.progress}%` : "100%" }}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_1fr]">
        <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">90-Day Habit Tracker</h2>
              <p className="text-sm text-secondary">Click each day to mark it complete. Today is highlighted.</p>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Phase {stats.phase}</p>
          </div>
          <div className="grid grid-cols-30 gap-2">
            {Array.from({ length: TOTAL_DAYS }, (_, idx) => {
              const dayNumber = idx + 1;
              const isToday = idx === todayIndex;
              const isComplete = completedDays.includes(idx);
              const phase = PHASES.find((p) => dayNumber >= p.range[0] && dayNumber <= p.range[1]);

              let bg = "bg-[var(--bg-hover)]";
              if (isComplete) bg = "bg-[var(--color-brand-green)]";
              else if (isToday) bg = "bg-[var(--color-brand-blue)]";

              return (
                <button
                  key={idx}
                  onClick={() => toggleDay(idx)}
                  className={`${bg} h-8 rounded-md text-[10px] font-semibold text-zinc-900 transition hover:opacity-80`}
                  title={`${phase?.name ?? "Foundation"} · Day ${dayNumber}`}
                >
                  {dayNumber}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-5">
            <p className="text-sm text-muted">Phase Breakdown</p>
            <ul className="mt-4 space-y-3 text-sm">
              {PHASES.map((phase) => (
                <li key={phase.name} className="flex items-center justify-between">
                  <span className="text-secondary">{phase.name}</span>
                  <span className="text-muted">Days {phase.range[0]}–{phase.range[1]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-5">
            <p className="text-sm text-muted">Motivation</p>
            <p className="mt-3 text-lg font-semibold">{motivational}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quick Todos</h2>
            <p className="text-xs text-muted">Local to this machine</p>
          </div>
          <TodoInput onAdd={addTodo} />
          <div className="mt-4 space-y-2">
            {todos.length === 0 && <p className="text-sm text-secondary">No tasks yet — add something small.</p>}
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onRemove={removeTodo} />
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {notes.map((note, idx) => (
            <div key={idx} className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-5">
              <p className="text-sm text-muted">Note {idx + 1}</p>
              <textarea
                value={note}
                onChange={(e) => updateNote(idx, e.target.value)}
                placeholder="Write anything your agent should remember about this sprint."
                className="mt-3 h-32 w-full resize-none rounded-xl border border-white/10 bg-transparent p-3 text-sm text-[var(--text-primary)] outline-none focus:border-white/20"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function TodoInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onAdd(text);
        setText("");
      }}
      className="flex gap-2"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a ritual or task"
        className="flex-1 rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-white/20"
      />
      <button
        type="submit"
        className="rounded-xl border border-white/10 bg-[var(--bg-hover)] px-3 py-2 text-sm text-secondary transition hover:border-white/20"
      >
        Add
      </button>
    </form>
  );
}

function TodoItem({
  todo,
  onToggle,
  onRemove,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[var(--bg-hover)]/60 px-3 py-2 text-sm text-secondary">
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.done}
          onChange={() => onToggle(todo.id)}
          className="h-4 w-4 rounded border-white/20 bg-transparent"
        />
        <span className={todo.done ? "line-through text-muted" : undefined}>{todo.text}</span>
      </label>
      <button className="text-xs text-muted" onClick={() => onRemove(todo.id)}>
        Remove
      </button>
    </div>
  );
}
