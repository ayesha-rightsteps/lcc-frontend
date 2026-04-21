# AGENTS.md — lcc-frontend

> Read `../AGENT.md` first — understand who you are, how you speak to Ayesha, and the cross-cutting rules.
> Read `../sessions/` next — understand where the project currently stands.
> This file governs everything inside `lcc-frontend/`. It overrides general instinct. Follow it exactly.

This file provides guidance to AI agents (Antigravity, Claude, etc.) when working with code in this repository.
You are a senior architect, developer, and engineer. Write production-grade React code with zero shortcuts.

## Commands

```bash
npm run dev        # Vite dev server (localhost:5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint check
```

## Stack

React 19 · Vite 8 · Tailwind CSS v4 · Axios · React Router DOM · ES Modules

## Folder structure

```
src/
  assets/               ← static files (images, svgs)
  components/
    ui/                 ← design system primitives (Button, Input, Modal, Badge…)
                           Ayesha owns this folder — do not create files here without instruction
    common/             ← reusable app-level components (Navbar, Sidebar, PageHeader…)
  constants/
    api-endpoints.js    ← every API endpoint string, grouped by domain
  hooks/                ← custom React hooks (useAuth, useFetch, useDebounce…)
  layouts/              ← route-level layout wrappers (AuthLayout, DashboardLayout…)
  pages/                ← one file per route (LoginPage, DashboardPage…)
  routes/               ← React Router config
  services/
    api.js              ← axios instance with interceptors — import this everywhere
  store/                ← global state (Zustand or Context)
  utils/                ← pure functions (formatDate, formatCurrency, cn…)
  App.jsx
  main.jsx
  index.css
```

## API layer — two files, one rule

### `src/services/api.js`

Axios instance with base URL, auth header injection, and token refresh interceptor.
Import `api` from here for every HTTP call. Never use raw `axios` or `fetch` in components or hooks.

```js
import api from '../services/api.js';
const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
```

Token storage: `localStorage.setItem('accessToken', token)` and `localStorage.setItem('refreshToken', token)`.
On 401: interceptor auto-retries once with a refreshed token, then clears auth and redirects to `/login`.

### `src/constants/api-endpoints.js`

Every endpoint string lives here, grouped by domain. Never hardcode a URL string anywhere else.

```js
import API_ENDPOINTS from '../constants/api-endpoints.js';
await api.get(API_ENDPOINTS.AUTH.ME);
```

When a new backend route is added, add it here first — one place to update when the API changes.

## Component conventions

### File naming

| Type | File | Export |
|---|---|---|
| Page | `LoginPage.jsx` | default |
| Layout | `DashboardLayout.jsx` | default |
| Common component | `PageHeader.jsx` | default |
| UI primitive | `Button.jsx` | default |
| Custom hook | `useAuth.js` | named |
| Utility | `formatDate.js` | named |

### Component structure

Every component in this order, no exceptions:

```jsx
import ...

const ComponentName = ({ prop1, prop2 }) => {
  // hooks first
  // derived state
  // handlers
  // render
  return (...);
};

export default ComponentName;
```

### No comments — ever

Zero inline comments. Zero block comments. Zero JSDoc. No `//`. No `/* */`.
Name things clearly enough that comments are never needed.

### Props

Destructure props in the function signature. Never access `props.x`.

### No index.js barrel files

Import directly from the file. Barrel files create circular dependency risks and slow down HMR.

```js
import PageHeader from '../components/common/PageHeader.jsx';
```

## Custom hooks pattern

All data fetching lives in custom hooks, never inside components.

```js
const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export { useLogin };
```

## Error handling

- API errors: read `err.response?.data?.message` — backend always returns this shape
- Never show raw error objects to the user
- Loading and error states are always managed together in the same hook

## Routing

React Router DOM v6+. All routes defined in `src/routes/`.
Protected routes check auth state before rendering. Unauthenticated users redirect to `/login`.

```jsx
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" replace />;
};
```

## Environment variables

All env vars prefixed with `VITE_`. Accessed via `import.meta.env.VITE_*`.

```
VITE_API_BASE_URL=http://localhost:5000       # dev
VITE_API_BASE_URL=https://api.lcc.com        # production
```

Never hardcode base URLs anywhere. They are read in `src/services/api.js` only.

## Tailwind CSS v4

Using Tailwind v4 via `@tailwindcss/vite` plugin — no `tailwind.config.js` needed.
Custom design tokens (colors, fonts, spacing) go in `src/index.css` under `@theme`.
Ayesha will define the design system tokens — do not invent color names or values.

## Design system — Ayesha's domain

`src/components/ui/` is owned by the designer.
When building pages or features, use whatever UI components exist in `src/components/ui/`.
If a needed primitive doesn't exist yet, use plain Tailwind and flag it — do not create a half-finished component.

## Production standards

- No `console.log` anywhere — use nothing (this is frontend, no logger)
- No hardcoded strings for UI copy — keep text in the component but make it easy to extract later
- Images from `src/assets/` only — never link to external URLs for app assets
- Lazy load pages with `React.lazy` and `Suspense`
- All forms must show field-level validation errors from the API response
- Never store sensitive data beyond tokens in localStorage
- Token refresh is handled automatically by `src/services/api.js` — do not build it again elsewhere
