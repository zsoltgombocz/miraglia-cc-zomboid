import express from 'express';
import { db } from '../db.js';
import { settings } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Get a setting by key
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await db.select().from(settings).where(eq(settings.key, key));

    if (setting.length === 0) {
      return res.json({ value: null });
    }

    res.json({ value: setting[0].value });
  } catch (error) {
    console.error('Failed to read setting:', error);
    res.status(500).json({ error: 'Failed to read setting' });
  }
});

// Update or create a setting
router.put('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    await db
      .insert(settings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value, updatedAt: new Date().toISOString() },
      });

    res.json({ success: true, value });
  } catch (error) {
    console.error('Failed to update setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

export default router;
