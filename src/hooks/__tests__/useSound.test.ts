import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSound } from '../useSound';

interface MockOscillator {
  type: string;
  frequency: {
    setValueAtTime: ReturnType<typeof vi.fn>;
    exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
  };
  connect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
}

interface MockGain {
  gain: {
    setValueAtTime: ReturnType<typeof vi.fn>;
    exponentialRampToValueAtTime: ReturnType<typeof vi.fn>;
  };
  connect: ReturnType<typeof vi.fn>;
}

interface MockAudioContextType {
  currentTime: number;
  state: 'running' | 'suspended';
  destination: object;
  resume: ReturnType<typeof vi.fn>;
  createOscillator: ReturnType<typeof vi.fn>;
  createGain: ReturnType<typeof vi.fn>;
}

describe('useSound', () => {
  let mockCreateOscillator: ReturnType<typeof vi.fn>;
  let mockCreateGain: ReturnType<typeof vi.fn>;
  let mockResume: ReturnType<typeof vi.fn>;
  let oscillatorInstances: MockOscillator[] = [];
  let gainInstances: MockGain[] = [];

  function createMockOscillator(): MockOscillator {
    const osc: MockOscillator = {
      type: '',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(function (this: MockOscillator) {
        return this;
      }),
      start: vi.fn(),
      stop: vi.fn(),
    };
    oscillatorInstances.push(osc);
    return osc;
  }

  function createMockGain(): MockGain {
    const gain: MockGain = {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(function (this: MockGain) {
        return this;
      }),
    };
    gainInstances.push(gain);
    return gain;
  }

  function createMockAudioContext(state: 'running' | 'suspended' = 'running'): MockAudioContextType {
    class MockAudioContext implements Partial<MockAudioContextType> {
      currentTime = 0;
      state: 'running' | 'suspended' = state;
      destination = {};
      resume = mockResume;
      createOscillator = mockCreateOscillator;
      createGain = mockCreateGain;
    }
    return new MockAudioContext() as MockAudioContextType;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    oscillatorInstances = [];
    gainInstances = [];

    mockCreateOscillator = vi.fn(createMockOscillator);
    mockCreateGain = vi.fn(createMockGain);
    mockResume = vi.fn();

    global.AudioContext = createMockAudioContext as any;
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
    class MockSuspendedAudioContext implements Partial<MockAudioContextType> {
      currentTime = 0;
      state: 'running' | 'suspended' = 'suspended';
      destination = {};
      resume = mockResume;
      createOscillator = mockCreateOscillator;
      createGain = mockCreateGain;
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
    expect(firstOsc.frequency.setValueAtTime).toHaveBeenCalledWith(220, 0);
    expect(firstOsc.frequency.exponentialRampToValueAtTime).toHaveBeenCalledWith(80, 0.05);
    expect(firstOsc.start).toHaveBeenCalledWith(0);
    expect(firstOsc.stop).toHaveBeenCalledWith(0.1);
  });

  it('playDrawSound 應該正確設定第二個振盪器（square）的參數', () => {
    const { result } = renderHook(() => useSound(false));

    act(() => {
      result.current.playDrawSound();
    });

    const secondOsc = oscillatorInstances[1];
    expect(secondOsc.type).toBe('square');
    expect(secondOsc.frequency.setValueAtTime).toHaveBeenCalledWith(880, 0.02);
    expect(secondOsc.start).toHaveBeenCalledWith(0.02);
    expect(secondOsc.stop).toHaveBeenCalledWith(0.15);
  });

  it('playWinSound 應該為每個音符建立振盪器並正確連接', () => {
    const { result } = renderHook(() => useSound(false));

    act(() => {
      result.current.playWinSound();
    });

    // 應該有 4 個振盪器
    expect(oscillatorInstances.length).toBe(4);

    // 驗證每個音符的參數
    const expectedNotes = [
      { freq: 523, start: 0, dur: 0.15 },
      { freq: 659, start: 0.15, dur: 0.15 },
      { freq: 784, start: 0.3, dur: 0.4 },
      { freq: 1047, start: 0.3, dur: 0.4 },
    ];

    oscillatorInstances.forEach((osc, index) => {
      const note = expectedNotes[index];
      expect(osc.type).toBe('square');
      expect(osc.frequency.setValueAtTime).toHaveBeenCalledWith(note.freq, note.start);
      expect(osc.start).toHaveBeenCalledWith(note.start);
      expect(osc.stop).toHaveBeenCalledWith(note.start + note.dur + 0.05);
    });
  });
});
