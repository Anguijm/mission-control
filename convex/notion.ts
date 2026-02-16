import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

const NOTION_DB_ID = "308dffb0-ceca-816c-bf27-ee84d6b75f2c";
const NOTION_API_KEY = process.env.NOTION_API_KEY;

export const syncFromNotion = action({
  args: { apiKey: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const apiKey = args.apiKey || process.env.NOTION_API_KEY;
    if (!apiKey) {
      console.error("NOTION_API_KEY not set");
      return;
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: {
          property: "Status",
          select: {
            does_not_equal: "Done" // Optional: Don't sync old completed stuff? Or maybe sync everything.
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Notion fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    for (const page of data.results) {
      const props = page.properties;
      
      const title = props.Name?.title?.[0]?.plain_text || "Untitled";
      const statusRaw = props.Status?.select?.name || "To Do";
      const priorityRaw = props.Priority?.select?.name || "Medium";
      const assigneeRaw = props.Assignee?.select?.name;

      // Map status
      let status = "todo";
      if (statusRaw === "In Progress") status = "in-progress";
      if (statusRaw === "Done") status = "done";
      if (statusRaw === "Blocked") status = "blocked";

      // Map priority
      let priority = "medium";
      if (priorityRaw === "High") priority = "high";
      if (priorityRaw === "Low") priority = "low";

      await ctx.runMutation(internal.notion.upsertTask, {
        notionId: page.id,
        title,
        status,
        priority,
        assignedTo: assigneeRaw,
        // No description in properties usually, unless we fetch page content. 
        // For now, keep description empty or try to map a text field if exists.
        description: "", 
      });
    }
    
    return { synced: data.results.length };
  },
});

export const upsertTask = internalMutation({
  args: {
    notionId: v.string(),
    title: v.string(),
    status: v.string(),
    priority: v.string(),
    assignedTo: v.optional(v.string()),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("kanbanTasks")
      .withIndex("by_notionId", (q) => q.eq("notionId", args.notionId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        title: args.title,
        status: args.status as any,
        priority: args.priority as any,
        assignedTo: args.assignedTo,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("kanbanTasks", {
        title: args.title,
        description: args.description,
        status: args.status as any,
        priority: args.priority as any,
        assignedTo: args.assignedTo,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        notionId: args.notionId,
        tags: ["notion-synced"],
      });
    }
  },
});
