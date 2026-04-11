import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const modCache = new Map();

async function fetchWorkshopItems(workshopIds) {
  if (!workshopIds || workshopIds.length === 0) return [];

  try {
    let requestBody = `itemcount=${workshopIds.length}`;

    workshopIds.forEach((id, index) => {
      requestBody += `&publishedfileids[${index}]=${id}`;
    });

    const response = await fetch(
      `https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: requestBody,
      }
    );

    const data = await response.json();
    const items = data.response?.publishedfiledetails || [];

    const modResults = [];
    for (const item of items) {
      if (item && item.result === 1) {
        const modData = {
          workshopId: item.publishedfileid,
          name: item.title,
          description: item.short_description || item.description?.substring(0, 100) || '',
          image: item.preview_url,
        };
        modCache.set(item.publishedfileid, modData);
        modResults.push(modData);
      }
    }

    return modResults;
  } catch (error) {
    console.error('Failed to fetch workshop items:', error);
    return [];
  }
}

router.get('/', async (req, res) => {
  try {
    const changelogPath = path.join(__dirname, '../data/changelog.json');
    const changelogData = await fs.readFile(changelogPath, 'utf-8');
    const changelog = JSON.parse(changelogData);

    // Enrich changelog entries with mod details
    const enrichedChangelogs = await Promise.all(
      changelog.map(async (entry) => {
        const [addedModsDetails, removedModsDetails] = await Promise.all([
          fetchWorkshopItems(entry.addedMods),
          fetchWorkshopItems(entry.removedMods),
        ]);

        return {
          ...entry,
          addedModsDetails,
          removedModsDetails,
        };
      })
    );

    res.json({ changelogs: enrichedChangelogs });
  } catch (error) {
    console.error('Failed to fetch changelog:', error);
    res.status(500).json({ error: 'Failed to fetch changelog' });
  }
});

router.get('/new-mods', async (req, res) => {
  try {
    const changelogPath = path.join(__dirname, '../data/changelog.json');
    const changelogData = await fs.readFile(changelogPath, 'utf-8');
    const changelog = JSON.parse(changelogData);

    const latestChangelogWithMods = changelog.find(entry =>
      entry.addedMods && entry.addedMods.length > 0
    );
    const newMods = latestChangelogWithMods?.addedMods || [];

    res.json({ newMods });
  } catch (error) {
    console.error('Failed to fetch new mods:', error);
    res.status(500).json({ error: 'Failed to fetch new mods' });
  }
});

export default router;
