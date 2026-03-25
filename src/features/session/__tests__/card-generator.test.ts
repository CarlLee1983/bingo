import { describe, it, expect } from 'vitest';
import { generateCardGrid } from '../card-generator';

describe('generateCardGrid', () => {
  it('returns a 5x5 grid', () => {
    const grid = generateCardGrid();
    expect(grid).toHaveLength(5);
    grid.forEach(row => {
      expect(row).toHaveLength(5);
    });
  });

  it('contains "FREE" in the center [2][2]', () => {
    const grid = generateCardGrid();
    expect(grid[2][2]).toBe('FREE');
  });

  it('generates numbers within standard B-I-N-G-O ranges', () => {
    const grid = generateCardGrid();
    
    // Rows loop
    for (let r = 0; r < 5; r++) {
      // Column B: 1-15
      expect(grid[r][0]).toBeGreaterThanOrEqual(1);
      expect(grid[r][0]).toBeLessThanOrEqual(15);
      
      // Column I: 16-30
      expect(grid[r][1]).toBeGreaterThanOrEqual(16);
      expect(grid[r][1]).toBeLessThanOrEqual(30);
      
      // Column N: 31-45 (except center)
      if (r !== 2) {
        expect(grid[r][2]).toBeGreaterThanOrEqual(31);
        expect(grid[r][2]).toBeLessThanOrEqual(45);
      }
      
      // Column G: 46-60
      expect(grid[r][3]).toBeGreaterThanOrEqual(46);
      expect(grid[r][3]).toBeLessThanOrEqual(60);
      
      // Column O: 61-75
      expect(grid[r][4]).toBeGreaterThanOrEqual(61);
      expect(grid[r][4]).toBeLessThanOrEqual(75);
    }
  });

  it('ensures all numbers in a column are unique', () => {
    const grid = generateCardGrid();
    
    for (let c = 0; c < 5; c++) {
      const columnNumbers = grid
        .map(row => row[c])
        .filter(val => typeof val === 'number');
      
      const uniqueNumbers = new Set(columnNumbers);
      expect(uniqueNumbers.size).toBe(columnNumbers.length);
    }
  });
});
