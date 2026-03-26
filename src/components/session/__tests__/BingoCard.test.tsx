import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BingoCard } from '../BingoCard';
import type { BingoCardGrid } from '../../../features/session/session-types';

// Mock grid for testing
const createMockGrid = (): BingoCardGrid => {
  return [
    [1, 16, 31, 46, 61],
    [2, 17, 32, 47, 62],
    [3, 18, 'FREE', 48, 63],
    [4, 19, 33, 49, 64],
    [5, 20, 34, 50, 65],
  ];
};

describe('BingoCard', () => {
  let mockGrid: BingoCardGrid;

  beforeEach(() => {
    mockGrid = createMockGrid();
  });

  it('顯示 5x5 網格', () => {
    const { container } = render(
      <BingoCard
        grid={mockGrid}
        calledNumbers={[]}
        latestNumber={null}
      />
    );

    const headers = container.querySelectorAll('.bingo-card__header');
    expect(headers.length).toBe(5);
  });

  it('顯示 FREE SPACE', () => {
    const { container } = render(
      <BingoCard
        grid={mockGrid}
        calledNumbers={[]}
        latestNumber={null}
      />
    );

    // 檢查是否有顯示 FREE
    expect(container.textContent).toContain('FREE');
  });

  it('當 latestNumber 有值時顯示角標', () => {
    const { container } = render(
      <BingoCard
        grid={mockGrid}
        calledNumbers={[]}
        latestNumber={42}
      />
    );

    const badge = container.querySelector('.bingo-card__number-badge');
    expect(badge).not.toBeNull();
    expect(badge?.textContent).toBe('42');
  });

  it('當 latestNumber 為 null 時不顯示角標', () => {
    const { container } = render(
      <BingoCard
        grid={mockGrid}
        calledNumbers={[]}
        latestNumber={null}
      />
    );

    const badge = container.querySelector('.bingo-card__number-badge');
    expect(badge).toBeNull();
  });

  it('點擊單元格標記/取消標記', async () => {
    const { container } = render(
      <BingoCard
        grid={mockGrid}
        calledNumbers={[]}
        latestNumber={null}
      />
    );

    const cells = container.querySelectorAll('.bingo-card__cell');
    const firstCell = cells[0] as HTMLElement;

    // 初始無標記
    expect(firstCell.className).not.toContain('bingo-card__cell--user-marked');

    // 點擊標記
    fireEvent.click(firstCell);
    await waitFor(() => {
      expect(firstCell.className).toContain('bingo-card__cell--user-marked');
    });

    // 再點擊取消標記
    fireEvent.click(firstCell);
    await waitFor(() => {
      expect(firstCell.className).not.toContain('bingo-card__cell--user-marked');
    });
  });

  it('當號碼被叫出時標記為 host-marked', () => {
    const { container } = render(
      <BingoCard
        grid={mockGrid}
        calledNumbers={[1, 16]} // 標記前兩個數字
        latestNumber={16}
      />
    );

    // 檢查 calledNumbers 中的號碼是否被標記
    // 1 在網格 [0][0]，16 在網格 [0][1]
    // 我們需要找到顯示 "1" 和 "16" 的單元格
    const allCells = container.querySelectorAll('.bingo-card__cell');

    // 找到顯示 "1" 的單元格
    let cellWithOne: HTMLElement | null = null;
    let cellWithSixteen: HTMLElement | null = null;

    for (const cell of allCells) {
      if (cell.textContent?.trim() === '1') {
        cellWithOne = cell as HTMLElement;
      }
      if (cell.textContent?.trim() === '16') {
        cellWithSixteen = cell as HTMLElement;
      }
    }

    expect(cellWithOne?.className).toContain('bingo-card__cell--marked');
    expect(cellWithSixteen?.className).toContain('bingo-card__cell--marked');
  });
});
