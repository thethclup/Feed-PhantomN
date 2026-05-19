# Feed Phantom

Feed Phantom is a dark, atmospheric stealth endless runner on Base Mainnet. Hide from algorithms, collect lost echoes, and record your runs on-chain.

## Features
- **Stealth Mechanics:** Manage visibility and utilize Ghost Mode to evade detection.
- **Lost Echoes:** Collect forgotten bits of algorithmic history.
- **On-chain Integration & Leaderboards:** Sign transactions directly on the Base network to record your deepest scroll depth via ERC-8021 tracking.
- **AI Orchestration:** Backend automation via an ERC-8004 AI Agent. MCP active.

## Technical Stack
- **Framework:** React / Vite (Full-stack Express configuration)
- **Web3 Integration:** Wagmi, Viem, Base Mainnet
- **Styling:** Tailwind CSS, Framer Motion for glitch and Phantom Shift mechanics.
- **AI Agent Protocol:** ERC-8004 Metadata & MCP (Model Context Protocol)

## Setup & Local Development
1. Clone the repository and run `npm install`.
2. Configure environment variables using the `.env.example` as a reference.
3. Start the local server: `npm run dev`
4. Production Building: `npm run build` followed by `npm run start`

## Agent Architecture
Feed Phantom operates with an integrated **Feed Phantom Orchestrator** agent (ERC-8004 compliant). 

### Capabilities listed via Agent Card
- phantom-feed-management
- invisible-content-orchestration
- ghost-mode-automation
- multi-feed-management
- silent-curation
- stealth-operations
- mcp-command-execution

### MCP Tools available
- `get_race_status`
- `start_race`
- `get_leaderboard`
- `optimize_speed`
- `get_track_info`

### Connectivity Locations
- **Agent Card Registration:** Served entirely statically at `/.well-known/agent-card.json`
- **MCP Command Endpoint:** `https://feedphantom.vercel.app/api/mcp`
- **Agent INFO API:** `https://feedphantom.vercel.app/api/agent`

