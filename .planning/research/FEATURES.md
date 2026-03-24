# Research Notes: 美式賓果（American Bingo）

## Product Shape

This is a static-first web bingo game for GitHub Pages. The primary gameplay loop is:

1. Host starts a session
2. Multiple players join the same session
3. Each player receives a random American bingo card
4. Host calls numbers from 1 to 75
5. The game marks called numbers and detects winning patterns
6. The first valid bingo is announced as the winner

## Rule Assumptions

- American bingo uses a 5x5 grid with a free center square
- Columns typically map to fixed number ranges:
  - B: 1-15
  - I: 16-30
  - N: 31-45
  - G: 46-60
  - O: 61-75
- A caller should not repeat numbers
- Winning patterns should at minimum include row, column, and diagonal

## Static Hosting Implications

- GitHub Pages cannot provide an authoritative realtime backend by itself
- For v1, the safest shape is a single shared browser session with local persistence
- Future realtime multiplayer should be treated as an extension, not a dependency of the core game

## Extensibility Strategy

- Represent win patterns as data
- Separate session state from UI components
- Keep card generation, call drawing, and win validation as distinct modules
- Make future variants additive rather than invasive

## Early Risks

- Multi-device multiplayer can be misunderstood as "online" even when only a static site is available
- If persistence is too tightly coupled to UI state, future rule changes will be expensive
- If win patterns are hardcoded, variant support will become a rewrite

