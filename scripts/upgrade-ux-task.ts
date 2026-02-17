import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

async function main() {
  // Update "Refine Hunt Page UI" to "Global UX/UI Overhaul"
  // @ts-ignore
  await client.mutation(api.kanban.update, {
    id: "jh79mbdaxypsn4xpwaxv7z1ejn81ahmx", // ID from previous read
    title: "Global UX/UI Overhaul",
    description: "Redesign the entire app flow (Landing -> Selection -> Hunt) for mobile-first usability. Implement immersive vibes, smooth transitions, and a cleaner aesthetic.",
    priority: "high",
    tags: ["frontend", "ux", "design"],
  });
  console.log("Updated task to Global UX/UI Overhaul");
}

main();
