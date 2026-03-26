import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { NumberControlPanel } from '../NumberControlPanel';

describe('NumberControlPanel', () => {
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
    const button = screen.getByRole('button');
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
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
