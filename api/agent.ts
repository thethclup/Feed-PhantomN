export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    res.status(200).json({
      name: "Feed Phantom Orchestrator",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Base",
      network: "base-mainnet",
      chainId: 8453,
      upgrade: "denim",
      blockTimeMs: 200,
      version: "1.0.0"
    });
  } else {
    res.status(405).send("Method Not Allowed");
  }
}

