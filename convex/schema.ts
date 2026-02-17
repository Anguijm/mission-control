import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  activities: defineTable({
    timestamp: v.number(),
    type: v.string(),
    action: v.string(),
    details: v.string(),
    metadata: v.optional(v.any()),
    sessionKey: v.optional(v.string()),
  })
    .index("by_timestamp", ["timestamp"])
    .index("by_type", ["type", "timestamp"])
    .searchIndex("search_activities", {
      searchField: "details",
      filterFields: ["type"],
    }),

  scheduledTasks: defineTable({
    name: v.string(),
    schedule: v.string(),
    scheduleKind: v.string(),
    nextRun: v.optional(v.number()),
    lastRun: v.optional(v.number()),
    payload: v.optional(v.string()),
    sessionTarget: v.string(),
    enabled: v.boolean(),
    color: v.optional(v.string()),
  }).index("by_nextRun", ["nextRun"]),

  kanbanTasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("todo"),
      v.literal("in-progress"),
      v.literal("done"),
      v.literal("blocked")
    ),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    assignedTo: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    comments: v.optional(
      v.array(
        v.object({
          author: v.string(),
          content: v.string(),
          timestamp: v.number(),
        })
      )
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
    notionId: v.optional(v.string()),
    project: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_project", ["project"])
    .index("by_notionId", ["notionId"]),

  agents: defineTable({
    name: v.string(),
    role: v.string(),
    emoji: v.string(),
    status: v.string(), // online, offline, working
    task: v.optional(v.string()),
    cpu: v.optional(v.number()),
    ram: v.optional(v.number()),
    lastSeen: v.number(),
  }).index("by_lastSeen", ["lastSeen"]),

  users: defineTable({
    clerkId: v.string(), // Links to Clerk Auth
    email: v.string(),
    name: v.optional(v.string()),
    plan: v.union(v.literal("free"), v.literal("hero")), // "Local Hero" subscription
    stripeCustomerId: v.optional(v.string()),
    createdAt: v.number(),
    lastLogin: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  savedHunts: defineTable({
    userId: v.id("users"),
    title: v.string(), // e.g. "My Tokyo Coffee Run"
    locationName: v.string(), // "Shimokitazawa"
    vibe: v.string(), // "Classic"
    places: v.array(v.object({
      name: v.string(),
      lat: v.number(),
      lng: v.number(),
      googleId: v.string(), // Place ID
    })),
    assignments: v.array(v.object({
      text: v.string(),
      completed: v.boolean(),
    })),
    isPublic: v.boolean(), // Shareable link?
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_public", ["isPublic"]),

  documents: defineTable({
    source: v.string(),
    title: v.string(),
    content: v.string(),
    path: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_source", ["source"])
    .searchIndex("search_documents", {
      searchField: "content",
      filterFields: ["source"],
    }),
});
