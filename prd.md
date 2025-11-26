# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Project Name:** DetoxAI
**Version:** 2.0
**Prepared By:** Product Team
**Last Updated:** November 19, 2025

---

## 1. Overview

### 1.1 Product Summary

This app enables users to scan or upload photos of packaged food products and receive an instant health score, ingredient safety analysis, and better alternatives. The goal is to make India's packaged-food market transparent by explaining harmful additives, chemicals, oils, sugars, and allergens in simple language.

### 1.2 Target Platforms

- **Android** (primary)
- **iOS** (secondary)
- **Special build:** Expo-managed workflow

### 1.3 Primary Users

- Health-conscious individuals
- Gym & fitness community
- Parents (baby/kid food safety)
- Diabetic/heart/kidney patients
- Students & working professionals
- Nutritionists & dieticians

---

## 2. Objectives & Goals

### 2.1 Business Objectives

- Create India's most trusted food safety & transparency app
- Build a community-driven database of scanned food products
- Enable healthy decision-making through AI-driven scoring
- Monetize via subscription, affiliate, and B2B API licensing

### 2.2 Success Metrics

| Metric | Target |
|--------|--------|
| OCR accuracy | 92%+ on printed labels |
| 7-day retention | 40%+ |
| Monthly scans per active user | 10+ |
| User rating | 4.5★+ |
| Share rate | 20% of scans |

---

## 3. User Problems

Users often face:

- Confusing ingredient lists
- Lack of awareness of harmful additives
- Fake/duplicate products in India
- No simple way to compare healthy alternatives
- Regional variations in packaged food
- Missing barcodes or invalid scans

This app solves these by enabling pure photo-based analysis, avoiding barcode-only limitations.

---

## 4. Key Features (MVP + Future)

### 4.1 MVP Features

**🟦 A. Product Input**
- Capture photo of product packaging
- Capture close-up photo of ingredient list
- Upload from gallery
- Automatic cropping & enhancement (optional)

**🟦 B. OCR + Text Processing**
- Multi-language OCR (English, Hindi, regional Indian languages)
- Detect ingredient blocks, nutrition tables, claims (e.g., "No Sugar Added")

**🟦 C. Ingredient Safety Engine**

Detect harmful health additives:
- Artificial colors (E102, E110, etc.)
- Preservatives (INS 211, 202)
- Oils (palm, hydrogenated)
- Sugars (HFCS, dextrose, added sugar forms)
- MSG & enhancers (INS 621, 627, 631)
- Allergen detection (nuts, gluten, lactose, soy)

**🟦 D. Score & Insights**
- Overall health score (0–100)
- Color: Red (unsafe), Yellow (moderate), Green (safe)
- Detailed breakdown: Ingredients to avoid, high sodium/sugar/oil flags, safety comments in simple language

**🟦 E. Recommendations**
- Suggest healthier alternatives in India
- Show nutrient comparisons
- Link to detailed product profiles

**🟦 F. User Accounts**
- Login with Google or Apple (Supabase OAuth)
- Store scan history
- Save favorite products

### 4.2 Future Features (Phase 3+)

- Fake product detection using packaging pattern comparison
- AI ingredient substitution suggestions
- Full community section (reviews, photo uploads)
- Offline ingredient dictionary
- FSSAI compliance rating
- Personalized diet filters (Keto, Vegan, Jain, Diabetic, Pregnant)

---

## 5. User Experience (UX) Flow

### 5.1 High-Level Flow

```
Onboarding → Sign in (Google/Apple) → Home
→ Scan/Upload Photo → OCR → Analysis Engine
→ Health Score Screen → Save/Share → Product History
```

### 5.2 Screen Breakdown

**Home**
- "Scan Product" button
- "Upload Photo" button
- Suggested healthy products
- User goals shortcut

**Scan Screen**
- Camera UI
- Capture 1) Front image
- Capture 2) Ingredient label
- Continue → Uploading animation

**Result Screen**
- Product name & image
- Score bar (0–100)
- Harmful ingredients flagged in red
- Safe ingredients in green
- "Better Alternatives"
- Buttons: Save | Share | Add Note

**Profile**
- User preferences & goals
- History of scans
- Saved products
- Settings

---

## 6. Technical Specifications

### 6.1 Frontend

**React Native + Expo (Managed Workflow)**
- Fast development
- OTA updates
- Cross-platform consistency
- Camera: `expo-camera`
- Gallery: `expo-image-picker`
- File handling: `expo-file-system`
- Auth: `expo-auth-session`
- Apple login: `expo-apple-authentication`

**UI Libraries**
- React Native Paper
- NativeWind (Tailwind for RN)
- Lottie animations

### 6.2 Backend (Supabase)

**🔐 Authentication**
- Supabase Auth with Google OAuth provider and Apple OAuth provider
- Session persists locally in RN through supabase-js
- RLS enabled for user data security

**🗃 Database (Postgres)**

Tables:
- `profiles`
- `products`
- `ingredients`
- `scans`
- `alternatives`

**🧺 Storage**
- Bucket "scans" → uploaded images
- Private access with signed URLs

**⚙️ Edge Functions (Supabase)**

Written in Node.js or Deno. Functions:

1. **process-image:** Accepts image path, runs OCR, extracts ingredient list, cleans + normalizes text
2. **analyze-ingredients:** Rule-based + ML scoring, returns score, risks, categories
3. **add-product**
4. **get-alternatives**

### 6.3 AI Components

**OCR**
- Google Cloud Vision API (recommended high accuracy)

**NLP & Rules**
- Regex + rules to detect additives
- ML classifier to categorize risk
- Ingredient dictionary (local JSON + DB)

**Fake Detection (Phase 4)**
- CNN model trained on real vs. counterfeit packages

---

## 7. Security Requirements

- RLS for per-user data
- HTTPS calls only
- No service keys shipped to client
- Access tokens stored securely
- Delete user scans on request (GDPR-like compliance)
- Signed URLs expire in < 60 min

---

## 8. Non-functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | 2s OCR response target |
| Scalability | 10M scans/month |
| Usability | Simple, minimal UI |
| Reliability | 99% uptime (Supabase SLA) |
| Privacy | Data never sold to food brands |
| Accessibility | Large fonts, high-contrast support |

---

## 9. Analytics & Logging

**Track:**
- Number of scans
- Retention rate
- Product share rate
- Score distribution
- Most-scanned categories
- OCR accuracy

**Tools:**
- Supabase logs
- Firebase Analytics or Amplitude

---

## 10. Business Model

### Free Tier
- Unlimited scans
- Ads between results

### Premium (₹99–₹199/month)
- No ads
- Priority OCR
- Detailed breakdown

### Additional Revenue
- Affiliate with healthy brands
- API sales to hospitals/gyms
- Verified seller program

---

## 11. Project Roadmap (4-Phase Timeline)

### Phase 1: Foundation & Core Infrastructure (4–5 weeks)

**Deliverables:**
- React Native + Expo project setup with navigation (Expo Router)
- Supabase project initialization (Auth, Database, Storage configured)
- Google & Apple OAuth implementation
- Basic UI screens: Onboarding, Home, Profile
- Camera integration (expo-camera) and gallery upload (expo-image-picker)
- Image upload to Supabase Storage with signed URLs
- User profile creation and RLS policies

**Team:**
- 1 Frontend Developer
- 1 Backend/Supabase Developer

**Success Criteria:**
- Users can sign in with Google/Apple
- Users can capture/upload images
- Images stored securely in Supabase

### Phase 2: OCR, Ingredient Database & Scoring Engine (5–6 weeks)

**Deliverables:**
- Google Cloud Vision API integration for OCR
- Supabase Edge Function: `process-image` (OCR extraction & text cleaning)
- Ingredient database setup (harmful additives, preservatives, oils, sugars, allergens)
- Supabase Edge Function: `analyze-ingredients` (rule-based + ML scoring)
- Health score algorithm (0–100) with color coding (Red/Yellow/Green)
- Database tables: `products`, `ingredients`, `scans`
- Backend logic to store scan results and link to user profiles

**Team:**
- 1 Backend Developer (Supabase Edge Functions)
- 1 ML/Data Engineer (Ingredient analysis logic)
- 1 Frontend Developer (integrate API calls)

**Success Criteria:**
- OCR extracts ingredient text with 90%+ accuracy
- Scoring engine returns health score with detailed breakdown
- Scan results saved to user history

### Phase 3: Result UI, Alternatives & Community Features (4–5 weeks)

**Deliverables:**
- Result screen UI (health score, ingredient breakdown, harmful flags)
- Alternative product recommendation engine
- Supabase Edge Function: `get-alternatives` (healthier product suggestions)
- "Save" and "Share" functionality for scans
- Product comparison UI (side-by-side nutrient comparison)
- Analytics integration (Firebase Analytics or Amplitude)
- Community features: User reviews, product ratings, photo uploads
- Shopping list and favorites feature

**Team:**
- 2 Frontend Developers (UI/UX implementation)
- 1 Backend Developer (alternatives engine)
- 1 Designer (UI polish)

**Success Criteria:**
- Users receive 3+ healthier alternatives per scan
- Share rate: 15%+
- Users can save favorite products and create shopping lists

### Phase 4: Testing, Optimization & Launch Preparation (3–4 weeks)

**Deliverables:**
- Comprehensive testing (unit, integration, end-to-end)
- Performance optimization (reduce OCR response time to <2s)
- Fake product detection (Phase 4 AI feature) using CNN model
- Offline ingredient dictionary for common products
- FSSAI compliance rating integration
- Personalized diet filters (Keto, Vegan, Jain, Diabetic, Pregnant)
- App Store & Play Store submission (screenshots, descriptions, compliance)
- Beta testing with 100+ users
- Bug fixes and final UI polish
- Analytics dashboard setup for monitoring post-launch metrics

---

## 12. Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| OCR errors | High | Vision API + post-correction |
| Fake products | Medium | Phase 4 ML model |
| Parsing regional languages | High | Collect training data |
| Non-standard packaging | Medium | Manual user correction |
| Data quality | High | Nutritionist verification |
| Regulatory compliance | High | FSSAI certification review |

---

## 13. Assumptions

- Users have smartphones with camera access
- Majority of products have printed ingredient labels
- Google Cloud Vision API maintains 90%+ OCR accuracy
- Supabase provides 99% uptime
- Indian food brands adopt standardized ingredient labeling
- Users are willing to pay ₹99–₹199/month for premium features
