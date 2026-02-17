
const { ConvexClient } = require('convex/browser');
const { api } = require('../convex/_generated/api');

// Initialize Convex Client (will need URL from .env or hardcoded for now)
const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL || 'http://127.0.0.1:3210');

async function main() {
  console.log('Fetching high-priority tasks from Mission Control...');
  
  try {
    const tasks = await client.query(api.kanban.list, { status: 'todo' });
    const highPri = tasks.filter(t => t.priority === 'high');

    if (highPri.length === 0) {
      console.log('No high-priority tasks found.');
      return;
    }

    console.log(`Found ${highPri.length} high-priority tasks.`);
    const task = highPri[0];
    console.log(`Starting work on: ${task.title} (${task.project})`);

    // In a real implementation, we would now trigger an agent session via OpenClaw CLI or API
    // For now, we simulate the 'handoff'
    console.log('Handing off to agent: engineer');
    
    // Update task status to in-progress
    // Note: mutations need a different client or admin key usually, but for local dev with no auth it might work
    // or we'd need to use a mutation call.
    // client.mutation(api.kanban.updateStatus, { id: task._id, status: 'in-progress' });

  } catch (err) {
    console.error('Failed to fetch tasks:', err);
  }
}

main();

