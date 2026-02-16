import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // No caching

export async function GET() {
  // Mock data for now - in a real implementation, this would query the OpenClaw Gateway API
  // or a shared state in Convex/Redis where agents report their heartbeats.
  
  const agents = [
    {
      id: "main",
      name: "Circus",
      role: "Chief of Staff",
      emoji: "🦭",
      status: "online",
      task: "Monitoring system health",
      cpu: 12,
      ram: 45
    },
    {
      id: "engineer",
      name: "Bolt",
      role: "Engineering",
      emoji: "🔩",
      status: "working",
      task: "Refactoring API routes",
      cpu: 78,
      ram: 62
    },
    {
      id: "researcher",
      name: "Scope",
      role: "Research",
      emoji: "🔭",
      status: "online",
      task: "Idle - Awaiting instructions",
      cpu: 5,
      ram: 20
    },
    {
      id: "ops",
      name: "Tempo",
      role: "Operations",
      emoji: "⏱️",
      status: "working",
      task: "Running cron jobs",
      cpu: 34,
      ram: 40
    },
    {
      id: "relations",
      name: "Beau",
      role: "Public Relations",
      emoji: "🏹",
      status: "offline",
      task: "Offline",
      cpu: 0,
      ram: 0
    },
    {
      id: "hr",
      name: "Scout",
      role: "Human Resources",
      emoji: "🕵️",
      status: "online",
      task: "Reviewing team metrics",
      cpu: 15,
      ram: 30
    },
    {
      id: "radar",
      name: "Radar",
      role: "Tech Scouting",
      emoji: "📡",
      status: "offline",
      task: "Offline",
      cpu: 0,
      ram: 0
    },
    {
      id: "archive",
      name: "Archive",
      role: "Librarian",
      emoji: "📚",
      status: "online",
      task: "Indexing logs",
      cpu: 8,
      ram: 55
    }
  ];

  return NextResponse.json({ agents });
}
