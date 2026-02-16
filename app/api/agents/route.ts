import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const { stdout } = await execAsync('/home/johnanguiano/.npm-global/bin/openclaw sessions list --json');
    let sessionsData: any = {};
    try {
      sessionsData = JSON.parse(stdout);
    } catch (e) {
      console.error('Failed to parse sessions JSON:', e);
      return NextResponse.json({ error: 'Invalid session data' }, { status: 500 });
    }
    
    const sessions = sessionsData.sessions || [];

    const agents = [
      { id: 'main', name: 'Circus Cruz (Main)', role: 'Ringmaster', emoji: '🦭', status: 'online', task: 'Running Mission Control' },
      { id: 'engineer', name: 'Bolt (Eng)', role: 'Chief Engineer', emoji: '🔩', status: 'offline', task: 'Sleeping' },
      { id: 'researcher', name: 'Scope (Research)', role: 'Chief of Content', emoji: '🔭', status: 'offline', task: 'Sleeping' },
      { id: 'ops', name: 'Tempo (Ops)', role: 'Chief of Ops', emoji: '⏱️', status: 'offline', task: 'Sleeping' },
      { id: 'relations', name: 'Beau (Relations)', role: 'Chief of Relations', emoji: '🏹', status: 'offline', task: 'Sleeping' },
      { id: 'hr', name: 'Scout (HR)', role: 'Chief of Talent', emoji: '🕵️', status: 'offline', task: 'Sleeping' },
      { id: 'archive', name: 'Archive (KM)', role: 'Librarian', emoji: '📚', status: 'offline', task: 'Sleeping' },
      { id: 'radar', name: 'Radar (Skills)', role: 'Skills Inventor', emoji: '📡', status: 'offline', task: 'Sleeping' }
    ];

    // Identify active subagents based on session age (< 10 minutes)
    const activeSubagents = sessions.filter((s: any) => 
      s.key.startsWith('agent:main:subagent') && s.ageMs < 10 * 60 * 1000
    );

    // Heuristic: Assign active sessions to roles for the demo
    if (activeSubagents.length > 0) agents[1].status = 'online'; // Bolt
    if (activeSubagents.length > 1) agents[2].status = 'online'; // Scope
    if (activeSubagents.length > 2) agents[3].status = 'online'; // Tempo
    if (activeSubagents.length > 3) agents[4].status = 'online'; // Beau
    if (activeSubagents.length > 4) agents[5].status = 'online'; // Scout
    if (activeSubagents.length > 5) agents[6].status = 'online'; // Archive
    if (activeSubagents.length > 6) agents[7].status = 'online'; // Radar

    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Failed to fetch agent status:', error);
    return NextResponse.json({ error: 'Failed to fetch agent status', details: String(error) }, { status: 500 });
  }
}
