# BHCJobs — React Native App

A mobile job portal application built with **React Native (Expo)** and **TypeScript** for the BHCJobs platform. Includes a landing page with live API data, login, and multi-step registration with OTP verification.

---

## Screens

| Screen | Description |
|--------|-------------|
| **Landing** | Hero banner, Popular Industries, Recommended Jobs, Popular Companies — all from live API |
| **Login** | Phone + password with validation and loading indicator |
| **Register** | 2-step: registration form → 6-digit OTP verification |

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | ≥ 18 | [nodejs.org](https://nodejs.org) |
| npm | ≥ 9 | Comes with Node |
| Expo Go | Latest | Install on your Android / iOS device |
| Android Studio | Latest | Only needed for Android emulator |
| Xcode | ≥ 14 | macOS only — needed for iOS simulator |

> You do **not** need React Native CLI or CocoaPods for this Expo project.

---

## Setup & Run

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd new-task-cloudcore
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npx expo start
```

This opens the **Expo Dev Tools** in your browser and shows a QR code in the terminal.

### 4. Run on a device or emulator

| Target | How |
|--------|-----|
| **Physical Android / iOS** | Open **Expo Go** app → scan the QR code |
| **Android emulator** | Press `a` in the terminal (Android Studio must be open with an emulator running) |
| **iOS simulator** | Press `i` in the terminal (macOS + Xcode required) |

---

## Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Start and open on Android emulator
npm run ios        # Start and open on iOS simulator (macOS only)
npm run web        # Start web version
npm run lint       # Run ESLint + Prettier check
npm run format     # Auto-fix lint and formatting
```

---

## Project Structure

```
new-task-cloudcore/
├── App.tsx                          # App entry point
├── app.json                         # Expo configuration (name, icon, splash)
├── assets/
│   └── Logo.png                     # App icon and splash image
├── src/
│   ├── navigation/
│   │   ├── AppNavigator.tsx         # Stack navigator
│   │   └── types.ts                 # RootStackParamList type definitions
│   ├── screens/
│   │   ├── LandingScreen.tsx        # Home / landing page
│   │   ├── LoginScreen.tsx          # Login form
│   │   └── RegisterScreen.tsx       # Registration + OTP verification
│   ├── components/
│   │   ├── UIComponents.tsx         # PrimaryButton, JobCard, IndustryCard, CompanyCard, SkeletonBox, ErrorView
│   │   └── FormInput.tsx            # Reusable labelled input with validation
│   ├── services/
│   │   └── api.ts                   # All API calls (GET + POST) and image URL helpers
│   ├── hooks/
│   │   └── useFetch.ts              # Generic data-fetching hook with loading/error/refetch
│   └── utils/
│       └── theme.ts                 # Design tokens — colors, spacing, font sizes, shadows
├── package.json
└── README.md
```

---

## API Reference

### Base URLs

| Purpose | URL |
|---------|-----|
| API | `https://dev.bhcjobs.com` |
| Image Storage | `https://dev.bhcjobs.com/storage` |

### GET Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/industry/get` | Fetch all industries |
| `GET /api/job/get` | Fetch recommended jobs |
| `GET /api/company/get` | Fetch popular companies |

### POST Endpoints

| Endpoint | Purpose | Request Body |
|----------|---------|--------------|
| `POST /api/job_seeker/register` | Register new user | `{ name, email, phone, password, password_confirmation }` |
| `POST /api/job_seeker/phone_verify` | Verify phone OTP | `{ phone, otp }` |
| `POST /api/job_seeker/login` | Login | `{ phone, password }` |

> The register API returns the OTP inside its response (dev environment). The app shows this in a dev-mode hint box on the OTP screen.

### Image URL Format

```
Industry:  https://dev.bhcjobs.com/storage/industry-image/{image}
Job:       https://dev.bhcjobs.com/storage/company-image/{image}
Company:   https://dev.bhcjobs.com/storage/company-image/{image}
```

**Example:** If the API returns `"image": "2362_1754539698.webp"` for an industry:
```
https://dev.bhcjobs.com/storage/industry-image/2362_1754539698.webp
```

---

## Features Implemented

- [x] Hero / Banner section with search bar and live stats
- [x] Popular Industries — horizontal scroll, images from API
- [x] Recommended Jobs — vertical card list, data from API
- [x] Popular Companies — horizontal scroll, logos from API
- [x] Loading skeleton placeholders during data fetch
- [x] Error states with retry button on all API sections
- [x] Pull-to-refresh on landing page
- [x] Login — phone + password validation, API integration, loading indicator
- [x] Register — 5-field form validation
- [x] OTP verification — custom 6-box input with auto-focus and backspace navigation
- [x] Keyboard-avoiding scroll on all form screens (iOS + Android)
- [x] Status bar styled to match app theme (light content on dark header)
- [x] Reusable components (buttons, cards, inputs, skeletons)
- [x] TypeScript throughout — type-safe navigation and API calls
- [x] Clean code structure with separation of concerns

---

## Building an APK

### Option A — EAS Build (recommended, no local Android setup needed)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to your Expo account
eas login

# Configure the project (first time only)
eas build:configure

# Build APK for Android
eas build -p android --profile preview
```

The APK download link is provided in the Expo dashboard after the build finishes.

### Option B — Local Build (requires Android Studio + JDK 17)

```bash
# Generate native Android project
npx expo prebuild --platform android

# Build APK
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| Expo | ~54.0.0 | Build toolchain and native modules |
| React Native | 0.81.5 | Mobile UI framework |
| TypeScript | ~5.9.2 | Type safety |
| React Navigation | ^7.x | Screen navigation |
| react-native-safe-area-context | ~5.6.0 | Status bar + notch handling |
| react-native-screens | ~4.16.0 | Native navigation optimization |
| expo-print | ~15.0.8 | PDF generation |
| expo-sharing | ~14.0.8 | Share files |
| expo-file-system | ~18.0.0 | File read/write |

---

## Code Quality

```bash
# Check lint and formatting
npm run lint

# Auto-fix
npm run format
```
