# NEET Study Tracker — Next.js app

Production-ready Next.js 15 / React 19 / TypeScript rebuild of the full study
tracker: **Today**, **Study Log**, **Planner**, and **Dashboard**.

Two distinct visual materials are used on purpose, matching the two design
briefs given for this app:

- **Today & Dashboard** — purple "Liquid Glass" acrylic theme (frosted glass
  cards, ambient purple glow, breathing background blobs).
- **Study Log & Planner** — dark "premium fintech dashboard" theme (matte
  floating cards, one accent color per card: lime / purple / cyan / emerald /
  gold).

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4 (CSS-first `@theme` config, see `app/globals.css`)
- Framer Motion (all entrance/hover/tap/tilt/parallax animation)
- Recharts (bar chart + radial progress arcs)
- Lucide React (icons)

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000 — it redirects to `/today`. Use the top nav
to switch between Today, Study Log, Planner, and Dashboard.

## Data

State (log hours, exam date, planner progress) is saved to the browser's
`localStorage` under the key `neet_tracker_v1` — the same key the standalone
`neet-study-tracker.html` file uses, so progress carries over automatically
if you open this app in the same browser.

## Project structure

```
app/
  layout.tsx            root layout (no global backdrop — each page sets its own)
  page.tsx               redirects to /today
  today/page.tsx
  study-log/page.tsx
  planner/page.tsx
  dashboard/page.tsx
components/
  ui/
    GlowCard.tsx          fintech-theme card (Study Log / Planner)
    LiquidGlassCard.tsx   Liquid Glass acrylic card (Today / Dashboard)
    MatteBackdrop.tsx     dark ambient page background (Study Log / Planner)
    LiquidBackdrop.tsx    purple ambient page background (Today / Dashboard)
    CapsuleButton.tsx, StatCard.tsx, PageShell.tsx
  today/                 Countdown, Stopwatch, TodaySection
  study-log/              Heatmap, HoursBarChart, Ledger, StudyLogSection
  planner/                ChapterRow, SubjectCard, PlannerSection
  dashboard/              DashboardSection
lib/
  types.ts                shared TypeScript types
  data.ts                  chapter lists + accent color map (one accent per card)
  date-utils.ts            pure date helpers
  useTrackerState.ts       the persisted state hook (all read/write logic, shared by all 4 sections)
  useCountUp.ts            animated number hook for stat cards
```

## Design notes

- Fintech cards use **exactly one** accent color (lime / purple / cyan /
  emerald / gold) — never blended.
- Liquid Glass cards use `backdrop-filter: blur(30px)`, a translucent white
  fill, an inset highlight, and a purple outer glow, with a slow ambient
  shadow pulse and a cursor-follow spotlight.
- Both backdrop types react to cursor and touch movement (pointer + touch
  listeners drive a Framer Motion spring, which the background blobs read).
- Buttons are capsule-shaped, lift and brighten on hover, compress on click.

