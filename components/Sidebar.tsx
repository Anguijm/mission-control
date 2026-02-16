"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/activity", label: "Activity", icon: "⚡" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/search", label: "Search", icon: "🔍" },
  { href: "/org", label: "Organization", icon: "🏢" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🦭</span>
          <div>
            <h1 className="text-lg font-bold text-zinc-100">Mission Control</h1>
            <p className="text-xs text-zinc-500">Circus Cruz • OpenClaw</p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot"></span>
          <span>All systems operational</span>
        </div>
        <div className="mt-2 flex gap-3 text-xs text-zinc-500">
          <span>Signal ✅</span>
          <span>Discord ✅</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-zinc-800 text-zinc-100 font-medium"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-600">
          <p>Mike • Asia/Tokyo (GMT+9)</p>
          <p className="mt-1">OpenClaw 2026.2.12</p>
        </div>
      </div>
    </aside>
  );
}
