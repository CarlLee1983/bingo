import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PlayerDashboard } from '../PlayerDashboard';

// Mock useSession hook 而不是整個 SessionProvider
vi.mock('../../../features/session/session-provider', () => {
  const mockUseSession = vi.fn();
  return {
    useSession: mockUseSession,
    SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    _mockUseSession: mockUseSession,
  };
});

import { useSession } from '../../../features/session/session-provider';
import type { Session } from '../../../features/session/session-types';

const createMockSession = (overrides?: Partial<Session>): Session => {
  return {
    sessionId: 'test-session',
    hostId: 'host-1',
    status: 'active',
    players: [
      { id: 'host-1', name: 'Host Player' },
      { id: 'player-2', name: 'Player Two' },
    ],
    cards: {
      'host-1': [
        [1, 16, 31, 46, 61],
        [2, 17, 32, 47, 62],
        [3, 18, 'FREE', 48, 63],
        [4, 19, 33, 49, 64],
        [5, 20, 34, 50, 65],
      ],
      'player-2': [
        [6, 21, 35, 51, 66],
        [7, 22, 36, 52, 67],
        [8, 23, 'FREE', 53, 68],
        [9, 24, 37, 54, 69],
        [10, 25, 38, 55, 70],
      ],
    },
    calledNumbers: [1, 16, 31],
    winners: [],
    markedSquares: {
      'host-1': new Set(),
      'player-2': new Set(),
    },
    ...overrides,
  };
};

describe('PlayerDashboard - 叫號功能整合', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Host 視圖顯示浮動面板', () => {
    const mockSession = createMockSession();
    const mockUseSession = useSession as ReturnType<typeof vi.fn>;

    mockUseSession.mockReturnValue({
      session: mockSession,
      localPlayerId: 'host-1',
      setLocalPlayerId: vi.fn(),
      rerollCard: vi.fn(),
      drawNumber: vi.fn(),
    });

    const { container } = render(<PlayerDashboard />);

    const panel = container.querySelector('.number-control-panel');
    expect(panel).not.toBeNull();
  });

  it('Player 視圖不顯示浮動面板', () => {
    const mockSession = createMockSession();
    const mockUseSession = useSession as ReturnType<typeof vi.fn>;

    mockUseSession.mockReturnValue({
      session: mockSession,
      localPlayerId: 'player-2',
      setLocalPlayerId: vi.fn(),
      rerollCard: vi.fn(),
      drawNumber: vi.fn(),
    });

    const { container } = render(<PlayerDashboard />);

    const panel = container.querySelector('.number-control-panel');
    expect(panel).toBeNull();
  });

  it('BingoCard 接收 latestNumber 並顯示角標', () => {
    const mockSession = createMockSession({
      status: 'active',
      calledNumbers: [1, 16, 31],
    });
    const mockUseSession = useSession as ReturnType<typeof vi.fn>;

    mockUseSession.mockReturnValue({
      session: mockSession,
      localPlayerId: 'host-1',
      setLocalPlayerId: vi.fn(),
      rerollCard: vi.fn(),
      drawNumber: vi.fn(),
    });

    const { container } = render(<PlayerDashboard />);

    // 檢查卡片上是否有角標顯示最新號碼 31
    const badge = container.querySelector('.bingo-card__number-badge');
    expect(badge).not.toBeNull();
    expect(badge?.textContent).toBe('31');
  });

  it('Host 在 lobby 狀態下顯示玩家名單', () => {
    const mockSession = createMockSession({
      status: 'lobby',
    });
    const mockUseSession = useSession as ReturnType<typeof vi.fn>;

    mockUseSession.mockReturnValue({
      session: mockSession,
      localPlayerId: 'host-1',
      setLocalPlayerId: vi.fn(),
      rerollCard: vi.fn(),
      drawNumber: vi.fn(),
    });

    const { container } = render(<PlayerDashboard />);

    expect(container.textContent).toContain('Current Players');
  });

  it('Player 在 active 狀態下顯示叫號記錄', () => {
    const mockSession = createMockSession({
      status: 'active',
      calledNumbers: [1, 16, 31],
    });
    const mockUseSession = useSession as ReturnType<typeof vi.fn>;

    mockUseSession.mockReturnValue({
      session: mockSession,
      localPlayerId: 'player-2',
      setLocalPlayerId: vi.fn(),
      rerollCard: vi.fn(),
      drawNumber: vi.fn(),
    });

    const { container } = render(<PlayerDashboard />);

    expect(container.textContent).toContain('叫號記錄');
  });

  it('Host 可見 HOST 控制台', () => {
    const mockSession = createMockSession();
    const mockUseSession = useSession as ReturnType<typeof vi.fn>;

    mockUseSession.mockReturnValue({
      session: mockSession,
      localPlayerId: 'host-1',
      setLocalPlayerId: vi.fn(),
      rerollCard: vi.fn(),
      drawNumber: vi.fn(),
    });

    const { container } = render(<PlayerDashboard />);

    // 檢查 HOST 控制台是否可見
    const hostText = Array.from(container.querySelectorAll('*'))
      .find(el => el.textContent?.includes('HOST') && el.textContent?.includes('控制台'));

    expect(hostText).not.toBeUndefined();
  });

  it('Player 看不見 HOST 控制台', () => {
    const mockSession = createMockSession();
    const mockUseSession = useSession as ReturnType<typeof vi.fn>;

    mockUseSession.mockReturnValue({
      session: mockSession,
      localPlayerId: 'player-2',
      setLocalPlayerId: vi.fn(),
      rerollCard: vi.fn(),
      drawNumber: vi.fn(),
    });

    const { container } = render(<PlayerDashboard />);

    // 尋找包含 "HOST" 和 "控制台" 的元素
    const hostControlPanel = Array.from(container.querySelectorAll('*'))
      .find(el => el.textContent?.includes('HOST') && el.textContent?.includes('控制台'));

    expect(hostControlPanel).toBeUndefined();
  });
});
