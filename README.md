# Price Offer Service

A small full-stack app that serves and displays flight **price offers**, with filtering by **origin** and **destination**.

- **Backend**: Express server exposing a simple REST endpoint backed by a mock JSON file
- **Frontend**: Vue 3 + Vite app that fetches and renders offers with a clean, mobile-first UI

## Quick start

### Prerequisites

- Node.js (recent LTS recommended)
- npm

### 1) Start the API server

```bash
cd server
npm install
npm start
```

The server runs on `http://localhost:3000`.

### 2) Start the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run start
```

The app runs on the Vite dev server (usually `http://localhost:5173`).

## Frontend scripts

From `frontend/`:

- **`npm run start`**: start Vite dev server
- **`npm run build`**: type-check (`vue-tsc`) then build for production (`vite build`)
- **`npm run preview`**: serve the production build locally
- **`npm run lint`**: run ESLint using `frontend/eslint.config.js`
- **`npm run test`**: run Vitest in watch mode
- **`npm run test:run`**: run Vitest once (CI-friendly)
- **`npm run test:ui`**: run Vitest UI

## Backend API

### `GET /price-offers`

Returns an array of price offers.

- **Server implementation**: `server/server.js`
- **Mock data source**: `server/mockPriceOffers.json`

Response shape (simplified):

```json
[
  {
    "origin": "FRA",
    "destination": "ROM",
    "departureDate": "2024-03-01",
    "returnDate": "2024-03-05",
    "seatAvailability": 7,
    "price": { "amount": 128.26, "currency": "EUR" },
    "offerType": "BestPrice",
    "uuid": "SA00001-..."
  }
]
```

## Architecture and design decisions

### Clean architecture and consistent structure

The frontend code is organized by **feature** and **responsibility**:

- **Feature module**: `frontend/src/features/priceOffers/`
  - **components**: presentational Vue components (UI rendering)
  - **composables**: data-fetching and state orchestration hooks (e.g. `usePriceOffers`)
  - **services**: API calls (e.g. `getPriceOffers`)
  - **utils**: pure functions (e.g. `formatAmount`) with unit tests
  - **types**: shared TypeScript interfaces
- **Shared UI**: `frontend/src/components/` (reusable primitives like `Button`, `Select`, `StatusBanner`)
- **Shared infra**: `frontend/src/libs/axios.ts` for a single Axios instance

This separation makes ownership clear, keeps components small, and keeps business logic testable outside the DOM.

### Declarative data fetching (Vue Query) vs `onMounted`

Instead of manually fetching in `onMounted` and managing a local pile of booleans, the app uses a **declarative** approach via `@tanstack/vue-query`:

- **Single source of truth for request state**: `isLoading`, `isPending`, `isError`, `error`, `data`
- **Retry and refetch** are first-class (`refetch`), enabling a “Retry” UX without reinventing request logic
- **Caching and request deduping** are available if/when the app grows (even if this demo keeps query configuration minimal)
- **Testability**: UI components can be tested by passing state in as props rather than mocking fetch timing

### TailwindCSS for a mobile-first UI

The UI uses Tailwind utility classes because it enables:

- **Mobile-first layout** (small screens by default, progressively enhanced with `sm:`, `md:`, etc.)
- **Fast iteration** without bouncing between CSS files
- **Consistent spacing/typography** and predictable styling

### URL-based state (shareable filters)

The selected origin/destination are mirrored into the URL query string (`?origin=...&destination=...`) so:

- Filtered views are **shareable** (copy/paste link)
- State survives **refresh** and browser navigation (back/forward)
- It’s easy to integrate with future deep-linking and analytics

To keep the UI responsive and avoid excessive router writes while a user is interacting, query updates are **debounced** in `PriceOfferContainer.vue`.

### Validation, error handling, and edge cases

The app includes explicit handling for common edge cases:

- **Loading / empty / error states** are rendered with a shared `StatusBanner` component
- **Unknown errors** are converted into readable messages in `PriceOfferList.vue`
- The error banner can **auto-focus** for accessibility (keyboard/screen-reader friendliness)
- A **Retry** action is available in error state (wired to Vue Query’s `refetch`)
- Formatting via `formatAmount` is defensive:
  - Handles `null`, `undefined`, `NaN`, and invalid currency inputs via a fallback

### Clear naming and ownership

Examples:

- `usePriceOffers` (composable): “how we fetch and expose offers”
- `getPriceOffers` (service): “how we call the API”
- `PriceOfferContainer` (component): page orchestration (filters, URL sync)
- `PriceOfferList` / `PriceOfferCard` (components): rendering and filtering
- `formatAmount` (util): pure formatting logic with unit tests

This naming makes it obvious where to put changes (and where not to).

## Testing approach

The test suite intentionally mixes:

- **Unit-style tests**: stub child components and test component state/logic in isolation
- **Integration-style tests**: render real child components to verify component composition and data flow

Run all tests:

```bash
cd frontend
npm run test:run
```

## Production-grade quality standards (what’s already in place)

- **Type safety**: strict TypeScript settings (`noUnusedLocals`, `noUnusedParameters`, etc.)
- **Linting and formatting**: ESLint + Vue + TypeScript + Prettier are wired in `frontend/eslint.config.js`
- **Accessible UI states**: `role="status"`, `role="alert"`, `aria-live`, focus management for errors
- **Separation of concerns**: clear boundaries between UI, fetching, services, and utils

## Notes / trade-offs

- The backend is intentionally minimal (mock JSON file + single endpoint). In a production service you’d likely add:
  - input validation, pagination, caching, structured logging, and error envelopes
- The Axios base URL is currently hard-coded in `frontend/src/libs/axios.ts`. For production, prefer an environment variable (e.g. `VITE_API_BASE_URL`).
