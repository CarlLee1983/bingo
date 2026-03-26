import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { NumberControlPanel } from '../NumberControlPanel';

describe('NumberControlPanel', () => {
  beforeEach(() => {
    // Mock localStorage
    const store: { [key: string]: string } = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        Object.keys(store).forEach(key => delete store[key]);
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('顯示最新號碼', () => {
    const { container } = render(
      <NumberControlPanel
        latestNumber={42}
        totalNumbers={10}
        onDrawNumber={() => {}}
      />
    );
    // 檢查號碼顯示
    expect(container.textContent).toContain('42');
    expect(container.textContent).toContain('10 / 75');
  });

  it('null 時顯示 -', () => {
    const { container } = render(
      <NumberControlPanel
        latestNumber={null}
        totalNumbers={0}
        onDrawNumber={() => {}}
      />
    );
    expect(container.textContent).toContain('-');
    expect(container.textContent).toContain('0 / 75');
  });

  it('按鈕點擊觸發回調', () => {
    const onDrawNumber = vi.fn();
    render(
      <NumberControlPanel
        latestNumber={42}
        totalNumbers={10}
        onDrawNumber={onDrawNumber}
      />
    );
    const button = screen.getByRole('button', { name: /Draw/ });
    fireEvent.click(button);
    expect(onDrawNumber).toHaveBeenCalledTimes(1);
  });

  it('disabled 時禁用按鈕', () => {
    render(
      <NumberControlPanel
        latestNumber={42}
        totalNumbers={10}
        onDrawNumber={() => {}}
        disabled={true}
      />
    );
    const button = screen.getByRole('button', { name: /Draw/ }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('顯示靜音按鈕', () => {
    const { container } = render(
      <NumberControlPanel
        latestNumber={42}
        totalNumbers={10}
        onDrawNumber={() => {}}
      />
    );
    const muteButton = container.querySelector('.number-control-panel__mute-button');
    expect(muteButton).not.toBeNull();
    expect(muteButton?.textContent).toBe('🔊'); // 預設未靜音
  });

  it('靜音按鈕切換狀態', () => {
    const { rerender, container } = render(
      <NumberControlPanel
        latestNumber={42}
        totalNumbers={10}
        onDrawNumber={() => {}}
      />
    );
    const muteButton = container.querySelector('.number-control-panel__mute-button') as HTMLButtonElement;

    // 初始未靜音
    expect(muteButton.textContent).toBe('🔊');
    expect(muteButton.title).toBe('關閉音效');

    // 點擊後應該變成靜音狀態
    fireEvent.click(muteButton);

    // 重新渲染以獲得最新狀態
    rerender(
      <NumberControlPanel
        latestNumber={42}
        totalNumbers={10}
        onDrawNumber={() => {}}
      />
    );

    const updatedButton = container.querySelector('.number-control-panel__mute-button') as HTMLButtonElement;
    expect(updatedButton.textContent).toBe('🔇');
    expect(updatedButton.title).toBe('開啟音效');
  });

  it('靜音按鈕保存狀態至 localStorage', () => {
    const { container } = render(
      <NumberControlPanel
        latestNumber={42}
        totalNumbers={10}
        onDrawNumber={() => {}}
      />
    );
    const muteButton = container.querySelector('.number-control-panel__mute-button') as HTMLButtonElement;

    fireEvent.click(muteButton);
    expect(localStorage.getItem('bingo-sound-muted')).toBe('true');
  });
});
