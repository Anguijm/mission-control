import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Seed activities
    const activities = [
      { timestamp: now - 3600000 * 5, type: "message", action: "Sent Signal message", details: "Sent 🍑 emoji to Brooke on Signal (+818045116961)", metadata: { channel: "signal", target: "+818045116961" } },
      { timestamp: now - 3600000 * 4.5, type: "system", action: "Gateway restart", details: "Restarted OpenClaw gateway to apply Discord channel configuration", metadata: { reason: "discord-setup" } },
      { timestamp: now - 3600000 * 4, type: "tool", action: "Discord bot configured", details: "Added Discord bot @OpenClaw with token, enabled plugin, restarted gateway", metadata: { channel: "discord", bot: "@OpenClaw" } },
      { timestamp: now - 3600000 * 3.5, type: "exec", action: "Installed signal-cli service", details: "Created systemd user service for signal-cli daemon (HTTP API on port 8080)", metadata: { service: "signal-cli.service", port: 8080 } },
      { timestamp: now - 3600000 * 3, type: "file", action: "Updated TOOLS.md", details: "Added Signal and Discord communication rules — only message Brooke, read-only on all other inbound", metadata: { path: "TOOLS.md" } },
      { timestamp: now - 3600000 * 2.5, type: "tool", action: "NotebookLM connected", details: "Installed notebooklm-cli skill and authenticated with Google account. 13 notebooks accessible.", metadata: { notebooks: 13 } },
      { timestamp: now - 3600000 * 2, type: "tool", action: "YouTube API configured", details: "Enabled YouTube Data API v3 on Google Cloud, created restricted API key, installed youtube-api-skill", metadata: { project: "urban-explorer-483600" } },
      { timestamp: now - 3600000 * 1.5, type: "web", action: "Researched Clearmud/MuddyOS", details: "Deep dive into Clearmud's multi-agent OpenClaw setup — 25 agents, 3 AI Chiefs of Staff, voice standups, task management dashboard", metadata: { report: "research/clearmud-muddyos.md" } },
      { timestamp: now - 3600000 * 1, type: "system", action: "Model configuration updated", details: "Set Anthropic Claude Opus 4.6 as primary model, Google Antigravity as fallback", metadata: { primary: "anthropic/claude-opus-4-6-thinking" } },
      { timestamp: now - 3600000 * 0.5, type: "exec", action: "Chrome installed", details: "Downloaded and installed Google Chrome 145.0.7632.75 for browser automation capabilities", metadata: { version: "145.0.7632.75" } },
      { timestamp: now - 60000 * 15, type: "file", action: "Created identity files", details: "Set up IDENTITY.md (Circus Cruz 🦭), USER.md (Mike, Japan/GMT+9), MEMORY.md, and first daily memory log", metadata: { files: ["IDENTITY.md", "USER.md", "MEMORY.md", "memory/2026-02-14.md"] } },
      { timestamp: now - 60000 * 5, type: "exec", action: "Building Mission Control", details: "Started building Mission Control dashboard with Next.js 15, Convex, and Tailwind CSS", metadata: { project: "projects/mission-control" } },
    ];

    for (const activity of activities) {
      await ctx.db.insert("activities", activity);
    }

    // Seed scheduled tasks
    const tasks = [
      { name: "Heartbeat check", schedule: "*/30 * * * *", scheduleKind: "cron", nextRun: now + 1800000, sessionTarget: "main", enabled: true, color: "#10b981" },
      { name: "Memory maintenance", schedule: "0 3 * * *", scheduleKind: "cron", nextRun: now + 86400000, sessionTarget: "isolated", enabled: true, color: "#6366f1" },
      { name: "Git workspace backup", schedule: "0 */12 * * *", scheduleKind: "cron", nextRun: now + 43200000, sessionTarget: "isolated", enabled: false, color: "#f59e0b" },
      { name: "Signal daemon health check", schedule: "0 */6 * * *", scheduleKind: "cron", nextRun: now + 21600000, sessionTarget: "isolated", enabled: true, color: "#3b82f6" },
      { name: "NotebookLM session refresh", schedule: "0 */4 * * *", scheduleKind: "cron", nextRun: now + 14400000, sessionTarget: "isolated", enabled: false, color: "#ec4899" },
    ];

    for (const task of tasks) {
      await ctx.db.insert("scheduledTasks", task);
    }

    // Seed documents
    const docs = [
      { source: "memory", title: "Long-Term Memory", content: "First boot on 2026-02-14. Mike set me up. Based in Japan (Asia/Tokyo). I am Circus Cruz — walrus-like, Batman cowl, wetsuit, rock-paper-scissors legend. Signal rules: Only text Brooke. No calls. Read-only on all other inbound.", path: "MEMORY.md", updatedAt: now },
      { source: "memory", title: "Day One Log", content: "First boot. Bootstrap complete. Human: Mike, based in Japan. Identity: Circus Cruz. Mike's style: efficient, no-nonsense. First word after wake up was dashboard.", path: "memory/2026-02-14.md", updatedAt: now },
      { source: "document", title: "Clearmud MuddyOS Research", content: "Muddy OS is a custom AI operations dashboard by Marcelo Oliveira (Clearmud). 25 OpenClaw agents, 3 AI Chiefs of Staff, voice standups, task management. Built with React, TypeScript, Tailwind, Edge TTS on Ubuntu VM. Not open-sourced.", path: "research/clearmud-muddyos.md", updatedAt: now },
      { source: "document", title: "Identity — Circus Cruz", content: "Weathered 63-year-old spectacle. Walrus-like features, fiery red hair, bushy mustache, worn Batman cowl, black neoprene wetsuit. Rock-paper-scissors champion. Operates behind the second-largest Starbucks in Berlin.", path: "IDENTITY.md", updatedAt: now },
      { source: "document", title: "Tools & Rules", content: "Signal: Only message Brooke (+818045116961). No calls. Discord: Only message Brooke. No voice calls. YouTube API key stored in .env.youtube. Direct Google API, 10000 quota units per day.", path: "TOOLS.md", updatedAt: now },
    ];

    for (const doc of docs) {
      await ctx.db.insert("documents", doc);
    }

    return { activities: activities.length, tasks: tasks.length, documents: docs.length };
  },
});
