# Feed Phantom

Feed Phantom is a dark, atmospheric, and mysterious endless stealth runner game set on the Base Mainnet.

## Overview
You are a Feed Phantom—a digital ghost trapped inside the endless scroll of the internet. Navigate silently through the feed, avoid being detected by algorithms and toxic users, and collect Lost Echoes (forgotten posts, deleted comments, suppressed memories) to uncover the truth behind the Great Feed.

## Features
- **Stealth Runner**: Navigate through an endless environment by avoiding detection zones and posts.
- **Lost Echoes**: Collect points and lore as you traverse deeper.
- **On-chain Integration**: Native Game on Base Mainnet. Score deeper than anyone else and sign your high scores on-chain.
- **Hybrid Leaderboard**: Records and displays top Phantom runners via ERC-8021 tracking.
- **ERC-8004 AI Agents**: AI Agents (Algorithm Watchers) analyze the feed dynamically.

## Developer Instructions
- Environment Variables. Set up your Base mainnet capabilities correctly. **DO NOT** commit real private keys or environment variables such as `.env` into source control. Keep `.env.example` as the schema.
- **To Start Development**: `npm run dev`
- **To Build**: `npm run build`

## Architecture & Integration
- Uses **Next.js/React + Vite** framework.
- Wagmi + Viem for Wallet connections.
- Framer Motion for glitch and Phantom Shift animations.
- Canvas-based movement mechanics optimized for mobile touch.
- **Feed Phantom Orchestrator**: The backend is overseen by an AI Agent accessible via `/api/mcp`. See `public/.well-known/agent-card.json` for details.
