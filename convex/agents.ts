import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

export const reportHeartbeat = mutation({
  args: {
    id: v.optional(v.id("agents")), // Can pass existing ID or find by name
    name: v.string(),
    role: v.string(),
    emoji: v.string(),
    status: v.string(),
    task: v.optional(v.string()),
    cpu: v.optional(v.number()),
    ram: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Try to find agent by name if no ID provided
    let agentId = args.id;
    if (!agentId) {
      const existing = await ctx.db
        .query("agents")
        .filter((q) => q.eq(q.field("name"), args.name))
        .first();
      if (existing) {
        agentId = existing._id;
      }
    }

    let targetId: typeof agentId;

    if (agentId) {
      await ctx.db.patch(agentId, {
        status: args.status,
        task: args.task,
        cpu: args.cpu,
        ram: args.ram,
        lastSeen: now,
      });
      targetId = agentId;
    } else {
      targetId = await ctx.db.insert("agents", {
        name: args.name,
        role: args.role,
        emoji: args.emoji,
        status: args.status,
        task: args.task,
        cpu: args.cpu,
        ram: args.ram,
        lastSeen: now,
      });
    }

    await ctx.db.insert("activities", {
      type: "system",
      action: "Heartbeat",
      details: `${args.name} heartbeat (${args.status})` +
        (args.cpu !== undefined && args.ram !== undefined
          ? ` — CPU ${args.cpu}% · RAM ${args.ram}%`
          : ""),
      timestamp: now,
      metadata: {
        agentId: targetId,
        task: args.task,
      },
    });

    return targetId;
  },
});
