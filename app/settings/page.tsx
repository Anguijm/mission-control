"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Save, RotateCcw, Sliders, UserCog, Terminal } from "lucide-react";

const DEFAULT_CONFIG = [
  { key: "Model Provider", value: "Anthropic" },
  { key: "Model Name", value: "claude-3-opus-20240229" },
  { key: "Temperature", value: "0.7" },
  { key: "Max Tokens", value: "4096" },
];

export default function SettingsPage() {
  const agent = useQuery(api.config.get);
  const updateConfig = useMutation(api.config.update);
  
  const [isDirty, setIsDirty] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  useEffect(() => {
    if (agent) {
      setSystemPrompt(agent.systemPrompt || "You are an AI agent...");
      setName(agent.name);
      setRole(agent.role);
      if (agent.modelConfig) {
        try {
          setConfig(JSON.parse(agent.modelConfig));
        } catch (e) {
          console.error("Failed to parse model config", e);
        }
      }
    }
  }, [agent]);

  const handleConfigChange = (index: number, newValue: string) => {
    const newConfig = [...config];
    newConfig[index].value = newValue;
    setConfig(newConfig);
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!agent) return;
    await updateConfig({
      id: agent._id,
      name,
      role,
      systemPrompt,
      modelConfig: JSON.stringify(config),
    });
    setIsDirty(false);
  };

  if (agent === undefined) return <div className="p-10 text-center text-muted">Loading settings...</div>;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Configuration</p>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-secondary">Tune the personality and parameters of your agent.</p>
          </div>
          <div className="flex gap-3">
            <button
              disabled={!isDirty}
              onClick={() => setIsDirty(false)}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-secondary transition hover:bg-[var(--bg-hover)] disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              disabled={!isDirty}
              onClick={handleSave}
              className="flex items-center gap-2 rounded-xl bg-[var(--color-brand-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:bg-[var(--bg-elevated)] disabled:text-muted"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-1">
            <div className="border-b border-white/5 px-5 py-4">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-[var(--color-brand-orange)]" />
                <h2 className="text-lg font-semibold">System Personality</h2>
              </div>
              <p className="mt-1 text-sm text-secondary">The core prompt that defines who your agent is.</p>
            </div>
            <div className="p-1">
              <textarea
                value={systemPrompt}
                onChange={(e) => { setSystemPrompt(e.target.value); setIsDirty(true); }}
                className="min-h-[400px] w-full resize-y rounded-xl border-none bg-[var(--bg-hover)]/30 p-4 font-mono text-sm leading-relaxed text-[var(--text-primary)] outline-none transition focus:bg-[var(--bg-hover)]/50"
                spellCheck={false}
              />
            </div>
            <div className="flex justify-between border-t border-white/5 px-5 py-3 text-xs text-muted">
              <span>Markdown supported</span>
              <span>{systemPrompt.length} chars</span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-5">
            <div className="mb-4 flex items-center gap-2">
              <UserCog size={18} className="text-[var(--color-brand-green)]" />
              <h3 className="font-semibold">Identity</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-secondary">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setIsDirty(true); }}
                  className="w-full rounded-lg border border-white/10 bg-[var(--bg-hover)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--color-brand-blue)]/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-secondary">Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => { setRole(e.target.value); setIsDirty(true); }}
                  className="w-full rounded-lg border border-white/10 bg-[var(--bg-hover)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--color-brand-blue)]/50"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sliders size={18} className="text-[var(--color-brand-blue)]" />
              <h3 className="font-semibold">Parameters</h3>
            </div>
            <div className="space-y-3">
              {config.map((item, idx) => (
                <div key={item.key} className="group">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary">{item.key}</span>
                  </div>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleConfigChange(idx, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/5 bg-[var(--bg-hover)]/50 px-3 py-2 text-sm text-[var(--text-primary)] transition focus:border-[var(--color-brand-blue)]/50 focus:bg-[var(--bg-hover)] group-hover:bg-[var(--bg-hover)]"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
