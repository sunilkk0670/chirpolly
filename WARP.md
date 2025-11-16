# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: ChirPolly – AI language learning SPA (React + Vite + TypeScript) with Gemini + Firebase.

## Quick start and common commands

- Install dependencies
  ```bash path=null start=null
  npm install
  ```
- Run the dev server (Vite)
  ```bash path=null start=null
  npm run dev
  ```
  - Serves on http://localhost:3000 (Vite dev server, host `0.0.0.0`).
- Build for production
  ```bash path=null start=null
  npm run build
  ```
- Preview the production build locally
  ```bash path=null start=null
  npm run preview
  ```
- Type-check TypeScript (no dedicated script)
  ```bash path=null start=null
  npx tsc --noEmit
  ```

Linting and tests

- Linting: no ESLint config or npm script is defined.
- Tests: no test runner/scripts are configured. If a test framework is added (e.g. Vitest/Jest), also add scripts for `npm test` and how to run a single test here.

## Environment configuration

`.env.local` at the repo root is used for both Gemini and Firebase. It is gitignored (via `*.local`).

- Minimal Gemini setup (from `vite.config.ts` and `services/geminiService.ts`):
  ```bash path=null start=null
  GEMINI_API_KEY=your_gemini_api_key
  ```
  - Vite injects this as `process.env.API_KEY` and `process.env.GEMINI_API_KEY`.
  - `services/geminiService.ts` uses `process.env.API_KEY || 'demo-api-key-for-development'`.
  - If `GEMINI_API_KEY` is missing, the app still loads but runs in a "demo" state where Gemini calls log warnings and will not work correctly.

- Firebase setup (from `services/firebase.ts` and `FIREBASE_SETUP.md`):
  ```bash path=null start=null
  VITE_FIREBASE_API_KEY=your_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  VITE_FIREBASE_APP_ID=your_app_id
  GEMINI_API_KEY=your_gemini_api_key
  ```
  - `services/firebase.ts` reads these via `import.meta.env` and falls back to demo values if missing.
  - When `VITE_FIREBASE_API_KEY` is absent, `isDemoModeEnabled` is `true` and a console warning is shown; Firebase uses demo config.
  - In demo mode, `App.tsx` auto-authenticates a fake user (`demo@chirpolly.app`) so the main experience is reachable without setting up Firebase.

## High-level architecture
### App shell and routing

- Entry: `index.html` + `index.tsx` mount `<App />` inside `React.StrictMode`, wrapped in a `HashRouter`.
- `App.tsx` is the top-level orchestrator:
  - Layout: renders `Sidebar`, `Header`, main routed content, and `Footer`.
  - Routing: uses `react-router-dom` `Routes`/`Route` and the `VIEWS` map from `constants.tsx` for route IDs, labels, and paths.
  - Language state: `currentLanguage` (from `LANGUAGES` in `constants.tsx`); `handleLanguageChange` can remap lesson routes by switching the language prefix in `lesson_id`.
  - Auth flow:
    - Lazy-imports `auth` and `onAuthStateChanged` from Firebase.
    - If `isDemoModeEnabled` from `services/firebase.ts` is true, it skips Firebase and sets a hard-coded demo user.
    - Otherwise it subscribes to `onAuthStateChanged` and keeps `authUser` / `isAuthenticated` in state.
    - If authenticated but email is not verified for password users, navigation is forced to `/verify-email`.
  - Onboarding and inactivity:
    - Shows an `Onboarding` overlay once per authenticated user (persisted via `localStorage` key `chirPollyOnboarded`).
    - Tracks inactivity with a 2-minute timer and exposes `isInactive` to views like `Dashboard`.
  - PWA/native behavior:
    - Uses Capacitor `StatusBar` when running as a native app.
    - Listens for the `beforeinstallprompt` event and iOS standalone detection, then shows an install banner with local dismissal persisted (`chirPollyInstallDismissed`).

- Route wrappers:
  - `ScenarioViewWrapper` reads `:id` from the URL and looks up the matching `Scenario` from `SCENARIOS` (redirects to `/` if not found).
  - `LessonViewWrapper` does the same for `LESSONS` by `lesson_id`.

### Domain types and static content

- `types.ts` defines the core domain model used across the app:
  - `Language`, `Scenario`, `Message` + optional `GrammarFeedback`, `Lesson`/`LessonContent`/`QuizQuestion`, `VocabularyWord`, `LessonUnit`/`LearningModule`, `MediaItem`, `Workshop`, `Tutor`, `Persona`, `Kanji`, leaderboard entries, etc.
  - Social features: `Post`, `Comment`, `Like` – models for the community social feed with user info, timestamps, and engagement counts.
- `constants.tsx` is the primary content/config hub:
  - Language catalog: `LANGUAGES_CONFIG` and derived `LANGUAGES` (code + display name + emoji).
  - Motivational copy: `MOTIVATIONAL_QUOTES`.
  - Lessons: `LESSONS` – per-language beginner greeting lessons including quizzes and optional `cultureCapsule` (Markdown content).
  - Conversation scenarios: `SCENARIOS` – structured scenario definitions with `systemPrompt` strings for Gemini.
  - Gamification: `ACHIEVEMENT_BADGES`, `CHALLENGES`, `LEADERBOARD_DATA`, `POST_LESSON_Messages`.
  - Media catalog: `MEDIA_ITEMS` for podcasts/films/comics.
  - Personas: `PERSONAS` controlling which scenario categories a learner sees.
  - Views: `VIEWS` (app-wide route IDs and paths including sidebar/footer views) and `ALL_VIEWS` (used for navigation UI).
- `i18n/` holds additional structured learning content:
  - `learningPath.ts`: `LEARNING_PATH` – modules → units → `VocabularyWord`s consumed by `WordBankView`.
  - `vocabulary.ts` and `kanji.ts`: vocab and kanji data for specific views.
  - `translations.ts`: per-language label mappings for navigation and UI, used by `Sidebar`/`Header`.

### AI integration

- Central Gemini service (`services/geminiService.ts`):
  - Client: creates a single `GoogleGenAI` instance with `apiKey` from `process.env.API_KEY` (or a demo fallback). Maintains a module-level `activeChat` for text chat scenarios.
  - Text generation:
    - `generateContent(prompt)`: simple text helper around `models.generateContent` (`gemini-2.5-flash`).
    - `generateAdaptivePath(languageName, personaLabel)`: returns a JSON array of `AdaptiveStep`s describing a recommended learning path.
  - Chat scenarios (`ScenarioView`):
    - `startChat(systemPrompt)` sets up `activeChat` with model `gemini-flash-lite-latest` and the given system instruction.
    - `sendMessage(message, includeGrammarCheck)` sends user input (optionally appending a grammar-check block) and returns a `GenerateContentResponse`.
    - `ScenarioView` parses the `---GRAMMAR CHECK---` section from `response.text` into `GrammarFeedback` stored on the corresponding user `Message`.
  - Analysis and feedback:
    - `analyzeGrammar(text)` – Markdown-formatted breakdown using `gemini-2.5-pro` with `thinkingConfig`.
    - `getPronunciationFeedback(originalText, userTranscription, languageName)` – concise markdown feedback on pronunciation.
  - Vision:
    - `generateImage(prompt)` – uses Imagen 4.0, returns base64 JPEG.
    - `editImage(base64, mimeType, prompt)` – uses `gemini-2.5-flash-image` with image inline data, returns modified base64.
    - `generateVocabularyFromImage(base64, mimeType, languageName)` – returns a JSON array of `ImageVocabularyWord` (word, transliteration, meaning) for visual vocabulary.
  - Speech / TTS:
    - `generateSpeech(prompt)` – uses `gemini-2.5-flash-preview-tts` with `prebuiltVoiceConfig` (`Kore`), returns base64 audio; views decode to PCM and play via Web Audio.
  - Quiz generation:
    - `generateQuizForUnit(words, languageName)` – returns a JSON array of `QuizQuestion` where each question uses the English meaning and 4 options in the target language.

- Live audio tutor (`components/AITutorView.tsx`):
  - Creates its own `GoogleGenAI` client using `process.env.API_KEY` (same env wiring as the service) and connects via `ai.live.connect`.
  - Uses `AI_TUTOR_PROMPT` from `constants.tsx`, templated with the current language, and a native-audio preview model (`gemini-2.5-flash-native-audio-preview-09-2025`).
  - Streams microphone input via a `ScriptProcessorNode`, uses helper functions to encode PCM into the `Blob` format expected by the API, and decodes model audio into PCM for playback.
  - Maintains incremental `currentInput` and `currentOutput` buffers, flushing them into the `messages` history on `turnComplete`.

### Firebase, authentication, and user data

- Initialization (`services/firebase.ts`):
  - Builds `firebaseConfig` from `import.meta.env.VITE_FIREBASE_*`, with demo defaults when missing.
  - Detects demo mode via `!VITE_FIREBASE_API_KEY` and logs a warning.
  - Initializes a single Firebase app (with defensive try/catch), then exports:
    - `auth` (for `LoginPage` / `App`),
    - `db` (Firestore),
    - `isDemoModeEnabled` (used by `App.tsx`).

- Auth UI and user documents (`components/LoginPage.tsx`):
  - Email/password:
    - Login via `signInWithEmailAndPassword`; if `emailVerified` is false, navigates to `/verify-email` and shows a message.
    - Signup via `createUserWithEmailAndPassword`, sends verification email, and writes/merges a `users/{uid}` document with `uid`, `email`, `provider: 'password'`, and `createdAt` server timestamp.
  - Google sign-in:
    - `signInWithPopup` + `GoogleAuthProvider`; ensures a `users/{uid}` document with profile fields (`displayName`, `photoURL`, `provider: 'google'`).
  - Password reset via `sendPasswordResetEmail`.

- Email verification flow:
  - `VerifyEmail` route (component in `components/VerifyEmail.tsx`) is the landing page after signup or when an unverified email logs in.
  - `App.tsx` enforces navigation to `/verify-email` for password users with `!emailVerified`.

- Firestore data model (from `FIREBASE_SETUP.md` and `LoginPage.tsx`):
  - `users/{uid}` documents typically contain:
    - `uid`, `email`, optional `displayName` and `photoURL`, `provider`, and `createdAt` (server timestamp).
  - Social feed collections (used by `services/communityService.ts`):
    - `posts`: social posts with `userId`, `userName`, `userAvatar`, `content`, `imageUrl`, `language`, `createdAt`, `likesCount`, `commentsCount`.
    - `comments`: comments with `postId`, `userId`, `userName`, `userAvatar`, `content`, `createdAt`.
    - `likes`: likes with `postId`, `userId`, `createdAt`.
  - Security rules (in the guide) restrict each user document to its own `uid` for reads/writes.

### Feature views (how the big pieces connect)

- Dashboard (`components/Dashboard.tsx`):
  - Landing hub for authenticated users; receives `lessons`, `scenarios` and `isInactive` from `App.tsx`.
  - Shows a hero section, "Core Lessons" grid, progress stats (streak, XP), and a daily challenge (picked from `CHALLENGES` with `type === 'daily'`).
  - Navigates via `VIEWS` to specific feature routes (e.g. Languages, Challenges).

- Lessons (`components/LessonView.tsx`):
  - Bound to a single `Lesson` from `LESSONS` via `LessonViewWrapper`.
  - Renders vocab list with transliteration, meaning, and example sentence.
  - Optional `cultureCapsule` is parsed from Markdown using `marked` and rendered via `dangerouslySetInnerHTML`.
  - Includes a built-in quiz from `lesson.quiz`, with dynamic styling to highlight correct/incorrect answers and a final score.
  - On completion, shows a random message from `POST_LESSON_Messages` (Polly feedback) and can navigate back to the dashboard.

- Word Bank & adaptive quizzes (`components/WordBankView.tsx`):
  - Uses `LEARNING_PATH` to show modules and units for the selected `Language`.
  - Tracks per-unit completion and locking, with progress stored in `localStorage` by language.
  - For each vocabulary word, triggers `generateSpeech` with a language-specific `audio_prompt` and decodes the returned audio via Web Audio.
  - Generates on-demand multiple-choice quizzes per unit via `generateQuizForUnit`; when the score passes a threshold, the next unit can be unlocked.

- Scenario chat (`components/ScenarioView.tsx`):
  - Driven by a chosen `Scenario` from `SCENARIOS` and the current `Language`.
  - On mount, calls `startChat(scenario.systemPrompt)` then immediately sends an empty message to get the model's scripted opening.
  - For each user turn, calls `sendMessage(userMessage, showGrammarCheck)` and splits out grammar feedback using the `---GRAMMAR CHECK---` markers.
  - Attaches parsed `GrammarFeedback` objects back onto the user messages, rendered as inline yellow tips.

- Live AI tutor (`components/AITutorView.tsx`):
  - Voice-only conversation with Polly in the selected `Language` using the Gemini Live API.
  - Maintains session state (`idle`/`connecting`/`active`/`error`), current partial transcriptions, and an audio playback queue.
  - Handles audio resource cleanup on stop, language changes, and unmount via `stopConversation`.

- Community social feed (`components/CommunityView.tsx` and `components/SocialFeed.tsx`):
  - `CommunityView` displays leaderboards, language partner matching, peer challenges, and the social feed.
  - `SocialFeed` component provides a real-time social feed where users can:
    - Create posts with text content and language tags using `CreatePost` component.
    - View posts in reverse chronological order with `PostCard` component.
    - Like/unlike posts with optimistic UI updates and Firestore sync via `toggleLike`.
    - Add comments to posts with expandable `CommentSection` component.
    - Delete their own posts (restricted to post author).
  - Uses `services/communityService.ts` for all Firestore operations:
    - Post CRUD: `createPost`, `fetchPosts`, `deletePost`, `subscribeToPost` (real-time).
    - Comments: `addComment`, `fetchComments`, `subscribeToComments` (real-time).
    - Likes: `toggleLike` (checks existing like and creates/deletes), `checkIfUserLiked`.
    - All operations use atomic counters (`increment`) for `likesCount` and `commentsCount`.
  - Uses `react-firebase-hooks/auth` for authentication state and `lucide-react` for icons.

- Other notable views (wired through `VIEWS` and `ALL_VIEWS`):
  - `GrammarClinicView` – uses Gemini analysis utilities from `services/geminiService.ts`.
  - `ImageEditorView` – uses the vision/image-edit endpoints for visual vocabulary.
  - `WordBankView`, `KanjiLairView`, `AccentTrainingView`, `TutorView`, `AchievementsView`, `ChallengesView`, `MediaView` (if present) all consume static config from `constants.tsx` and/or `i18n/`.
  - Footer-only informational routes: `AboutView`, `TermsView`, `PrivacyView` (paths from `VIEWS`).

## Notes derived from README.md and FIREBASE_SETUP.md

- Prerequisites: Node.js.
- Basic local run:
  1. `npm install`
  2. Create `.env.local` and set at least `GEMINI_API_KEY`; for full auth, also set `VITE_FIREBASE_*`.
  3. `npm run dev`
- Firebase:
  - Supports Email/Password and Google authentication, with email verification and password reset.
  - Uses Firestore `users` collection with one document per user and rules restricting access to `request.auth.uid == uid`.
  - When Firebase variables are not configured, the app falls back to demo mode (auto-auth demo user and console warnings).

## Repository conventions

- Routing and navigation:
  - Add new top-level views to `VIEWS` (for routing) and `ALL_VIEWS` (for sidebar) in `constants.tsx` instead of hard-coding paths or labels.
  - `Sidebar` and `Header` consume these structures plus `i18n/translations.ts` for language-specific labels.
- AI features:
  - Prefer calling Gemini through `services/geminiService.ts` so model names, env handling, and JSON schemas remain centralized.
  - For new live-audio use cases, follow the existing pattern in `AITutorView.tsx` (shared audio helpers, cleanup, and status handling).
- Firebase:
  - Use `services/firebase.ts` for `auth` and `db`; do not reinitialize Firebase elsewhere.
  - Keep auth-related UI flows consistent with `LoginPage.tsx` and `VerifyEmail` (e.g., ensuring user docs in `users/{uid}`).
- Content modeling:
  - Add new static lessons, scenarios, and personas to `constants.tsx` and `i18n/` assets instead of scattering literals across components, so language switching and navigation remain consistent.
