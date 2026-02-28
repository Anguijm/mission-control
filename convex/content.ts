import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const sync = mutation({
  args: { source: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // In a real app, this would trigger an action to fetch from YouTube/etc.
    // For now, we log the activity.
    await ctx.db.insert("activities", {
      type: "system",
      action: "Content Sync",
      details: `Started sync for ${args.source ?? "all sources"}`,
      timestamp: Date.now(),
    });
    return "Sync started";
  },
});
