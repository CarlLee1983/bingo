import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSoundToggle } from '../useSoundToggle';

describe('useSoundToggle', () => {
  const STORAGE_KEY = 'bingo-sound-muted';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('應該初始化為未靜音狀態（localStorage 為空）', () => {
    const { result } = renderHook(() => useSoundToggle());
    expect(result.current.muted).toBe(false);
  });

  it('應該從 localStorage 讀取初始狀態為靜音', () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    const { result } = renderHook(() => useSoundToggle());
    expect(result.current.muted).toBe(true);
  });

  it('應該從 localStorage 讀取初始狀態為未靜音', () => {
    localStorage.setItem(STORAGE_KEY, 'false');
    const { result } = renderHook(() => useSoundToggle());
    expect(result.current.muted).toBe(false);
  });

  it('調用 toggle() 應該切換狀態並更新 localStorage', () => {
    const { result } = renderHook(() => useSoundToggle());

    expect(result.current.muted).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

    act(() => {
      result.current.toggle();
    });

    expect(result.current.muted).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('true');
  });

  it('多次調用 toggle() 應該正確切換狀態', () => {
    const { result } = renderHook(() => useSoundToggle());

    expect(result.current.muted).toBe(false);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.muted).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('true');

    act(() => {
      result.current.toggle();
    });
    expect(result.current.muted).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('false');

    act(() => {
      result.current.toggle();
    });
    expect(result.current.muted).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('true');
  });

  it('toggle 函數應該是穩定的（不改變引用）', () => {
    const { result, rerender } = renderHook(() => useSoundToggle());
    const firstToggle = result.current.toggle;

    rerender();

    expect(result.current.toggle).toBe(firstToggle);
  });
});
