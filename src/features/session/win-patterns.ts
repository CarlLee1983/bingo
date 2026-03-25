import { WinPattern } from './session-types';

export const WIN_PATTERNS: Record<string, WinPattern> = {
  // Rows
  'row-1': { id: 'row-1', label: 'Row 1', squares: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
  'row-2': { id: 'row-2', label: 'Row 2', squares: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]] },
  'row-3': { id: 'row-3', label: 'Row 3', squares: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] },
  'row-4': { id: 'row-4', label: 'Row 4', squares: [[3, 0], [3, 1], [3, 2], [3, 3], [3, 4]] },
  'row-5': { id: 'row-5', label: 'Row 5', squares: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4]] },

  // Columns
  'column-1': { id: 'column-1', label: 'Column 1', squares: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]] },
  'column-2': { id: 'column-2', label: 'Column 2', squares: [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]] },
  'column-3': { id: 'column-3', label: 'Column 3', squares: [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]] },
  'column-4': { id: 'column-4', label: 'Column 4', squares: [[0, 3], [1, 3], [2, 3], [3, 3], [4, 3]] },
  'column-5': { id: 'column-5', label: 'Column 5', squares: [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4]] },

  // Diagonals
  'diagonal-1': { id: 'diagonal-1', label: 'Diagonal 1', squares: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]] },
  'diagonal-2': { id: 'diagonal-2', label: 'Diagonal 2', squares: [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]] },

  // Custom Patterns
  'four-corners': { id: 'four-corners', label: 'Four Corners', squares: [[0, 0], [0, 4], [4, 0], [4, 4]] },
  'blackout': { 
    id: 'blackout', 
    label: 'Blackout', 
    squares: Array.from({ length: 5 }, (_, r) => 
      Array.from({ length: 5 }, (_, c) => [r, c] as [number, number])
    ).flat() 
  },
};

export const STANDARD_PATTERN_IDS = [
  'row-1', 'row-2', 'row-3', 'row-4', 'row-5',
  'column-1', 'column-2', 'column-3', 'column-4', 'column-5',
  'diagonal-1', 'diagonal-2'
];
