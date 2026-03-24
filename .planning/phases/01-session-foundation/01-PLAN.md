---
phase: 01-session-foundation
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - package-lock.json
  - tsconfig.json
  - vite.config.ts
  - index.html
  - src/main.tsx
  - src/app/App.tsx
  - src/styles.css
  - src/features/session/session-types.ts
  - src/features/session/session-reducer.ts
  - src/features/session/session-storage.ts
  - src/features/session/session-reducer.test.ts
  - src/features/session/session-storage.test.ts
autonomous: true
requirements:
  - SESS-03
must_haves:
  truths:
    - "Session snapshot can be saved to localStorage and restored after refresh"
    - "The session store is a single normalized source of truth"
    - "Reset creates a fresh sessionId and clears the roster instead of mutating the old lobby"
    - "Missing or invalid persisted data falls back to a fresh default session"
  artifacts:
    - path: "src/features/session/session-types.ts"
      provides: "Session and player type contracts"
    - path: "src/features/session/session-reducer.ts"
      provides: "Pure reducer for create/add/reset/load actions"
    - path: "src/features/session/session-storage.ts"
      provides: "Versioned localStorage snapshot adapter"
    - path: "package.json"
      provides: "Vite/React/TypeScript/Vitest project scaffold"
  key_links:
    - from: "src/features/session/session-reducer.ts"
      to: "src/features/session/session-storage.ts"
      via: "snapshot serialization and hydration"
      pattern: "saveSession|loadSession"
    - from: "src/features/session/session-storage.ts"
      to: "window.localStorage"
      via: "single versioned storage key"
      pattern: "bingo.session.v1"
    - from: "src/main.tsx"
      to: "src/app/App.tsx"
      via: "React root bootstrap"
      pattern: "createRoot"
---

<objective>
Bootstrap the static React/Vite app and canonical session data layer for Phase 1.

Purpose: give the session UI a stable, testable store and persistence boundary before the host/player shell is built.
Output: project scaffold, reducer, storage adapter, and passing unit tests.
</objective>

<execution_context>
@/Users/carl/.codex/get-shit-done/workflows/execute-plan.md
@/Users/carl/.codex/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/REQUIREMENTS.md
@.planning/phases/01-session-foundation/01-CONTEXT.md
@.planning/phases/01-session-foundation/01-RESEARCH.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Bootstrap the static React/Vite/TypeScript app shell</name>
  <files>package.json, package-lock.json, tsconfig.json, vite.config.ts, index.html, src/main.tsx, src/app/App.tsx, src/styles.css</files>
  <read_first>.planning/PROJECT.md, .planning/ROADMAP.md, .planning/STATE.md, .planning/phases/01-session-foundation/01-RESEARCH.md</read_first>
  <action>Create a Vite 8 + React 19 + TypeScript 6 project with npm scripts `dev`, `build`, `preview`, and `test`; add `react@19.2.4`, `react-dom@19.2.4`, `vite@8.0.2`, `typescript@6.0.2`, `vitest@4.1.1`, `@testing-library/react@16.3.2`, `jsdom@29.0.1`, `@types/react`, and `@types/react-dom`; mount `src/app/App.tsx` from `src/main.tsx` using `createRoot(document.getElementById('root')!)`; create `index.html` with a `<div id="root"></div>`; keep `src/app/App.tsx` as a simple placeholder shell that can be replaced in Wave 2.</action>
  <acceptance_criteria>
    - `package.json` contains scripts named `dev`, `build`, `preview`, and `test`
    - `package.json` contains `react@19.2.4` and `react-dom@19.2.4`
    - `package.json` contains devDependencies `vite@8.0.2`, `typescript@6.0.2`, `vitest@4.1.1`, `@testing-library/react@16.3.2`, and `jsdom@29.0.1`
    - `src/main.tsx` contains `createRoot(document.getElementById('root')!)`
    - `index.html` contains `<div id="root"></div>`
    - `npm run build` exits 0
  </acceptance_criteria>
  <verify><automated>npm run build</automated></verify>
  <done>The project boots from a Vite React entry point and builds as a static frontend app.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Implement the normalized session reducer and localStorage adapter</name>
  <files>src/features/session/session-types.ts, src/features/session/session-reducer.ts, src/features/session/session-storage.ts, src/features/session/session-reducer.test.ts, src/features/session/session-storage.test.ts</files>
  <read_first>.planning/phases/01-session-foundation/01-RESEARCH.md, .planning/phases/01-session-foundation/01-CONTEXT.md, src/features/session/session-types.ts, src/features/session/session-reducer.ts, src/features/session/session-storage.ts</read_first>
  <behavior>
    - `SessionState` must include `schemaVersion: 1`, `sessionId`, `status: 'lobby' | 'active'`, `hostId`, `players`, `createdAt`, and `updatedAt`
    - `SessionAction` must support `session/create`, `player/add`, `session/reset`, and `session/load`
    - `session/create` must seed one host player and set `hostId` to that player id
    - `player/add` must append a new player without overwriting the existing roster
    - `session/reset` must return a brand-new lobby snapshot with a new `sessionId`
    - `session-storage.ts` must serialize to `localStorage.setItem('bingo.session.v1', JSON.stringify(snapshot))`
    - `loadSession` must return `null` for missing, malformed, or version-mismatched payloads
  </behavior>
  <action>Write a pure reducer and storage adapter with exact exports `SessionStatus`, `Player`, `SessionState`, `SessionAction`, `sessionReducer`, `createInitialSession`, `loadSession`, `saveSession`, and `clearSession`; keep browser access isolated to `session-storage.ts`; use `crypto.randomUUID()` for session and player ids; make the reducer deterministic so the same action sequence always yields the same session shape.</action>
  <acceptance_criteria>
    - `src/features/session/session-types.ts` exports `type SessionStatus = 'lobby' | 'active'`
    - `src/features/session/session-reducer.ts` contains `case 'session/create'`, `case 'player/add'`, and `case 'session/reset'`
    - `src/features/session/session-storage.ts` contains `const SESSION_STORAGE_KEY = 'bingo.session.v1'`
    - `src/features/session/session-reducer.test.ts` contains tests for create, add, and reset behavior
    - `src/features/session/session-storage.test.ts` contains tests for save/load round-tripping and invalid payload fallback
    - `npm test` exits 0
  </acceptance_criteria>
  <verify><automated>npm test</automated></verify>
  <done>The session domain is normalized, test-covered, and persists through a versioned browser snapshot.</done>
</task>

</tasks>

<verification>
- `npm run build` succeeds on the new scaffold
- `npm test` passes for the reducer and persistence layer
- The persisted snapshot key is `bingo.session.v1`
- The reducer can create, add players, and reset without mutating prior state
</verification>

<success_criteria>
- Phase 1 has a working static app scaffold and a canonical session store
- Session state can be restored from browser storage after refresh
- The session data model is ready for the interactive shell in Wave 2
</success_criteria>

<output>
After completion, create `.planning/phases/01-session-foundation/01-SUMMARY.md`
</output>
