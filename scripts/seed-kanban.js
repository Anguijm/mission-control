const { ConvexClient } = require("convex/browser");
const { api } = require("../convex/_generated/api");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

const TASKS = [
  {
    title: "Implement Poltergeist (Build Watcher)",
    description: "Create a background process that watches `npm run dev` output and proactively notifies the engineer agent of build errors. Based on Steinberger's insights.",
    status: "todo",
    priority: "high",
    project: "mission-control",
    tags: ["infra", "dx"]
  },
  {
    title: "Urban Explorer: Morning Briefing Cron",
    description: "Set up a cron job that runs the Curator Agent logic at 8:00 AM JST and sends a Signal message with the day's highlights.",
    status: "todo",
    priority: "high",
    project: "urban-explorer",
    tags: ["feature", "cron"]
  },
  {
    title: "Urban Explorer: Fix Rate Limiting",
    description: "Finish the `src/lib/rateLimit.ts` implementation to ensure we don't burn through API quotas.",
    status: "todo",
    priority: "high",
    project: "urban-explorer",
    tags: ["bugfix", "backend"]
  },
  {
    title: "Mission Control: Autonomy Loop",
    description: "Create the `scripts/run-next-task.js` script that fetches the top Kanban item and spawns a sub-agent to do it.",
    status: "in-progress", // We are doing this now
    priority: "high",
    project: "mission-control",
    tags: ["meta", "autonomy"]
  }
];

async function seed() {
  console.log("🌱 Seeding Kanban with High Priority tasks...");
  for (const task of TASKS) {
    await client.mutation(api.kanban.create, task);
    console.log(`+ Added: ${task.title}`);
  }
  console.log("✅ Done.");
}

seed().catch(console.error);
