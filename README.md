# 美式賓果（American Bingo）

這是一個專為靜態部署設計的多人即時賓果遊戲。核心價值在於透過 WebRTC P2P 技術與資料驅動的規則引擎，提供公平、即時且具備擴充性的賓果體驗，完全不依賴後端伺服器。

## 🚀 技術棧 (Tech Stack)

*   **前端框架**: [React 19](https://react.dev/) (TypeScript)
*   **建構工具**: [Vite 8](https://vitejs.dev/)
*   **即時同步**: [PeerJS](https://peerjs.com/) (WebRTC P2P)
*   **狀態管理**: React Context + `useReducer` (Redux-style pattern)
*   **二維碼產生**: QRServer API
*   **測試工具**: [Vitest](https://vitest.dev/) + React Testing Library
*   **部署**: GitHub Actions + GitHub Pages (SPA 支援)
*   **樣式**: 純 CSS (Vanilla CSS)

## 🏗️ 專案架構 (Architecture)

專案採用 **Feature-based** 架構，確保核心邏輯與 UI 組件解耦：

```text
src/
├── app/                # 應用進入點與全域佈局
├── components/         # 表現層 (UI Components)
│   └── session/        # 賓果遊戲專屬組件 (卡片、即時視圖、控制面板)
├── features/           # 業務邏輯層 (Business Logic)
│   └── session/        # 賓果遊戲核心引擎
│       ├── __tests__/  # 測試案例
│       ├── card-generator.ts # 卡片生成邏輯
│       ├── sync-service.ts   # WebRTC P2P 同步服務
│       ├── session-reducer.ts # 狀態變更邏輯
│       ├── win-detection.ts  # 連線判定引擎
│       └── win-patterns.ts   # 勝利規則定義集
└── main.tsx            # 入口檔案
```

### 核心設計模式
1.  **WebRTC 即時同步**: 採用 P2P 架構，主持人端作為「資料源」，透過 `SyncService` 將最新的賽局狀態（如開號結果）推播給所有已連線的玩家，達成免後端的即時互動。
2.  **資料驅動規則**: 所有的勝利連線 (Patterns) 都定義在 `win-patterns.ts`。新增玩法只需新增 Pattern 物件，無需修改判定代碼。
3.  **狀態持久化**: 透過 `session-storage.ts` 將狀態同步至 `localStorage`，重新整理頁面亦可恢復身分與進度。

## 🛠️ 開發與維護 (Development & Maintenance)

### 常用指令
*   `npm run dev`: 啟動開發伺服器。
*   `npm run build`: 執行生產環境編譯。
*   `npm test`: 執行單元與整合測試。

## 🚢 自動化部署 (CI/CD)

專案包含 GitHub Actions 工作流，推送到 `main` 分支後會自動部署至 GitHub Pages，並透過 `404.html` 重定向機制確保 SPA 路由在重新整理後依然可用。
