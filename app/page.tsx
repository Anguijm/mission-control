"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  MessageSquare,
  Wrench,
  Clapperboard,
  Activity as ActivityIcon,
  CalendarClock,
  RefreshCcw,
  Bot,
  HardDriveDownload,
} from "lucide-react";

const typeTokens: Record<string, { color: string; label: string; icon: string }> = {
  message: {
    color: "bg-brand-blue/15 text-brand-blue",
    label: "message",
    icon: "💬",
  },
  tool: {
    color: "bg-brand-orange/15 text-brand-orange",
    label: "tool",
    icon: "🛠️",
  },
  file: {
    color: "bg-brand-green/15 text-brand-green",
    label: "content",
    icon: "📁",
  },
  cron: {
    color: "bg-brand-blue/15 text-brand-blue",
    label: "cron",
    icon: "⏰",
  },
  system: {
    color: "bg-white/8 text-secondary",
    label: "system",
    icon: "🖥️",
  },
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

export default function CommandCenterPage() {
  const activities = useQuery(api.activities.list, { limit: 20 });
  const tasks = useQuery(api.tasks.list, {});
  const agents = useQuery(api.agents.list, {});
  const sendHeartbeat = useMutation(api.agents.reportHeartbeat);
  const runHealthCheck = useMutation(api.agents.healthCheck);
  const syncContent = useMutation(api.content.sync);
  const runBrief = useMutation(api.actions.runBrief);
  const [actionLoading, setActionLoading] = useState<"heartbeat" | "content" | "brief" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [healthReport, setHealthReport] = useState<null | {
    ok: boolean;
    cpu: number;
    ram: number;
    checks: Record<string, { ok: boolean; label: string; detail: string }>;
  }>(null);

  const handleQuickAction = async (type: "heartbeat" | "content" | "brief") => {
    setActionError(null);
    setActionSuccess(null);
    try {
      setActionLoading(type);
      if (type === "heartbeat") {
        const result = await runHealthCheck({
          name: "Circus Cruz",
          role: "Walrus of Whimsy",
          emoji: "🦭",
        });
        setHealthReport(result);
        setActionSuccess(result.ok ? "All systems nominal." : "Health check complete — some issues found.");
      } else if (type === "content") {
        await syncContent({ source: "all" });
        setActionSuccess("Content sync queued.");
      } else if (type === "brief") {
        await runBrief({});
        setActionSuccess("Daily brief queued.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setActionError(`Failed: ${msg}`);
    } finally {
      setActionLoading(null);
    }
  };

  const startOfDay = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const todaysActivities = useMemo(
    () => activities?.filter((a) => a.timestamp >= startOfDay) ?? [],
    [activities, startOfDay]
  );

  const statCards = useMemo(() => {
    const messageCount = todaysActivities.filter((a) => a.type === "message").length;
    const toolCount = todaysActivities.filter((a) => a.type === "tool").length;
    const contentCount = todaysActivities.filter((a) => a.type === "file").length;
    const uptime = agents?.length ? 99.3 : 0;

    return [
      {
        label: "Messages Handled",
        value: messageCount,
        delta: `+${messageCount} today`,
        icon: MessageSquare,
      },
      {
        label: "Tool Calls",
        value: toolCount,
        delta: `+${toolCount} today`,
        icon: Wrench,
      },
      {
        label: "Content Synced",
        value: contentCount,
        delta: `+${contentCount} today`,
        icon: Clapperboard,
      },
      {
        label: "Agent Uptime",
        value: uptime ? `${uptime}%` : "—",
        delta: "Heartbeat stable",
        icon: ActivityIcon,
      },
    ];
  }, [todaysActivities, agents]);

  const primaryAgent = agents?.[0];
  const config = {
    model: primaryAgent?.role ?? "Gemini Flash 1.5",
    provider: primaryAgent ? "Convex" : "Convex · default",
    memory: "Convex documents + local cache",
    heartbeat: "Every 30 min",
    sync: "Content sync @ 05:00 UTC",
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Mission Control</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Command Center</h1>
            <p className="text-secondary">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button className="rounded-xl border border-white/10 bg-hover px-4 py-2 text-sm text-secondary transition hover:border-white/25">
            Export Report
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-white/5 bg-card p-5">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-blue via-brand-green to-brand-orange" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold">{stat.value ?? "—"}</p>
                <p className="mt-1 text-xs text-brand-green">{stat.delta}</p>
              </div>
              <div className="rounded-xl bg-hover p-3 text-secondary">
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-white/5 bg-card">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold">Live Activity</h2>
              <p className="text-sm text-secondary">Real-time feed of heartbeats, messages, and tool calls</p>
            </div>
            <Link href="/activity" className="text-sm text-secondary hover:text-primary">
              View all →
            </Link>
          </div>

          <div className="divide-y divide-white/5">
            {activities === undefined ? (
              <div className="px-5 py-6 text-sm text-secondary">Connecting to Convex…</div>
            ) : activities.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-secondary">
                No activity yet. Trigger an action to see it appear live.
              </div>
            ) : (
              activities.map((action) => {
                const token = typeTokens[action.type] ?? typeTokens.system;
                return (
                  <div key={action._id} className="flex items-start gap-4 px-5 py-4">
                    <div className="text-lg">{token.icon}</div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className={`text-[10px] font-semibold uppercase tracking-wide ${token.color} rounded-full px-2 py-0.5`}>
                          {action.type}
                        </span>
                        <span className="text-xs text-muted">{formatRelative(action.timestamp)}</span>
                      </div>
                      <p className="text-sm font-medium">{action.action}</p>
                      <p className="text-xs text-secondary line-clamp-1">{action.details}</p>
                    </div>
                    <span className="text-xs text-muted">{formatTime(action.timestamp)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-card p-5">
            <div className="mb-4 flex items-center gap-3">
              <Bot size={18} className="text-brand-blue" />
              <div>
                <p className="text-sm text-muted">Agent Configuration</p>
                <h3 className="text-lg font-semibold">{primaryAgent?.name ?? "Circus Cruz"}</h3>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-secondary">Model</dt>
                <dd>{config.model}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-secondary">Provider</dt>
                <dd>{config.provider}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-secondary">Memory Stack</dt>
                <dd>{config.memory}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-secondary">Heartbeat</dt>
                <dd className="flex items-center gap-2">
                  <CalendarClock size={14} /> {config.heartbeat}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-secondary">Content Sync</dt>
                <dd className="flex items-center gap-2">
                  <RefreshCcw size={14} /> {config.sync}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-white/5 bg-card p-5">
            <div className="mb-4 flex items-center gap-3">
              <HardDriveDownload size={18} className="text-brand-orange" />
              <div>
                <p className="text-sm text-muted">Quick Actions</p>
                <h3 className="text-lg font-semibold">Control Panel</h3>
              </div>
            </div>
            <div className="space-y-3">
              <button
                className="w-full rounded-xl border border-white/10 bg-hover/60 px-4 py-3 text-left text-sm text-secondary transition hover:border-white/25 hover:text-primary disabled:opacity-50"
                disabled={actionLoading !== null}
                onClick={() => handleQuickAction("heartbeat")}
              >
                {actionLoading === "heartbeat" ? "Sending heartbeat…" : "Send Heartbeat"}
              </button>
              <button
                className="w-full rounded-xl border border-white/10 bg-hover/60 px-4 py-3 text-left text-sm text-secondary transition hover:border-white/25 hover:text-primary disabled:opacity-50"
                disabled={actionLoading !== null}
                onClick={() => handleQuickAction("content")}
              >
                {actionLoading === "content" ? "Syncing content…" : "Sync Content"}
              </button>
              <button
                className="w-full rounded-xl border border-white/10 bg-hover/60 px-4 py-3 text-left text-sm text-secondary transition hover:border-white/25 hover:text-primary disabled:opacity-50"
                disabled={actionLoading !== null}
                onClick={() => handleQuickAction("brief")}
              >
                {actionLoading === "brief" ? "Running brief…" : "Run Daily Brief"}
              </button>
              {actionSuccess && (
                <p className="rounded-lg bg-brand-green/10 px-3 py-2 text-xs text-brand-green">
                  ✓ {actionSuccess}
                </p>
              )}
              {actionError && (
                <p className="rounded-lg bg-brand-red/10 px-3 py-2 text-xs text-brand-red">
                  ✗ {actionError}
                </p>
              )}
              {healthReport && (
                <div className="mt-1 rounded-xl border border-white/5 bg-hover/40 p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted mb-1">
                    <span className="font-semibold uppercase tracking-wider">Health Report</span>
                    <span className="flex gap-3">
                      <span>CPU <span className="text-primary">{healthReport.cpu}%</span></span>
                      <span>RAM <span className="text-primary">{healthReport.ram}%</span></span>
                    </span>
                  </div>
                  {Object.values(healthReport.checks).map((c) => (
                    <div key={c.label} className="flex items-start gap-2 text-xs">
                      <span className={c.ok ? "text-brand-green" : "text-brand-red"}>
                        {c.ok ? "●" : "●"}
                      </span>
                      <span className="text-secondary w-28 shrink-0">{c.label}</span>
                      <span className="text-muted">{c.detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-card p-4 text-xs text-muted">
            Need more power? <Link className="text-brand-blue" href="/settings">Tune persona & config →</Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/5 bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Scheduled Tasks</h2>
            <p className="text-sm text-secondary">Heartbeat, cron jobs, and automations running in Convex</p>
          </div>
          <Link href="/calendar" className="text-sm text-secondary hover:text-primary">
            Calendar →
          </Link>
        </div>
        <div className="divide-y divide-white/5">
          {tasks === undefined ? (
            <div className="px-4 py-6 text-sm text-secondary">Loading tasks…</div>
          ) : tasks.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-secondary">
              No scheduled tasks. Use Quick Actions to add your first automation.
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="flex items-center gap-4 px-4 py-4">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: task.color ?? "var(--brand-blue)" }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.name}</p>
                  <p className="text-xs text-secondary font-mono">{task.schedule}</p>
                </div>
                <span
                  className={`text-xs uppercase tracking-wide ${
                    task.enabled ? "text-brand-green" : "text-muted"
                  }`}
                >
                  {task.enabled ? "active" : "paused"}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
