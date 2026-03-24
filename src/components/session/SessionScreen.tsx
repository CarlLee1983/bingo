import { useSession } from '../../features/session/session-provider';
import { HostPanel } from './HostPanel';
import { PlayerRoster } from './PlayerRoster';
import { SessionStatus } from './SessionStatus';

export function SessionScreen() {
  const { session } = useSession();

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">American Bingo</p>
        <h1>靜態前端賓果局</h1>
        <p className="lede">
          Host 建局、玩家進場、開局後再擴充卡牌與叫號規則。
        </p>
      </section>

      <div className="session-grid">
        <div className="panel panel--primary">
          <SessionStatus />
          <HostPanel />
        </div>

        <div className="panel">
          <PlayerRoster />
        </div>
      </div>

      <footer className="session-footer">
        <span>Session {session.sessionId}</span>
      </footer>
    </main>
  );
}
