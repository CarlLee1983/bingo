# 美式賓果（American Bingo）

這是一個專為靜態部署設計的多人賓果遊戲。核心價值在於透過資料驅動的規則引擎，提供公平、流暢且具備擴充性的賓果體驗，完全不依賴後端服務即可運行。

## 🚀 技術棧 (Tech Stack)

*   **前端框架**: [React 19](https://react.dev/) (TypeScript)
*   **建構工具**: [Vite 8](https://vitejs.dev/)
*   **狀態管理**: React Context + `useReducer` (Redux-style pattern)
*   **測試工具**: [Vitest](https://vitest.dev/) + React Testing Library
*   **部署**: GitHub Actions + GitHub Pages (SPA 支援)
*   **樣式**: 純 CSS (Vanilla CSS)

## 🏗️ 專案架構 (Architecture)

專案採用 **Feature-based** 架構，確保核心邏輯與 UI 組件解耦：

```text
src/
├── app/                # 應用進入點與全域佈局
├── components/         # 表現層 (UI Components)
│   └── session/        # 賓果遊戲專屬組件 (卡片、歷史、面板)
├── features/           # 業務邏輯層 (Business Logic)
│   └── session/        # 賓果遊戲核心引擎
│       ├── __tests__/  # 測試案例
│       ├── card-generator.ts # 卡片生成邏輯
│       ├── session-reducer.ts # 狀態變更邏輯
│       ├── win-detection.ts  # 連線判定引擎
│       └── win-patterns.ts   # 勝利規則定義集
└── main.tsx            # 入口檔案
```

### 核心設計模式
1.  **資料驅動規則**: 所有的勝利連線 (Patterns) 都定義在 `win-patterns.ts`。新增玩法只需新增 Pattern 物件，無需修改 `win-detection.ts` 的判定代碼。
2.  **狀態持久化**: 透過 `session-storage.ts` 自動將遊戲狀態同步至 `localStorage`，重新整理頁面亦可繼續目前的賽局。
3.  **單向資料流**: 嚴格執行 `Action -> Reducer -> State -> UI` 的流向，確保邏輯可預測且易於測試。

## 🛠️ 開發與維護 (Development & Maintenance)

### 常用指令
*   `npm run dev`: 啟動開發伺服器。
*   `npm run build`: 執行生產環境編譯，產出靜態資源。
*   `npm test`: 執行所有單元測試與整合測試。
*   `npm run preview`: 在本地預覽生產環境編譯結果。

### 新增功能建議
*   **新增勝利規則**: 在 `win-patterns.ts` 中的 `WIN_PATTERNS` 加入新的格子座標定義。
*   **自訂樣式**: 修改 `src/styles.css`，目前採用階層式設計，易於針對特定組件進行主題調整。

## 🚢 自動化部署 (CI/CD)

專案包含 GitHub Actions 工作流 (`.github/workflows/deploy.yml`)：
*   **觸發條件**: 推送至 `main` 分支。
*   **流程**: 自動進行類型檢查、執行測試、編譯專案並部署至 `gh-pages` 靜態環境。
*   **SPA 修復**: 透過 `public/404.html` 與 `index.html` 內嵌腳本，解決 GitHub Pages 不支援單頁應用路徑重新整理的問題。
