"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

const typeColors: Record<string, string> = {
  message: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  file: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  exec: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  web: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  cron: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  tool: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  system: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
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

const types = ["all", "message", "file", "exec", "web", "cron", "tool", "system"];

function formatDateTime(ts: number) {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
  };
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

export default function ActivityPage() {
  const [filter, setFilter] = useState("all");
  const activities = useQuery(api.activities.list, {
    limit: 100,
    type: filter === "all" ? undefined : filter,
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">Activity Feed</h1>
        <p className="text-zinc-500 mt-1">Every action, every task, every moment</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === t
                ? "bg-zinc-700 text-zinc-100 font-medium"
                : "bg-zinc-900 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            {t === "all" ? "All" : (
              <span className="flex items-center gap-1.5">
                <span>{typeIcons[t]}</span>
                <span className="capitalize">{t}</span>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[23px] top-0 bottom-0 w-px bg-zinc-800" />

        {activities === undefined ? (
          <div className="text-zinc-600 text-sm p-8">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="text-zinc-600 text-sm p-8">No activities found.</div>
        ) : (
          <div className="space-y-6">
            {activities.map((a, i) => {
              const { date, time } = formatDateTime(a.timestamp);
              return (
                <div key={a._id} className="relative pl-12 animate-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
                  {/* Timeline dot */}
                  <div className="absolute left-[18px] top-5 w-[11px] h-[11px] rounded-full border-2 border-zinc-700 bg-zinc-900 z-10" />

                  <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:border-zinc-700/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-lg">{typeIcons[a.type] ?? "📌"}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${typeColors[a.type] ?? typeColors.system}`}>
                            {a.type}
                          </span>
                          <span className="text-xs text-zinc-600">{formatRelative(a.timestamp)}</span>
                        </div>
                        <p className="text-sm font-semibold text-zinc-200 mb-1">{a.action}</p>
                        <p className="text-sm text-zinc-400 leading-relaxed">{a.details}</p>
                        {a.metadata && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {Object.entries(a.metadata as Record<string, unknown>).slice(0, 4).map(([k, v]) => (
                              <span key={k} className="text-xs bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded font-mono">
                                {k}: {String(v).substring(0, 30)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-zinc-600">{date}</p>
                        <p className="text-xs text-zinc-500 font-mono">{time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
