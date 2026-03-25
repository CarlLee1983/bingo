# Phase 4 - Extensible Rules Layer Context

## Objective

Refactor hardcoded win detection logic into a data-driven system using `WinPattern` types and a pattern registry.

## Task Breakdown

1. Define the WinPattern type and update SessionState to store the active pattern set.
2. Create a registry of standard Bingo patterns (rows, columns, diagonals).
3. Refactor checkWin to iterate over the pattern registry.
4. Add support for a few custom patterns like 'Four Corners' and 'Blackout'.
5. Update the UI to show the name of the winning pattern from the registry.

## Technical Details

- `WinPattern`: An interface with `id`, `label`, and a way to define coordinates in a 5x5 grid (e.g., `squares: [number, number][]`).
- `SessionState`: Add `activePatternIds: string[]` to allow configuring which patterns are active for the round.
- `WinPatternsRegistry`: A collection of all supported patterns.
- `checkWin`: Should now take the registry and the active pattern IDs into account.
- UI: The winner announcement should display the label of the pattern from the registry.

## Decisions

- **D-01**: Use a static registry of `WinPattern` objects initially.
- **D-02**: The `SessionState` will store `activePatternIds` (array of string) to keep the state small and reference the registry.
- **D-03**: Default `activePatternIds` should include standard rows, columns, and diagonals.
- **D-04**: 'Four Corners' and 'Blackout' will be added to the registry but not necessarily active by default (unless user specifies).

## Constraints

- 5x5 grid (Standard American Bingo).
- FREE space at [2, 2] is always considered marked.
