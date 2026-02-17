import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

async function main() {
  const tasks = [
    {
      title: "Finish Events API Rate Limiting",
      description: "Ensure `src/app/api/events/route.ts` is fully implemented with Ticketmaster API and robust rate limiting (Redis/Upstash or in-memory).",
      status: "todo",
      priority: "high",
      tags: ["backend", "api"],
      project: "urban-explorer",
    },
    {
      title: "Refine Hunt Page UI",
      description: "Polish the UI in `src/app/hunt/page.tsx`. Improve mobile responsiveness, map integration, and print styles.",
      status: "todo",
      priority: "medium",
      tags: ["frontend", "ui"],
      project: "urban-explorer",
    },
    {
      title: "Add Neighborhood Selection Logic",
      description: "Implement logic to select neighborhoods dynamically instead of hardcoded 'San Francisco' defaults.",
      status: "todo",
      priority: "medium",
      tags: ["frontend", "logic"],
      project: "urban-explorer",
    },
    {
      title: "Verify Rate Limit Library",
      description: "Check `src/lib/rateLimit.ts` implementation. Ensure it persists correctly across serverless invocations (or migrate to external store).",
      status: "todo",
      priority: "high",
      tags: ["backend", "security"],
      project: "urban-explorer",
    }
  ];

  console.log("Seeding Urban Explorer tasks...");
  for (const task of tasks) {
    // @ts-ignore
    await client.mutation(api.kanban.create, task);
    console.log(`Created: ${task.title}`);
  }
}

main();
