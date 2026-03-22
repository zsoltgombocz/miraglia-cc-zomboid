import express from 'express';
import cors from 'cors';
import modsRoutes from './routes/mods.js';
import serverStatusRoutes from './routes/server-status.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/mods', modsRoutes);
app.use('/api/server-status', serverStatusRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000);
