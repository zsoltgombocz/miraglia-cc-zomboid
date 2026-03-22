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

### Backend (Node.js + Express)

Located in `server/` directory:

- **server/index.js** - Main Express server with CORS, JSON support
- **server/routes/auth.js** - Password authentication
- **server/routes/content.js** - Content management (hero, server info)
- **server/routes/mods.js** - Workshop mod management with Steam API
- **server/routes/forms.js** - Form submissions and testimonials
- **server/routes/server-status.js** - RCON integration for live server stats
- **server/data/** - JSON files for data storage (gitignored except .gitkeep)

### Environment Variables

Copy `.env.example` to `.env` and configure:

- `ADMIN_PASSWORD` - Master password for admin panel (default: admin123)
- `RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD` - Optional: For live server status
- `STEAM_API_KEY` - Optional: For fetching workshop mod details
- `PORT` - Backend server port (default: 3001)

### Admin Features

**Access**: Navigate to `http://localhost:5173/admin`

1. **Content Editor**
   - Edit hero section (title, description)
   - Edit server info fields (region, gameplay style, wipe policy, etc.)
   - Changes saved to `server/data/content.json`

2. **Mod Manager**
   - Add workshop mods by Steam Workshop ID
   - Auto-fetch mod details from Steam API (name, description, thumbnail)
   - Delete mods from the list
   - Mods stored in `server/data/mods.json`

3. **Form & Testimonial Manager**
   - View all submitted forms from the feedback section
   - Promote feedback submissions to testimonials (survivor logs)
   - Delete forms or testimonials
   - Forms stored in `server/data/forms.json`
   - Testimonials stored in `server/data/testimonials.json`

### Data Flow

- Frontend fetches dynamic content from backend API
- Admin panel updates are saved to JSON files in `server/data/`
- Server status is cached and updated every 30 seconds via RCON (if configured)
- Workshop mods are cached after first fetch to reduce API calls
