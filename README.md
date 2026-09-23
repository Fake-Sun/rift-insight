# Rift Insight

A responsive League of Legends stats dashboard built with Next.js, TypeScript, and Riot API integration.

## Highlights

- Next.js App Router architecture with TypeScript
- Secure Riot API access through server-side route handlers
- Responsive dashboard for desktop and mobile
- Live Riot ID lookup, ranked overview, mastery, match history, and champion breakdowns
- English and Spanish (LATAM) UI support
- Layered caching and manual refresh to reduce rate-limit pressure
- shadcn/ui components with Radix accessibility and Tailwind CSS 4 theme tokens
- Role-aware match scores and short, bilingual gameplay insights without additional Riot requests

## Stack

- Next.js
- React
- TypeScript
- shadcn/ui, Radix UI, Tailwind CSS 4
- Riot Games API
- Data Dragon

## Architecture

- `app/page.tsx`: main app entry
- `app/api/profile/route.ts`: live profile endpoint
- `app/api/health/route.ts`: health endpoint
- `features/rift-insight/`: client UI, state, and localized gameplay feedback
- `components/ui/`: shared shadcn components
- `components/custom-select.tsx`: typed wrapper around the Radix select
- `lib/match-analysis.ts`: pure match scoring and insight rules
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

## Match Insights

The Insight score is a transparent 0-100 heuristic, not an official Riot rating or a prediction of rank. It scores standard Summoner's Rift queues with ten players, a known role, and at least ten minutes played. Remakes and early surrenders are excluded.

Metric scores are clamped to 0-100, then combined using these weights:

| Metric | Formula | Lane / jungle | Support |
| --- | --- | --- | --- |
| Participation | Kill participation percentage | 25% | 30% |
| Survival | 100 - 20 x deaths per ten minutes | 25% | 25% |
| Economy | 50 x gold / opposing role's gold | 20% | 10% |
| Farming | 100 x CS/min / 8 (6 for jungle) | 20% | Excluded |
| Vision | 100 x vision score/min / 1 (2 for support) | 10% | 35% |

Missing metrics are omitted and remaining weights normalized. At least three measured metrics are required. A win or loss does not affect the score. Economy is omitted when an opposing role cannot be identified unambiguously. Benchmarks are general, not calibrated to champion, rank, or patch.

Each match shows at most three badges, prioritizing improvement opportunities while retaining a strength when available. Expanded details show the evidence and a practical tip. Early farming uses only Riot's `laneMinionsFirst10Minutes` challenge field; it is never estimated from end-game CS. No early-death claims are made without timestamped events. All analysis reuses the match response, with no timeline requests added.

Run `npm test` for scoring regression tests and `npm run build` for production verification. After building, `npm run test:ui` runs Chrome browser tests (requires Chrome installed). Browser tests intercept profile requests with fixtures; they do not use Riot API quota. Visual review screenshots are saved to the ignored `artifacts/` directory.

## Portfolio Summary

Rift Insight demonstrates full-stack API integration, TypeScript-based UI architecture, responsive product design, client-side localization, and practical handling of third-party API constraints like rate limits and server-side secret management.
