import express from 'express';
import { db } from '../db.js';
import { content } from '../schema.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await db.select().from(content);

    const contentData = {};
    for (const row of rows) {
      if (!contentData[row.language]) {
        contentData[row.language] = {};
      }
      contentData[row.language][row.section] = row.data;
    }

    res.json(contentData);
  } catch (error) {
    console.error('Failed to read content:', error);
    res.status(500).json({ error: 'Failed to read content' });
  }
});

router.put('/', async (req, res) => {
  try {
    const contentData = req.body;

    for (const [language, sections] of Object.entries(contentData)) {
      for (const [section, data] of Object.entries(sections)) {
        await db
          .insert(content)
          .values({ language, section, data })
          .onConflictDoUpdate({
            target: [content.language, content.section],
            set: { data },
          });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to update content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

export default router;
