# Phase 3 - Call Flow and Win Detection CONTEXT

## Vision
The goal is to implement the main gameplay loop: calling numbers and automatically detecting winners.

## Decisions

- **D-01: Local Session State for Calling**: The `SessionState` will include a `calledNumbers` array (number[]) to track the call sequence.
- **D-02: Pattern Detection**: The engine will check for rows, columns, and two main diagonals.
- **D-03: Win State**: When a winner is detected, the `SessionStatus` will remain `active`, but a `winners` array (string[] for player IDs) and `winningPattern` (string) will be added to the state.
- **D-04: Automated Win Detection**: The game will check for a win automatically after every call. No manual "Bingo!" button is required for v1, as per standard American Bingo rules in this project's scope.

## Deferred Ideas
- **Interactive Claims**: Manual bingo claims with potential disqualification (v2).
- **Custom Patterns**: Dynamic patterns (Phase 4).
- **Sound Effects**: Audio call for numbers (v2).

## the agent's Discretion
- UI design for the caller history.
- Winner announcement layout.
- Specific implementation of the winning pattern search algorithm.
