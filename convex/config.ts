import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    // For now, get the first agent or a default config doc
    const agent = await ctx.db.query("agents").first();
    return agent ?? null;
  },
});

export const update = mutation({
  args: {
    id: v.id("agents"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    modelConfig: v.optional(v.string()), // JSON string for config params
    systemPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Initialize if missing
export const init = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("agents").first();
    if (!existing) {
      await ctx.db.insert("agents", {
        name: "Circus Cruz",
        role: "Walrus of Whimsy",
        emoji: "🦭",
        status: "online",
        lastSeen: Date.now(),
      });
    }
  },
});
