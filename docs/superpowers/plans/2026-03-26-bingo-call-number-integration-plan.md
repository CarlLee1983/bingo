# Bingo 叫號功能整合 實施計劃

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目標：** 將 Bingo 遊戲的叫號功能和號碼顯示整合到卡片 UI 中，Host 可在側邊浮動面板快速骰號，Players 可在卡片角標看到最新號碼。

**架構：** 新增 NumberControlPanel 組件（Host 側邊浮動面板），修改 BingoCard 添加動態角標，修改 PlayerDashboard 以支持兩種視圖。實現完全響應式設計，桌面版浮動面板 + 右上角標，手機版角標移到卡片下方。

**技術棧：** React (TypeScript)、CSS 動畫、響應式設計、useSession hook

---

## 檔案結構

```
src/components/session/
├─ BingoCard.tsx               (修改：添加號碼角標、props、响應式)
├─ PlayerDashboard.tsx         (修改：添加浮動面板邏輯、佈局調整)
├─ NumberControlPanel.tsx      (新增：浮動面板組件)
├─ BingoCard.test.tsx          (修改：添加角標測試)
└─ __tests__/
   ├─ NumberControlPanel.test.tsx (新增)
   └─ PlayerDashboard.test.tsx    (修改：添加浮動面板測試)

src/
└─ styles.css                  (修改：添加角標樣式、動畫、浮動面板樣式)
```

---

## 任務分解

### Task 1: 添加樣式和動畫到 styles.css

**檔案：**
- Modify: `src/styles.css`

**說明：** 先添加所有 CSS 樣式和動畫定義，為後續組件提供樣式基礎。

- [ ] **Step 1: 添加號碼角標基礎樣式**

在 `src/styles.css` 中添加：

```css
/* 號碼角標 - 基礎樣式 */
.bingo-card__number-badge {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--neon-pink);
  border: 4px solid var(--deep-ink);
  color: white;
  font-weight: 900;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 4px 4px 0 var(--deep-ink);
  z-index: 10;
  line-height: 1;
}
```

- [ ] **Step 2: 添加動畫定義**

在 `src/styles.css` 中添加：

```css
/* 號碼脈動動畫 */
@keyframes numberPulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    filter: drop-shadow(0 0 12px var(--neon-pink));
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.bingo-card__number-badge--animate {
  animation: numberPulse 0.3s ease-out;
}
```

- [ ] **Step 3: 添加手機版角標樣式**

在 `src/styles.css` 中添加（在 `@media (max-width: 768px)` 斷點中）：

```css
@media (max-width: 768px) {
  .bingo-card {
    position: relative;
    margin-bottom: 60px; /* 預留角標空間 */
  }

  .bingo-card__number-badge {
    position: static;
    margin: 12px auto 0;
    top: auto;
    right: auto;
  }
}
```

- [ ] **Step 4: 添加浮動面板樣式**

在 `src/styles.css` 中添加：

```css
/* 數字控制面板 - 浮動面板 */
.number-control-panel {
  position: fixed;
  left: var(--space-md);
  top: 100px;
  width: 120px;
  background: white;
  border: 4px solid var(--deep-ink);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 8px 8px 0 var(--deep-ink);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.number-control-panel__display {
  text-align: center;
  width: 100%;
}

.number-control-panel__label {
  font-size: 10px;
  color: #888;
  font-weight: 800;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.number-control-panel__number {
  font-size: 32px;
  font-weight: 900;
  color: var(--neon-pink);
  line-height: 1;
  font-family: var(--font-heading);
}

.number-control-panel__button {
  width: 100%;
  padding: 8px;
  background: var(--neon-cyan);
  border: 2px solid var(--deep-ink);
  border-radius: 6px;
  font-weight: 800;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.number-control-panel__button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 2px 2px 0 var(--deep-ink);
}

.number-control-panel__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.number-control-panel__button:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 0 0 var(--deep-ink);
}

/* 手機版隱藏浮動面板 */
@media (max-width: 768px) {
  .number-control-panel {
    display: none;
  }
}
```

- [ ] **Step 5: 運行驗證確保 CSS 無語法錯誤**

```bash
npm run build
# Expected: 編譯成功，無 CSS 錯誤
```

- [ ] **Step 6: 提交**

```bash
git add src/styles.css
git commit -m "style: [UI] 添加號碼角標和控制面板樣式"
```

---

### Task 2: 創建 NumberControlPanel 組件

**檔案：**
- Create: `src/components/session/NumberControlPanel.tsx`

**說明：** 創建 Host 側邊浮動面板組件，顯示最新號碼和 Draw Number 按鈕。

- [ ] **Step 1: 創建組件框架和類型**

創建 `src/components/session/NumberControlPanel.tsx`：

```typescript
import React from 'react';

export interface NumberControlPanelProps {
  latestNumber: number | null;
  totalNumbers: number;
  onDrawNumber: () => void;
  disabled?: boolean;
}

export const NumberControlPanel: React.FC<NumberControlPanelProps> = ({
  latestNumber,
  totalNumbers,
  onDrawNumber,
  disabled = false,
}) => {
  return (
    <div className="number-control-panel">
      <div className="number-control-panel__display">
        <div className="number-control-panel__label">Latest</div>
        <div className="number-control-panel__number">
          {latestNumber ?? '-'}
        </div>
      </div>
      <button
        className="number-control-panel__button"
        onClick={onDrawNumber}
        disabled={disabled}
        type="button"
      >
        Draw
      </button>
      <div style={{ fontSize: '9px', color: '#999', textAlign: 'center' }}>
        {totalNumbers} / 75
      </div>
    </div>
  );
};
```

- [ ] **Step 2: 驗證組件可導入和使用**

運行編譯確保無 TypeScript 錯誤：

```bash
npm run build
# Expected: 編譯成功
```

- [ ] **Step 3: 提交**

```bash
git add src/components/session/NumberControlPanel.tsx
git commit -m "feat: [UI] 創建 NumberControlPanel 浮動面板組件"
```

---

### Task 3: 修改 BingoCard 組件添加角標

**檔案：**
- Modify: `src/components/session/BingoCard.tsx`

**說明：** 添加號碼角標功能，支持動畫和響應式佈局。

- [ ] **Step 1: 更新 BingoCardProps 類型**

修改 `src/components/session/BingoCard.tsx`，更新接口：

```typescript
interface BingoCardProps {
  grid: BingoCardGrid;
  calledNumbers: number[];
  latestNumber?: number | null;      // 新增
  isHost?: boolean;                   // 新增
}
```

在組件簽名中添加這些參數。

- [ ] **Step 2: 添加角標渲染邏輯**

在 `BingoCard` 組件中，在返回的 JSX 最後添加角標：

```typescript
const [shouldAnimate, setShouldAnimate] = useState(false);

useEffect(() => {
  // 當 latestNumber 變化時，觸發動畫
  if (latestNumber !== null) {
    setShouldAnimate(true);
    const timer = setTimeout(() => setShouldAnimate(false), 300);
    return () => clearTimeout(timer);
  }
}, [latestNumber]);
```

在 `return` 的 JSX 中，包裝整個卡片在一個 `position: relative` 的容器中，然後添加角標：

```typescript
return (
  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
    <div className="bingo-card" /* ... existing styles ... */>
      {/* 現有的卡片內容 */}
    </div>

    {/* 新增：號碼角標 */}
    {latestNumber !== null && latestNumber !== undefined && (
      <div
        className={`bingo-card__number-badge ${
          shouldAnimate ? 'bingo-card__number-badge--animate' : ''
        }`}
      >
        {latestNumber}
      </div>
    )}
  </div>
);
```

- [ ] **Step 3: 驗證修改無破壞**

```bash
npm run build
npm run test -- BingoCard.test.tsx
# Expected: 編譯成功，現有測試通過
```

- [ ] **Step 4: 提交**

```bash
git add src/components/session/BingoCard.tsx
git commit -m "feat: [UI] 在 BingoCard 添加動態號碼角標"
```

---

### Task 4: 修改 PlayerDashboard 添加浮動面板邏輯

**檔案：**
- Modify: `src/components/session/PlayerDashboard.tsx`

**說明：** 集成 NumberControlPanel，添加必要的數據計算和條件渲染。

- [ ] **Step 1: 計算 latestNumber 並傳遞給 BingoCard**

在 `PlayerDashboard` 組件中，修改卡片渲染部分：

```typescript
// 計算最新號碼
const latestNumber = session.calledNumbers.length > 0
  ? session.calledNumbers[session.calledNumbers.length - 1]
  : null;

// 在 BingoCard 組件調用時添加新 props：
<BingoCard
  grid={session.cards[localPlayerId!]}
  calledNumbers={session.calledNumbers}
  latestNumber={latestNumber}
  isHost={isHost}
/>
```

- [ ] **Step 2: 添加 NumberControlPanel 到 Host 視圖**

在 `PlayerDashboard` 組件中，找到 Host 控制台部分（大約第 97-105 行），在其前面添加浮動面板：

```typescript
{/* Host 專用：浮動面板 */}
{isHost && session.status === 'active' && (
  <NumberControlPanel
    latestNumber={latestNumber}
    totalNumbers={session.calledNumbers.length}
    onDrawNumber={drawNumber}
    disabled={session.winners.length > 0 || session.calledNumbers.length >= 75}
  />
)}
```

並在 `PlayerDashboard` 的頂部導入組件：

```typescript
import { NumberControlPanel } from './NumberControlPanel';
```

- [ ] **Step 3: 可選 - 簡化 HostPanel**

根據設計，可以在 Host 視圖中隱藏下方的 HostPanel，因為功能已整合到浮動面板：

```typescript
{/* 可選：根據需要決定是否隱藏下方的 HostPanel */}
{/* 注意：保留以保持向後兼容 */}
```

- [ ] **Step 4: 驗證修改**

```bash
npm run build
npm run test -- PlayerDashboard.test.tsx
# Expected: 編譯成功，現有測試通過
```

- [ ] **Step 5: 提交**

```bash
git add src/components/session/PlayerDashboard.tsx
git commit -m "feat: [UI] 集成 NumberControlPanel 浮動面板到 PlayerDashboard"
```

---

### Task 5: 單元測試 - NumberControlPanel 和 BingoCard

**檔案：**
- Create: `src/components/session/__tests__/NumberControlPanel.test.tsx`
- Modify: `src/components/session/__tests__/BingoCard.test.tsx`

**說明：** 添加單元測試確保組件正確渲染和交互。

- [ ] **Step 1: 創建 NumberControlPanel 測試**

創建 `src/components/session/__tests__/NumberControlPanel.test.tsx`：

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberControlPanel } from '../NumberControlPanel';

describe('NumberControlPanel', () => {
  it('顯示最新號碼', () => {
    render(
      <NumberControlPanel
        latestNumber={42}
        totalNumbers={10}
        onDrawNumber={() => {}}
      />
    );

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('10 / 75')).toBeInTheDocument();
  });

  it('當 latestNumber 為 null 時顯示 -', () => {
    render(
      <NumberControlPanel
        latestNumber={null}
        totalNumbers={0}
        onDrawNumber={() => {}}
      />
    );

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('按鈕點擊觸發 onDrawNumber 回調', async () => {
    const user = userEvent.setup();
    const onDrawNumber = vi.fn();

    render(
      <NumberControlPanel
        latestNumber={42}
        totalNumbers={10}
        onDrawNumber={onDrawNumber}
      />
    );

    const button = screen.getByRole('button');
    await user.click(button);

    expect(onDrawNumber).toHaveBeenCalledTimes(1);
  });

  it('disabled 屬性禁用按鈕', async () => {
    const onDrawNumber = vi.fn();

    const { rerender } = render(
      <NumberControlPanel
        latestNumber={42}
        totalNumbers={10}
        onDrawNumber={onDrawNumber}
        disabled={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
```

- [ ] **Step 2: 運行 NumberControlPanel 測試**

```bash
npm run test -- NumberControlPanel.test.tsx
# Expected: 所有 4 個測試通過
```

- [ ] **Step 3: 添加 BingoCard 角標測試**

修改或創建 `src/components/session/__tests__/BingoCard.test.tsx`，添加：

```typescript
describe('BingoCard 號碼角標', () => {
  it('當 latestNumber 為 null 時不顯示角標', () => {
    const grid = [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 'FREE', 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
    ];

    const { container } = render(
      <BingoCard grid={grid} calledNumbers={[]} latestNumber={null} />
    );

    const badge = container.querySelector('.bingo-card__number-badge');
    expect(badge).not.toBeInTheDocument();
  });

  it('當 latestNumber 為數字時顯示角標', () => {
    const grid = [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 'FREE', 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
    ];

    const { container } = render(
      <BingoCard grid={grid} calledNumbers={[1, 2, 42]} latestNumber={42} />
    );

    const badge = container.querySelector('.bingo-card__number-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('42');
  });

  it('新號碼出現時應用動畫類', () => {
    const grid = [
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 'FREE', 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
    ];

    const { container, rerender } = render(
      <BingoCard grid={grid} calledNumbers={[]} latestNumber={null} />
    );

    rerender(
      <BingoCard grid={grid} calledNumbers={[42]} latestNumber={42} />
    );

    const badge = container.querySelector('.bingo-card__number-badge');
    expect(badge).toHaveClass('bingo-card__number-badge--animate');
  });
});
```

- [ ] **Step 4: 運行 BingoCard 測試**

```bash
npm run test -- BingoCard.test.tsx
# Expected: 所有新舊測試通過
```

- [ ] **Step 5: 提交**

```bash
git add src/components/session/__tests__/NumberControlPanel.test.tsx
git add src/components/session/__tests__/BingoCard.test.tsx
git commit -m "test: [UI] 添加 NumberControlPanel 和 BingoCard 角標單元測試"
```

---

### Task 6: 集成測試 - PlayerDashboard

**檔案：**
- Modify: `src/components/session/__tests__/PlayerDashboard.test.tsx` (如果存在)

**說明：** 測試 Host 和 Player 視圖的區別，確保浮動面板只在 Host 視圖顯示。

- [ ] **Step 1: 創建或修改 PlayerDashboard 集成測試**

創建或修改 `src/components/session/__tests__/PlayerDashboard.test.tsx`：

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlayerDashboard } from '../PlayerDashboard';
import { SessionProvider } from '../../features/session/session-provider';

// Mock useSession hook
vi.mock('../../features/session/session-provider', () => ({
  useSession: vi.fn(),
}));

describe('PlayerDashboard - 叫號功能整合', () => {
  const mockSession = {
    status: 'active',
    hostId: 'host-123',
    localPlayerId: 'player-1',
    players: [{ id: 'host-123', name: 'Host' }, { id: 'player-1', name: 'Player 1' }],
    cards: {
      'host-123': /* grid */,
      'player-1': /* grid */,
    },
    calledNumbers: [1, 2, 42],
    winners: [],
    sessionId: 'session-1',
    winningPattern: null,
    activePatternIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  it('Host 視圖顯示 NumberControlPanel 浮動面板', () => {
    const { useSession } = require('../../features/session/session-provider');
    useSession.mockReturnValue({
      session: mockSession,
      localPlayerId: 'host-123',
      // ... other hooks
    });

    render(<PlayerDashboard />);

    // 檢查浮動面板存在
    const panel = screen.getByText('Latest');
    expect(panel).toBeInTheDocument();
  });

  it('Player 視圖不顯示 NumberControlPanel 浮動面板', () => {
    const { useSession } = require('../../features/session/session-provider');
    useSession.mockReturnValue({
      session: mockSession,
      localPlayerId: 'player-1', // Player ID，不是 Host
      // ... other hooks
    });

    render(<PlayerDashboard />);

    // 檢查浮動面板不存在
    const panel = screen.queryByText('Latest');
    expect(panel).not.toBeInTheDocument();
  });

  it('Host 視圖的 BingoCard 接收 latestNumber prop', () => {
    const { useSession } = require('../../features/session/session-provider');
    useSession.mockReturnValue({
      session: mockSession,
      localPlayerId: 'host-123',
      // ... other hooks
    });

    const { container } = render(<PlayerDashboard />);

    // 檢查角標顯示最新號碼 (42)
    const badge = container.querySelector('.bingo-card__number-badge');
    expect(badge).toHaveTextContent('42');
  });

  it('Player 視圖的 BingoCard 也接收 latestNumber prop', () => {
    const { useSession } = require('../../features/session/session-provider');
    useSession.mockReturnValue({
      session: mockSession,
      localPlayerId: 'player-1',
      // ... other hooks
    });

    const { container } = render(<PlayerDashboard />);

    // 檢查 Player 的卡片也有角標
    const badge = container.querySelector('.bingo-card__number-badge');
    expect(badge).toHaveTextContent('42');
  });
});
```

- [ ] **Step 2: 運行集成測試**

```bash
npm run test -- PlayerDashboard.test.tsx
# Expected: 所有測試通過
```

- [ ] **Step 3: 提交**

```bash
git add src/components/session/__tests__/PlayerDashboard.test.tsx
git commit -m "test: [UI] 添加 PlayerDashboard 集成測試"
```

---

### Task 7: 手動測試和驗證

**說明：** 在實際應用中手動測試，驗證視覺效果、動畫、響應式設計。

- [ ] **Step 1: 啟動開發服務器**

```bash
npm run dev
# Expected: 應用成功啟動，http://localhost:5173 可訪問
```

- [ ] **Step 2: 測試 Host 視圖**

1. 以 Host 身份進入遊戲
2. 驗證：
   - ✅ 左側浮動面板顯示（位置固定）
   - ✅ 浮動面板顯示 "LATEST" 標籤
   - ✅ Draw 按鈕可點擊
   - ✅ 卡片右上角有號碼角標（初始為空或 "-"）

- [ ] **Step 3: 測試 Player 視圖**

1. 以 Player 身份進入遊戲
2. 驗證：
   - ✅ 左側浮動面板不顯示
   - ✅ 卡片右上角有號碼角標
   - ✅ 號碼角標清晰可見

- [ ] **Step 4: 測試動畫效果**

1. Host 點擊 Draw 按鈕
2. 驗證：
   - ✅ 號碼角標出現（舊號碼換成新號碼）
   - ✅ 動畫流暢（scale + 閃光）
   - ✅ 所有玩家都能看到新號碼
   - ✅ 浮動面板同時更新

- [ ] **Step 5: 測試桌面響應式（✏️ 縮小瀏覽器窗口）**

1. 縮小窗口至 768px 寬度
2. 驗證：
   - ✅ 浮動面板隱藏
   - ✅ 角標仍在卡片右上方
   - ✅ 佈局正確調整

- [ ] **Step 6: 測試手機響應式（開發者工具手機模式）**

1. 打開 DevTools，切換到手機模式 (< 480px)
2. 驗證：
   - ✅ 卡片下方有足夠空間放角標
   - ✅ 角標居中顯示在卡片下方
   - ✅ 號碼清晰可讀
   - ✅ 卡片不被遮擋

- [ ] **Step 7: 測試邊界情況**

1. 骰到所有 75 個號碼
   - ✅ Draw 按鈕禁用
   - ✅ 浮動面板中按鈕呈灰色

2. 玩家贏了（彩金）
   - ✅ Draw 按鈕禁用
   - ✅ 浮動面板中按鈕呈灰色

- [ ] **Step 8: 驗證無破壞現有功能**

1. 測試卡片點擊標記功能
   - ✅ 用戶可點擊卡片格子標記
   - ✅ 動畫正常

2. 測試 CallHistory 顯示
   - ✅ CallHistory 仍正常顯示
   - ✅ 叫號動態可查看

3. 測試其他現有功能
   - ✅ 重新抽卡功能正常
   - ✅ 快速重啟功能正常
   - ✅ 分享會話功能正常

- [ ] **Step 9: 提交最終驗證**

```bash
# 確保所有測試通過
npm run test

# 確保編譯成功
npm run build

# Expected: 無錯誤，編譯完成
```

- [ ] **Step 10: 創建最終提交**

```bash
git status  # 確保所有文件都已提交
# 如有未提交的文件，各自提交

# 如果所有更改已提交，請執行：
git log --oneline -10  # 檢查 commit history
# Expected: 看到所有相關的 commit
```

---

## 測試檢查清單

### 單元測試覆蓋
- [ ] NumberControlPanel：4 個測試
- [ ] BingoCard 角標：3 個測試
- [ ] PlayerDashboard 整合：4 個測試

### 手動測試覆蓋
- [ ] Desktop (≥768px) 視圖
- [ ] Tablet (480-768px) 視圖
- [ ] Mobile (<480px) 視圖
- [ ] 動畫效果
- [ ] 邊界情況（遊戲結束、玩家贏）
- [ ] 現有功能無破壞

---

## 關鍵文件清單

| 檔案 | 修改類型 | 說明 |
|------|---------|------|
| `src/styles.css` | 修改 | 添加角標、動畫、浮動面板樣式 |
| `src/components/session/NumberControlPanel.tsx` | 新增 | 浮動面板組件 |
| `src/components/session/BingoCard.tsx` | 修改 | 添加角標、props、動畫 |
| `src/components/session/PlayerDashboard.tsx` | 修改 | 集成浮動面板、計算 latestNumber |
| `src/components/session/__tests__/NumberControlPanel.test.tsx` | 新增 | 浮動面板測試 |
| `src/components/session/__tests__/BingoCard.test.tsx` | 修改 | 添加角標測試 |
| `src/components/session/__tests__/PlayerDashboard.test.tsx` | 修改 | 添加集成測試 |

---

## 規格覆蓋驗證

✅ **設計細節 1.1 - BingoCard Props**
→ Task 3, Step 1 實現

✅ **設計細節 1.2 - 角標渲染和動畫**
→ Task 3, Step 2 和 Task 1, Step 1-2 實現

✅ **設計細節 1.3 - 響應式佈局**
→ Task 1, Step 3 和 Task 7, Step 5-6 驗證

✅ **設計細節 1.4 - NumberControlPanel 組件**
→ Task 2 完全實現

✅ **設計細節 1.5 - PlayerDashboard 邏輯**
→ Task 4 完全實現

✅ **設計細節 2 - 樣式和動畫**
→ Task 1 完全實現

✅ **測試策略**
→ Task 5-7 完全覆蓋

---

## 注意事項

- 所有 CSS 類名遵循 BEM 命名規範
- 所有新組件使用 TypeScript，包含完整類型定義
- 所有新功能有相應的單元和集成測試
- 手機版角標位置調整在 768px 斷點
- 浮動面板在手機版自動隱藏（display: none）
- 動畫長度為 300ms，不會讓用戶感到震驚
