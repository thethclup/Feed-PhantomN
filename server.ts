import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: MCP
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Feed Phantom MCP Endpoint",
      status: "active",
      description: "Active MCP server for Feed Phantom Orchestrator Agent",
      capabilities: ["phantom-feed-management", "invisible-content-orchestration", "ghost-mode-automation"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      const { action, command, params } = req.body;
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
            data: req.body
          };
      }

      res.json({
        status: "success",
        agent: "Feed Phantom Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process MCP command"
      });
    }
  });

  // API Route: Agent
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Feed Phantom Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Feed Phantom",
      version: "1.0.0"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Support Express v4 syntax since we installed ^4.21.2
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
