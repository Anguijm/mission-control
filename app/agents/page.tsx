"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

// Agent Data Interface (matching Convex schema)
interface Agent {
  _id: Id<"agents">;
  name: string;
  role: string;
  emoji: string;
  status: string;
  task?: string;
  cpu?: number;
  ram?: number;
  lastSeen: number;
}

export default function AgentsPage() {
  const agents = useQuery(api.agents.list);

  if (agents === undefined) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-zinc-500">
        Loading Agent Grid...
      </div>
    );
  }

  // Sort agents by name or status if needed. 
  // For now, let's keep them in the order Convex returns (or sort by name).
  const sortedAgents = [...agents].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Agents</h1>
          <p className="text-zinc-500 mt-1">Live Status & Resource Monitoring</p>
        </div>
        <div className="text-sm font-mono text-zinc-600">
          Live Connection
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedAgents.map((agent) => (
          <AgentCard 
            key={agent._id}
            name={agent.name} 
            role={agent.role} 
            emoji={agent.emoji} 
            data={agent} 
            // Simple heuristic for color coding based on name/role
            color={
              agent.name === 'Circus' ? "border-red-500/50" :
              agent.name === 'Bolt' ? "border-blue-500/50" :
              agent.name === 'Scope' ? "border-green-500/50" :
              agent.name === 'Beau' ? "border-pink-500/50" :
              agent.name === 'Scout' ? "border-purple-500/50" :
              agent.name === 'Radar' ? "border-orange-500/50" :
              agent.name === 'Archive' ? "border-amber-700/50" :
              "border-yellow-500/50"
            }
          />
        ))}
      </div>
    </div>
  );
}

function AgentCard({ name, role, emoji, data, color }: { name: string, role: string, emoji: string, data: Agent, color: string }) {
  const isOnline = data.status !== "offline";
  // Add a "stale" check? If lastSeen > 1 minute ago, maybe they crashed.
  const isStale = Date.now() - data.lastSeen > 60000;
  
  return (
    <div className={`bg-zinc-900 rounded-xl p-5 border border-zinc-800 ${color} shadow-sm transition-all duration-300 hover:border-zinc-700 hover:scale-[1.02]`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl bg-zinc-800/50 p-2 rounded-lg">{emoji}</div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">{name}</h3>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{role}</p>
          </div>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
          isStale ? "bg-red-900/30 text-red-400" :
          data.status === "working" ? "bg-emerald-500/20 text-emerald-400 animate-pulse" :
          data.status === "online" ? "bg-blue-500/20 text-blue-400" :
          "bg-zinc-700/30 text-zinc-500"
        }`}>
          {isStale ? "TIMEOUT" : data.status}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-semibold text-zinc-600 uppercase block mb-1">Current Task</label>
          <p className="text-sm text-zinc-300 truncate font-medium">{data.task || "Idle"}</p>
        </div>

        {isOnline && !isStale && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/50">
            <div className="bg-zinc-950/50 rounded p-2 text-center">
              <span className="text-[10px] text-zinc-500 block uppercase">CPU</span>
              <span className="text-sm font-mono text-zinc-300">{data.cpu || 0}%</span>
            </div>
            <div className="bg-zinc-950/50 rounded p-2 text-center">
              <span className="text-[10px] text-zinc-500 block uppercase">RAM</span>
              <span className="text-sm font-mono text-zinc-300">{data.ram || 0}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
