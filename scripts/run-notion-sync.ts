import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

async function main() {
  console.log("Triggering Notion sync...");
  try {
    const apiKey = process.env.NOTION_API_KEY;
    if (!apiKey) {
      throw new Error("NOTION_API_KEY not set in environment");
    }
    const result = await client.action(api.notion.syncFromNotion, {
      apiKey,
    });
    console.log("Sync complete:", result);
  } catch (error) {
    console.error("Sync failed:", error);
  }
}

main();
