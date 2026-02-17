import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { 
    status: v.optional(v.string()),
    project: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let tasks;
    if (args.status) {
      tasks = await ctx.db
        .query("kanbanTasks")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .collect();
    } else {
      tasks = await ctx.db.query("kanbanTasks").collect();
    }

    if (args.project && args.project !== "all") {
      tasks = tasks.filter(t => t.project === args.project);
    }

    return tasks;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    tags: v.optional(v.array(v.string())),
    project: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("kanbanTasks", {
      title: args.title,
      description: args.description || "",
      status: args.status as any,
      priority: args.priority as any,
      tags: args.tags || [],
      project: args.project || "mission-control", // Default project
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("kanbanTasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    project: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const delete_ = mutation({
  args: { id: v.id("kanbanTasks") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const updateStatus = mutation({
  args: { id: v.id("kanbanTasks"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status as any, updatedAt: Date.now() });
  },
});
