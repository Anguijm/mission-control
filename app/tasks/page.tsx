"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  KanbanSquare,
  History,
  MoreHorizontal,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
} from "lucide-react";

type TaskStatus = "todo" | "in-progress" | "done";
type Priority = "low" | "medium" | "high";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  tag: string;
}

const MOCK_TASKS: Task[] = [
  { id: "1", title: "Review Q1 Strategy", status: "todo", priority: "high", tag: "Strategy" },
  { id: "2", title: "Update Agent Memory Schema", status: "in-progress", priority: "medium", tag: "Dev" },
  { id: "3", title: "Sync Notion Docs", status: "done", priority: "low", tag: "Ops" },
  { id: "4", title: "Write Weekly Brief", status: "todo", priority: "medium", tag: "Content" },
];

const STATUS_CONFIG = {
  todo: { label: "To Do", color: "bg-zinc-800", icon: Circle },
  "in-progress": { label: "In Progress", color: "bg-blue-500/10 text-blue-400", icon: Clock },
  done: { label: "Complete", color: "bg-green-500/10 text-green-400", icon: CheckCircle2 },
};

const PRIORITY_COLORS = {
  low: "bg-blue-400",
  medium: "bg-yellow-400",
  high: "bg-red-400",
};

export default function TasksPage() {
  const [view, setView] = useState<"human" | "agent">("human");
  const activities = useQuery(api.activities.list, { limit: 50 });

  return (
    <div className="flex h-full flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks & Projects</h1>
          <p className="text-secondary">Manage your work alongside your agent's operations.</p>
        </div>
        <div className="flex rounded-xl border border-white/10 bg-[var(--bg-card)] p-1">
          <button
            onClick={() => setView("human")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              view === "human"
                ? "bg-[var(--bg-elevated)] text-white shadow-sm"
                : "text-secondary hover:text-white"
            }`}
          >
            <KanbanSquare size={16} />
            My Tasks
          </button>
          <button
            onClick={() => setView("agent")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              view === "agent"
                ? "bg-[var(--bg-elevated)] text-white shadow-sm"
                : "text-secondary hover:text-white"
            }`}
          >
            <History size={16} />
            Agent Actions
          </button>
        </div>
      </header>

      {view === "human" ? (
        <div className="grid h-full grid-cols-1 gap-6 overflow-hidden lg:grid-cols-3">
          {(["todo", "in-progress", "done"] as TaskStatus[]).map((status) => (
            <div key={status} className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-[var(--bg-card)]/50 p-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-md ${STATUS_CONFIG[status].color}`}>
                    {(() => {
                      const Icon = STATUS_CONFIG[status].icon;
                      return <Icon size={14} />;
                    })()}
                  </div>
                  <span className="text-sm font-semibold text-secondary">{STATUS_CONFIG[status].label}</span>
                  <span className="ml-2 rounded-full bg-[var(--bg-hover)] px-2 py-0.5 text-xs text-muted">
                    {MOCK_TASKS.filter((t) => t.status === status).length}
                  </span>
                </div>
                <button className="text-muted hover:text-white">
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
                {MOCK_TASKS.filter((t) => t.status === status).map((task) => (
                  <div
                    key={task.id}
                    className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-white/5 bg-[var(--bg-card)] p-4 shadow-sm transition hover:border-white/10 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-medium text-muted">{task.tag}</span>
                      <button className="opacity-0 transition-opacity group-hover:opacity-100">
                        <MoreHorizontal size={16} className="text-muted" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{task.title}</p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${PRIORITY_COLORS[task.priority]}`}
                        title={`Priority: ${task.priority}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden rounded-2xl border border-white/5 bg-[var(--bg-card)]">
          <div className="border-b border-white/5 px-6 py-4">
            <h2 className="text-lg font-semibold">Activity Log</h2>
          </div>
          <div className="h-full overflow-y-auto p-4">
            <div className="space-y-1">
              {activities?.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-[var(--bg-hover)]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-hover)] text-lg">
                    {activity.type === "message" ? "💬" : activity.type === "tool" ? "🛠️" : "⚡"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">{activity.action}</span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                        {activity.type}
                      </span>
                    </div>
                    <p className="text-xs text-secondary">{activity.details}</p>
                  </div>
                  <span className="text-xs text-muted font-mono">
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {!activities && <div className="p-8 text-center text-muted">Loading logs...</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
