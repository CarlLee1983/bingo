import { BingoCardGrid } from './session-types';

const RANGES = [
  { min: 1, max: 15 },   // B
  { min: 16, max: 30 },  // I
  { min: 31, max: 45 },  // N
  { min: 46, max: 60 },  // G
  { min: 61, max: 75 },  // O
];

function getRandomNumbers(count: number, min: number, max: number): number[] {
  const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const result: number[] = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(randomIndex, 1)[0]);
  }

  return result;
}

/**
 * Generates a 5x5 grid for an American Bingo card.
 * grid[row][col]
 */
export function generateCardGrid(): BingoCardGrid {
  const columns: (number | 'FREE')[][] = RANGES.map((range, colIndex) => {
    const count = colIndex === 2 ? 4 : 5;
    const nums = getRandomNumbers(count, range.min, range.max);
    
    if (colIndex === 2) {
      // Insert FREE at the center position (index 2 in the 5-element column)
      nums.splice(2, 0, 'FREE');
    }
    
    return nums;
  });

  // Transpose columns into rows for easier rendering
  const grid: BingoCardGrid = Array.from({ length: 5 }, (_, r) => 
    Array.from({ length: 5 }, (_, c) => columns[c][r])
  );

  return grid;
}
