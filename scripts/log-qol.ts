import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

async function main() {
  try {
    console.log("Logging QoL improvements...");

    // Task 1: Mobile Responsiveness
    // @ts-ignore
    await client.mutation(api.kanban.create, {
      title: "Mobile/Tablet Responsiveness",
      description: "Ensure Mission Control is responsive and usable on mobile and tablet devices.",
      status: "todo",
      priority: "medium",
      tags: ["qol", "ui/ux", "mission-control"],
      project: "mission-control"
    });
    console.log("Logged: Mobile/Tablet Responsiveness");

    // Task 2: Validate Add Task Workflow
    // @ts-ignore
    await client.mutation(api.kanban.create, {
      title: "Validate Task Pickup Workflow",
      description: "Verify that tasks added via the UI 'Add Task' button are picked up by the agent on the next cron/heartbeat cycle.",
      status: "todo",
      priority: "high",
      tags: ["validation", "workflow", "mission-control"],
      project: "mission-control"
    });
    console.log("Logged: Validate Task Pickup Workflow");

  } catch (e) {
    console.error("Error logging tasks:", e);
  }
}

main();
