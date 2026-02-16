import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("documents")
      .withSearchIndex("search_documents", (q) => q.search("content", args.query))
      .take(20);

    const activities = await ctx.db
      .query("activities")
      .withSearchIndex("search_activities", (q) => q.search("details", args.query))
      .take(10);

    return {
      documents: docs,
      activities: activities,
    };
  },
});

export const upsertDocument = mutation({
  args: {
    source: v.string(),
    title: v.string(),
    content: v.string(),
    path: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documents", {
      ...args,
      updatedAt: Date.now(),
    });
  },
});
