import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    if (!args.query) {
      return await ctx.db.query("documents").order("desc").take(20);
    }
    return await ctx.db
      .query("documents")
      .withSearchIndex("search_documents", (q) => q.search("content", args.query))
      .take(20);
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    type: v.string(), // fact, url, document
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("documents", {
      source: args.type,
      title: args.title,
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});
