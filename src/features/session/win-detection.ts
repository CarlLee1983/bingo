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
  for (const pattern of patterns) {
    const isWin = pattern.squares.every(([r, c]) => 
      isSquareMarked(grid[r][c], calledNumbers)
    );
    
    if (isWin) {
      return pattern.id;
    }
  }

  return null;
}
