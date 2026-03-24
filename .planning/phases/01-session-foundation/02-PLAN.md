---
phase: 01-session-foundation
plan: 02
type: execute
wave: 2
depends_on:
  - 01
files_modified:
  - src/app/App.tsx
  - src/app/App.test.tsx
  - src/components/session/SessionScreen.tsx
  - src/components/session/HostPanel.tsx
  - src/components/session/PlayerRoster.tsx
  - src/components/session/SessionStatus.tsx
  - src/features/session/session-provider.tsx
  - src/styles.css
autonomous: true
requirements:
  - SESS-01
  - SESS-02
must_haves:
  truths:
    - "Host can create a new local session and see the lobby initialize without a reload"
    - "Host can add multiple players before the game starts and the roster updates immediately"
    - "Host can reset the current session without reloading and gets a fresh empty lobby"
    - "Refreshing the page restores the persisted lobby state"
    - "The UI uses one canonical session store instead of duplicated local component state"
  artifacts:
    - path: "src/features/session/session-provider.tsx"
      provides: "Context provider and hook for the canonical session store"
    - path: "src/components/session/SessionScreen.tsx"
      provides: "Composed host/session view"
    - path: "src/components/session/HostPanel.tsx"
      provides: "Create/add/reset controls"
    - path: "src/app/App.test.tsx"
      provides: "Integration coverage for create/add/reset/restore flow"
  key_links:
    - from: "src/app/App.tsx"
      to: "src/features/session/session-provider.tsx"
      via: "context provider wrapper"
      pattern: "SessionProvider"
    - from: "src/app/App.tsx"
      to: "src/components/session/SessionScreen.tsx"
      via: "sessionId keyed remount boundary"
      pattern: "key={session.sessionId}"
    - from: "src/components/session/HostPanel.tsx"
      to: "session actions"
      via: "form submit and buttons"
      pattern: "Create session|Add player|Reset session"
---

<objective>
Build the host/player session shell that consumes the canonical store and exposes create, add, reset, and restore flows.

Purpose: satisfy SESS-01 and SESS-02 from the user's perspective while keeping the state model from Wave 1 as the single source of truth.
Output: interactive host screen, player roster, reset boundary, and integration tests.
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

<interfaces>
From `src/features/session/session-types.ts`:
```typescript
export type SessionStatus = 'lobby' | 'active';

export type Player = {
  id: string;
  name: string;
  joinedAt: number;
};

export type SessionState = {
  schemaVersion: 1;
  sessionId: string;
  status: SessionStatus;
  hostId: string | null;
  players: Player[];
  createdAt: number;
  updatedAt: number;
};

export type SessionAction =
  | { type: 'session/create'; hostName: string }
  | { type: 'player/add'; name: string }
  | { type: 'session/reset' }
  | { type: 'session/load'; snapshot: SessionState };
```

From `src/features/session/session-reducer.ts`:
```typescript
export function createInitialSession(): SessionState;
export function sessionReducer(state: SessionState, action: SessionAction): SessionState;
```

From `src/features/session/session-storage.ts`:
```typescript
export const SESSION_STORAGE_KEY: 'bingo.session.v1';
export function loadSession(): SessionState | null;
export function saveSession(snapshot: SessionState): void;
export function clearSession(): void;
```

From `src/features/session/session-provider.tsx`:
```typescript
export function SessionProvider(props: { children: React.ReactNode }): JSX.Element;
export function useSession(): {
  session: SessionState;
  createSession(hostName: string): void;
  addPlayer(name: string): void;
  resetSession(): void;
};
```
</interfaces>
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Wire the session provider, hook, and keyed reset boundary</name>
  <files>src/app/App.tsx, src/features/session/session-provider.tsx</files>
  <read_first>.planning/phases/01-session-foundation/01-PLAN.md, src/features/session/session-types.ts, src/features/session/session-reducer.ts, src/features/session/session-storage.ts, src/app/App.tsx</read_first>
  <behavior>
    - `SessionProvider` must initialize from `loadSession()` when valid persisted data exists
    - `SessionProvider` must fall back to `createInitialSession()` when nothing valid is persisted
    - `createSession(hostName)` must dispatch `session/create`
    - `addPlayer(name)` must dispatch `player/add`
    - `resetSession()` must dispatch `session/reset` and clear the persisted snapshot
    - `App.tsx` must remount the session shell with `key={session.sessionId}` so child UI state resets on a new round
  </behavior>
  <action>Create a `SessionProvider` that owns the reducer state from Wave 1, writes each snapshot through `saveSession(session)` in an effect, and exposes a `useSession()` hook that returns `{ session, createSession, addPlayer, resetSession }`; wrap the app shell in that provider and pass the current `session.sessionId` as the `key` for the session screen so an explicit reset clears child component-local state.</action>
  <acceptance_criteria>
    - `src/features/session/session-provider.tsx` exports `SessionProvider` and `useSession`
    - `src/features/session/session-provider.tsx` contains `loadSession(` and `saveSession(`
    - `src/app/App.tsx` contains `key={session.sessionId}` or `key={state.sessionId}`
    - `src/app/App.tsx` renders `SessionProvider`
    - `resetSession()` clears the persisted snapshot before the new session is rendered
    - `npm test` exits 0 after the provider wiring is added
  </acceptance_criteria>
  <verify><automated>npm test</automated></verify>
  <done>The app has a canonical provider layer and an explicit reset boundary that clears local UI state without a page reload.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Build the host/session shell UI and integration coverage</name>
  <files>src/components/session/SessionScreen.tsx, src/components/session/HostPanel.tsx, src/components/session/PlayerRoster.tsx, src/components/session/SessionStatus.tsx, src/app/App.test.tsx, src/styles.css</files>
  <read_first>.planning/phases/01-session-foundation/01-PLAN.md, src/app/App.tsx, src/features/session/session-provider.tsx, src/features/session/session-types.ts, src/features/session/session-reducer.ts, src/features/session/session-storage.ts, src/styles.css</read_first>
  <behavior>
    - `HostPanel` must expose a host-name input plus buttons labeled exactly `Create session`, `Add player`, and `Reset session`
    - `PlayerRoster` must render every player from `session.players` and show an empty-state message when the roster is empty
    - `SessionStatus` must show the current `status`, `sessionId`, and player count derived from session state
    - `SessionScreen` must compose the host controls and roster using the provider hook, not local duplicate state
    - `App.test.tsx` must exercise create, add, reset, and restore flows against the real provider
  </behavior>
  <action>Implement the browser-facing shell with a focused host layout: a host panel that creates a session and adds players, a roster that lists names in insertion order, a status block that shows the current lobby state, and a reset button that returns the UI to a fresh empty session; keep styling minimal but structured in `src/styles.css`, and verify the localStorage restore path with an integration test that saves a snapshot, remounts the app, and sees the same player roster.</action>
  <acceptance_criteria>
    - `src/components/session/HostPanel.tsx` contains the exact button labels `Create session`, `Add player`, and `Reset session`
    - `src/components/session/PlayerRoster.tsx` maps over `session.players`
    - `src/components/session/SessionStatus.tsx` shows `sessionId` and player count
    - `src/app/App.test.tsx` contains tests for create, add, reset, and restore behavior
    - `npm test` exits 0
  </acceptance_criteria>
  <verify><automated>npm test</automated></verify>
  <done>The host can create a session, add multiple players, reset to a fresh lobby, and restore the lobby from browser storage without reloading.</done>
</task>

</tasks>

<verification>
- `npm test` passes with provider and UI integration tests
- `key={session.sessionId}` is present in the app shell
- The host panel exposes create, add, and reset controls with the exact labels specified
- Refreshing the page restores the roster from the persisted snapshot
</verification>

<success_criteria>
- Phase 1 meets SESS-01, SESS-02, and SESS-03 in a browser without a backend
- The app exposes a stable host/player shell and a single canonical session store
- A fresh session can be started, mutated, reset, and restored from storage
</success_criteria>

<output>
After completion, create `.planning/phases/01-session-foundation/02-SUMMARY.md`
</output>
