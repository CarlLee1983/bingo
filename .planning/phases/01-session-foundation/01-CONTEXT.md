# Phase 1: Session Foundation - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

建立單局多人賓果的核心 session 骨架。這一階段只處理開局、玩家名單、局內狀態保存與重置，讓後續的卡牌、開號與勝利判定能掛在同一個穩定的遊戲 session 上。

</domain>

<decisions>
## Implementation Decisions

### Session model
- **D-01:** 以「單一共享局」作為 Phase 1 的核心模型，不先做真正的跨裝置即時房間同步
- **D-02:** 主持人負責開局與重置，玩家只需要加入同一局即可
- **D-03:** 局內狀態需要能在瀏覽器端持久化，避免重新整理後整局消失

### Player flow
- **D-04:** 先支援多人加入同一局，再進入開局與發卡流程
- **D-05:** Phase 1 不加入帳號、登入或長期玩家資料

### Scope boundaries
- **D-06:** 即時跨裝置同步、房間邀請與多人協作控制留到後續 phase
- **D-07:** 規則變體、特殊道具與自訂勝利條件不在本階段實作

### the agent's Discretion
- 局內狀態儲存的具體前端機制
- Host / player 畫面的視覺安排
- 玩家加入與重置的互動細節

</decisions>

<specifics>
## Specific Ideas

- 產品目標是 GitHub Pages 靜態部署
- 這個階段先讓一局能成立並可續局，後面再把卡牌、開號與判定疊上去
- 美式賓果是 75-ball bingo 的常見規則基礎

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project definition
- `.planning/PROJECT.md` — 產品目標、核心價值、約束與目前決策
- `.planning/REQUIREMENTS.md` — v1 要求、v2 延後項與 Phase traceability
- `.planning/ROADMAP.md` — Phase 1 的交付邊界與驗證方式

### Session state
- `.planning/STATE.md` — 目前專案焦點與進度

### Phase scope
- `.planning/REQUIREMENTS.md` `SESS-01` to `SESS-03` — Phase 1 的可驗收要求

No external specs — requirements are fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet: this is a greenfield project

### Established Patterns
- None yet: no implementation exists

### Integration Points
- GitHub Pages static build output
- Browser storage for session persistence

</code_context>

<deferred>
## Deferred Ideas

- Real-time cross-device multiplayer backend
- Player accounts and authentication
- Custom rules / variants / power-ups
- Persistent stats and ranked play

</deferred>

---

*Phase: 01-session-foundation*
*Context gathered: 2026-03-24*
