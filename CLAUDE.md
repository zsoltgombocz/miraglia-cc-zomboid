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

# Start development server (runs on http://localhost:5173)
bun run dev

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
