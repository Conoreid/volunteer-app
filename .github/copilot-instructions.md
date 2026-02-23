# Copilot Instructions for Volunteer App

## Project Overview
A React Native mobile app for volunteer opportunity discovery. Users browse volunteer opportunities on a map and sign in via Firebase Authentication.

## Tech Stack
- **Expo SDK 54** with React Native 0.81 and React 19
- **expo-router** for file-based navigation (routes defined by files in `app/` directory)
- **NativeWind** for styling (Tailwind CSS syntax via `className` props)
- **Firebase Auth** with AsyncStorage for session persistence
- **react-native-maps** with Google provider for the map view
- **@gorhom/bottom-sheet** for modal overlays

## Architecture

### Navigation Flow
The app uses expo-router's file-based routing. The `app/` folder structure directly maps to routes:
- Landing screen at root, login screen at `/login`
- Authenticated users access the tab navigator at `/(tabs)/` containing Home, Explore, and Settings tabs
- The root layout wraps everything in gesture handling and theming providers

### Styling Approach
NativeWind allows Tailwind-style classes directly on React Native components via `className`. For complex or dynamic styles, traditional `StyleSheet.create()` is used (see the MarkerDetailsSheet component for an example).

### Firebase Setup
Authentication is configured in `FirebaseConfig.ts` with React Native AsyncStorage persistence so users stay logged in between app restarts. After successful login, navigation uses `router.replace()` to prevent back-navigation to auth screens.

### Map Feature
The Explore tab displays a Google Maps view with markers for volunteer opportunities. Tapping a marker opens a bottom sheet with details. Marker data follows a consistent interface: id, name, description, coordinate, and details.

## Development Commands
```bash
npm start          # Start Expo dev server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS simulator
npm run lint       # Check code with ESLint + Prettier
npm run format     # Auto-fix lint and formatting issues
```

## Key Conventions
- **Functional components with hooks** over class components
- **TypeScript interfaces** for all component props
- **Path alias `@/`** for imports from project root
- **FontAwesome icons** via @expo/vector-icons
- **`router.replace()`** for auth transitions to prevent back-navigation to login
