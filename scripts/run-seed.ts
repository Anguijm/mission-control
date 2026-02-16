import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

async function main() {
  console.log("Seeding database...");
  try {
    const result = await client.mutation(api.seed.seed, {});
    console.log("Seed complete:", result);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

main();
