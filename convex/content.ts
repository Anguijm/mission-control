import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("content")
      .withIndex("by_published")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    type: v.string(),
    platform: v.string(),
    url: v.string(),
    thumbnail: v.optional(v.string()),
    views: v.number(),
    likes: v.number(),
    publishedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("content", {
      ...args,
      lastSynced: Date.now(),
    });
  },
});

export const updateStats = mutation({
  args: {
    id: v.id("content"),
    views: v.number(),
    likes: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      views: args.views,
      likes: args.likes,
      lastSynced: Date.now(),
    });
  },
});

export const sync = mutation({
  args: { source: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.insert("activities", {
      type: "system",
      action: "Content Sync",
      details: `Started sync for ${args.source ?? "all sources"}`,
      timestamp: Date.now(),
    });
    return "Sync started";
  },
});
