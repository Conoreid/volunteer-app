# Volunteer Companion App 🤝

> A modern, real-time mobile application for community welfare volunteers and street response teams in Glasgow City Centre. Built with React Native, Expo, NativeWind, and Firebase Cloud Firestore.

---

## 📱 Features

### 1. 🗺️ Real-Time Incident Map (`Map` Tab)
- **Live Marker Synchronization**: Real-time snapshot listening for active incidents across Glasgow City Centre.
- **Priority Categorization**: Color-coded markers for incident severity (`High`, `Medium`, `Low`).
- **Floating Controls**: One-tap action buttons to **Locate Me**, **Re-center Sector**, and **Zoom In/Out**.
- **Interactive Bottom Sheet**: Tap any incident marker to preview distance, reported time, conditions, and accept the assignment.

### 2. 📝 Incident Resolution & Reporting
- **Assignment Acceptance**: Lock incidents to volunteer IDs with instantaneous Firestore updates.
- **Field Resolution Form**: Submit comprehensive incident resolution reports with detailed welfare observations, emergency service escalations, and status closure.

### 3. 📦 Completed Jobs Archive (`Completed` Tab)
- **Historical Field Records**: Real-time join of resolved markers with corresponding resolution reports.
- **Bento Metric Counters**: Total resolved jobs broken down by High, Medium, and Low risk.
- **Instant Search & Filter**: Search reports by volunteer name, notes, or incident ID, and filter by priority chip.

### 4. 📖 Volunteer Field Guide (`Guide` Tab)
- Standard operating procedures, safety guidelines, and de-escalation workflows.
- Emergency dispatch directory with one-tap dial actions for Police Scotland, Ambulance Service, and Street Team Hub.

### 5. 👤 Profile & Duty Status (`Profile` Tab)
- Volunteer duty stats (assignments completed, response rating).
- Authenticated account management and secure sign-out.

### 6. 🌓 Seamless Dark & Light Themes
- Fully integrated theme toggle controlling the Android status bar, top navigation headers, bottom tab bar, and interactive map styles.

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/) (SDK 52)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Styling**: [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Backend & Auth**: [Firebase](https://firebase.google.com/) (Auth, Cloud Firestore)
- **Maps**: [react-native-maps](https://github.com/react-native-maps/react-native-maps)
- **Gestures & Sheets**: [`@gorhom/bottom-sheet`](https://github.com/gorhom/react-native-bottom-sheet) & `react-native-gesture-handler`
- **Icons**: [lucide-react-native](https://lucide.dev/)
- **Data Fetching**: [@tanstack/react-query](https://tanstack.com/query/latest)

---

## 📂 Project Structure

```text
volunteer-app/
├── app/                  # Expo Router navigation routes
│   ├── (tabs)/           # Main bottom tab navigator
│   │   ├── _layout.tsx   # Tabs configuration, styling & icons
│   │   ├── index.tsx     # Guide screen & emergency contacts
│   │   ├── explore.tsx   # Map screen & custom controls
│   │   ├── completed.tsx # Completed jobs archive & filters
│   │   └── settings.tsx  # Volunteer profile & settings
│   ├── _layout.tsx       # Root stack navigator & context providers
│   ├── index.tsx         # Auth guard gateway
│   └── login.tsx         # Sign in / Register screen
├── assets/               # Marker icons, logos, and splash assets
├── components/           # Reusable UI components
│   ├── JobList.tsx       # Assignment summary card
│   ├── LoginForm.tsx     # Authentication form
│   ├── MarkerDetailsSheet.tsx # Bottom sheet wrapper
│   ├── Submission.tsx    # Resolution report form
│   └── ThemeProvider.tsx # Dark/Light theme manager & status bar sync
├── context/              # AuthContext & state management
├── data/                 # Fallback seed data
├── hooks/                # Custom React hooks (useMarkers, useCompletedJobs)
├── scripts/              # Database seed scripts
├── services/             # Firestore & Firebase Auth services
├── types/                # TypeScript interface definitions
└── utils/                # Utility functions & calculations
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:
- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **Expo Go** app on your physical mobile device, or an **Android Emulator / iOS Simulator**.

---

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/SlimsyKhan7/volunteer-app.git
   cd volunteer-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase (`FirebaseConfig.ts`):**
   Ensure your Firebase project credentials are configured in `FirebaseConfig.ts`.

4. **Seed Sample Incidents to Firestore (Optional):**
   Populate Firestore with initial sample markers across Glasgow City Centre:
   ```bash
   node scripts/seed.js
   ```

---

### Running the App

Start the Expo development server:

```bash
npx expo start
```

#### Running on Devices:
- **Android Emulator**: Press **`a`** in the terminal.
- **Physical Device**: Scan the QR code using the **Expo Go** app (Android) or Camera app (iOS).
- **Reloading**: Press **`r`** in the terminal to trigger a fast reload.

---

## 🧪 Code Quality & Formatting

Run code formatting and linting checks:

```bash
# Check TypeScript types
npx tsc --noEmit

# Format code with Prettier and ESLint
npm run format
```

---

## 📄 License

This project was built as part of the **Apps for Good** university initiative for community welfare teams.
