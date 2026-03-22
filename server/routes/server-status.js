import express from 'express';
import Rcon from 'rcon-srcds';

const router = express.Router();

let statusCache = {
  status: 'offline',
  players: 0,
  maxPlayers: 64,
  lastUpdated: null,
};

let rconClient = null;

async function connectRcon() {
  if (!process.env.RCON_HOST || !process.env.RCON_PASSWORD) {
    console.warn('RCON credentials not configured');
    return null;
  }

  try {
    const client = new Rcon({
      host: process.env.RCON_HOST,
      port: parseInt(process.env.RCON_PORT) || 27015,
      timeout: 5000,
    });

    await client.authenticate(process.env.RCON_PASSWORD);
    return client;
  } catch (error) {
    console.error('Failed to connect to RCON:', error.message);
    return null;
  }
}

async function fetchServerStatus() {
  try {
    if (!rconClient || !rconClient.authenticated) {
      rconClient = await connectRcon();
    }

    if (!rconClient) {
      return {
        status: 'offline',
        players: 0,
        maxPlayers: 64,
        lastUpdated: new Date().toISOString(),
      };
    }

    const response = await rconClient.execute('players');

    // Parse player count from response
    // Format varies by game, this is a simple implementation
    const playerCount = response.match(/Players: (\d+)/i);
    const players = playerCount ? parseInt(playerCount[1]) : 0;

    return {
      status: 'online',
      players,
      maxPlayers: 64,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch server status:', error.message);
    return {
      status: 'offline',
      players: 0,
      maxPlayers: 64,
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Update status every 30 seconds
setInterval(async () => {
  statusCache = await fetchServerStatus();
}, 30000);

// Initial fetch
fetchServerStatus().then((status) => {
  statusCache = status;
});

router.get('/', async (req, res) => {
  // If cache is old, fetch new data
  if (!statusCache.lastUpdated || Date.now() - new Date(statusCache.lastUpdated) > 30000) {
    statusCache = await fetchServerStatus();
  }

  res.json(statusCache);
});

export default router;
