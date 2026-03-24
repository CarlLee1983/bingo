# Phase 1: Session Foundation - Research

**Researched:** 2026-03-24
**Domain:** static frontend session state for a browser bingo game
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** 以「單一共享局」作為 Phase 1 的核心模型，不先做真正的跨裝置即時房間同步
- **D-02:** 主持人負責開局與重置，玩家只需要加入同一局即可
- **D-03:** 局內狀態需要能在瀏覽器端持久化，避免重新整理後整局消失
- **D-04:** 先支援多人加入同一局，再進入開局與發卡流程
- **D-05:** Phase 1 不加入帳號、登入或長期玩家資料
- **D-06:** 即時跨裝置同步、房間邀請與多人協作控制留到後續 phase
- **D-07:** 規則變體、特殊道具與自訂勝利條件不在本階段實作

### Claude's Discretion
- 局內狀態儲存的具體前端機制
- Host / player 畫面的視覺安排
- 玩家加入與重置的互動細節

### Deferred Ideas (OUT OF SCOPE)
- Real-time cross-device multiplayer backend
- Player accounts and authentication
- Custom rules / variants / power-ups
- Persistent stats and ranked play

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SESS-01 | Host can create a new game session and add multiple players before the game starts | A single normalized session store with player roster actions keeps lobby state simple and testable |
| SESS-02 | Host can reset the current session and start a fresh round without reloading the page | React preserves state by position, so reset should be driven by explicit state transitions and/or keyed remounts |
| SESS-03 | Game state can be saved and restored locally in the browser | `localStorage` persists across browser sessions and is appropriate for GitHub Pages |

</phase_requirements>

## Summary

Phase 1 should be built as a static-first React app with one source of truth for the game session, not as a collection of component-local `useState` islands. The lightest reliable stack for this scope is React 19.2.4, Vite 8.0.2, and TypeScript 6.0.2, with browser `localStorage` as the persistence layer. That combination keeps the app deployable to GitHub Pages and leaves enough structure for later phases to add cards, calling, and win validation without rewriting the session core.

The main design decision is to normalize the session state and treat reset as a deliberate state transition. React’s state-structure guidance favors grouped related state, avoiding duplication, and avoiding deeply nested state; those principles map well to a bingo lobby with players, host metadata, and round status. For persistence, write a versioned JSON snapshot to `localStorage`, restore on boot, and use the `storage` event only as a future cross-tab warning mechanism, not as a multiplayer sync layer.

**Primary recommendation:** Use a feature-based React/TypeScript session store with reducer-style transitions, persist the snapshot to `localStorage`, and reset by explicit action plus keyed subtree remount where UI state must be cleared.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | UI rendering and component state | Official current major line; fits a small interactive game UI and supports keyed resets cleanly |
| Vite | 8.0.2 | Dev server, production build, GitHub Pages-friendly static output | Official static deploy docs include GitHub Pages guidance and build-to-`dist` flow |
| TypeScript | 6.0.2 | Type-safe session models and actions | Reduces state-shape bugs in a normalized session store |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 4.1.1 | Unit and integration tests | Use for reducer, persistence, and reset behavior |
| @testing-library/react | 16.3.2 | DOM behavior tests | Use for lobby/session UI behavior |
| jsdom | 29.0.1 | Browser-like test environment | Use for localStorage and render testing |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React + reducer store | Vanilla JS modules | Less framework overhead, but harder to scale once card and calling phases arrive |
| React + reducer store | Zustand / Redux | More tooling than Phase 1 needs; state is still small enough for a reducer |
| localStorage | IndexedDB | More storage capacity, but unnecessary complexity for a small serialized session snapshot |
| localStorage | sessionStorage | Clears on tab close, which conflicts with the requirement to restore locally |

**Installation:**
```bash
npm install react@19.2.4 react-dom@19.2.4
npm install -D vite@8.0.2 typescript@6.0.2 vitest@4.1.1 @testing-library/react@16.3.2 jsdom@29.0.1 @types/react @types/react-dom
```

**Version verification:** versions above were verified against the npm registry on 2026-03-24.

## Architecture Patterns

### Recommended Project Structure
```text
src/
├── app/              # App shell, route-less layout, session bootstrap
├── features/
│   └── session/      # Session state, actions, selectors, persistence adapter
├── components/       # Shared presentational UI
├── lib/
│   └── storage/      # localStorage read/write/versioning helpers
├── types/            # Shared TypeScript types
└── main.tsx
```

### Pattern 1: Single normalized session store
**What:** Keep the lobby/session data in one state object with explicit actions like `createSession`, `addPlayer`, `resetSession`, and `loadPersistedSession`.
**When to use:** When multiple views need the same authoritative session data and resets must stay deterministic.
**Example:**
```typescript
type SessionStatus = 'lobby' | 'active';

type Player = {
  id: string;
  name: string;
  joinedAt: number;
};

type SessionState = {
  schemaVersion: 1;
  sessionId: string;
  status: SessionStatus;
  hostId: string | null;
  players: Player[];
  createdAt: number;
  updatedAt: number;
};
```

### Pattern 2: Versioned persistence adapter
**What:** Serialize the session snapshot through one storage module that owns JSON parsing, schema versioning, and fallback-to-default behavior.
**When to use:** When the app must restore after refresh but still tolerate schema changes later.
**Example:**
```typescript
// Source: MDN localStorage property (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
const STORAGE_KEY = 'bingo.session.v1';

export function saveSession(snapshot: SessionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}
```

### Pattern 3: Explicit reset boundary
**What:** Dispatch a reset action to clear session state and, when needed, change a React `key` to force child subtrees to remount.
**When to use:** When the host starts a fresh round and any child component-local UI state must be discarded.
**Example:**
```tsx
// Source: React preserving and resetting state (https://react.dev/learn/preserving-and-resetting-state)
<SessionPanel key={session.sessionId} session={session} />
```

### Anti-Patterns to Avoid
- Scattering session truth across many `useState` calls: it creates contradictions and duplicated data.
- Persisting derived values such as player counts or lobby labels: derive them from the canonical session snapshot instead.
- Using nested state that mirrors the UI hierarchy: flat session data is easier to update and serialize.
- Treating `sessionStorage` as persistence: it does not satisfy the refresh/restoration requirement.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Browser persistence | A custom multi-tab sync system | `localStorage` snapshot + optional `storage` event handling | Static GitHub Pages has no backend; the browser already provides persistence |
| Session reset semantics | Imperative DOM clearing | Reducer action plus keyed React subtree reset | React’s state model already handles controlled resets cleanly |
| Store shape | Deeply nested lobby/player trees with duplicated fields | Flat normalized session state | Reduces contradictions and update bugs |
| Multiplayer sync | Fake real-time backend inside the frontend | Defer to a later sync phase | Out of scope for a static-first v1 |

**Key insight:** For this phase, the hard problem is not rendering a lobby, it is keeping one authoritative session snapshot consistent across refreshes and resets without introducing duplicate state.

## Common Pitfalls

### Pitfall 1: Duplicate state between session and UI
**What goes wrong:** Player names, counts, and status badges drift out of sync because some values are stored and others are derived.
**Why it happens:** The UI is built component-first instead of state-first.
**How to avoid:** Store only canonical session fields; derive counts and labels from the snapshot during render.
**Warning signs:** Multiple components need to "keep in sync" manually.

### Pitfall 2: Reset that only clears visible UI
**What goes wrong:** The host sees a fresh lobby, but stale player/session data reappears after refresh.
**Why it happens:** The app resets component state but not persisted browser state.
**How to avoid:** Reset both the in-memory store and the persisted snapshot together.
**Warning signs:** Fresh round looks correct until the page is reloaded.

### Pitfall 3: Multi-tab overwrite surprises
**What goes wrong:** Two tabs write different session snapshots and the last writer wins silently.
**Why it happens:** `localStorage` is shared per origin and the `storage` event only fires in other documents.
**How to avoid:** Either keep Phase 1 single-tab by design or add a visible "another tab updated this session" warning later.
**Warning signs:** Lobby state changes unexpectedly when another tab is open.

### Pitfall 4: Overly nested session state
**What goes wrong:** Resetting one part of the lobby requires copying multiple layers of nested objects.
**Why it happens:** State mirrors the UI tree instead of the data model.
**How to avoid:** Keep the session flat and store IDs, not duplicated object references.
**Warning signs:** Immutable updates become verbose before cards or calling even exist.

## Code Examples

Verified patterns from official sources:

### Local persistence snapshot
```typescript
// Source: MDN localStorage property (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
const STORAGE_KEY = 'bingo.session.v1';

export function loadSession(): SessionState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    return null;
  }
}
```

### Flat reducer state
```typescript
// Source: React choosing the state structure (https://react.dev/learn/choosing-the-state-structure)
type Action =
  | { type: 'session/create'; hostName: string }
  | { type: 'player/add'; name: string }
  | { type: 'session/reset' };
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Scattered component-local state | One normalized session store | Modern React guidance on state structure | Fewer contradictions and easier persistence |
| Page reload to start fresh | Explicit reset action and remount boundary | React preserving/resetting state model | Deterministic start-over behavior |
| In-memory-only lobby | `localStorage` snapshot restore | Browser storage is widely available and persistent | Refresh-safe static deployment |

**Deprecated/outdated:**
- `sessionStorage` for this requirement: not durable enough for refresh restoration.
- Deeply nested session trees: harder to update and serialize than a flat snapshot.

## Open Questions

1. **Single-tab only or multi-tab warning?**
   - What we know: v1 is not a true multi-device sync room.
   - What's unclear: whether opening the game in two tabs should be blocked, warned, or ignored.
   - Recommendation: surface a warning if a second tab writes to the same session.

2. **How much lobby editing belongs in v1?**
   - What we know: users can add multiple players before the game starts.
   - What's unclear: whether rename/remove/reorder should ship in the same phase.
   - Recommendation: keep v1 to add/start/reset unless the planner has spare capacity.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | Vite build/test toolchain | ✓ | v22.17.1 | — |
| npm | Package install and scripts | ✓ | 10.9.2 | — |
| Modern browser | localStorage and static app runtime | ✓ | current browser | none needed |

**Missing dependencies with no fallback:**
- None.

**Missing dependencies with fallback:**
- None.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.1 |
| Config file | `vitest.config.ts` (to be added in Wave 0) |
| Quick run command | `npx vitest run` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SESS-01 | Add players to a new host-created session | integration | `npx vitest run src/features/session/sessionStore.test.ts` | ❌ Wave 0 |
| SESS-02 | Reset session without page reload | unit + component | `npx vitest run src/features/session/sessionStore.test.ts src/app/SessionShell.test.tsx` | ❌ Wave 0 |
| SESS-03 | Persist and restore session in browser storage | unit | `npx vitest run src/lib/storage/sessionStorage.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `vitest.config.ts` - configure jsdom environment and test aliases
- [ ] `src/lib/storage/sessionStorage.ts` - storage adapter for persistence round-trips
- [ ] `src/features/session/sessionStore.ts` - reducer/store with create, add player, reset, load actions
- [ ] `src/features/session/sessionStore.test.ts` - covers SESS-01, SESS-02, SESS-03
- [ ] `src/app/SessionShell.test.tsx` - verifies reset boundary and host/player shell behavior

## Sources

### Primary (HIGH confidence)
- React docs: Choosing the State Structure - https://react.dev/learn/choosing-the-state-structure
- React docs: Preserving and Resetting State - https://react.dev/learn/preserving-and-resetting-state
- Vite docs: Deploying a Static Site - https://vite.dev/guide/static-deploy.html
- MDN: Window.localStorage - https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- MDN: Window.storage event - https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
- npm registry versions verified on 2026-03-24 for react, vite, typescript, vitest, @testing-library/react, jsdom

### Secondary (MEDIUM confidence)
- None used for recommendations that materially affect Phase 1

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - official docs + current npm registry versions
- Architecture: HIGH - official React state guidance and MDN storage behavior align with the proposed model
- Pitfalls: HIGH - React and MDN docs explicitly describe the relevant failure modes

**Research date:** 2026-03-24
**Valid until:** 2026-04-23
