import { useSession } from '../../features/session/session-provider';
import { HostPanel } from './HostPanel';
import { PlayerRoster } from './PlayerRoster';
import { SessionStatus } from './SessionStatus';
import { CallHistory } from './CallHistory';
import { WinnerAnnouncement } from './WinnerAnnouncement';
import { PlayerDashboard } from './PlayerDashboard';
import { IdentityPicker } from './IdentityPicker';

export function SessionScreen() {
  const { session, localPlayerId } = useSession();

  // If the user has picked an identity, show their personal dashboard
  if (localPlayerId) {
    return (
      <main className="app-shell">
        <PlayerDashboard />
      </main>
    );
  }

  // If the user is entering from a shared link but hasn't picked who they are
  const isEnteringFromShare = new URLSearchParams(window.location.search).has('s') || session.players.length > 0;

  if (isEnteringFromShare && !session.hostId) {
     // Still in setup or empty
  } else if (session.players.length > 0 && !localPlayerId) {
    return (
      <main className="app-shell">
        <IdentityPicker />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <WinnerAnnouncement />

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
          {session.status === 'active' && <CallHistory />}
        </div>

        <div className="panel">
          <PlayerRoster />
        </div>
      </div>

      <footer className="session-footer">
        <p>Session ID: <code>{session.sessionId}</code></p>
      </footer>
    </main>
  );
}
