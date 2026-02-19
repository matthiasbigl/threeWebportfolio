# AGENTS.md — Coding Agent Guidelines

## Project Overview

SvelteKit 2 + Svelte 5 portfolio website with Three.js 3D elements, GSAP animations,
Tailwind CSS styling, and i18n (German-first, English lazy-loaded). Target market is
Vienna/Austria. Node >= 22 required.

## Agent Skills

- **`frontend-design`** — Always use this skill when building or modifying UI components,
  pages, layouts, or any visual/styling work. It ensures high design quality.
- **`svelte5-best-practices`** — Use when writing, reviewing, or refactoring Svelte 5
  components. Covers runes, snippets, events, TypeScript props, and SvelteKit patterns.
- **`ui-ux-pro-max`** — Use for design system generation, color palettes, font pairings,
  and UX guidelines. Has a searchable database with Svelte stack support.
- **`seo-audit`** — Use when auditing or diagnosing SEO issues. Covers crawlability,
  indexation, Core Web Vitals, on-page optimization, and structured data.

## Build / Dev / Lint Commands

```bash
npm run dev            # Start Vite dev server
npm run build          # Production build (vite build)
npm run preview        # Preview production build locally
npm run check          # TypeScript + Svelte type checking (svelte-kit sync && svelte-check)
npm run check:watch    # Type checking in watch mode
npm run lint           # Run Prettier check + ESLint (prettier --check . && eslint .)
npm run format         # Auto-format all files with Prettier
```

There is **no test suite** — no vitest, jest, or playwright. No test runner or test files exist.
Validate changes with `npm run check` and `npm run build`.

## Tech Stack

| Layer      | Technology                                                            |
| ---------- | --------------------------------------------------------------------- |
| Framework  | SvelteKit 2 (`@sveltejs/kit`)                                         |
| UI         | Svelte 5 (runes mode: `$state`, `$props`, `$derived`, `$effect`)      |
| Styling    | Tailwind CSS 3.4 + CSS custom properties (design tokens in `app.css`) |
| 3D         | Three.js 0.172 + Threlte (core/extras/rapier)                         |
| Animation  | GSAP 3.13 — always dynamically imported                               |
| i18n       | `svelte-i18n` — German default, English lazy-loaded                   |
| Forms      | SvelteKit server actions + EmailJS                                    |
| Validation | Manual validation functions (Zod in deps but unused)                  |
| Markdown   | `marked` — used for pricing page content                              |
| Adapter    | `@sveltejs/adapter-auto` with prerender + crawl                       |

## Code Style & Formatting

### Prettier (`.prettierrc`)

- **Tabs** for indentation (not spaces)
- **Single quotes** (`'`)
- **No trailing commas**
- **100 char** print width
- Svelte files use `prettier-plugin-svelte`

### ESLint (`.eslintrc.cjs`)

- Extends: `eslint:recommended`, `@typescript-eslint/recommended`, `svelte/recommended`, `prettier`
- Parser: `@typescript-eslint/parser` with Svelte override using `svelte-eslint-parser`

### TypeScript

- **Strict mode** enabled (`strict: true` in tsconfig)
- Use `interface` for component props and object shapes (not `type` — except union literals)
- Use `$lib/` alias for all lib imports; relative imports (`'./Foo.svelte'`) only for siblings
- Type SvelteKit-generated types from `./$types` (e.g., `import type { Actions } from './$types'`)
- Use `import type` for type-only imports

### Naming Conventions

- **Components**: PascalCase filenames (`Button.svelte`, `SEO.svelte`, `ThemeToggle.svelte`)
- **Routes**: SvelteKit conventions (`+page.svelte`, `+page.server.ts`, `+layout.svelte`)
- **Variables / functions**: camelCase
- **Constants**: camelCase or UPPER_SNAKE_CASE for true constants (e.g., `RATE_LIMIT_WINDOW`)
- **CSS classes**: Tailwind utilities in markup; custom classes use kebab-case (`glass-card`, `ripple-effect`)
- **Stores**: camelCase named exports (`theme`, `reducedMotion`)

### Import Ordering

1. Svelte/SvelteKit imports (`svelte`, `svelte/store`, `$app/environment`, `@sveltejs/kit`)
2. Third-party libraries (`gsap`, `three`, `svelte-i18n`, `marked`, `emailjs`)
3. `$lib/` imports (stores, utils, components, data)
4. Relative imports (`'./Component.svelte'`)
5. Type imports use `import type { ... }`

### Svelte 5 Component Pattern

All components use **Svelte 5 runes** — no legacy syntax. Key rules:

- Use `$props()` with a `Props` interface — never `export let`
- Use `$state()`, `$derived()`, `$effect()` — never legacy reactive declarations
- Use `{@render children?.()}` — never `<slot>`
- Use `className` prop (not `class`) for external class overrides
- Use `Snippet` type (from `svelte`) for children/slot content

## Architecture Patterns

### GSAP — Always Lazy-Loaded

Never import GSAP statically. Always use dynamic import inside `onMount`:

```ts
onMount(async () => {
	const { gsap } = await import('gsap');
	const { ScrollTrigger } = await import('gsap/ScrollTrigger');
	gsap.registerPlugin(ScrollTrigger);
});
```

### Accessibility — Reduced Motion

All animations must respect `prefers-reduced-motion`:

- GSAP: Use `gsap.matchMedia()` to disable/simplify animations
- CSS: Add `@media (prefers-reduced-motion: reduce)` blocks
- Use the `reducedMotion` store from `$lib/stores/reducedMotion`

### Theming

- Light/dark mode via CSS custom properties defined in `src/app.css`
- Theme state in `$lib/theme.ts` (writable store); dark class toggled on `<html>`
- Theme persisted in `localStorage`; inline script in `app.html` prevents FOUC

### i18n

- German (`de`) is default/fallback — loaded synchronously via `addMessages`
- English (`en`) lazy-loaded via `register('en', () => import(...))`
- Use `$_('key')` in templates; locale files at `src/lib/i18n/locales/{de,en}.json`

### Styling

- **Tailwind utilities** for layout/spacing/typography in markup
- **CSS custom properties** in `src/app.css` for theme colors (`var(--text-heading)`, `var(--bg-primary)`)
- **Component-scoped `<style>`** for complex animations and glassmorphism
- Use existing classes: `glass-card`, `glass-card-hover`, `text-gradient`

## Error Handling

- Server actions: use `fail()` from `@sveltejs/kit` to return validation errors
- Wrap external API calls (EmailJS, etc.) in `try/catch`
- Log errors with `console.error()`; return user-friendly messages
- Guard browser-only code with `if (!browser) return` using `$app/environment`

## Performance Rules

- Three.js/Threlte lazy-loaded — keep out of critical path
- GSAP always dynamically imported (never static `import`)
- Vite config has manual chunk splitting for three, gsap, i18n, marked, zod
- Images use `@sveltejs/enhanced-img`; lazy-load non-critical images

## Key Directories

```
src/
├── app.html / app.css / app.d.ts  # Shell, design tokens, global types
├── hooks.server.ts                # Security headers, cache control
├── routes/                        # SvelteKit file-based routing
│   ├── +layout.svelte             # Root layout (navbar, footer, SEO)
│   ├── +page.svelte               # Homepage
│   ├── contact/                   # Contact form with server action
│   ├── projects/[slug]/           # Dynamic project pages
│   ├── pricing/ | about/          # Static pages
│   ├── impressum/ | datenschutz/  # Legal pages
│   └── sitemap.xml/               # Dynamic sitemap
└── lib/
    ├── components/                # 19 reusable Svelte components
    ├── i18n/                      # i18n setup + locale JSON files
    ├── data/ | stores/ | utils/   # Data, stores, utilities
    ├── content/                   # Markdown content (pricing)
    ├── assets/                    # Images (processed by enhanced-img)
    └── theme.ts                   # Theme store and toggle logic
```

## Environment Variables

Required for contact form (EmailJS) — see `.env.example`:
`EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`

Never commit `.env` files. Access via `import.meta.env.VAR_NAME`.
