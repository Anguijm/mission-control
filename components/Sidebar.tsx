"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Target,
  KanbanSquare,
  Clapperboard,
  Brain,
  Share2,
  Settings2,
} from "lucide-react";
import packageJson from "@/package.json";
import type { LucideIcon } from "lucide-react";

const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/productivity", label: "Productivity", icon: Target },
  { href: "/tasks", label: "Tasks", icon: KanbanSquare },
  { href: "/content", label: "Content Intel", icon: Clapperboard },
  { href: "/brain", label: "Second Brain", icon: Brain },
  { href: "/connections", label: "Connections", icon: Share2 },
  { href: "/settings", label: "Settings", icon: Settings2 },
];

const agentMeta = {
  status: "Agent Online",
  environment: "Railway",
  model: "Claude Sonnet 4",
  uptime: "128h uptime",
};

const levelMeta = {
  label: "Level 7 — Field Agent",
  current: 4580,
  nextLabel: "Strategist",
  progress: 0.68,
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-white/5"
      style={{ backgroundColor: "var(--bg-sidebar)" }}
    >
      <div className="border-b border-white/5 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/5 p-2">
            <Image src="/logo.svg" alt="Mission Control logo" width={36} height={36} priority />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Mission Control
            </p>
            <p className="text-[11px] text-white/40">v{packageJson.version}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-white/5 bg-[var(--bg-card)] p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <span className="status-dot h-2.5 w-2.5 rounded-full bg-[var(--brand-green)]"></span>
            {agentMeta.status}
          </div>
          <p className="mt-2 text-xs text-white/60">
            {agentMeta.environment} • {agentMeta.model}
          </p>
          <p className="text-[11px] text-white/40">{agentMeta.uptime}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname?.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--bg-elevated)] text-white"
                  : "text-white/60 hover:bg-white/5"
              }`}
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-[var(--brand-orange)]"
                    : "text-white/50 group-hover:text-white/80"
                }
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 px-6 py-5">
        <div className="flex items-center justify-between text-[11px] text-white/50">
          <span>{levelMeta.label}</span>
          <span>{levelMeta.current.toLocaleString()} XP</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--brand-orange)] via-[var(--brand-blue)] to-[var(--brand-green)]"
            style={{ width: `${levelMeta.progress * 100}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/40">
          Next: {levelMeta.nextLabel}
        </p>
      </div>
    </aside>
  );
}
