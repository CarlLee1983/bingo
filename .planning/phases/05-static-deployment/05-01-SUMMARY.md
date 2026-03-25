---
phase: 05-static-deployment
plan: 05-01
subsystem: build
tags: [vite, typescript, github-pages, static-deployment, spa-routing]

requires:
  - phase: 04-extensible-rules-layer
    provides: Complete game engine, rules system, and Bingo logic

provides:
  - Vite build configuration with GitHub Pages base path
  - Environment variable types via vite-env.d.ts
  - SPA routing redirect handlers (404.html and index.html)
  - Static asset build output ready for GitHub Pages deployment

affects: [GitHub Pages deployment, Phase 6 documentation]

tech-stack:
  added: [vite@8.0.2, TypeScript environment types]
  patterns: [base-path configuration, SPA redirect handling, environment type safety]

key-files:
  created:
    - public/404.html
    - src/vite-env.d.ts
  modified:
    - vite.config.ts (base: '/bingo/')
    - index.html (SPA redirect handler)
    - .env.example (environment template)

key-decisions:
  - "Set Vite base path to '/bingo/' for GitHub Pages subpath deployment."
  - "Implement SPA routing redirects using 404.html and index.html handlers to support client-side navigation."
  - "Use type-safe environment variables via vite-env.d.ts instead of hardcoded config."
  - "Keep .env.example as template without secrets; never commit .env."

patterns-established:
  - "GitHub Pages SPA redirect pattern: 404.html converts path-based navigation into query string format; index.html restores it via history.replaceState()."
  - "Vite base path configuration enables automatic asset rewriting in build output."
  - "Environment type interface ensures compile-time safety for import.meta.env usage."

requirements-completed: [PLAT-01]

# Metrics
duration: Documented as part of 797a292
completed: 2026-03-25
---

# Phase 5 Plan 01: Static Assets and Production Configuration Summary

Vite build configuration and SPA routing setup for GitHub Pages deployment with correct asset paths and client-side navigation support.

## Performance

- **Duration:** Included in commit 797a292
- **Completed:** 2026-03-25
- **Requirements:** 1 (PLAT-01 - CRITICAL)
- **Files modified:** 4
- **Files created:** 2

## Accomplishments

- Configured Vite with `base: '/bingo/'` to ensure all asset paths are rewritten correctly for GitHub Pages subpath deployment.
- Implemented type-safe environment variables via `src/vite-env.d.ts` with ImportMeta interface for compile-time safety.
- Created `public/404.html` with SPA redirect handler that converts path-based navigation to query string format (spa-github-pages pattern).
- Updated `index.html` with SPA redirect restoration script that converts query parameters back to proper paths via `window.history.replaceState()`.
- Created `.env.example` as environment configuration template.
- Verified build output includes correct asset paths prefixed with `/bingo/`.

## Task Details

### Vite Configuration Setup
- **File:** `vite.config.ts`
- **Changes:** Set `base: '/bingo/'` to configure base path for GitHub Pages subpath deployment
- **Effect:** All generated asset imports automatically rewritten to `/bingo/assets/...` format

### Environment Type Definition
- **File:** `src/vite-env.d.ts`
- **Changes:** Created type definitions for `ImportMetaEnv` interface with `VITE_APP_TITLE` and placeholder for additional variables
- **Effect:** Type-safe access to `import.meta.env` throughout application

### SPA Routing - 404 Handler
- **File:** `public/404.html`
- **Changes:** Implemented GitHub Pages redirect handler that converts failed path lookups to query string format
- **Implementation:** JavaScript in `<head>` captures current URL, converts path segments into `?p=` and `?q=` query parameters, then redirects
- **Configuration:** `pathSegmentsToKeep = 1` maintains `/bingo/` base while converting deeper paths
- **Effect:** Direct navigation to `/bingo/any/path` redirects to `/bingo/?p=/any/path` for client-side routing

### SPA Routing - Index Handler
- **File:** `index.html`
- **Changes:** Added SPA redirect restoration script in `<head>` that restores paths from query string
- **Implementation:** JavaScript checks for `search[1] === '/'`, decodes `~and~` separators back to `&`, restores path via `history.replaceState()`
- **Effect:** Once page loads, the redirect is transparent—URL displays original path without query string rewriting

### Environment Configuration
- **File:** `.env.example`
- **Changes:** Created template with example environment variables
- **Note:** Actual `.env` file excluded from version control via `.gitignore`

## Build Verification

When `npm run build` is executed:
1. Vite processes TypeScript and JSX with `/bingo/` base path
2. All asset imports (JS, CSS, images) are rewritten to include `/bingo/` prefix
3. `dist/index.html` contains correct paths: `<script src="/bingo/assets/index-xxx.js">`
4. `dist/404.html` is copied to deployment root for GitHub Pages 404 handling
5. TypeScript compilation succeeds with `vite-env.d.ts` types

## GitHub Pages Deployment Flow

1. Push to `main` branch
2. GitHub Actions workflow (`.github/workflows/deploy.yml`) triggers
3. Run `npm run build` → produces `dist/` with `/bingo/` prefixed assets
4. Deploy `dist/` contents to `gh-pages` branch
5. GitHub Pages serves from `gh-pages` branch at `/bingo/` subpath
6. SPA routing works seamlessly:
   - Direct URL: `/bingo/host` → 404 → redirects to `/?p=/host` → index.html loads → React Router handles navigation → displays /host
   - Navigation via app: React Router → updates hash/path → no page reload

## Files Created/Modified

### Created
- `public/404.html` - SPA redirect handler for GitHub Pages
- `src/vite-env.d.ts` - TypeScript type definitions for environment variables

### Modified
- `vite.config.ts` - Added `base: '/bingo/'` configuration
- `index.html` - Added SPA redirect restoration script in `<head>`
- `.env.example` - New environment configuration template (referenced in git output)

## Decisions Made

- **Base path strategy:** Use Vite's `base` configuration option instead of environment variables for asset path rewriting. This is the official recommended approach and ensures all imports are rewritten at build time.

- **SPA redirect approach:** Implement the battle-tested spa-github-pages pattern rather than building custom routing. This is proven to work reliably across all browsers and GitHub Pages versions.

- **Environment type safety:** Create `vite-env.d.ts` module with TypeScript interfaces rather than relying on Vite's auto-generated types. This ensures IDE autocomplete and compile-time checking for custom environment variables.

- **404 handler placement:** Use `public/404.html` (served by GitHub Pages on 404 errors) rather than a middleware solution. GitHub Pages automatically serves this file, making it the most reliable approach.

- **Redirect timing:** Implement redirect in `404.html` (immediate on request) and restoration in `index.html` (after page load) to handle all navigation scenarios—direct links, bookmarks, and internal navigation.

## Deviations from Plan

None - plan executed exactly as written. All verification steps (build completion, asset path rewriting, file existence, TypeScript compilation) were completed and confirmed.

## Issues Encountered

None - configuration applied cleanly with no errors or edge cases.

## User Setup Required

None - no external service configuration required. The static build is ready for GitHub Pages deployment.

## Next Phase Readiness

- Phase 5 Plan 01 is complete and verified.
- Requirement PLAT-01 is satisfied: "The app can be built and deployed as static assets on GitHub Pages without a backend"
- Build configuration is production-ready for automated GitHub Actions deployment.
- SPA routing is properly configured for client-side navigation on GitHub Pages.
- No blockers for continuing to Phase 6 documentation work.

---

*Phase: 05-static-deployment*
*Plan: 05-01*
*Completed: 2026-03-25*
*Requirement Coverage: PLAT-01 (100%)*
