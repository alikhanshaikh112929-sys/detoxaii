# Implementation Plan - Phase 1: Foundation & Core Infrastructure

## Goal Description
Establish the core technical foundation for DetoxAI using React Native (Expo), NativeWind, and Supabase. This phase focuses on project setup, authentication, basic navigation, and image capture/upload capabilities.

## User Review Required
> [!IMPORTANT]
> **Supabase Credentials**: I will need the Supabase Project URL and Anon Key to configure the app. Please create a new Supabase project if you haven't already.
> **Google/Apple OAuth**: These require setting up projects in Google Cloud Console and Apple Developer Portal. For local development, we can start with email/password or mock auth if preferred, but the PRD specifies OAuth.

## Proposed Changes

### Project Setup
#### [NEW] [app.json](file:///c:/Users/India/Desktop/detoxai/app.json)
- Configure Expo project settings (name, slug, scheme).

#### [NEW] [babel.config.js](file:///c:/Users/India/Desktop/detoxai/babel.config.js)
- Configure NativeWind and Reanimated plugins.

#### [NEW] [tailwind.config.js](file:///c:/Users/India/Desktop/detoxai/tailwind.config.js)
- Setup Tailwind CSS theme and paths.

### Frontend Structure (Expo Router)
#### [NEW] [app/_layout.tsx](file:///c:/Users/India/Desktop/detoxai/app/_layout.tsx)
- Root layout with AuthProvider and Stack navigation.

#### [NEW] [app/index.tsx](file:///c:/Users/India/Desktop/detoxai/app/index.tsx)
- Landing/Onboarding screen.

#### [NEW] [app/(auth)/login.tsx](file:///c:/Users/India/Desktop/detoxai/app/(auth)/login.tsx)
- Login screen with Supabase Auth.

#### [NEW] [app/(tabs)/_layout.tsx](file:///c:/Users/India/Desktop/detoxai/app/(tabs)/_layout.tsx)
- Tab navigator for Home, Scan, Profile.

#### [NEW] [app/(tabs)/home.tsx](file:///c:/Users/India/Desktop/detoxai/app/(tabs)/home.tsx)
- Home screen with recent scans (placeholder).

#### [NEW] [app/(tabs)/scan.tsx](file:///c:/Users/India/Desktop/detoxai/app/(tabs)/scan.tsx)
- Camera interface using `expo-camera`.

#### [NEW] [app/(tabs)/profile.tsx](file:///c:/Users/India/Desktop/detoxai/app/(tabs)/profile.tsx)
- User profile and settings.

### Backend Integration (Supabase)
#### [NEW] [lib/supabase.ts](file:///c:/Users/India/Desktop/detoxai/lib/supabase.ts)
- Supabase client initialization.

#### [NEW] [lib/auth.ts](file:///c:/Users/India/Desktop/detoxai/lib/auth.ts)
- Auth helper functions.

## Verification Plan

### Automated Tests
- Run `npx expo start` to verify the app loads.
- Verify navigation between tabs.

### Manual Verification
- **Auth**: Sign up/Login (using email for initial test, then OAuth).
- **Camera**: Verify camera permission and preview.
- **Upload**: Capture image and verify it appears in Supabase Storage (via dashboard).
