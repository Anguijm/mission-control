import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

async function main() {
  const tasks = [
    {
      title: "Implement Convex Agent Registry",
      description: "Add `agents` table to Convex schema (id, name, status, cpu, ram, task). Create API mutations for agents to report heartbeats.",
      status: "todo",
      priority: "high",
      tags: ["backend", "telemetry"],
    },
    {
      title: "Build Host Telemetry Daemon",
      description: "Create a TypeScript daemon (`scripts/telemetry.ts`) that reads system stats (CPU/RAM) and OpenClaw status, then pushes to Convex loop.",
      status: "todo",
      priority: "high",
      tags: ["system", "script"],
    },
    {
      title: "Connect Agent UI to Live Data",
      description: "Refactor `app/agents/page.tsx` to use `useQuery(api.agents.list)` instead of the mock API route.",
      status: "todo",
      priority: "medium",
      tags: ["frontend", "ui"],
    },
    {
      title: "Google Calendar Integration",
      description: "Use the `gog` skill to fetch calendar events and sync them to `scheduledTasks` or a new `events` table in Convex.",
      status: "todo",
      priority: "medium",
      tags: ["integration", "calendar"],
    },
  ];

  console.log("Seeding Phase 3 tasks...");
  for (const task of tasks) {
    // @ts-ignore
    await client.mutation(api.kanban.create, task);
    console.log(`Created: ${task.title}`);
  }
}

main();
