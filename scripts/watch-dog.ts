// Watch Dog: Poltergeist-Lite
// Monitors pm2 logs for errors and pipes them to the agent's attention.

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../convex/_generated/api';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const LOG_DIR = '/home/johnanguiano/.pm2/logs';
const APPS = ['urban-explorer', 'mission-control', 'data-ingest', 'convex-backend'];

if (!CONVEX_URL) {
    console.error('Missing CONVEX_URL');
    process.exit(1);
}
const client = new ConvexHttpClient(CONVEX_URL);

// State tracking (file position)
const stateFile = path.resolve(process.cwd(), '.watch-dog-state.json');
let state: Record<string, number> = {};

if (fs.existsSync(stateFile)) {
    try {
        state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
    } catch (e) { console.warn('Resetting state'); }
}

function tailLog(appName: string, type: 'out' | 'error') {
    const logPath = path.join(LOG_DIR, `${appName}-${type}.log`);
    if (!fs.existsSync(logPath)) return;

    const stats = fs.statSync(logPath);
    const lastSize = state[logPath] || 0;

    if (stats.size < lastSize) {
        // Log rotated
        state[logPath] = 0;
    }

    if (stats.size > lastSize) {
        const stream = fs.createReadStream(logPath, {
            start: state[logPath],
            end: stats.size
        });
        
        let buffer = '';
        stream.on('data', (chunk) => { buffer += chunk.toString(); });
        stream.on('end', async () => {
            if (!buffer.trim()) return;

            // Simple heuristic: only care about ERRORS or CRASHES
            // Or specific build failures from Next.js
            const isError = type === 'error' || 
                            buffer.includes('Error:') || 
                            buffer.includes('Failed to compile') ||
                            buffer.includes('Exception');

            if (isError) {
                console.log(`[Alert] Issue detected in ${appName}`);
                await client.mutation(api.activities.add, {
                    timestamp: Date.now(),
                    type: 'system',
                    action: `Build/Runtime Error: ${appName}`,
                    details: buffer.substring(0, 500), // Truncate
                    metadata: { source: 'watch-dog', log: logPath, priority: 'high' }
                });
            }
        });
        
        state[logPath] = stats.size;
    }
}

// Check every 10 seconds
setInterval(() => {
    APPS.forEach(app => {
        tailLog(app, 'out');
        tailLog(app, 'error');
    });
    fs.writeFileSync(stateFile, JSON.stringify(state));
}, 10000);

console.log('Watch Dog active. Sniffing logs...');
