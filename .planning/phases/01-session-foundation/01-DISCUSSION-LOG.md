# Phase 1: Session Foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-24
**Phase:** 1-session-foundation
**Areas discussed:** Session model, Player flow, Scope boundaries

---

## Session model

| Option | Description | Selected |
|--------|-------------|----------|
| Single shared local session | One host-controlled session stored in the browser, suitable for GitHub Pages | ✓ |
| Cross-device realtime room | Multiple devices sync through a backend service | |
| Offline-only per player | Each player keeps an isolated local game | |

**User's choice:** Single shared local session
**Notes:** Keeps v1 compatible with static hosting and avoids backend dependency.

## Player flow

| Option | Description | Selected |
|--------|-------------|----------|
| Host adds players then starts | Players join the session before cards are generated | ✓ |
| Players self-register during play | Players can appear after the game starts | |
| Anonymous one-off cards | No persistent player identity beyond the round | |

**User's choice:** Host adds players then starts
**Notes:** Matches a single shared bingo round and keeps control centralized.

## Scope boundaries

| Option | Description | Selected |
|--------|-------------|----------|
| No accounts / no auth | Keep phase focused on the game loop | ✓ |
| Add invite links | Share room entry via URL or code | |
| Add custom rules now | Allow alternate house rules in Phase 1 | |

**User's choice:** No accounts / no auth
**Notes:** Cross-device sync, invite links, and custom variants are deferred to later phases.

## the agent's Discretion

- Local persistence mechanism
- UI layout details for host/player views
- Interaction polish for adding players and resetting a session

## Deferred Ideas

- Real-time cross-device multiplayer backend
- Invite links / room codes
- Custom rules / variants
- Persistent stats and ranked play
