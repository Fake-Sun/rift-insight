# Rift Insight

A responsive League of Legends stats dashboard built with Next.js, TypeScript, and Riot API integration.

## Highlights

- Next.js App Router architecture with TypeScript
- Secure Riot API access through server-side route handlers
- Responsive dashboard for desktop and mobile
- Live Riot ID lookup, ranked overview, mastery, match history, and champion breakdowns
- English and Spanish (LATAM) UI support
- Layered caching and manual refresh to reduce rate-limit pressure

## Stack

- Next.js
- React
- TypeScript
- Riot Games API
- Data Dragon

## Architecture

- `app/page.tsx`: main app entry
- `app/api/profile/route.ts`: live profile endpoint
- `app/api/health/route.ts`: health endpoint
- `components/rift-insight-app.tsx`: client UI
- `components/custom-select.tsx`: reusable custom dropdown
- `lib/riot.ts`: Riot API integration and caching
- `lib/types.ts`: shared TypeScript models

## Local Run

1. Copy `.env.example` to `.env`
2. Set `RIOT_API_KEY`
3. Install dependencies
4. Start the app

```powershell
npm install
$env:RIOT_API_KEY="your-key"
npm run dev
```

Then open `http://localhost:3000`.

## Deployment

The repo includes a Dockerfile for container-based deployment. Set `RIOT_API_KEY` in your hosting environment before starting the app.

## Portfolio Summary

Rift Insight demonstrates full-stack API integration, TypeScript-based UI architecture, responsive product design, client-side localization, and practical handling of third-party API constraints like rate limits and server-side secret management.
