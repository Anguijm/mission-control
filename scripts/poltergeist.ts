import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const LOG_FILES = [
  '/home/johnanguiano/.pm2/logs/mission-control-out.log',
  '/home/johnanguiano/.pm2/logs/mission-control-error.log',
];

const SIGNAL_CLI = '/home/johnanguiano/.openclaw/tools/signal-cli/0.13.24/signal-cli';
const ME = '+818013355612';

console.log('👻 Poltergeist is watching...');

function alert(message: string) {
  console.log('🚨 ALERT:', message);
  const { exec } = require('child_process');
  // Try using openclaw CLI to send message
  exec(`openclaw message send --channel signal --target "${ME}" --message "👻 Poltergeist Alert:\n${message}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to send via openclaw:', error);
      // Fallback: log to file (already done via console.log)
    } else {
      console.log('Sent alert via openclaw');
    }
  });
}

let lastAlertTime = 0;
const DEBOUNCE_MS = 10000; // 10 seconds

function processLine(line: string, source: string) {
  if (line.includes('Error') || line.includes('Exception') || line.includes('Failed')) {
    const now = Date.now();
    if (now - lastAlertTime > DEBOUNCE_MS) {
      alert(`Error in ${source}:\n${line.trim()}`);
      lastAlertTime = now;
    }
  }
}

LOG_FILES.forEach(file => {
  const tail = spawn('tail', ['-f', '-n', '0', file]);
  
  tail.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach((line: string) => {
      if (line.trim()) processLine(line, file);
    });
  });

  tail.stderr.on('data', (data) => {
    console.error(`tail error for ${file}:`, data.toString());
  });

  console.log(`Watching ${file}`);
});
