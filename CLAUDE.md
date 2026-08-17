# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React Native volunteer app built for the University of Glasgow "Apps for Good" course. The app displays volunteer tasks as map markers around Glasgow city centre, allowing users to view incident details, accept jobs, and submit reports.

## Tech Stack

- **React Native 0.81** with **Expo SDK 54**
- **Expo Router v6** (file-based routing)
- **TypeScript** (strict mode)
- **NativeWind** (Tailwind CSS for React Native)
- **Firebase Auth** (sign-in/sign-up)
- **Cloud Firestore** (real-time database for markers and incident reports)
- **react-native-maps** (Google Maps)
- **@gorhom/bottom-sheet** (marker detail sheets)

## Commands

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in browser
npm run seed       # Seed markers to Cloud Firestore
npm run prebuild   # Generate native ios/ and android/ folders
npm run lint       # ESLint + Prettier check (dry run)
npm run format     # ESLint fix + Prettier write
```

No test framework is configured.

## Architecture

**Entry point:** `App.tsx` imports `global.css` and `expo-router/entry`. Expo Router handles all navigation.

**Routing** (`app/` directory):
- `index.tsx` - Landing page with hero image, navigates to `(tabs)/explore`
- `login.tsx` - Firebase email/password login
- `(tabs)/` - Tab navigator with Home, Explore, Settings tabs
  - `explore.tsx` - Main feature: map with markers + bottom sheet

**Root layout** (`app/_layout.tsx`): Wraps the app in `GestureHandlerRootView` > `ThemeProvider` > `Stack`.

**Core feature flow** (Explore tab):
1. `useMarkers()` hook subscribes to Firestore `markers` collection via `onSnapshot` for real-time sync
2. `MapView` renders markers color-coded by priority (red/yellow/green based on condition count)
3. Tapping a marker opens a `BottomSheet` containing `MarkerDetailsSheet`
4. `MarkerDetailsSheet` allows volunteers to accept tasks, release tasks, or submit incident reports
5. Mutations update Firestore directly (`services/markerService.ts`), syncing changes across all users in real-time
6. Distance is calculated via Haversine formula using `expo-location`

**Data layer:**
- `markers` collection: document ID, `location` (lat/lng), `conditions`, `time`, `status` ('open' | 'accepted' | 'completed'), `acceptedById`, `acceptedByName`, `acceptedAt`
- `reports` collection: `markerId`, `submittedById`, `submittedByName`, `message`, `createdAt`
- Data services are located in `services/markerService.ts`, hooks in `hooks/useMarkers.ts`

## Style Conventions

- NativeWind (`className` prop) for most styling, `StyleSheet.create` for some components
- Prettier: 100 char width, single quotes, trailing comma ES5, 2-space tabs
- Tailwind class sorting via `prettier-plugin-tailwindcss`
- ESLint: expo config with `react/display-name` off

## Path Aliases

`@/*` maps to project root.

## Firebase

Firebase config is in `FirebaseConfig.ts` at the project root. Cloud Firestore (`db`) and Firebase Auth (`auth`) are exported.
