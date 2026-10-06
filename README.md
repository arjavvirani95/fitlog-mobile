# fitlog-mobile

[![CI](https://github.com/arjavvirani95/fitlog-mobile/actions/workflows/ci.yml/badge.svg)](https://github.com/arjavvirani95/fitlog-mobile/actions/workflows/ci.yml)

A workout tracker for iOS and Android built with **Expo**, **React Native** and **TypeScript**. Works fully offline: data is stored on the device.

## Features

- Log workouts quickly with set shorthand: `5x100, 5x100, 3x110` or `3x5@80`
- History list with total volume per session (long-press to delete)
- Progress screen: current day streak, weekly volume chart, and personal records using the Epley one-rep-max estimate
- Offline persistence with AsyncStorage
- "Load sample data" on first launch to try the app without typing

## Architecture

```
App.tsx                   tab shell (History / Log / Stats)
src/
  domain/                 pure TypeScript, no React Native imports
    types.ts              Workout, ExerciseEntry, SetEntry
    stats.ts              volume, 1RM, PRs, streak, weekly buckets
    parse.ts              set shorthand parser
    reducer.ts            state transitions
  WorkoutContext.tsx      useReducer + AsyncStorage sync
  screens/                History, Log, Stats
  ui/                     theme, Button, TabBar
```

The business logic lives in `src/domain` and is unit-tested with Vitest without needing a simulator. CI typechecks, runs the tests and builds the iOS and Android JavaScript bundles.

## Getting started

```bash
npm install
npx expo start      # scan the QR code with Expo Go, or press i / a for a simulator
npm test
```

## License

MIT
