"use client";

import { useState, useEffect } from "react";

// Agent Data Interface
interface Agent {
  id: string;
  name: string;
  role: string;
  emoji: string;
  status: "online" | "offline" | "working";
  task: string;
  cpu?: number;
  ram?: number;
}

export default function AgentDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch agent status from our Next.js API route
    const fetchAgents = async () => {
      try {
        const res = await fetch('/api/agents', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setAgents(data.agents);
        }
      } catch (err) {
        console.error("Failed to fetch agent status", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
    
    // Poll every 5 seconds for updates
    const interval = setInterval(fetchAgents, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-white">
        Loading Command Center...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-white">Agent Command Center 🎪 (Live)</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <AgentCard 
            key={agent.id}
            name={agent.name} 
            role={agent.role} 
            emoji={agent.emoji} 
            data={agent} 
            color={
              agent.id === 'main' ? "border-red-500" :
              agent.id === 'engineer' ? "border-blue-500" :
              agent.id === 'researcher' ? "border-green-500" :
              agent.id === 'relations' ? "border-pink-500" :
              agent.id === 'hr' ? "border-purple-500" :
              agent.id === 'radar' ? "border-orange-500" :
              agent.id === 'archive' ? "border-amber-700" :
              "border-yellow-500"
            }
          />
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-300">Live Communication Log</h2>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto border border-gray-700">
          <p className="text-yellow-400">[Today] Tempo → Main: Automated Standup Complete</p>
          <p className="text-green-400">[Today] Scope → Main: NotebookLM Research Complete</p>
          <p className="text-blue-400">[Today] Bolt → Main: nlm CLI Patched</p>
        </div>
      </div>
    </div>
  );
}

function AgentCard({ name, role, emoji, data, color }: { name: string, role: string, emoji: string, data: Agent, color: string }) {
  const isOnline = data.status !== "offline";
  
  return (
    <div className={`bg-gray-800 rounded-xl p-6 border-l-4 ${color} shadow-lg transition-all duration-300 hover:scale-105`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-3xl mb-1">{emoji}</div>
          <h3 className="text-xl font-bold text-white">{name}</h3>
          <p className="text-gray-400 text-sm">{role}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
          data.status === "working" ? "bg-green-900 text-green-300 animate-pulse" :
          data.status === "online" ? "bg-blue-900 text-blue-300" :
          "bg-gray-700 text-gray-400"
        }`}>
          {data.status}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 uppercase">Current Task</label>
          <p className="text-sm text-gray-200 truncate">{data.task}</p>
        </div>

        {isOnline && (
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-gray-700 rounded p-2">
              <span className="text-xs text-gray-400 block">CPU</span>
              <span className="text-lg font-mono text-white">{data.cpu || 0}%</span>
            </div>
            <div className="bg-gray-700 rounded p-2">
              <span className="text-xs text-gray-400 block">RAM</span>
              <span className="text-lg font-mono text-white">{data.ram || 0}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
