import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import SteamAPI from 'steam-api';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/mods.json');

const steam = process.env.STEAM_API_KEY ? new SteamAPI(process.env.STEAM_API_KEY) : null;
const modCache = new Map();

async function fetchWorkshopItem(workshopId) {
  if (modCache.has(workshopId)) {
    return modCache.get(workshopId);
  }

  try {
    if (!steam) {
      throw new Error('Steam API key not configured');
    }

    const response = await fetch(
      `https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `itemcount=1&publishedfileids[0]=${workshopId}`,
      }
    );

    const data = await response.json();
    const item = data.response.publishedfiledetails[0];

    if (item && item.result === 1) {
      const modData = {
        id: workshopId,
        name: item.title,
        description: item.short_description || item.description?.substring(0, 100) || '',
        image: item.preview_url,
      };
      modCache.set(workshopId, modData);
      return modData;
    }
  } catch (error) {
    console.error(`Failed to fetch workshop item ${workshopId}:`, error);
  }

  return null;
}

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.json([]);
  }
});

router.post('/', async (req, res) => {
  try {
    const { workshopId } = req.body;
    const modData = await fetchWorkshopItem(workshopId);

    if (!modData) {
      return res.status(404).json({ error: 'Workshop item not found' });
    }

    const data = await fs.readFile(dataPath, 'utf-8');
    const mods = JSON.parse(data);
    mods.push(modData);

    await fs.writeFile(dataPath, JSON.stringify(mods, null, 2));
    res.json(modData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add mod' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(dataPath, 'utf-8');
    const mods = JSON.parse(data);

    const filteredMods = mods.filter((mod) => mod.id !== id);
    await fs.writeFile(dataPath, JSON.stringify(filteredMods, null, 2));

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete mod' });
  }
});

export default router;
