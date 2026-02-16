import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';
import dotenv from 'dotenv';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!CONVEX_URL) {
  console.error('Error: NEXT_PUBLIC_CONVEX_URL not found in .env.local');
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);
const memoryDir = path.resolve(process.cwd(), '../../memory');
const stateFile = path.resolve(process.cwd(), '.ingest-state.json');

// Get today's memory file (local time)
function getTodayFile() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return path.join(memoryDir, `${year}-${month}-${day}.md`);
}

// Load state
let state = { file: '', linesIngested: 0 };
if (fs.existsSync(stateFile)) {
  try {
    state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  } catch (e) {
    console.warn('Failed to parse state file, resetting.');
  }
}

// Helper to determine activity type
function determineType(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('signal') || lower.includes('discord') || lower.includes('message') || lower.includes('sent')) return 'message';
  if (lower.includes('file') || lower.includes('created') || lower.includes('updated') || lower.includes('.md')) return 'file';
  if (lower.includes('exec') || lower.includes('install') || lower.includes('run') || lower.includes('command')) return 'exec';
  if (lower.includes('web') || lower.includes('research') || lower.includes('browser') || lower.includes('http')) return 'web';
  if (lower.includes('cron') || lower.includes('schedule') || lower.includes('task')) return 'cron';
  if (lower.includes('tool') || lower.includes('api') || lower.includes('key')) return 'tool';
  return 'system';
}

// Process file changes
async function processFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const newLines = lines.slice(state.linesIngested);

  if (newLines.length === 0) return;

  console.log(`Found ${newLines.length} new lines to process...`);

  for (const line of newLines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      const details = trimmed.substring(2).trim();
      const type = determineType(details);
      const action = details.length > 50 ? details.substring(0, 47) + '...' : details;

      try {
        await client.mutation(api.activities.add, {
          timestamp: Date.now(),
          type,
          action,
          details,
          metadata: { source: 'memory-ingest', file: path.basename(filePath) },
        });
        console.log(`Ingested: [${type}] ${action}`);
      } catch (err) {
        console.error('Failed to ingest activity:', err);
      }
    }
  }

  // Update state
  state.file = path.basename(filePath);
  state.linesIngested = lines.length;
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

const todayFile = getTodayFile();

// Watch directory for new files too
const watcher = chokidar.watch(memoryDir, { persistent: true, ignoreInitial: false });

watcher.on('add', (filePath) => {
  if (path.basename(filePath) === path.basename(todayFile)) {
    console.log(`Today's memory file created: ${filePath}`);
    processFile(filePath);
  }
});

watcher.on('change', (filePath) => {
  if (path.basename(filePath) === path.basename(todayFile)) {
    processFile(filePath);
  }
});

console.log(`Ingestion service watching ${memoryDir} for ${path.basename(todayFile)}...`);
