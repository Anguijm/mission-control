"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { TaskModal, TaskData } from "@/components/TaskModal";

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
  const [projectFilter, setProjectFilter] = useState("all");
  
  const tasks = useQuery(api.kanban.list, {
    project: projectFilter === "all" ? undefined : projectFilter
  });
  
  const createTask = useMutation(api.kanban.create);
  const updateTask = useMutation(api.kanban.update);
  const deleteTask = useMutation(api.kanban.delete_);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);

  const handleCreate = async (data: TaskData) => {
    await createTask({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      tags: data.tags,
      project: data.project,
    });
  };

  const handleUpdate = async (data: TaskData) => {
    if (!data._id) return;
    await updateTask({
      id: data._id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      tags: data.tags,
      project: data.project,
    });
  };

  const handleDelete = async (id: Id<"kanbanTasks">) => {
    await deleteTask({ id });
  };

  const openNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditTask = (task: any) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Mission Board</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-zinc-500">Autonomous Task Tracking</p>
            <span className="text-zinc-700">•</span>
            {/* Project Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 rounded px-2 py-1 focus:outline-none focus:border-zinc-700"
            >
              <option value="all">All Projects</option>
              <option value="mission-control">Mission Control</option>
              <option value="urban-explorer">Urban Explorer</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-zinc-600">
            {tasks ? `${tasks.length} tasks` : 'Loading...'}
          </div>
          <button
            onClick={openNewTask}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span> New Task
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-4 min-h-0 overflow-x-auto">
        {COLUMNS.map((col) => {
          const colTasks = tasks?.filter((t) => t.status === col.id) || [];
          
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
                    onClick={() => openEditTask(task)}
                    className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg shadow-sm hover:border-zinc-600 cursor-pointer transition-colors group"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-sm font-medium text-zinc-200 leading-tight">
                        {task.title}
                      </h3>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-1.5 items-center">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-medium ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}`}>
                          {task.priority}
                        </span>
                        {/* Project Badge */}
                        <span className="text-[10px] text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded border border-zinc-800">
                          {task.project === 'mission-control' ? 'MC' : 
                           task.project === 'urban-explorer' ? 'UE' : '??'}
                        </span>
                      </div>
                      
                      {/* Quick Status Move */}
                      <select
                        value={task.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateTask({ id: task._id, status: e.target.value })}
                        className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-500 rounded px-1 py-0.5 focus:outline-none focus:border-zinc-700 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {COLUMNS.map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingTask ? handleUpdate : handleCreate}
        onDelete={editingTask ? handleDelete : undefined}
        initialData={editingTask}
        defaultProject={projectFilter !== "all" ? projectFilter : "mission-control"}
      />
    </div>
  );
}
