import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './database.js';

// Routes
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import modsRoutes from './routes/mods.js';
import formsRoutes from './routes/forms.js';
import serverStatusRoutes from './routes/server-status.js';
import settingsRoutes from './routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/mods', modsRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/server-status', serverStatusRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize database and start server
await initializeDatabase();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
