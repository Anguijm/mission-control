import { mutation } from "./_generated/server";

export const addTasks = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    const tasks = [
      {
        title: "Refactor Tailwind Config",
        description: "Create tailwind.config.ts to map CSS variables to utility classes (e.g. bg-card instead of bg-[var(--bg-card)]).",
        status: "todo",
        priority: "low",
        tags: ["frontend", "refactor"],
        project: "mission-control",
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Optimize Health Check Query",
        description: "Refactor api.agents.healthCheck to use count() queries instead of fetching all records to improve performance.",
        status: "todo",
        priority: "medium",
        tags: ["backend", "performance"],
        project: "mission-control",
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Image Optimization",
        description: "Update Content Intel page to use next/image for thumbnails and whitelist domains in next.config.ts.",
        status: "todo",
        priority: "low",
        tags: ["frontend", "performance"],
        project: "mission-control",
        createdAt: now,
        updatedAt: now,
      },
      {
        title: "Security Hardening",
        description: "Implement Clerk auth checks on mutations to secure the dashboard against unauthorized access.",
        status: "todo",
        priority: "high",
        tags: ["security", "backend"],
        project: "mission-control",
        createdAt: now,
        updatedAt: now,
      }
    ];

    for (const task of tasks) {
      // @ts-ignore
      await ctx.db.insert("kanbanTasks", task);
    }

    return `Added ${tasks.length} technical debt tasks via seed_polish.`;
  },
});