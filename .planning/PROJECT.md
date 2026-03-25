# 美式賓果（American Bingo）

## What This Is

這是一個可部署到 GitHub Pages 的純前端美式賓果網頁遊戲。它支援單局多人參與、主持人開號、每位玩家隨機抽卡，以及自動判定誰先連成一線獲勝。

這個專案的重點不是先做複雜平台，而是先把一局賓果跑順，並且用資料驅動的規則與版型保留後續擴充玩法的空間。

## Core Value

用一個靜態、免後端的網頁，讓多人可以快速開始一局公平、清楚、可擴充的美式賓果。

## Requirements

### Validated

(None yet - ship to validate)

### Active

- [ ] 建立單局多人賓果流程，能新增玩家並開始遊戲
- [ ] 每位玩家在開局後可獲得隨機且符合美式規則的賓果卡
- [ ] 主持人可在遊戲中持續開號，並保留完整號碼歷史
- [ ] 系統可自動判定勝利條件並標示首位完成連線的玩家
- [ ] 遊戲狀態可在純前端靜態頁面中保存與恢復
- [ ] 規則與勝利型態採資料驅動設計，方便未來擴充
- [ ] 可以部署到 GitHub Pages，不依賴自建後端

### Out of Scope

- 真正跨裝置的即時同步房間 - GitHub Pages 靜態部署無法在 v1 內提供可靠後端協調
- 帳號、登入與玩家身分系統 - 目前不影響核心玩法
- 語音、文字聊天或視訊 - 不屬於賓果核心循環
- 積分排行與長期戰績 - 先完成單局體驗

## Context

- 目標平台是 GitHub Pages，因此輸出必須是純靜態前端資產
- 遊戲型態是美式賓果，核心規則應符合 75-ball bingo 的習慣
- 多人參與需要在單局內成立，但 v1 不依賴後端房間協調
- 後續可能加入更多玩法，例如自訂連線型態、主題卡面、特殊道具或不同局規

## Constraints

- **Tech stack**: 只能用純前端技術輸出靜態頁面 - 需要直接部署到 GitHub Pages
- **Architecture**: 規則引擎要資料驅動 - 後續新增玩法時不能重寫核心流程
- **Multiplayer**: v1 以單一共享局為主 - 不假設有後端或即時房間服務
- **Persistence**: 狀態需要能在瀏覽器端保存 - 讓靜態部署下仍可續局

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Static-first frontend only | 符合 GitHub Pages 部署與成本限制 | Pending |
| Shared local session instead of backend rooms | 保持 v1 可交付性，避免把即時同步綁進初版 | Pending |
| Data-driven win patterns and rules | 讓後續擴充玩法不必重寫核心邏輯 | Pending |
| Dedicated __tests__ folders | 將測試與實作邏輯分開存放，提高維護性 | Completed |

---
*Last updated: 2026-03-24 after project initialization*
