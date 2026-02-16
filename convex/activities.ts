import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    if (args.type) {
      return await ctx.db
        .query("activities")
        .withIndex("by_type", (q) => q.eq("type", args.type!))
        .order("desc")
        .take(limit);
    }
    return await ctx.db
      .query("activities")
      .order("desc")
      .take(limit);
  },
});

export const add = mutation({
  args: {
    timestamp: v.number(),
    type: v.string(),
    action: v.string(),
    details: v.string(),
    metadata: v.optional(v.any()),
    sessionKey: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", args);
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("activities")
      .withSearchIndex("search_activities", (q) => q.search("details", args.query))
      .take(20);
  },
});
