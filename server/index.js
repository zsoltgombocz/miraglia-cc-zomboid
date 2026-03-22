import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import modsRoutes from './routes/mods.js';
import formsRoutes from './routes/forms.js';
import serverStatusRoutes from './routes/server-status.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize data files if they don't exist
async function initializeDataFiles() {
  const dataDir = path.join(__dirname, 'data');

  const defaultFiles = {
    'content.json': {
      en: {
        hero: {
          title: 'NewDawn Zomboid',
          description: 'A brutal, community-driven survival experience. Scavenge, build, and outlive the horde in a meticulously crafted world.',
        },
        serverInfo: {
          region: 'North America (East)',
          gameplayStyle: 'PvPvE / Light Roleplay',
          wipePolicy: 'No scheduled wipes',
          lootRespawn: 'Every 2 in-game months',
          additionalNotes: 'In-game voice chat is highly encouraged. Factions can claim safehouses after 3 days of playtime. Reading speeds are increased by 2x to respect your time.',
        },
      },
      hu: {
        hero: {
          title: 'NewDawn Zomboid',
          description: 'Brutális, közösség által vezérelt túlélési élmény. Gyűjts, építs, és éld túl a hordát egy gondosan kidolgozott világban.',
        },
        serverInfo: {
          region: 'Észak-Amerika (Kelet)',
          gameplayStyle: 'PvPvE / Könnyű Roleplay',
          wipePolicy: 'Nincs tervezett törlés',
          lootRespawn: '2 játékbeli hónaponként',
          additionalNotes: 'A játékon belüli hangchat erősen ajánlott. A frakciók 3 nap játékidő után igényelhetnek biztonságos házakat. Az olvasási sebesség 2x-re van növelve, hogy tiszteletben tartsuk az idődet.',
        },
      },
    },
    'mods.json': [],
    'forms.json': [],
    'testimonials.json': [
      {
        quote: "Best balance of mods I've found. It's brutal enough to be scary, but the QoL mods make it bearable to rebuild after dying.",
        author: 'Marcus T.',
        initial: 'M',
      },
      {
        quote: 'The admin team is super responsive. The server economy and faction wars make late-game actually worth playing.',
        author: 'Sarah204',
        initial: 'S',
      },
      {
        quote: 'Love the customized safehouse rules. Gives us a reason to fight over territory without completely losing our progress to a glitch.',
        author: 'Alex G.',
        initial: 'A',
      },
      {
        quote: "Hardcore survival at its finest. If you're looking for an easy time, look elsewhere. The loot settings are perfectly scarce.",
        author: 'ZombieBait',
        initial: 'Z',
      },
    ],
  };

  for (const [filename, defaultContent] of Object.entries(defaultFiles)) {
    const filePath = path.join(dataDir, filename);
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaultContent, null, 2));
      console.log(`Created ${filename} with default content`);
    }
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/mods', modsRoutes);
app.use('/api/forms', formsRoutes);
app.use('/api/server-status', serverStatusRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
initializeDataFiles().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
