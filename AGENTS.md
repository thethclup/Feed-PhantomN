# Feed Phantom Agent Guidelines

## Agent Overview
The **Feed Phantom Orchestrator** is an ERC-8004 compliant AI agent acting as the "Algorithm" and "Orchestrator" behind the game. 

- **Wallet Address**: `0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6`
- **Network**: Base Mainnet

## Subsystems

1. **Agent Card (`public/.well-known/agent-card.json`)**
   The identity and capabilities registry for the agent on the Base network.

2. **MCP API (`/api/mcp`)**
   The Model Context Protocol endpoint for remote orchestration, executing commands such as `Phantom-feed-management`.

3. **Agent INFO API (`/api/agent`)**
   Status and wallet retrieval endpoint.

## Security & Privacy Guidelines
- **No Credentials in Repo**: Never commit private keys, API secrets, or passwords.
- **Agent Keys**: Any wallet private keys associated with `0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6` must remain strictly out of the codebase and injected only through environment variables (`.env`).
- **Data Anonyms**: The agent will scrub user data before broadcasting to public ledgers unless explicitly signed by the user as part of the ERC-8021 score record.
