# Requirements: 美式賓果（American Bingo）

**Defined:** 2026-03-24
**Core Value:** 用一個靜態、免後端的網頁，讓多人可以快速開始一局公平、清楚、可擴充的美式賓果。

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Session

- [ ] **SESS-01**: Host can create a new game session and add multiple players before the game starts
- [ ] **SESS-02**: Host can reset the current session and start a fresh round without reloading the page
- [x] **SESS-03**: Game state can be saved and restored locally in the browser

### Cards

- [ ] **CARD-01**: Each player receives a unique randomized 5x5 American bingo card
- [ ] **CARD-02**: Generated cards follow B-I-N-G-O number ranges and use a free center space
- [ ] **CARD-03**: Card generation avoids duplicate numbers within the same card

### Calling

- [ ] **CALL-01**: Host can draw bingo numbers randomly without replacement from 1 to 75
- [ ] **CALL-02**: Called numbers are shown in order with the full call history visible
- [ ] **CALL-03**: The game prevents duplicate calls and clearly marks already-called numbers

### Winning

- [ ] **WIN-01**: Game automatically detects standard winning patterns such as row, column, and diagonal
- [ ] **WIN-02**: The system can validate a claimed bingo and identify the winning player
- [ ] **WIN-03**: The UI clearly indicates when a player has won and which pattern completed

### Extensibility

- [ ] **RULE-01**: Winning patterns are defined in data rather than hardcoded in the UI
- [ ] **RULE-02**: The rules engine can support future variants without restructuring the session flow

### Platform

- [ ] **PLAT-01**: The app can be built and deployed as static assets on GitHub Pages without a backend

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Multiplayer Sync

- **SYNC-01**: Multiple devices can join the same live room with automatic state synchronization
- **SYNC-02**: A host can recover an active room from another device or browser session

### Variants

- **VAR-01**: Admin can configure custom winning patterns from the UI
- **VAR-02**: The game can support alternate card sizes or house rules
- **VAR-03**: Players can choose cosmetic themes or card skins

### Social / Replay

- **REPL-01**: Players can review completed rounds and call histories
- **REPL-02**: Players can export or share a round summary

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Real-time cross-device multiplayer backend | Conflicts with the pure static GitHub Pages constraint for v1 |
| Accounts and authentication | Not needed for a single-session game loop |
| Chat, voice, or video features | Not part of the bingo core loop |
| Ranked ladder / persistent global stats | Requires backend storage and changes the product shape |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SESS-01 | Phase 1 | Complete |
| SESS-02 | Phase 1 | Complete |
| SESS-03 | Phase 1 | Complete |
| CARD-01 | Phase 2 | Complete |
| CARD-02 | Phase 2 | Complete |
| CARD-03 | Phase 2 | Complete |
| CALL-01 | Phase 3 | Complete |
| CALL-02 | Phase 3 | Complete |
| CALL-03 | Phase 3 | Complete |
| WIN-01 | Phase 3 | Complete |
| WIN-02 | Phase 3 | Complete |
| WIN-03 | Phase 3 | Complete |
| RULE-01 | Phase 4 | Complete |
| RULE-02 | Phase 4 | Complete |
| PLAT-01 | Phase 5 (doc: Phase 6) | In Verification |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---
*Requirements defined: 2026-03-24*
*Last updated: 2026-03-24 after project initialization*
