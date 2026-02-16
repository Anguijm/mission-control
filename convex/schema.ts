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
