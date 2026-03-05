# TechaNewz Frontend

A modern, mobile-first news aggregation platform built with React, TypeScript, and SCSS. See [FEATURES.md](./FEATURES.md) for a full overview of the app and its features.

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (default: `http://localhost:5005`)

## Quick start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and set: VITE_API_BASE_URL=http://localhost:5005

# Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

## Commands

| Command | Description |
|--------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run build` | Production build (output in `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

## Configuration

### Environment variables

Create a `.env` file (copy from `.env.example`):

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5005` |

### TypeScript path aliases

Imports use the `@/` alias:

```typescript
import { NewsCard } from '@/components/NewsCard/NewsCard';
import { apiService } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
```

## Project structure

```
src/
├── components/     # Reusable UI (BottomNav, TopBar, Sidebar, Layout, NewsCard, LoadingSpinner, ErrorBoundary)
├── pages/          # Home, Explore, Profile
├── contexts/       # UserContext
├── hooks/          # useInfiniteScroll, useHome, useExplore
├── services/       # api.ts
├── styles/         # designSystem.scss, global.scss
├── types/          # TypeScript definitions
├── App.tsx
└── main.tsx
```

## API integration

The app talks to the TechaNewz backend. Main endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/news/feed?userId=...&page=1&limit=10` | Personalized feed (unviewed items) |
| GET | `/api/news?page=1&limit=10` | All news (paginated) |
| GET | `/api/news/:id` | Single news item |
| GET | `/api/news/tags?tags=AI,Web%20Development&page=1&limit=10` | News by tags |
| POST | `/api/news/:id/view` | Mark as viewed (body: `{"userId": "user123"}`) |

**Example – get feed:**

```bash
curl "http://localhost:5005/api/news/feed?userId=user123&page=1&limit=10"
```

**Example – mark as viewed:**

```bash
curl -X POST "http://localhost:5005/api/news/NEWS_ID/view" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user123"}'
```

Ensure the backend is running and `VITE_API_BASE_URL` in `.env` matches it.

## Styling and design system

Styles use `src/styles/designSystem.scss`: colors, spacing, typography, radius, shadows, breakpoints, and mixins (e.g. `card-base`, `button-base`, `glass-effect`).

**In a component SCSS module:**

```scss
@import '../../styles/designSystem.scss';

.myBlock {
  background-color: color(card-bg);
  padding: spacing(4);
  border-radius: radius(lg);
  @include typography(base, medium, normal);
  @include breakpoint(md) { padding: spacing(8); }
}
```

**Component folder pattern:** `ComponentName/ComponentName.tsx`, `ComponentName.module.scss`, and optionally `useComponentName.ts` for logic.

## Testing on mobile

1. Get your machine’s IP: `ifconfig | grep "inet "` (macOS/Linux) or `ipconfig` (Windows).
2. Ensure the dev server is bound to `0.0.0.0` (see `vite.config.ts`).
3. On the phone, open `http://YOUR_IP:3000`.

## Troubleshooting

**Port 3000 in use:**

```bash
lsof -ti:3000 | xargs kill -9
```

**Module not found / install issues:**

```bash
rm -rf node_modules package-lock.json
npm install
```

**API connection:**

- Confirm backend is running on the port in `.env`.
- Check backend CORS allows your frontend origin.
- Confirm `VITE_API_BASE_URL` in `.env` (no trailing slash).

**Build / type errors:**

```bash
npm run build
npm run lint
```

## Deployment

**Vercel:**

```bash
npm i -g vercel
vercel
```

**Netlify:** Build command: `npm run build`, publish directory: `dist`.

**Static server:** Run `npm run build` and serve the `dist/` folder.

Set `VITE_API_BASE_URL` in the deployment environment to your production API URL.

## Tech stack

- React 18, TypeScript, Vite, React Router, Axios, SCSS, React Icons

## Code guidelines

- Use the design system for colors, spacing, and typography.
- Mobile-first responsive styles.
- Component structure: UI in `.tsx`, logic in hooks, scoped styles in `.module.scss`.
- Semantic HTML and accessibility (ARIA, keyboard navigation, 44px touch targets).

## Contributing

Follow the existing structure and design system; keep styles mobile-first and TypeScript strict.

## License

© 2026 TechaNewz. All rights reserved.
