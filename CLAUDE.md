# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based travel itinerary web app for a 9-day winter road trip in Japan's Tohoku region (東北). Features an interactive map with Leaflet, day-by-day scheduling, dangerous winter road warnings, accommodation bookings, packing checklist, and weather forecasts.

**Live URL:** tohoku-2026-tw.zeabur.app

## Commands

```bash
# Development
npm run dev          # Start Vite dev server

# Build
npm run build        # Production build to dist/

# Preview production build
npm run preview

# Run Playwright tests
npx playwright test

# Run single test file
npx playwright test tests/app.spec.ts

# Run tests with UI
npx playwright test --ui
```

## Architecture

### Core Data Flow

```
constants.ts (ITINERARY_DATA, DANGEROUS_ROUTES)
       ↓
    App.tsx (main component, map rendering, state management)
       ↓
supabaseClient.ts (persistent storage for notes, checklist, custom locations)
```

### Key Files

| File | Purpose |
|------|---------|
| `App.tsx` | Main component (~1200 lines). Contains map rendering, all tabs (地圖/行程/住宿/機票/清單/匯出), sidebar, and state management |
| `constants.ts` | All itinerary data (`ITINERARY_DATA: DayPlan[]`) and dangerous winter routes (`DANGEROUS_ROUTES`) |
| `types.ts` | TypeScript interfaces: `TripEvent`, `DayPlan`, `WeatherData` |
| `checklistData.ts` | Packing checklist categories and items (`PACKING_CHECKLIST`) |
| `supabaseClient.ts` | Supabase integration for persisting notes, checklist state, and custom marker locations |
| `weatherService.ts` | Weather data fetching |

### Map Features

- Uses `react-leaflet` with OpenStreetMap tiles
- Each day has a unique color (defined in `DayPlan.color`)
- Dangerous routes are polylines with status: `'closed'` | `'dangerous'` | `'caution'`
- Custom marker locations can be saved to override default lat/lng
- Legend shows day colors with hover-to-highlight functionality

### Data Persistence (Supabase)

The app uses Supabase for:
- `trip_notes` - Extended notes for each event
- `checklist_items` - Checkbox states for packing list
- `custom_checklist_items` - User-added checklist items
- `event_locations` - Custom lat/lng overrides for markers

## Important Context

### Winter Driving Warnings

This is a **winter road trip** (February). The `DANGEROUS_ROUTES` array in `constants.ts` defines hazardous mountain passes that should be avoided. Each route has:
- `status`: 'closed' (冬季封閉), 'dangerous' (極度危險), or 'caution' (注意安全)
- `affectedDays`: Which trip days are impacted
- `coordinates`: Polyline points to display on map

When adding driving notes, always include:
1. Safe alternative routes with navigation waypoints
2. Warnings about dangerous roads to avoid
3. Tips for winter driving (engine braking, fuel stops, weather checks)

### Itinerary Event Structure

Events in `ITINERARY_DATA` can have:
- `importantNotes`: Displayed prominently in orange/red (for warnings, driving tips)
- `notes`: Regular notes
- `booking`: Hotel/activity reservation details
- `flight`: Flight information for Day 1/9

### Language

The app UI and all content is in **Traditional Chinese (繁體中文)**. Japanese location names are kept in their original form.
