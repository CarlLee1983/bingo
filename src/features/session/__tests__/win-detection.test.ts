import { describe, it, expect } from 'vitest';
import { checkWin } from '../win-detection';
import type { BingoCardGrid } from '../session-types';
import { WIN_PATTERNS } from '../win-patterns';

const mockGrid: BingoCardGrid = [
  [1, 16, 31, 46, 61],
  [2, 17, 32, 47, 62],
  [3, 18, 'FREE', 48, 63],
  [4, 19, 34, 49, 64],
  [5, 20, 35, 50, 65],
];

const allPatterns = Object.values(WIN_PATTERNS);

describe('checkWin', () => {
  it('returns null for an empty list of called numbers', () => {
    expect(checkWin(mockGrid, [], allPatterns)).toBeNull();
  });

  it('detects a row win', () => {
    const calledNumbers = [1, 16, 31, 46, 61];
    expect(checkWin(mockGrid, calledNumbers, allPatterns)).toBe('row-1');
  });

  it('detects a row win with a FREE space', () => {
    const calledNumbers = [3, 18, 48, 63];
    expect(checkWin(mockGrid, calledNumbers, allPatterns)).toBe('row-3');
  });

  it('detects a column win', () => {
    const calledNumbers = [1, 2, 3, 4, 5];
    expect(checkWin(mockGrid, calledNumbers, allPatterns)).toBe('column-1');
  });

  it('detects a diagonal 1 win (top-left to bottom-right)', () => {
    const calledNumbers = [1, 17, 49, 65]; // 'FREE' at 3,3 (index 2,2)
    expect(checkWin(mockGrid, calledNumbers, allPatterns)).toBe('diagonal-1');
  });

  it('detects a diagonal 2 win (top-right to bottom-left)', () => {
    const calledNumbers = [61, 47, 19, 5]; // 'FREE' at index 2,2
    expect(checkWin(mockGrid, calledNumbers, allPatterns)).toBe('diagonal-2');
  });

  it('detects a win when ONLY numbers are called', () => {
    const calledNumbers = [31, 32, 34, 35]; // Column 3 (Column N), FREE is auto-marked
    expect(checkWin(mockGrid, calledNumbers, allPatterns)).toBe('column-3');
  });

  it('detects four-corners win', () => {
    const calledNumbers = [1, 61, 5, 65];
    expect(checkWin(mockGrid, calledNumbers, allPatterns)).toBe('four-corners');
  });
});
