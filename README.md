# Breathe

A personal, browser-local habit tracker for Smoking, Oranges, and Sweets.

## Development

Run `npm ci`, then `npm run dev`. Validate using `npx vue-tsc --noEmit` and `npm run build`.

## Features

- Independent local start dates, craving events, trigger tags and daily mood check-ins.
- Smoking recovery milestones linked to CDC/NHS sources, with explicit uncertainty and no fabricated vitals.
- Practical daily prompts for each habit, three-minute pause timer and seven-day event chart.
- Yen savings estimates from configurable smoking habits.
- JSON backup export and validated restore of all three trackers.
- No account, backend data collection, analytics, push reminders or cloud sync.

Data uses localStorage key `breathe-v2`; the prior single-tracker `breathe-v1` shape can be migrated. Old NAMA learning data is not touched. Historical Japanese app code remains available in Git history. Production remains the existing `nama-japanese` Vercel project and URL.

Health milestones are educational population-level information for cigarette cessation, not measured vitals or individual predictions. Support prompts do not diagnose conditions. The Oranges label is deliberately neutral throughout this app.
