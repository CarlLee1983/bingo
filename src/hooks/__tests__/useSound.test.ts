import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSound } from '../useSound';

describe('useSound', () => {
  let mockCreateOscillator: any;
  let mockCreateGain: any;
  let mockResume: any;
  let oscillatorInstances: any[] = [];
  let gainInstances: any[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    oscillatorInstances = [];
    gainInstances = [];

    // Mock Oscillator factory
    mockCreateOscillator = vi.fn(() => {
      const osc = {
        type: '',
        frequency: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(function (this: any) {
          return this;
        }),
        start: vi.fn(),
        stop: vi.fn(),
      };
      oscillatorInstances.push(osc);
      return osc;
    });

    // Mock Gain factory
    mockCreateGain = vi.fn(() => {
      const gain = {
        gain: {
          setValueAtTime: vi.fn(),
          exponentialRampToValueAtTime: vi.fn(),
        },
        connect: vi.fn(function (this: any) {
          return this;
        }),
      };
      gainInstances.push(gain);
      return gain;
    });

    // Mock resume
    mockResume = vi.fn();

    // Mock AudioContext class
    class MockAudioContext {
      currentTime = 0;
      state = 'running';
      destination = {};

      constructor() {
        // Set up state for testing suspend scenarios
      }

      resume = mockResume;
      createOscillator = mockCreateOscillator;
      createGain = mockCreateGain;
    }

    global.AudioContext = MockAudioContext as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('靜音時不應該建立任何振盪器', () => {
    const { result } = renderHook(() => useSound(true));

    act(() => {
      result.current.playDrawSound();
    });

    expect(mockCreateOscillator).not.toHaveBeenCalled();
  });

  it('playDrawSound 應該建立 2 個振盪器（sawtooth + square）', () => {
    const { result } = renderHook(() => useSound(false));

    act(() => {
      result.current.playDrawSound();
    });

    expect(mockCreateOscillator).toHaveBeenCalledTimes(2);
    expect(mockCreateGain).toHaveBeenCalledTimes(2);
  });

  it('playWinSound 應該建立 4 個振盪器（對應 4 個音符）', () => {
    const { result } = renderHook(() => useSound(false));

    act(() => {
      result.current.playWinSound();
    });

    expect(mockCreateOscillator).toHaveBeenCalledTimes(4);
    expect(mockCreateGain).toHaveBeenCalledTimes(4);
  });

  it('AudioContext suspended 時應該自動 resume', () => {
    // 創建一個模擬構造函數，返回具有 suspended 狀態的 AudioContext
    let contextInstance: any;

    class MockSuspendedAudioContext {
      currentTime = 0;
      state = 'suspended';
      destination = {};
      resume = mockResume;
      createOscillator = mockCreateOscillator;
      createGain = mockCreateGain;

      constructor() {
        contextInstance = this;
      }
    }

    global.AudioContext = MockSuspendedAudioContext as any;

    const { result } = renderHook(() => useSound(false));

    act(() => {
      result.current.playDrawSound();
    });

    expect(mockResume).toHaveBeenCalled();
  });

  it('多次調用應該返回相同的 AudioContext 引用', () => {
    const { result } = renderHook(() => useSound(false));

    act(() => {
      result.current.playDrawSound();
    });

    const firstCallCount = mockCreateOscillator.mock.calls.length;

    act(() => {
      result.current.playWinSound();
    });

    const totalCallCount = mockCreateOscillator.mock.calls.length;
    // 應該呼叫了 2 + 4 = 6 次 createOscillator（同一個 AudioContext）
    expect(totalCallCount).toBe(6);
  });

  it('playDrawSound 應該正確設定第一個振盪器（sawtooth）的參數', () => {
    const { result } = renderHook(() => useSound(false));

    act(() => {
      result.current.playDrawSound();
    });

    const firstOsc = oscillatorInstances[0];
    expect(firstOsc.type).toBe('sawtooth');
    expect(firstOsc.frequency.setValueAtTime).toHaveBeenCalled();
    expect(firstOsc.frequency.exponentialRampToValueAtTime).toHaveBeenCalled();
    expect(firstOsc.start).toHaveBeenCalled();
    expect(firstOsc.stop).toHaveBeenCalled();
  });

  it('playDrawSound 應該正確設定第二個振盪器（square）的參數', () => {
    const { result } = renderHook(() => useSound(false));

    act(() => {
      result.current.playDrawSound();
    });

    const secondOsc = oscillatorInstances[1];
    expect(secondOsc.type).toBe('square');
    expect(secondOsc.frequency.setValueAtTime).toHaveBeenCalled();
    expect(secondOsc.start).toHaveBeenCalled();
    expect(secondOsc.stop).toHaveBeenCalled();
  });

  it('playWinSound 應該為每個音符建立振盪器並正確連接', () => {
    const { result } = renderHook(() => useSound(false));

    act(() => {
      result.current.playWinSound();
    });

    // 應該有 4 個振盪器
    expect(oscillatorInstances.length).toBe(4);

    // 每個振盪器都應該是 square 類型
    oscillatorInstances.forEach((osc) => {
      expect(osc.type).toBe('square');
      expect(osc.start).toHaveBeenCalled();
      expect(osc.stop).toHaveBeenCalled();
    });
  });
});
