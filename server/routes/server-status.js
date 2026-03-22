import express from 'express';
import { Rcon } from "rcon-client"
import {configDotenv} from "dotenv";

configDotenv();

const router = express.Router();

let statusCache = {
  status: 'offline',
  players: null,
  maxPlayers: null,
  lastUpdated: null,
};

let rconClient = null;

async function connectRcon() {
  try {
    const rcon = await Rcon.connect({
      host: process.env.RCON_HOST,
      port: parseInt(process.env.RCON_PORT),
      password: process.env.RCON_PASSWORD
    });

    console.log('RCON connected successfully');

    return rcon;
  } catch (error) {
    console.error('Failed to connect to RCON:', error.message);
    return null;
  }
}

async function fetchServerStatus() {
  try {
    if (! rconClient) {
      rconClient = await connectRcon();
    }

    if (! rconClient) {
      return {
        status: 'offline',
        players: null,
        maxPlayers: null,
        lastUpdated: new Date().toISOString(),
      };
    }

    const response = await rconClient.send('players');

    const playerCount = response.match(/Players: (\d+)/i);
    const players = playerCount ? parseInt(playerCount[1]) : 0;

    return {
      status: 'online',
      players,
      maxPlayers: 32,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch server status:', error.message);

    rconClient = null;
    return {
      status: 'offline',
      players: null,
      maxPlayers: null,
      lastUpdated: new Date().toISOString(),
    };
  }
}

setInterval(async () => {
  statusCache = await fetchServerStatus();
}, 30000);

fetchServerStatus().then((status) => {
  statusCache = status;
});

router.get('/', async (req, res) => {
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
