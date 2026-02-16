"use client";

import { useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

export type TaskData = {
  _id?: Id<"kanbanTasks">;
  title: string;
  description: string;
  status: string;
  priority: string;
  tags: string[];
};

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: TaskData) => void;
  onDelete?: (id: Id<"kanbanTasks">) => void;
  initialData?: TaskData | null;
}

export function TaskModal({ isOpen, onClose, onSave, onDelete, initialData }: TaskModalProps) {
  const [formData, setFormData] = useState<TaskData>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    tags: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        tags: [],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
          <h2 className="text-lg font-semibold text-zinc-100">
            {initialData ? "Edit Task" : "New Task"}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500/50 transition-colors"
              placeholder="Task title..."
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500/50"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-blue-500/50 h-32 resize-none"
              placeholder="Add details..."
            />
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
          {initialData && onDelete ? (
            <button
              onClick={() => {
                if (confirm("Delete this task?")) {
                  onDelete(initialData._id!);
                  onClose();
                }
              }}
              className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-2"
            >
              Delete
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(formData);
                onClose();
              }}
              disabled={!formData.title}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
