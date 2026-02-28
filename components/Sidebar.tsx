"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gauge,
  Zap,
  ListTodo,
  Clapperboard,
  Brain,
  Share2,
  Settings as SettingsIcon,
  Activity,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Command Center", icon: Gauge },
  { href: "/productivity", label: "Productivity", icon: Zap },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/content", label: "Content Intel", icon: Clapperboard },
  { href: "/brain", label: "Second Brain", icon: Brain },
  { href: "/connections", label: "Connections", icon: Share2 },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

function AgentStatus() {
  const agent = useQuery(api.agents.list)?.['0'];
  const isOnline = agent?.status === "online";
  
  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-[var(--bg-card)]/60 p-4">
      <div className="flex items-center gap-3">
        <span className="relative inline-flex h-3 w-3">
          {isOnline && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-brand-green)] opacity-75" />
          )}
          <span 
            className={`relative inline-flex h-3 w-3 rounded-full ${isOnline ? "bg-[var(--color-brand-green)]" : "bg-red-500"}`}
          />
        </span>
        <div className="text-xs uppercase tracking-[0.2em] text-muted">
          {agent?.name ?? "Agent Offline"}
        </div>
      </div>
      <div className="mt-3 text-sm text-secondary">
        {agent ? `Last ping ${Math.floor((Date.now() - agent.lastSeen) / 1000 / 60)}m ago` : "No signal"}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const runHealthCheck = useMutation(api.agents.healthCheck);
  const runBrief = useMutation(api.actions.runBrief);
  
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (action: "heartbeat" | "brief") => {
    try {
      setLoading(action);
      if (action === "heartbeat") {
        await runHealthCheck({
          name: "Circus Cruz",
          role: "Walrus of Whimsy",
          emoji: "🦭",
        });
      } else {
        await runBrief({});
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-white/5 bg-[var(--bg-sidebar)]/95 px-5 py-6">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand-blue)]/20 to-[var(--color-brand-green)]/20 text-2xl">
            🦭
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-secondary">Mission Control</p>
            <p className="text-xs text-muted">v0.1 • Walrus Edition</p>
          </div>
        </div>
        <AgentStatus />
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-white/10"
                  : "text-secondary border border-transparent hover:border-white/5 hover:bg-[var(--bg-card)]/80"
              }`}
            >
              <Icon
                size={18}
                className={
                  isActive ? "text-[var(--color-brand-orange)]" : "text-muted group-hover:text-[var(--text-primary)]"
                }
              />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-4">
        <div className="rounded-xl border border-white/10 bg-[var(--bg-card)]/70 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Quick Actions</p>
          <div className="mt-3 space-y-2">
            <button 
              disabled={!!loading}
              onClick={() => handleAction("heartbeat")}
              className="w-full rounded-lg border border-white/10 bg-[var(--bg-hover)]/70 px-3 py-2 text-left text-sm text-secondary transition hover:border-white/20 hover:text-[var(--text-primary)] disabled:opacity-50"
            >
              {loading === "heartbeat" ? "Sending..." : "Send Heartbeat"}
            </button>
            <button 
              disabled={!!loading}
              onClick={() => handleAction("brief")}
              className="w-full rounded-lg border border-white/10 bg-[var(--bg-hover)]/70 px-3 py-2 text-left text-sm text-secondary transition hover:border-white/20 hover:text-[var(--text-primary)] disabled:opacity-50"
            >
              {loading === "brief" ? "Running..." : "Run Daily Brief"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
