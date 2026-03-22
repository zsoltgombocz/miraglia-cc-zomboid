import express from 'express';

const WORKSHOP_MODS = [
  1299328280,
  2503622437,
  3632444452,
  3580276809,
  3461263912,
  3401134276,
  2463184726,
  2447729538,
  3429790870,
  3436537035,
  3437629766,
  3508537032,
  2684285534,
  3414634809,
  3616536783,
  2956146279,
  2950902979,
  2866258937,
  3431734923,
  3451167732,
  3171167894,
  3161951724,
  3570973322,
  3110913021,
  2952802178,
  3152529790,
  2962175696,
  3073430075,
  3330403100,
  3026723485,
  3052360250,
  3088951320,
  2625625421,
  3226885926,
  3287727378,
  3539691958,
  3435796523,
  3388107363,
  3625510824,
  3677017550,
  3680633169,
  3470422050,
  3470426196,
  3611718925,
  3682045254,
  3058134369,
  3685155134,
  3600401184,
  3676456221,
  3268487204,
  3469292499,
  3386906181,
  2896041179,
  3077900375,
];

const router = express.Router();
const modCache = new Map();

async function fetchWorkshopItems(workshopIds) {
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
    const allMods = await fetchWorkshopItems(WORKSHOP_MODS);

    res.json(allMods);
  } catch (error) {
    console.error('Failed to fetch mods:', error);
    res.status(500).json({ error: 'Failed to fetch mods' });
  }
});

export default router;
