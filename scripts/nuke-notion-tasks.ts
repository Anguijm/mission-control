import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

async function main() {
  try {
    // @ts-ignore
    const tasks = await client.query(api.kanban.list, {});
    const notionTasks = tasks.filter((t: any) => t.notionId);
    
    console.log(`Found ${notionTasks.length} tasks from Notion. Nuking them...`);

    for (const task of notionTasks) {
      // @ts-ignore
      await client.mutation(api.kanban.delete_, { id: task._id });
      console.log(`Deleted: ${task.title}`);
    }
    console.log("Cleanup complete.");
  } catch (e) {
    console.error(e);
  }
}

main();
