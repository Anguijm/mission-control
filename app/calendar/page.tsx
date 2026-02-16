"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

function getWeekDays() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek + 1); // Monday
  startOfWeek.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(d);
  }
  return days;
}

const hours = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM

function getTaskHour(ts: number) {
  return new Date(ts).getHours();
}

function getTaskDay(ts: number) {
  return new Date(ts).getDay();
}

function formatHour(h: number) {
  if (h === 0) return "12 AM";
  if (h < 12) return `${h} AM`;
  if (h === 12) return "12 PM";
  return `${h - 12} PM`;
}

export default function CalendarPage() {
  const tasks = useQuery(api.tasks.list, {});
  const toggleTask = useMutation(api.tasks.toggle);
  const addTask = useMutation(api.tasks.add);
  const weekDays = getWeekDays();
  const today = new Date();

  // Add Task Modal State
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    schedule: "0 9 * * *",
    sessionTarget: "isolated",
    enabled: true,
    color: "#6366f1",
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTask({
      name: newTask.name,
      schedule: newTask.schedule,
      scheduleKind: "cron",
      sessionTarget: newTask.sessionTarget,
      enabled: newTask.enabled,
      color: newTask.color,
      nextRun: Date.now() + 3600000, // Placeholder: scheduled for 1h from now
    });
    setIsAdding(false);
    setNewTask({
      name: "",
      schedule: "0 9 * * *",
      sessionTarget: "isolated",
      enabled: true,
      color: "#6366f1",
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Calendar</h1>
          <p className="text-zinc-500 mt-1">
            Week of {weekDays[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })} –{" "}
            {weekDays[6].toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-zinc-100 text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          + New Task
        </button>
      </div>

      {/* Upcoming Tasks Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-zinc-400 mb-3">SCHEDULED TASKS</h2>
        <div className="flex flex-wrap gap-3">
          {tasks === undefined ? (
            <span className="text-zinc-600 text-sm">Loading...</span>
          ) : tasks.length === 0 ? (
            <span className="text-zinc-600 text-sm">No tasks scheduled</span>
          ) : (
            tasks.map((t) => (
              <div
                key={t._id}
                className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: t.color ?? "#6366f1" }}
                />
                <div>
                  <p className="text-sm font-medium text-zinc-200">{t.name}</p>
                  <p className="text-xs text-zinc-500 font-mono">{t.schedule}</p>
                </div>
                <span
                  onClick={() => toggleTask({ id: t._id })}
                  className={`ml-2 cursor-pointer select-none text-xs px-2 py-0.5 rounded-full transition-colors ${
                    t.enabled
                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      : "bg-zinc-700/50 text-zinc-500 hover:bg-zinc-700/70"
                  }`}
                >
                  {t.enabled ? "on" : "off"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Week Grid */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-8 border-b border-zinc-800">
          <div className="p-3 text-xs text-zinc-600 border-r border-zinc-800">GMT+9</div>
          {weekDays.map((d, i) => {
            const isToday =
              d.getDate() === today.getDate() &&
              d.getMonth() === today.getMonth();
            return (
              <div
                key={i}
                className={`p-3 text-center border-r border-zinc-800 last:border-r-0 ${
                  isToday ? "bg-zinc-800/50" : ""
                }`}
              >
                <p className={`text-xs font-medium ${isToday ? "text-blue-400" : "text-zinc-500"}`}>
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className={`text-lg font-bold ${isToday ? "text-blue-400" : "text-zinc-300"}`}>
                  {d.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Time Grid */}
        <div className="max-h-[600px] overflow-y-auto">
          {hours.map((h) => (
            <div key={h} className="grid grid-cols-8 border-b border-zinc-800/50 min-h-[48px]">
              <div className="p-2 text-xs text-zinc-600 border-r border-zinc-800 flex items-start justify-end pr-3">
                {formatHour(h)}
              </div>
              {weekDays.map((d, dayIdx) => {
                const dayNum = (dayIdx + 1) % 7; // Mon=1 ... Sun=0
                const isToday =
                  d.getDate() === today.getDate() &&
                  d.getMonth() === today.getMonth();

                // Find tasks that fall on this hour/day
                const matchingTasks = tasks?.filter((t) => {
                  if (!t.nextRun) return false;
                  return getTaskHour(t.nextRun) === h && getTaskDay(t.nextRun) === dayNum;
                }) ?? [];

                return (
                  <div
                    key={dayIdx}
                    className={`border-r border-zinc-800/50 last:border-r-0 p-1 ${
                      isToday ? "bg-zinc-800/20" : ""
                    }`}
                  >
                    {matchingTasks.map((t) => (
                      <div
                        key={t._id}
                        className="text-xs px-2 py-1 rounded-md mb-1 truncate font-medium"
                        style={{
                          backgroundColor: (t.color ?? "#6366f1") + "30",
                          color: t.color ?? "#6366f1",
                          borderLeft: `3px solid ${t.color ?? "#6366f1"}`,
                        }}
                      >
                        {t.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Add Task Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <h2 className="text-xl font-bold text-zinc-100 mb-4">Add New Task</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Task Name</label>
                <input
                  type="text"
                  required
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500"
                  placeholder="e.g. Daily Check-in"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Cron Schedule</label>
                <input
                  type="text"
                  required
                  value={newTask.schedule}
                  onChange={(e) => setNewTask({ ...newTask, schedule: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500 font-mono"
                  placeholder="*/30 * * * *"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Session Target</label>
                  <select
                    value={newTask.sessionTarget}
                    onChange={(e) => setNewTask({ ...newTask, sessionTarget: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-zinc-500"
                  >
                    <option value="isolated">Isolated</option>
                    <option value="main">Main</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 uppercase tracking-wider mb-1">Color</label>
                  <input
                    type="color"
                    value={newTask.color}
                    onChange={(e) => setNewTask({ ...newTask, color: e.target.value })}
                    className="w-full h-[42px] bg-zinc-800 border border-zinc-700 rounded-lg px-1 py-1 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={newTask.enabled}
                  onChange={(e) => setNewTask({ ...newTask, enabled: e.target.checked })}
                  className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-blue-500 focus:ring-0 focus:ring-offset-0"
                />
                <label htmlFor="enabled" className="text-sm text-zinc-300 select-none">Enable immediately</label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors font-medium"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
