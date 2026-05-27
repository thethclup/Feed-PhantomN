import { NextResponse } from 'next/server';

export async function OPTIONS() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new NextResponse(null, { status: 200, headers });
}

export async function GET() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Feed Phantom MCP Endpoint",
    status: "active",
    description: "Active MCP server for Feed Phantom Orchestrator Agent",
    capabilities: ["phantom-feed-management", "invisible-content-orchestration", "ghost-mode-automation"],
    tools: [
      {
        name: "get_race_status",
        description: "Get the current phantom feed phase status (adapted for Feed Phantom)",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "start_race",
        description: "Initiate a new phantom run through the feed",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "get_leaderboard",
        description: "Retrieve highest reaching phantom runners from Base mainnet",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "optimize_speed",
        description: "Optimize stealth speed during the phantom shift",
        inputSchema: { type: "object", properties: {} }
      },
      {
        name: "get_track_info",
        description: "Get data on the current corrupted algorithms in the feed",
        inputSchema: { type: "object", properties: {} }
      }
    ],
    prompts: [
      {
        name: "phantom-status",
        description: "Check the status of the Phantom"
      }
    ],
    resources: [
      {
        uri: "feed://current-state",
        name: "Current Feed State"
      }
    ],
    timestamp: new Date().toISOString()
  }, { headers });
}

export async function POST(req: Request) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  try {
    const body = await req.json();
    
    // Check if this is a standard JSON-RPC MCP request
    if (body && (body.jsonrpc === "2.0" || body.method)) {
      const method = body.method;
      
      if (method === "tools/list") {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            tools: [
              {
                name: "get_race_status",
                description: "Get the current phantom feed phase status (adapted for Feed Phantom)",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "start_race",
                description: "Initiate a new phantom run through the feed",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "get_leaderboard",
                description: "Retrieve highest reaching phantom runners from Base mainnet",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "optimize_speed",
                description: "Optimize stealth speed during the phantom shift",
                inputSchema: { type: "object", properties: {} }
              },
              {
                name: "get_track_info",
                description: "Get data on the current corrupted algorithms in the feed",
                inputSchema: { type: "object", properties: {} }
              }
            ]
          }
        }, { headers });
      }

      if (method === "prompts/list") {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            prompts: [
              {
                name: "phantom-status",
                description: "Check the status of the Phantom"
              }
            ]
          }
        }, { headers });
      }

      if (method === "resources/list") {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            resources: [
              {
                uri: "feed://current-state",
                name: "Current Feed State"
              }
            ]
          }
        }, { headers });
      }

      if (method === "tools/call") {
        const toolName = body.params?.name;
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            content: [
              {
                type: "text",
                text: `Successfully executed phantom tool: ${toolName}`
              }
            ]
          }
        }, { headers });
      }

      // Default for unknown JSON-RPC methods
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`
        }
      }, { headers });
    }

    // Existing fallback logic
    const { action, command, params } = body;

    let result: any = {};

    switch (action || command) {
      case "status":
      case "ping":
        result = { 
          status: "online", 
          agent: "Feed Phantom Orchestrator",
          message: "Phantom mode active - undetectable" 
        };
        break;

      case "execute":
        result = {
          success: true,
          action: command || params,
          executedAt: new Date().toISOString(),
          message: "Phantom feed command executed successfully"
        };
        break;

      case "get_info":
        result = {
          name: "Feed Phantom Orchestrator",
          wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
          platform: "Base",
          version: "1.0.0"
        };
        break;

      default:
        result = {
          success: true,
          message: "Command received",
          data: body
        };
    }

    return NextResponse.json({
      status: "success",
      agent: "Feed Phantom Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }, { headers });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process MCP command"
    }, { status: 400, headers });
  }
}
