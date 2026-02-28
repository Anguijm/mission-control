"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Brain, FileText, Link as LinkIcon, UploadCloud, Hash, Plus } from "lucide-react";

export default function SecondBrainPage() {
  const [activeTab, setActiveTab] = useState<"note" | "url" | "file">("note");
  const [search, setSearch] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [urlContent, setUrlContent] = useState("");

  const memories = useQuery(api.brain.search, { query: search });
  const addMemory = useMutation(api.brain.add);

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    await addMemory({
      title: "Quick Note",
      content: noteContent,
      type: "fact",
      tags: ["note"],
    });
    setNoteContent("");
  };

  const handleAddUrl = async () => {
    if (!urlContent.trim()) return;
    await addMemory({
      title: urlContent,
      content: urlContent,
      type: "url",
      tags: ["resource"],
    });
    setUrlContent("");
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Knowledge Base</p>
        <h1 className="text-3xl font-bold">Second Brain</h1>
        <p className="text-secondary">The long-term memory vault. Feed it facts, links, and docs.</p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        {/* Input Zone */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-white/5 bg-[var(--bg-card)]">
            <div className="flex border-b border-white/5">
              <button
                onClick={() => setActiveTab("note")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "note" ? "bg-[var(--bg-elevated)] text-white" : "text-muted hover:text-secondary"
                }`}
              >
                Note
              </button>
              <button
                onClick={() => setActiveTab("url")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "url" ? "bg-[var(--bg-elevated)] text-white" : "text-muted hover:text-secondary"
                }`}
              >
                URL
              </button>
              <button
                onClick={() => setActiveTab("file")}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === "file" ? "bg-[var(--bg-elevated)] text-white" : "text-muted hover:text-secondary"
                }`}
              >
                File
              </button>
            </div>

            <div className="p-5">
              {activeTab === "note" && (
                <div className="flex flex-col gap-3">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Teach the agent a new fact..."
                    className="h-32 w-full resize-none rounded-xl border border-white/10 bg-[var(--bg-hover)] p-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-muted focus:border-white/20"
                  />
                  <button 
                    onClick={handleAddNote}
                    className="rounded-xl bg-[var(--color-brand-blue)] py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Add Memory
                  </button>
                </div>
              )}

              {activeTab === "url" && (
                <div className="flex flex-col gap-3">
                  <div className="relative">
                    <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      value={urlContent}
                      onChange={(e) => setUrlContent(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-white/10 bg-[var(--bg-hover)] py-2 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-muted focus:border-white/20"
                    />
                  </div>
                  <button 
                    onClick={handleAddUrl}
                    className="rounded-xl bg-[var(--color-brand-blue)] py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Scrape & Store
                  </button>
                </div>
              )}

              {activeTab === "file" && (
                <div className="flex flex-col gap-3">
                  <div className="flex h-32 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-[var(--bg-hover)]/30 text-center transition hover:border-white/20 hover:bg-[var(--bg-hover)]/50">
                    <UploadCloud size={24} className="mb-2 text-muted" />
                    <p className="text-sm font-medium text-secondary">Drop PDFs or TXT here</p>
                    <p className="text-xs text-muted">Max 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-4">
              <p className="text-xs text-muted">Total Memories</p>
              <p className="mt-1 text-2xl font-bold">{memories?.length ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-[var(--bg-card)] p-4">
              <p className="text-xs text-muted">Last Sync</p>
              <p className="mt-1 text-2xl font-bold">Just now</p>
            </div>
          </div>
        </div>

        {/* Memory Grid */}
        <div className="flex flex-col gap-6">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your brain..."
              className="w-full rounded-2xl border border-white/5 bg-[var(--bg-card)] py-4 pl-12 pr-4 text-[var(--text-primary)] outline-none transition focus:border-white/10 focus:bg-[var(--bg-elevated)]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {memories === undefined ? (
               <div className="py-12 text-center text-muted">Loading...</div>
            ) : memories.length === 0 ? (
               <div className="py-12 text-center">
                 <p className="text-muted">No memories found matching "{search}"</p>
               </div>
            ) : (
              memories.map((memory) => (
                <div
                  key={memory._id}
                  className="group flex flex-col gap-3 rounded-2xl border border-white/5 bg-[var(--bg-card)] p-5 transition hover:border-white/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bg-hover)]">
                        {memory.source === "fact" && <Brain size={14} className="text-[var(--color-brand-orange)]" />}
                        {memory.source === "url" && <LinkIcon size={14} className="text-[var(--color-brand-blue)]" />}
                        {memory.source === "document" && <FileText size={14} className="text-[var(--color-brand-green)]" />}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted">{memory.source}</span>
                    </div>
                    <span className="text-xs text-muted">{new Date(memory.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-sm leading-relaxed text-[var(--text-primary)]">{memory.content}</p>

                  <div className="flex flex-wrap gap-2">
                    {/* Tags are not yet in documents schema, using title as tag-like or placeholder */}
                    <span className="flex items-center gap-1 rounded-md bg-[var(--bg-hover)] px-2 py-1 text-[10px] text-secondary transition group-hover:text-[var(--text-primary)]">
                      <Hash size={10} className="text-muted" />
                      {memory.title}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
