import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

async function main() {
  try {
    // @ts-ignore
    const tasks = await client.query(api.kanban.list, { status: "todo" });
    console.log(JSON.stringify(tasks, null, 2));
  } catch (e) {
    console.error(e);
  }
}

main();
