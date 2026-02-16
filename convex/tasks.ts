import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("scheduledTasks").collect();
  },
});

export const upcoming = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const now = Date.now();
    return await ctx.db
      .query("scheduledTasks")
      .withIndex("by_nextRun")
      .filter((q) => q.gte(q.field("nextRun"), now))
      .take(limit);
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    schedule: v.string(),
    scheduleKind: v.string(),
    nextRun: v.optional(v.number()),
    lastRun: v.optional(v.number()),
    payload: v.optional(v.string()),
    sessionTarget: v.string(),
    enabled: v.boolean(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("scheduledTasks", args);
  },
});

export const toggle = mutation({
  args: { id: v.id("scheduledTasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) return;
    await ctx.db.patch(args.id, { enabled: !task.enabled });
  },
});

export const remove = mutation({
  args: { id: v.id("scheduledTasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
