import * as fs from "fs";
import * as path from "path";

const SKILLS_DIR = path.resolve(__dirname, "../../skills");
const MEMORY_DIR = path.resolve(__dirname, "../../memory");

// Simple heuristic: read log, find "Error", suggest fix
// In a real scenario, this would call an LLM.
// For now, we'll implement a basic rule-based improver.

async function main() {
  const logPath = path.resolve(__dirname, "../auto_maintenance_log.md");
  if (!fs.existsSync(logPath)) {
    console.log("No log file found.");
    return;
  }

  const logContent = fs.readFileSync(logPath, "utf-8");
  const lines = logContent.split("\n");
  const errors = lines.filter((l) => l.toLowerCase().includes("error") || l.toLowerCase().includes("failed"));

  if (errors.length === 0) {
    console.log("No errors found in log. No improvements needed.");
    return;
  }

  console.log(`Found ${errors.length} errors. Analyzing...`);

  // Example rule: If "cron" failed, update TOOLS.md with a note
  if (logContent.includes("cron tool payload")) {
    const toolsPath = path.join(MEMORY_DIR, "../TOOLS.md");
    if (fs.existsSync(toolsPath)) {
      const toolsContent = fs.readFileSync(toolsPath, "utf-8");
      if (!toolsContent.includes("Cron Tool Note")) {
        const updatedContent = toolsContent + "\n\n## Cron Tool Note\n- The `cron` tool is strict about JSON formatting. Ensure payloads are valid JSON objects, not strings.\n";
        fs.writeFileSync(toolsPath, updatedContent);
        console.log("Updated TOOLS.md with cron usage note.");
      }
    }
  }
}

main();
