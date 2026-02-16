"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/activity", label: "Activity", icon: "⚡" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/agents", label: "Agents", icon: "🤖" },
  { href: "/org", label: "Organization", icon: "🏢" },
  { href: "/search", label: "Search", icon: "🔍" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-zinc-800 h-screen bg-zinc-950 flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-zinc-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Mission Control
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">
            OA
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">OpenClaw Agent</p>
            <p className="text-xs text-zinc-500">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}
