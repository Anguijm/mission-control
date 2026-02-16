import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

const args = process.argv.slice(2);
const id = args[0];
const status = args[1];

async function main() {
  if (!id || !status) {
    console.error("Usage: tsx scripts/pm-update-status.ts <id> <status>");
    process.exit(1);
  }
  try {
    // @ts-ignore
    await client.mutation(api.kanban.updateStatus, { id, status });
    console.log(`Updated ${id} to ${status}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
