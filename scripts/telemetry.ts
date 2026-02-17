import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import * as dotenv from "dotenv";
import * as os from "os";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "http://127.0.0.1:3210");

const AGENTS = [
  { name: "Circus", role: "Chief of Staff", emoji: "🦭", id: "main" },
  { name: "Bolt", role: "Engineering", emoji: "🔩", id: "engineer" },
  { name: "Scope", role: "Research", emoji: "🔭", id: "researcher" },
  { name: "Tempo", role: "Operations", emoji: "⏱️", id: "ops" },
  { name: "Beau", role: "Relations", emoji: "🏹", id: "relations" },
  { name: "Scout", role: "HR", emoji: "🕵️", id: "hr" },
  { name: "Radar", role: "Tech Scouting", emoji: "📡", id: "radar" },
  { name: "Archive", role: "Librarian", emoji: "📚", id: "archive" },
];

function getCpuUsage() {
  const cpus = os.cpus();
  const user = cpus.reduce((acc, cpu) => acc + cpu.times.user, 0);
  const nice = cpus.reduce((acc, cpu) => acc + cpu.times.nice, 0);
  const sys = cpus.reduce((acc, cpu) => acc + cpu.times.sys, 0);
  const idle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
  const irq = cpus.reduce((acc, cpu) => acc + cpu.times.irq, 0);
  const total = user + nice + sys + idle + irq;
  return 100 - Math.round((idle / total) * 100);
}

function getRamUsage() {
  const total = os.totalmem();
  const free = os.freemem();
  return Math.round(((total - free) / total) * 100);
}

async function report(agent: typeof AGENTS[0]) {
  try {
    const isOnline = Math.random() > 0.1; // Simulate occasional offline/sleep
    const status = isOnline ? (Math.random() > 0.7 ? "working" : "online") : "offline";
    
    // Simulate real tasks based on role if working
    let task = "";
    if (status === "working") {
      const tasks = [
        "Analyzing logs", "Running tests", "Syncing Convex", "Checking cron jobs", 
        "Compiling code", "Fetching metadata", "Optimizing indexes"
      ];
      task = tasks[Math.floor(Math.random() * tasks.length)];
    } else if (status === "online") {
      task = "Idle - Monitoring";
    } else {
      task = "Offline";
    }

    // In a real multi-agent deployment, each process would report its own stats.
    // Here, we simulate the fleet using the host's actual stats + some variance.
    const baseCpu = getCpuUsage();
    const baseRam = getRamUsage();
    
    // Variance for simulation
    const cpu = status === "offline" ? 0 : Math.min(100, Math.max(0, baseCpu + Math.floor(Math.random() * 20 - 10)));
    const ram = status === "offline" ? 0 : Math.min(100, Math.max(0, baseRam + Math.floor(Math.random() * 10 - 5)));

    // @ts-ignore
    await client.mutation(api.agents.reportHeartbeat, {
      name: agent.name,
      role: agent.role,
      emoji: agent.emoji,
      status,
      task,
      cpu,
      ram,
    });
    // console.log(`Reported for ${agent.name}: ${status}`);
  } catch (e) {
    console.error(`Failed to report for ${agent.name}:`, e);
  }
}

async function main() {
  console.log("Starting Telemetry Daemon...");
  console.log("Press Ctrl+C to stop.");

  // Initial report
  for (const agent of AGENTS) {
    await report(agent);
  }

  // Loop every 5 seconds
  setInterval(async () => {
    // Randomly update 1-3 agents per tick to simulate asynchronous reporting
    const shuffled = [...AGENTS].sort(() => 0.5 - Math.random());
    const toUpdate = shuffled.slice(0, 3);
    
    for (const agent of toUpdate) {
      await report(agent);
    }
  }, 5000);
}

main();
