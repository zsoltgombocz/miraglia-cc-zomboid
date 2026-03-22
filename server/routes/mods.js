import express from 'express';
import { db } from '../db.js';
import { mods } from '../schema.js';
import { eq, desc } from 'drizzle-orm';

const router = express.Router();
const modCache = new Map();

async function fetchWorkshopItem(workshopId) {
  if (modCache.has(workshopId)) {
    return modCache.get(workshopId);
  }

  try {
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
        workshopId: workshopId,
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
    const allMods = await db
      .select({
        id: mods.workshopId,
        name: mods.name,
        description: mods.description,
        image: mods.image,
        displayOrder: mods.displayOrder,
      })
      .from(mods)
      .orderBy(mods.displayOrder, desc(mods.createdAt));

    res.json(allMods);
  } catch (error) {
    console.error('Failed to read mods:', error);
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

    try {
      await db.insert(mods).values({
        workshopId: modData.workshopId,
        name: modData.name,
        description: modData.description,
        image: modData.image,
      });

      res.json({ id: workshopId, ...modData });
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Mod already exists' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Failed to add mod:', error);
    res.status(500).json({ error: 'Failed to add mod' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(mods).where(eq(mods.workshopId, id));
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete mod:', error);
    res.status(500).json({ error: 'Failed to delete mod' });
  }
});

// Reorder mods
router.put('/reorder', async (req, res) => {
  try {
    const { mods: modOrder } = req.body; // Array of {id: workshopId, order: number}

    for (const mod of modOrder) {
      await db
        .update(mods)
        .set({ displayOrder: mod.order })
        .where(eq(mods.workshopId, mod.id));
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to reorder mods:', error);
    res.status(500).json({ error: 'Failed to reorder mods' });
  }
});

export default router;
