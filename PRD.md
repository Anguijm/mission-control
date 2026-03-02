# PRD: mission-control

## Goal
Build a Kanban UI that parses and displays the open-projects.md Markdown file as a live project dashboard.

## Requirements
- Parse `memory/open-projects.md` (located at `/home/johnanguiano/.openclaw/workspace/memory/open-projects.md`) and render each project entry as a Kanban card
- Cards must display: project name, status, goal, dir, started date, and PRD link
- Columns map to status values: `running`, `blocked`, `review`, `done`
- The app must live-sync with `memory/open-projects.md` to populate the Kanban board (poll every 5 seconds or use fs.watch)
- Cards in the `done` column should show completion date and commit hashes if available
- History section entries from open-projects.md should appear in the `done` column
- Responsive layout (mobile-friendly)
- Dark mode by default (matches developer aesthetic)
- No authentication required (local tool)

## Technical Requirements
- Next.js App Router (already scaffolded)
- Tailwind CSS for styling
- API route `/api/projects` that reads and parses open-projects.md, returns JSON
- Client-side polling or SSE to keep the board in sync
- Markdown parsing via a lightweight lib (e.g., marked, remark, or regex)
- No external database — the single source of truth is open-projects.md

## Out of scope
- User authentication
- Multi-user collaboration
- Editing projects from the UI (read-only for now)
- Deployment to cloud (local dev server only for now)

## Stack
- Next.js 14+ (App Router), TypeScript, Tailwind CSS, React

## Definition of done
- Kanban board renders with columns: Running, Blocked, Review, Done
- All entries from open-projects.md appear as cards in correct columns
- Live-sync works (adding/removing entries in .md reflects on board within 5s)
- Historical entries appear in Done column
- Responsive and dark-mode styled
- `npm run dev` starts the dashboard at localhost:3000
