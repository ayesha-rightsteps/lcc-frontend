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
All design tokens are defined in `src/index.css` — under `@theme` for static values, and under
`:root` / `[data-theme]` for theme-aware CSS variables.

## Design system — non-negotiable, always follow

`src/components/ui/` is owned by Ayesha. Do not create files there without her instruction.
When building pages or features, use whatever UI components exist in `src/components/ui/`.
If a needed primitive doesn't exist yet, use plain Tailwind classes + CSS variables and flag it.
Do not invent token names or color values. Everything you need is defined below and in `index.css`.

### Brand identity

Project: **ISSB Smart Study** — military + education platform.
Brand colors come from the logo: deep army green + rich brass gold.
Every design decision must feel premium, authoritative, and trustworthy.

### Fonts

| Token | Family | Use |
|---|---|---|
| `--font-sans` | Inter | All UI text, labels, body copy |
| `--font-heading` | Playfair Display | Page titles, section headings, hero text |
| `--font-mono` | JetBrains Mono | OTP inputs, numeric data, code |

Always use the token, never hardcode font names in components.

```css
font-family: var(--font-sans);
font-family: var(--font-heading);
```

### Color tokens — static (same in both modes)

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#1B4332` | Primary brand green — buttons, links, active states |
| `--color-primary-light` | `#2D6A4F` | Hover state on primary elements |
| `--color-primary-dark` | `#0D2B1E` | Pressed / active state |
| `--color-accent` | `#C9A84C` | Gold accent — badges, highlights, borders on cards |
| `--color-accent-light` | `#E8C96A` | Hover state on accent elements |
| `--color-accent-dark` | `#A07830` | Pressed gold, deep decorative use |
| `--color-success` | `#2D9E6B` | Success messages, completed states |
| `--color-error` | `#C0392B` | Form errors, destructive alerts |
| `--color-warning` | `#E07B00` | Warning banners |
| `--color-info` | `#2471A3` | Info badges, hints |

### Color tokens — theme-aware (change between light and dark)

These are CSS variables, not Tailwind tokens. Use them with `var()`:

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-bg` | `#F8F6F0` | `#0D1A14` | Page background |
| `--color-surface` | `#FFFFFF` | `#132218` | Card / panel background |
| `--color-surface-elevated` | `#F0EDE5` | `#1A2E22` | Elevated surfaces, dropdowns |
| `--color-border` | `#D4CFC4` | `#253D2E` | Default borders |
| `--color-border-subtle` | `#E8E4DC` | `#1E3326` | Subtle dividers |
| `--color-text` | `#1A1A1A` | `#F0EDE5` | Primary text |
| `--color-text-muted` | `#6B6560` | `#8A9E90` | Secondary / helper text |
| `--color-text-placeholder` | `#A09A93` | `#5A7060` | Input placeholder text |
| `--color-text-on-primary` | `#FFFFFF` | `#FFFFFF` | Text on green backgrounds |
| `--color-text-on-accent` | `#1B1000` | `#1B1000` | Text on gold backgrounds |
| `--color-primary-soft` | `rgba(27,67,50,0.08)` | `rgba(45,106,79,0.15)` | Soft green tints |
| `--color-accent-soft` | `rgba(201,168,76,0.12)` | `rgba(201,168,76,0.1)` | Soft gold tints |
| `--shadow-card` | green-tinted shadow | dark shadow | Default card shadow |

### Shadows

| Token | Use |
|---|---|
| `--shadow-sm` | Subtle lifts |
| `--shadow-md` | Cards, inputs on focus |
| `--shadow-lg` | Modals, dropdowns |
| `--shadow-accent` | Gold-glowing CTAs |

### Border radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | `4px` | Badges, tags, small inputs |
| `--radius-md` | `8px` | Buttons, cards |
| `--radius-lg` | `12px` | Large cards, panels |
| `--radius-xl` | `16px` | Modals, sheets |
| `--radius-full` | `9999px` | Pills, avatars |

### Dark / light mode implementation

Theme is controlled by `data-theme` attribute on `<html>`:

```html
<html data-theme="light">
<html data-theme="dark">
```

User preference is stored in `localStorage` under the key `theme`.
The toggle hook reads from `localStorage` on mount and applies the attribute to `document.documentElement`.
Default: **light mode**.

```js
const stored = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', stored);
```

Never use Tailwind's `dark:` variant. Always use `var(--color-*)` tokens.
The theme switch is instant — CSS variables automatically cascade to all components.

### Usage rules

- Always use `var(--color-*)` for any color that appears in the UI
- Never hardcode hex values in components or pages
- For Tailwind utility classes that need a color, use arbitrary values: `bg-[var(--color-surface)]`
- Do not add new tokens to `index.css` without Ayesha's approval

## Production standards

- No `console.log` anywhere — use nothing (this is frontend, no logger)
- No hardcoded strings for UI copy — keep text in the component but make it easy to extract later
- Images from `src/assets/` only — never link to external URLs for app assets
- Lazy load pages with `React.lazy` and `Suspense`
- All forms must show field-level validation errors from the API response
- Never store sensitive data beyond tokens in localStorage
- Token refresh is handled automatically by `src/services/api.js` — do not build it again elsewhere
