import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/forms.json');
const testimonialsPath = path.join(__dirname, '../data/testimonials.json');

router.post('/submit', async (req, res) => {
  try {
    const { type, steamName, message } = req.body;

    const data = await fs.readFile(dataPath, 'utf-8');
    const forms = JSON.parse(data);

    const newForm = {
      id: Date.now().toString(),
      type,
      steamName,
      message,
      timestamp: new Date().toISOString(),
    };

    forms.push(newForm);
    await fs.writeFile(dataPath, JSON.stringify(forms, null, 2));

    res.json({ success: true, form: newForm });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.json([]);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fs.readFile(dataPath, 'utf-8');
    const forms = JSON.parse(data);

    const filteredForms = forms.filter((form) => form.id !== id);
    await fs.writeFile(dataPath, JSON.stringify(filteredForms, null, 2));

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete form' });
  }
});

// Promote form to testimonial
router.post('/:id/promote', async (req, res) => {
  try {
    const { id } = req.params;

    const formsData = await fs.readFile(dataPath, 'utf-8');
    const forms = JSON.parse(formsData);
    const form = forms.find((f) => f.id === id);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const testimonialsData = await fs.readFile(testimonialsPath, 'utf-8');
    const testimonials = JSON.parse(testimonialsData);

    const initial = form.steamName ? form.steamName[0].toUpperCase() : 'A';
    const newTestimonial = {
      quote: form.message,
      author: form.steamName,
      initial,
    };

    testimonials.push(newTestimonial);
    await fs.writeFile(testimonialsPath, JSON.stringify(testimonials, null, 2));

    res.json({ success: true, testimonial: newTestimonial });
  } catch (error) {
    res.status(500).json({ error: 'Failed to promote form' });
  }
});

// Get testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const data = await fs.readFile(testimonialsPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.json([]);
  }
});

// Delete testimonial
router.delete('/testimonials/:index', async (req, res) => {
  try {
    const index = parseInt(req.params.index);
    const data = await fs.readFile(testimonialsPath, 'utf-8');
    const testimonials = JSON.parse(data);

    testimonials.splice(index, 1);
    await fs.writeFile(testimonialsPath, JSON.stringify(testimonials, null, 2));

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

export default router;
