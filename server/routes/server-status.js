import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Rcon = require('rcon-srcds');

const router = express.Router();

let statusCache = {
  status: 'unavailable',
  players: null,
  maxPlayers: null,
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
    console.log('RCON connected successfully');
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
        status: 'unavailable',
        players: null,
        maxPlayers: null,
        lastUpdated: new Date().toISOString(),
      };
    }

    // Try to execute the players command
    const response = await rconClient.execute('players');

    // Parse player count from response
    // Format varies by game, adjust regex as needed for Project Zomboid
    const playerCount = response.match(/Players: (\d+)/i);
    const players = playerCount ? parseInt(playerCount[1]) : 0;

    // If we successfully got data, server is online
    return {
      status: 'online',
      players,
      maxPlayers: 64, // You might want to get this from the RCON response too
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch server status:', error.message);
    // Clear the client so we try to reconnect next time
    rconClient = null;
    return {
      status: 'unavailable',
      players: null,
      maxPlayers: null,
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

  res.json({
    ...statusCache,
    ip: process.env.SERVER_IP || null,
    port: process.env.SERVER_PORT || null,
  });
});

export default router;
