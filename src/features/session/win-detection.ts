import type { BingoCardGrid, WinPattern } from './session-types';

export function isSquareMarked(val: number | 'FREE', calledNumbers: number[]): boolean {
  if (val === 'FREE') return true;
  return calledNumbers.includes(val);
}

/**
 * Checks if a 5x5 Bingo card grid has any winning pattern from the provided list.
 * Returns the ID of the first matching pattern or null if no win.
 */
export function checkWin(
  grid: BingoCardGrid, 
  calledNumbers: number[], 
  patterns: WinPattern[]
): string | null {
  const wonPatterns = detectWinningLines(grid, calledNumbers, patterns);
  return wonPatterns.length > 0 ? wonPatterns[0] : null;
}

/**
 * Detects ALL winning pattern IDs currently matched by the combination of host and player marks.
 */
export function detectWinningLines(
  grid: BingoCardGrid,
  calledNumbers: number[],
  patterns: WinPattern[],
  userMarked?: Set<number | 'FREE'>
): string[] {
  const wonPatternIds: string[] = [];

  for (const pattern of patterns) {
    const isWin = pattern.squares.every(([r, c]) => {
      const cell = grid[r][c];
      const isHostMarked = isSquareMarked(cell, calledNumbers);
      const isUserMarked = userMarked?.has(cell) || false;
      return isHostMarked || isUserMarked;
    });

    if (isWin) {
      wonPatternIds.push(pattern.id);
    }
  }

  return wonPatternIds;
}
