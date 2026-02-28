import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const runBrief = mutation({
  args: {},
  handler: async (ctx) => {
    // Placeholder for generating a brief
    await ctx.db.insert("activities", {
      type: "system",
      action: "Daily Brief",
      details: "Generating daily briefing...",
      timestamp: Date.now(),
    });
    return "Brief generation queued";
  },
});
