# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A diet-tracking web app (Next.js 15 + TypeScript + Tailwind CSS) that lets users photograph meals, analyze calories and nutrients via the Claude API, and view a weekly calendar summary.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
```

## Architecture

### Key flows

1. **Meal logging** (`/log`): User selects a photo → `compressImage()` (client, canvas) → POST `/api/analyze` → Claude vision API returns JSON with calories/macros → user confirms/edits → POST `/api/meals` → saved to Supabase.

2. **Today dashboard** (`/`): Client component fetches `/api/meals?date=YYYY-MM-DD` on mount. Aggregates nutrition totals client-side and renders `<NutritionSummary>` + `<MealCard>` list.

3. **Calendar** (`/calendar`): Fetches a week range `/api/meals?start_date=…&end_date=…`, groups meals by date client-side into `DayStats`, passes to `<WeekCalendar>`. Selecting a day fetches that day's meals separately.

### Auth / identity

No authentication. A UUID is generated on first visit and stored in `localStorage` (`diet_user_id`). All API route calls include `x-user-id` header. API routes use this value as `user_id` in Supabase queries.

### Photo storage

Photos are compressed to JPEG 640px / 60% quality client-side (`src/lib/imageUtils.ts`) and stored as base64 data URLs directly in the `photo_url` column. For production scale, switch to Supabase Storage and store the public URL instead.

### Claude API (`/api/analyze`)

Sends the base64 image + a Japanese prompt. Expects back a raw JSON object (no markdown). Strips code fences before `JSON.parse`. Uses model `claude-sonnet-4-6`.

### Data layer

All DB access goes through Next.js API routes (`src/app/api/`). The Supabase client is instantiated per-request in route handlers (not a singleton) to avoid edge-runtime issues. Schema is in `supabase/schema.sql`.

## Environment setup

Copy `.env.local.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
ANTHROPIC_API_KEY
```

Run `supabase/schema.sql` in the Supabase SQL Editor before first use.
