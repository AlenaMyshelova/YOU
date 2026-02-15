# 📸 YOU — React Native + Expo

Production-ready mobile app for **iOS** and **Android**, built with modern React Native stack.

## 🏗 Tech Stack

| Layer        | Technology                                      | Why                                           |
| ------------ | ----------------------------------------------- | --------------------------------------------- |
| Framework    | React Native 0.76 + Expo SDK 52 (managed)       | Cross-platform, EAS cloud builds              |
| Language     | TypeScript (strict)                             | Type safety, DX                               |
| Navigation   | React Navigation 7 (native-stack + bottom-tabs) | Industry standard, performant                 |
| Server State | TanStack Query 5                                | Caching, infinite queries, optimistic updates |
| Client State | Zustand 5                                       | Minimal, TS-first, no boilerplate             |
| Styling      | NativeWind 4 (Tailwind CSS)                     | Utility-first, fast iteration                 |
| Forms        | React Hook Form 7 + Zod 3                       | Performant forms with type-safe validation    |
| Media        | expo-image, expo-image-picker, expo-av          | Native performance, managed plugins           |
| Security     | expo-secure-store                               | Encrypted token storage                       |
| Realtime     | WebSocket client (custom)                       | Live notifications, chat                      |
| Push         | expo-notifications                              | Native push for iOS/Android                   |
| Monitoring   | Sentry                                          | Error tracking in production                  |
| Testing      | Jest + React Native Testing Library             | Unit & component tests                        |
| E2E          | Detox (configured as TODO)                      | Full UI automation                            |
| CI           | GitHub Actions                                  | Lint + typecheck + tests on every PR          |
| Code Quality | ESLint 9 + Prettier 3 + Husky + lint-staged     | Automated formatting & linting                |

## 📁 Architecture

```
src/
├── app/                    # App shell
│   ├── navigation/         # RootNavigator, AuthNavigator, MainTabNavigator
│   ├── providers/          # AppProviders (Query, SafeArea, ErrorBoundary)
│   └── notifications/      # Push notification setup
├── features/               # Feature-first modules (high cohesion, low coupling)
│   ├── auth/               # Login, Register, auth store, Zod schemas
│   ├── feed/               # Infinite feed, PostCard, like/unlike
│   ├── post/               # Create post, media picker, upload with progress
│   ├── profile/            # User profile, posts grid
│   ├── notifications/      # Notification list, realtime WebSocket integration
│   └── search/             # Search with debounce
├── shared/
│   ├── ui/                 # Reusable atoms: Button, TextInput, Avatar, etc.
│   ├── hooks/              # useDebounce, useRefreshOnFocus
│   ├── lib/                # apiClient, queryClient, wsClient, tokenStorage, logger, sentry
│   ├── types/              # Domain models (User, Post, Notification, etc.)
│   └── config/             # App config from EAS secrets
tests/                      # Mirrors src/ structure
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm i -g expo-cli`
- [EAS CLI](https://docs.expo.dev/build/introduction/): `npm i -g eas-cli`
- iOS: Xcode 15+ (for simulator)
- Android: Android Studio with emulator

### Installation

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/YOU.git
cd YOU

# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Run on iOS simulator
npx expo start --ios

# Run on Android emulator
npx expo start --android
```

### Environment Variables

Create EAS Secrets for production builds (never commit secrets!):

```bash
eas secret:create --name API_BASE_URL --value https://api.yourapp.com/api/v1
eas secret:create --name WS_BASE_URL --value wss://api.yourapp.com/ws
eas secret:create --name SENTRY_DSN --value https://xxx@sentry.io/xxx
```

For local development, values default to `http://localhost:8000/api/v1`.

### Backend API

This app assumes a REST API (FastAPI). The API types in `src/shared/types/` can be auto-generated from OpenAPI:

```bash
# Install generator
npm i -D openapi-typescript

# Generate types from running backend
npx openapi-typescript http://localhost:8000/openapi.json -o src/shared/types/api.generated.ts
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Docker (for CI-like environment)

```bash
# Run tests in Docker
docker compose run --rm app npm test

# Lint in Docker
docker compose run --rm app npm run lint

# Type check
docker compose run --rm app npm run typecheck

# Interactive shell
docker compose run --rm app sh
```

> **Note**: Docker is used for development tooling and CI tasks only.
> Native iOS/Android builds are done via **EAS Build** (cloud) or locally with Xcode/Android Studio.

## 📦 EAS Build

```bash
# Login to Expo
eas login

# Dev build (with dev client)
eas build --profile development --platform ios

# Preview (internal distribution)
eas build --profile preview --platform all

# Production
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

## 🔒 Security

- **Tokens**: Stored exclusively in `expo-secure-store` (encrypted keychain/keystore)
- **Auth strategy**: Short-lived access tokens (15 min), long-lived refresh tokens, auto-refresh on 401
- **Logging**: Sensitive data (tokens, passwords) is NEVER logged — redacted by the logger
- **Secrets**: Environment variables via `app.config.ts` + EAS Secrets — never committed to git
- **Error handling**: User-facing errors are sanitized; raw errors go to Sentry

## 📐 Code Quality

```bash
# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check

# Type check
npm run typecheck
```

Pre-commit hooks (via Husky) automatically run ESLint + Prettier on staged files.

## 📝 Conventional Commits

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(feed): add infinite scroll with pull-to-refresh
fix(auth): handle token refresh race condition
docs(readme): add EAS build instructions
test(auth): add store hydration tests
refactor(api): extract retry logic into helper
chore(deps): bump expo to SDK 52
style(ui): apply consistent spacing to buttons
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `style`, `perf`, `ci`, `build`

## 🗺 Roadmap

- [ ] Comments on posts
- [ ] Stories feature
- [ ] Direct messaging (chat)
- [ ] Video feed support
- [ ] Dark mode toggle
- [ ] Localization (i18n)
- [ ] Detox E2E tests
- [ ] Storybook for component development

## 📄 License

[MIT](LICENSE)
