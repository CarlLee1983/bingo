# Roadmap: 美式賓果（American Bingo）

## Phase 1 - Session Foundation

Goal: establish the core game shell for a single shared local session.

Deliverables:
- Start/reset game flow
- Player roster management
- Local state model and persistence
- Basic screen structure for host and players

Plans:
- [ ] 01-session-foundation/01-PLAN.md — Bootstrap the static app and canonical session store
- [ ] 01-session-foundation/02-PLAN.md — Build the host/player shell and reset boundary

Covered requirements:
- SESS-01
- SESS-02
- SESS-03

**Plans:** 2 plans

Verification:
- Can create a fresh session, add multiple players, and reset without a reload
- Browser refresh preserves an in-progress local session where appropriate

## Phase 2 - Card Engine

Goal: generate fair American bingo cards for each player and expose them in the session UI.

Deliverables:
- 5x5 card generator with B-I-N-G-O ranges
- Free center square
- Duplicate prevention within a card
- Player card rendering and card state representation

Covered requirements:
- CARD-01
- CARD-02
- CARD-03

Verification:
- Generated cards are unique per player and structurally valid
- Number ranges match standard American bingo rules

## Phase 3 - Call Flow and Win Detection

Goal: support the main gameplay loop from number call to automatic winner detection.

Deliverables:
- Random number caller without replacement
- Call history display
- Duplicate-call protection
- Pattern-based win engine
- Claim validation and winner announcement

Covered requirements:
- CALL-01
- CALL-02
- CALL-03
- WIN-01
- WIN-02
- WIN-03

Verification:
- Numbers cannot repeat once called
- A valid bingo claim is recognized and displayed
- Standard line patterns are detected correctly

## Phase 4 - Extensible Rules Layer

Goal: make future game variants possible without rewriting the core flow.

Deliverables:
- Data-driven pattern definitions
- Rules registry or equivalent configuration layer
- Extension points for future variants

Covered requirements:
- RULE-01
- RULE-02

Verification:
- A new pattern can be added by configuration rather than changing gameplay flow

## Phase 5 - Static Deployment

Goal: package the game as a GitHub Pages-friendly static app.

Deliverables:
- Production build output
- Static hosting configuration
- Deployment notes and usage instructions

Covered requirements:
- PLAT-01

Verification:
- App builds to static assets and can be published to GitHub Pages without a backend

## Milestone Summary

### v1 Done When

- A host can start a game, add players, draw numbers, and get a validated winner on a static page
- The app is deployable to GitHub Pages
- The rules layer is ready for future variants

### Recommended Execution Order

1. Phase 1
2. Phase 2
3. Phase 3
4. Phase 4
5. Phase 5

---
*Last updated: 2026-03-24 after project initialization*
