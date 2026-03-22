import express from 'express';
import { db } from '../db.js';
import { forms, testimonials } from '../schema.js';
import { eq, desc } from 'drizzle-orm';

const router = express.Router();

router.post('/submit', async (req, res) => {
  try {
    const { type, steamName, message } = req.body;

    const result = await db.insert(forms).values({
      type,
      steamName,
      message,
    });

    res.json({
      success: true,
      form: {
        id: result.lastInsertRowid,
        type,
        steamName,
        message,
      },
    });
  } catch (error) {
    console.error('Failed to submit form:', error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

router.get('/', async (req, res) => {
  try {
    const allForms = await db
      .select({
        id: forms.id,
        type: forms.type,
        steamName: forms.steamName,
        message: forms.message,
        timestamp: forms.createdAt,
      })
      .from(forms)
      .orderBy(desc(forms.createdAt));

    res.json(allForms);
  } catch (error) {
    console.error('Failed to read forms:', error);
    res.json([]);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(forms).where(eq(forms.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete form:', error);
    res.status(500).json({ error: 'Failed to delete form' });
  }
});

// Promote form to testimonial
router.post('/:id/promote', async (req, res) => {
  try {
    const { id } = req.params;

    const form = await db.select().from(forms).where(eq(forms.id, id));

    if (!form || form.length === 0) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const formData = form[0];
    const initial = formData.steamName ? formData.steamName[0].toUpperCase() : 'A';

    await db.insert(testimonials).values({
      quote: formData.message,
      author: formData.steamName,
      initial,
    });

    res.json({
      success: true,
      testimonial: {
        quote: formData.message,
        author: formData.steamName,
        initial,
      },
    });
  } catch (error) {
    console.error('Failed to promote form:', error);
    res.status(500).json({ error: 'Failed to promote form' });
  }
});

// Get testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const allTestimonials = await db
      .select({
        id: testimonials.id,
        quote: testimonials.quote,
        author: testimonials.author,
        initial: testimonials.initial,
      })
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));

    res.json(allTestimonials);
  } catch (error) {
    console.error('Failed to read testimonials:', error);
    res.json([]);
  }
});

// Delete testimonial
router.delete('/testimonials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(testimonials).where(eq(testimonials.id, id));
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router;
