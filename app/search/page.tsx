"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

const sourceIcons: Record<string, string> = {
  memory: "🧠",
  document: "📄",
  activity: "⚡",
  task: "📋",
};

const sourceColors: Record<string, string> = {
  memory: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  document: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  activity: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  task: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-500/30 text-yellow-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const results = useQuery(
    api.search.search,
    query.trim().length >= 2 ? { query: query.trim() } : "skip"
  );

  const totalResults =
    (results?.documents?.length ?? 0) + (results?.activities?.length ?? 0);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">Global Search</h1>
        <p className="text-zinc-500 mt-1">Search across memory, documents, activities, and tasks</p>
      </div>

      {/* Search Input */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg">🔍</span>
        <input
          type="text"
          placeholder="Search for anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-12 pr-4 py-4 text-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results */}
      {query.trim().length < 2 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🦭</p>
          <p className="text-zinc-500">Type at least 2 characters to search</p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Signal", "Discord", "Brooke", "Circus Cruz", "NotebookLM", "YouTube", "MuddyOS"].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="text-sm bg-zinc-900 text-zinc-400 px-3 py-1.5 rounded-lg hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      ) : results === undefined ? (
        <div className="text-zinc-600 text-sm py-8">Searching...</div>
      ) : totalResults === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🤷</p>
          <p className="text-zinc-500">No results found for &quot;{query}&quot;</p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-zinc-500">
            {totalResults} result{totalResults !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>

          {/* Documents */}
          {results.documents.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                <span>📄</span> Documents & Memory
              </h2>
              <div className="space-y-2">
                {results.documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:border-zinc-700/50 transition-colors animate-fade-in"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span>{sourceIcons[doc.source] ?? "📄"}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${sourceColors[doc.source] ?? sourceColors.document}`}>
                        {doc.source}
                      </span>
                      {doc.path && (
                        <span className="text-xs text-zinc-600 font-mono">{doc.path}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-zinc-200 mb-1">{doc.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {highlightText(doc.content.substring(0, 300), query)}
                      {doc.content.length > 300 && "..."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {results.activities.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-zinc-400 mb-3 flex items-center gap-2">
                <span>⚡</span> Activities
              </h2>
              <div className="space-y-2">
                {results.activities.map((a) => (
                  <div
                    key={a._id}
                    className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 hover:border-zinc-700/50 transition-colors animate-fade-in"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        {a.type}
                      </span>
                      <span className="text-xs text-zinc-600">
                        {new Date(a.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-zinc-200">{a.action}</p>
                    <p className="text-sm text-zinc-400">
                      {highlightText(a.details, query)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
