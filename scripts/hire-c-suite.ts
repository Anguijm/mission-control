import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

async function main() {
  console.log("Hiring C-Suite...");

  const newAgents = [
    { name: "Vantage", role: "CMO", emoji: "📢", status: "online", task: "Analyzing competitor SEO" },
    { name: "Forge", role: "CPO", emoji: "📐", status: "online", task: "Designing User Profile Schema" },
    { name: "Ledger", role: "CFO", emoji: "💰", status: "offline", task: "Awaiting Stripe credentials" }
  ];

  for (const agent of newAgents) {
    // @ts-ignore
    await client.mutation(api.agents.reportHeartbeat, agent);
    console.log(`Hired: ${agent.name} (${agent.role})`);
  }

  console.log("\nAssigning Executive Tasks...");
  
  const tasks = [
    {
      title: "Implement User Authentication (Clerk)",
      description: "We cannot monetize without users. Install Clerk, wrap the app, and create a user profile sync to Convex.",
      status: "todo",
      priority: "high",
      tags: ["backend", "auth", "foundation"],
      project: "urban-explorer"
    },
    {
      title: "Design 'Pro Vibe' UI Patterns",
      description: "Create visual indicators for locked content. Gray out 'Cyberpunk' vibe with a padlock icon.",
      status: "todo",
      priority: "medium",
      tags: ["frontend", "ux", "monetization"],
      project: "urban-explorer"
    },
    {
      title: "Define Database Schema for Saved Hunts",
      description: "Create a `hunts` table in Convex linked to `users`. Store place IDs and route data.",
      status: "todo",
      priority: "high",
      tags: ["backend", "database"],
      project: "urban-explorer"
    },
    {
      title: "Draft Landing Page Copy for 'Local Hero'",
      description: "Rewrite the hero section to emphasize the value of signing up. 'Don't just walk. Belong.'",
      status: "todo",
      priority: "low",
      tags: ["marketing", "copy"],
      project: "urban-explorer"
    }
  ];

  for (const task of tasks) {
    // @ts-ignore
    await client.mutation(api.kanban.create, task);
    console.log(`Task Created: ${task.title}`);
  }
}

main();
