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
  Settings,
} from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

const navItems = [
  { href: "/", label: "Command Center", icon: Gauge },
  { href: "/productivity", label: "Productivity", icon: Zap },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/content", label: "Content Intel", icon: Clapperboard },
  { href: "/brain", label: "Second Brain", icon: Brain },
  { href: "/connections", label: "Connections", icon: Share2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

function AgentStatus() {
  return (
    <div className="mt-6 rounded-xl border border-white/10 bg-[var(--bg-card)]/60 p-4">
      <div className="flex items-center gap-3">
        <span className="relative inline-flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-brand-green)] opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--color-brand-green)]" />
        </span>
        <div className="text-xs uppercase tracking-[0.2em] text-muted">
          Agent Online · Convex · Gemini
        </div>
      </div>
      <div className="mt-3 text-sm text-secondary">
        Last sync 2m ago · Heartbeat in 28m
      </div>
    </div>
  );
}

function XPBar() {
  const progress = 0.64; // placeholder, to be wired later
  return (
    <div className="rounded-xl border border-white/10 bg-[var(--bg-card)]/70 p-4">
      <div className="flex items-center justify-between text-xs text-secondary">
        <span>Level 7 — Field Agent</span>
        <span>{Math.round(progress * 100)}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-zinc-900">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand-blue)] via-[var(--color-brand-green)] to-[var(--color-brand-orange)]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const nav = useMemo(() => navItems, []);

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-white/5 bg-[var(--bg-sidebar)]/95 px-5 py-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image src="/logo.svg" alt="Mission Control" fill sizes="40px" className="object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-secondary">Mission Control</p>
            <p className="text-xs text-muted">v0.1 • Walrus Edition</p>
          </div>
        </div>
        <AgentStatus />
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
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
            <button className="w-full rounded-lg border border-white/10 bg-[var(--bg-hover)]/70 px-3 py-2 text-left text-sm text-secondary transition hover:border-white/20 hover:text-[var(--text-primary)]">
              Send Heartbeat
            </button>
            <button className="w-full rounded-lg border border-white/10 bg-[var(--bg-hover)]/70 px-3 py-2 text-left text-sm text-secondary transition hover:border-white/20 hover:text-[var(--text-primary)]">
              Run Daily Brief
            </button>
          </div>
        </div>
        <XPBar />
      </div>
    </aside>
  );
}
