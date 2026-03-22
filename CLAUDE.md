# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Landing page for "NewDawn" - a Project Zomboid multiplayer server for EU and Hungarian players. The site showcases server information, mods, rules, and connection details with a dark survival-themed aesthetic.

## Tech Stack

- **React** - Component-based UI
- **Tailwind CSS** - Utility-first styling
- **bun** - Package manager
- **Vite** - Build tool and dev server

## Development Commands

```bash
# Install dependencies
bun install

# Start frontend development server (runs on http://localhost:5173)
bun run dev

# Start backend server (runs on http://localhost:3001)
bun run server

# Start both frontend and backend concurrently
bun run dev:all

# Build for production
bun run build

# Preview production build
bun run preview
```

## Design Reference

**`aura.build`** is the completed HTML design prototype and serves as the single source of truth for the visual design. **Do not modify this file** - use it as reference when building React components.

## Design Principles

- **Clean and minimal** - Avoid overdesign and unnecessary complexity
- **Dark survival atmosphere** - Inspired by Project Zomboid's aesthetic
- **Readable and practical** - Prioritize content hierarchy and spacing
- **No sticky header** - Floating side navigation instead
- **No footer** - Content ends with feedback section
- **Subtle interactions** - Avoid flashy animations; use simple transitions

## Architecture Guidelines

- **Prefer small reusable components** - Break UI into focused, composable pieces
- **Component structure should mirror sections**:
  - Navigation (floating nav with icon links)
  - Hero (server status, CTAs)
  - ServerInfo (grid of server details)
  - Mods (grid of mod cards with Steam Workshop links)
  - HowToJoin (step-by-step timeline)
  - Rules (collapsible accordion)
  - Feedback (testimonial slider + contact form)
- **Preserve spacing and readability** - Match the generous spacing in aura.build
- **Keep sections minimal** - Each section should serve one clear purpose

## Multilanguage Support

The app supports English and Hungarian with a minimal language switcher:

- **Context**: `src/contexts/LanguageContext.jsx` - React Context for language state
- **Translations**: `src/locales/en.json` and `src/locales/hu.json`
- **Usage**: Use `const { t } = useLanguage()` hook and call `t('key.path')` for translations
- **Switcher**: Minimal EN/HU toggle in navigation (top of floating nav)
- **Persistence**: Language preference saved in browser localStorage
- **Adding languages**: Create new JSON file in `src/locales/` and add to `translations` object in LanguageContext

## Admin Panel

The project includes a full admin panel at `/admin` for managing content:

### Backend (Node.js + Express + Drizzle ORM)

Located in `server/` directory:

- **server/index.js** - Main Express server with CORS, JSON support
- **server/db.js** - Drizzle ORM database connection
- **server/schema.js** - Database schema definitions (content, mods, forms, testimonials)
- **server/database.js** - Database initialization and migration from JSON files
- **server/routes/auth.js** - Password authentication
- **server/routes/content.js** - Content management using Drizzle ORM
- **server/routes/mods.js** - Workshop mod management with Steam API
- **server/routes/forms.js** - Form submissions and testimonials
- **server/routes/server-status.js** - RCON integration for live server stats
- **server/data/zomboid.db** - SQLite database (gitignored)

### Environment Variables

Copy `.env.example` to `.env` and configure:

- `ADMIN_PASSWORD` - Master password for admin panel (default: admin123)
- `RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD` - Optional: For live server status
- `STEAM_API_KEY` - Optional: For fetching workshop mod details
- `PORT` - Backend server port (default: 3001)

### Admin Features

**Access**: Navigate to `http://localhost:5173/admin`

1. **Content Editor**
   - Edit hero section (title, description) for both languages
   - Edit server info (region, gameplay style, wipe policy, etc.) for both languages
   - Edit server rules (add, edit, remove rules) for both languages
   - Language tabs for English/Hungarian content management
   - Changes saved to SQLite database
   - **Note**: Server status (online/offline, player count) is NOT editable - it comes exclusively from RCON

2. **Mod Manager**
   - Add workshop mods by Steam Workshop ID
   - Auto-fetch mod details from Steam API (name, description, thumbnail)
   - Delete mods from the list
   - Mods stored in SQLite database

3. **Form & Testimonial Manager**
   - View all submitted forms from the feedback section
   - Promote feedback submissions to testimonials (survivor logs)
   - Delete forms or testimonials
   - Data stored in SQLite database
   - **Note**: Testimonials section is hidden on frontend if no testimonials exist

### Database & Data Flow

**Database**: SQLite with Drizzle ORM for type-safe queries

- **Database file**: `server/data/zomboid.db`
- **Schema**: Defined in `server/schema.js` (content, mods, forms, testimonials tables)
- **Initialization**: On first run, reads from `content.json` and `testimonials.json` if they exist, then deletes them after migration
- **Queries**: All routes use Drizzle ORM query builder for type safety and performance

**Data Flow**:
- Frontend fetches dynamic content from backend API endpoints
- Admin panel updates are saved to SQLite database via Drizzle ORM
- **Server status** (online/offline, players, IP, port) is queried exclusively from RCON every 30 seconds
  - Endpoint: `/api/server-status`
  - Hero component fetches and displays live RCON data
  - No static server status fields exist in admin panel
- Workshop mods are cached in memory after first fetch to reduce Steam API calls
- All content supports multilanguage (English/Hungarian)

### RCON Integration

**Important**: The RCON package requires `require()` instead of ES imports. See `server/routes/server-status.js`:

```javascript
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Rcon = require('rcon-srcds');
```

- RCON credentials configured in `.env` (RCON_HOST, RCON_PORT, RCON_PASSWORD)
- Status cached for 30 seconds to reduce RCON queries
- Returns offline status if RCON connection fails
