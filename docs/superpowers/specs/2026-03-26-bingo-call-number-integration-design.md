# Bingo 叫號功能整合設計規格

**日期**：2026-03-26
**狀態**：已批准
**設計師**：Claude Code

---

## 目錄
1. [概述](#概述)
2. [問題陳述](#問題陳述)
3. [解決方案](#解決方案)
4. [設計細節](#設計細節)
5. [實現細節](#實現細節)
6. [測試策略](#測試策略)

---

## 概述

本設計規格定義了如何將 Bingo 遊戲的叫號功能（Draw Number）整合到卡片 UI 中，以改善用戶體驗。通過在卡片右上角添加動態號碼角標（Host）和側邊浮動面板（Players），使得所有參與者都能快速且清楚地看到最新骰出的號碼。

**目標**：
- ✅ Host 可以完整看到自己的卡片（浮動面板不佔卡片空間）
- ✅ Host 骰號時號碼即時顯示（在浮動面板上）
- ✅ Players 也能快速看到號碼（卡片角標或下方）
- ✅ 符合粗獷主義視覺風格
- ✅ 完全響應式（桌面/手機都有好體驗）

---

## 問題陳述

### 當前狀況
- **叫號按鈕位置**：位於 PlayerDashboard 下方的 HostPanel 中
- **號碼顯示位置**：在 CallHistory 組件中，需要往下滑才能看到
- **Host 體驗問題**：
  - Host 要骰號時，看不到自己的卡片
  - 需要往下滑才能找到 Draw Number 按鈕
  - 骰出的號碼在下方，看不到實時反饋

- **Player 體驗問題**：
  - Players 在玩卡片時，看不到最新骰出的號碼
  - 需要往下滑看 CallHistory 來確認號碼是否已被叫過

---

## 解決方案

### 設計方案選擇：**方案 B - 卡片角標**

在卡片右上角放置一個醒目的號碼圓球（角標），同時為 Host 添加左側浮動面板。

#### Host 視圖
- **左側浮動面板**：
  - 位置：卡片左側，固定定位（不隨頁面滾動）
  - 內容：最新號碼（大字體）+ Draw Number 按鈕
  - 樣式：白色背景，粗獷邊框，陰影

- **卡片角標**：
  - 位置：卡片右上角（絕對定位）
  - 樣式：粉紅色圓球，白色數字，4px 深色邊框
  - 動畫：新號碼出現時 → scale(1.0) 到 scale(1.15)（300ms）+ 閃光效果

#### Player 視圖
- **卡片角標**（主要）：
  - 桌面版（≥768px）：卡片右上角
  - 手機版（<768px）：卡片下方居中
  - 動畫：同 Host 視圖

- **不顯示浮動面板**（Players 無法看到 Draw Number 按鈕）

---

## 設計細節

### 1. 核心組件改動

#### BingoCard.tsx
**新增 Props：**
```typescript
interface BingoCardProps {
  grid: BingoCardGrid;
  calledNumbers: number[];
  latestNumber?: number | null;      // 最新號碼（新增）
  isHost?: boolean;                   // 是否是 Host（新增）
  onDrawNumber?: () => void;          // 叫號回調（新增）
}
```

**新增功能：**
- 卡片右上角顯示號碼角標（絕對定位）
- 號碼出現時觸發動畫：`scale(1.0) → scale(1.15)` + 閃光
- 響應式：
  - 桌面版：角標在右上方
  - 手機版：角標移到卡片下方居中

#### PlayerDashboard.tsx
**調整：**
- 傳遞 `latestNumber` 和 `isHost` 給 BingoCard
- Host 版本：添加左側浮動面板（新組件 `NumberControlPanel`）
- 去掉页面下方的 HostPanel（功能移到浮動面板）

#### 新增組件：NumberControlPanel.tsx
**職責：**
- 顯示最新骰出號碼（大字體）
- 提供 Draw Number 按鈕
- 左側固定定位，不隨頁面滾動
- 只有 Host 能看到

**Props：**
```typescript
interface NumberControlPanelProps {
  latestNumber: number | null;
  totalNumbers: number;
  onDrawNumber: () => void;
  disabled?: boolean;
}
```

### 2. 樣式與動畫

#### 號碼角標樣式
```css
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
  animation: numberPulse 0.3s ease-out;
}
```

#### 動畫定義
```css
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
```

#### 浮動面板樣式
```css
.number-control-panel {
  position: fixed;
  left: var(--space-md);
  top: calc(var(--space-md) + 100px); /* 根據卡片位置調整 */
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
}

.number-control-panel__label {
  font-size: 10px;
  color: #888;
  font-weight: 800;
  margin-bottom: 4px;
}

.number-control-panel__number {
  font-size: 32px;
  font-weight: 900;
  color: var(--neon-pink);
  line-height: 1;
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
}

.number-control-panel__button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 2px 2px 0 var(--deep-ink);
}

.number-control-panel__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### 3. 響應式設計

| 斷點 | 佈局 | 說明 |
|-----|------|------|
| **桌面 (≥768px)** | 卡片 + 浮動面板（左側） + 角標（右上方） | 完整信息顯示 |
| **平板 (480-768px)** | 卡片 + 角標（右上方） | 角標可能部分遮擋 |
| **手機 (<480px)** | 卡片 + 角標（下方） | 清晰無遮擋 |

**手機版角標位置調整：**
```css
@media (max-width: 768px) {
  .bingo-card {
    position: relative;
    margin-bottom: 60px; /* 為下方角標預留空間 */
  }

  .bingo-card__number-badge {
    position: static;
    margin: 0 auto;
    margin-top: 12px;
  }
}
```

### 4. 數據流

```
Session State
├─ calledNumbers: number[]
├─ latestNumber: number | null (derived from calledNumbers)
└─ hostId, localPlayerId

PlayerDashboard
├─ isHost = (localPlayerId === hostId)
├─ latestNumber = session.calledNumbers[session.calledNumbers.length - 1] || null
│
├─ [Host Only]
│  └─ NumberControlPanel
│     ├─ latestNumber
│     ├─ onDrawNumber() 回調 → session.drawNumber()
│     └─ disabled = (winners.length > 0 || calledNumbers.length >= 75)
│
└─ BingoCard
   ├─ latestNumber
   ├─ isHost
   └─ 根據 isHost 和 screen size 決定角標位置
```

---

## 實現細節

### 檔案結構
```
src/components/session/
├─ BingoCard.tsx           (修改：添加角標)
├─ PlayerDashboard.tsx     (修改：添加浮動面板邏輯)
├─ NumberControlPanel.tsx  (新增：浮動面板組件)
├─ HostPanel.tsx           (修改：可能簡化或移除)
└─ ...

src/styles.css            (修改：添加新的樣式和動畫)
```

### 實現步驟
1. **修改 BingoCard 組件**：
   - 添加新 Props
   - 實現角標渲染邏輯
   - 添加響應式佈局邏輯
   - 實現動畫

2. **創建 NumberControlPanel 組件**：
   - 顯示最新號碼
   - Draw Number 按鈕
   - 固定定位邏輯

3. **修改 PlayerDashboard 組件**：
   - 計算 `latestNumber`
   - 條件渲染 NumberControlPanel（Host only）
   - 傳遞 props 給 BingoCard

4. **添加樣式**：
   - 角標樣式
   - 動畫定義
   - 浮動面板樣式
   - 響應式調整

5. **測試**：
   - 單元測試：組件渲染、props 傳遞
   - 集成測試：Host/Player 視圖切換
   - 手動測試：動畫效果、響應式佈局

---

## 測試策略

### 單元測試
- **BingoCard 組件**：
  - ✅ 無 `latestNumber` 時不顯示角標
  - ✅ 有 `latestNumber` 時正確顯示
  - ✅ 號碼變化時觸發動畫

- **NumberControlPanel 組件**：
  - ✅ 顯示最新號碼
  - ✅ 按鈕點擊事件正確觸發
  - ✅ disabled 狀態正確應用

### 集成測試
- **PlayerDashboard**：
  - ✅ Host 視圖顯示浮動面板
  - ✅ Player 視圖不顯示浮動面板
  - ✅ 號碼實時更新

### 手動測試
- **視覺效果**：
  - ✅ 角標在卡片右上方（桌面）或下方（手機）
  - ✅ 動畫流暢（scale + 閃光）
  - ✅ 浮動面板位置正確

- **交互**：
  - ✅ Host 可以點擊 Draw Number 按鈕
  - ✅ 號碼實時更新
  - ✅ 小屏幕上佈局正確調整

---

## 批准記錄

| 角色 | 日期 | 簽名 |
|------|------|------|
| 用戶 | 2026-03-26 | ✅ 已批准（方案 B） |

---

## 注釋

- 本設計基於用戶的澄清回應和偏好選擇
- 動畫效果旨在吸引注意力，但不會分散用戶
- 響應式設計確保各種設備上都有良好體驗
- 粗獷主義風格保持一致（大膽色彩、清晰邊界、陰影）
