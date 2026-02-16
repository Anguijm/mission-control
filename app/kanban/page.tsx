"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const COLUMNS = [
  { id: "todo", label: "To Do", color: "bg-blue-500/10 border-blue-500/20" },
  { id: "in-progress", label: "In Progress", color: "bg-orange-500/10 border-orange-500/20" },
  { id: "blocked", label: "Blocked", color: "bg-red-500/10 border-red-500/20" },
  { id: "done", label: "Done", color: "bg-emerald-500/10 border-emerald-500/20" },
];

const PRIORITY_COLORS: Record<string, string> = {
  high: "text-red-400 bg-red-500/10 border-red-500/20",
  medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  low: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

export default function KanbanPage() {
  const tasks = useQuery(api.kanban.list, {});
  const updateStatus = useMutation(api.kanban.updateStatus);

  if (tasks === undefined) {
    return <div className="p-8 text-zinc-500">Loading board...</div>;
  }

  const handleStatusChange = async (id: Id<"kanbanTasks">, newStatus: string) => {
    await updateStatus({ id, status: newStatus });
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Mission Board</h1>
          <p className="text-zinc-500 mt-1">Synced with Notion</p>
        </div>
        <div className="text-sm text-zinc-600">
          {tasks.length} tasks
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-4 min-h-0 overflow-x-auto">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);
          
          return (
            <div key={col.id} className={`flex flex-col h-full rounded-xl border ${col.color}`}>
              <div className="p-3 border-b border-zinc-800/50 flex justify-between items-center bg-zinc-900/20">
                <span className="font-semibold text-zinc-300">{col.label}</span>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-500">
                  {colTasks.length}
                </span>
              </div>
              
              <div className="p-3 space-y-3 overflow-y-auto flex-1">
                {colTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-sm hover:border-zinc-700 transition-colors group"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-sm font-medium text-zinc-200 leading-tight">
                        {task.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-medium ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}`}>
                        {task.priority}
                      </span>
                      
                      {/* Simple Move Dropdown */}
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-500 rounded px-1 py-0.5 focus:outline-none focus:border-zinc-700 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {COLUMNS.map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    {task.assignedTo && (
                      <div className="mt-2 pt-2 border-t border-zinc-800 flex justify-end">
                        <span className="text-xs text-zinc-500">{task.assignedTo}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
