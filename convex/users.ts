import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Sync Clerk user to Convex
export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        name: args.name,
        lastLogin: Date.now(),
      });
      return existing._id;
    } else {
      return await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        plan: "free",
        createdAt: Date.now(),
        lastLogin: Date.now(),
      });
    }
  },
});

export const saveHunt = mutation({
  args: {
    clerkId: v.string(), // We look up user by Clerk ID
    title: v.string(),
    locationName: v.string(),
    vibe: v.string(),
    places: v.array(v.object({
      name: v.string(),
      lat: v.number(),
      lng: v.number(),
      googleId: v.string(),
    })),
    assignments: v.array(v.object({
      text: v.string(),
      completed: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new Error("User not found");

    return await ctx.db.insert("savedHunts", {
      userId: user._id,
      title: args.title,
      locationName: args.locationName,
      vibe: args.vibe,
      places: args.places,
      assignments: args.assignments,
      isPublic: false, // Private by default
      createdAt: Date.now(),
    });
  },
});

export const getHunts = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return [];

    return await ctx.db
      .query("savedHunts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});
