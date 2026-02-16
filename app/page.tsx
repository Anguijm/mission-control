"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

const typeColors: Record<string, string> = {
  message: "bg-blue-500/20 text-blue-400",
  file: "bg-amber-500/20 text-amber-400",
  exec: "bg-purple-500/20 text-purple-400",
  web: "bg-cyan-500/20 text-cyan-400",
  cron: "bg-emerald-500/20 text-emerald-400",
  tool: "bg-pink-500/20 text-pink-400",
  system: "bg-zinc-500/20 text-zinc-400",
};

const typeIcons: Record<string, string> = {
  message: "💬",
  file: "📄",
  exec: "⚙️",
  web: "🌐",
  cron: "⏰",
  tool: "🔧",
  system: "🖥️",
};

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatRelative(ts: number) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function DashboardPage() {
  const activities = useQuery(api.activities.list, { limit: 8 });
  const tasks = useQuery(api.tasks.list, {});
  const toggleTask = useMutation(api.tasks.toggle);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
        <p className="text-zinc-500 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Activities Today", value: activities?.length ?? "—", icon: "⚡" },
          { label: "Active Tasks", value: tasks?.filter((t) => t.enabled).length ?? "—", icon: "📋" },
          { label: "Channels", value: "2", icon: "📡" },
          { label: "Context", value: "33%", icon: "🧠" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-500 text-sm">{stat.label}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Recent Activity */}
        <div className="col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Link href="/activity" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {activities === undefined ? (
              <div className="p-5 text-zinc-600 text-sm">Loading...</div>
            ) : activities.length === 0 ? (
              <div className="p-5 text-zinc-600 text-sm">No activities yet. Seed the database to get started.</div>
            ) : (
              activities.map((a) => (
                <div key={a._id} className="p-4 flex items-start gap-3 animate-fade-in">
                  <span className="text-lg mt-0.5">{typeIcons[a.type] ?? "📌"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[a.type] ?? typeColors.system}`}>
                        {a.type}
                      </span>
                      <span className="text-xs text-zinc-600">{formatRelative(a.timestamp)}</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-200">{a.action}</p>
                    <p className="text-xs text-zinc-500 truncate">{a.details}</p>
                  </div>
                  <span className="text-xs text-zinc-700 whitespace-nowrap">{formatTime(a.timestamp)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Scheduled Tasks */}
        <div className="col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Scheduled Tasks</h2>
            <Link href="/calendar" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
              Calendar →
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {tasks === undefined ? (
              <div className="p-5 text-zinc-600 text-sm">Loading...</div>
            ) : tasks.length === 0 ? (
              <div className="p-5 text-zinc-600 text-sm">No scheduled tasks.</div>
            ) : (
              tasks.map((t) => (
                <div key={t._id} className="p-4 flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: t.color ?? "#6366f1" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200">{t.name}</p>
                    <p className="text-xs text-zinc-600 font-mono">{t.schedule}</p>
                  </div>
                  <span
                    onClick={() => toggleTask({ id: t._id })}
                    className={`cursor-pointer select-none text-xs px-2 py-0.5 rounded-full transition-colors ${
                      t.enabled
                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        : "bg-zinc-700/50 text-zinc-500 hover:bg-zinc-700/70"
                    }`}
                  >
                    {t.enabled ? "active" : "paused"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
