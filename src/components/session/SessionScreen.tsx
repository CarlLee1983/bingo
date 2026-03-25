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

  if (session.players.length > 0 && !localPlayerId) {
    return (
      <main className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IdentityPicker />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <WinnerAnnouncement />

      <section className="hero" style={{ marginBottom: '6rem' }}>
        <p className="eyebrow" style={{ 
          background: 'var(--neon-pink)', 
          color: 'white', 
          display: 'inline-block', 
          padding: '4px 12px',
          transform: 'rotate(2deg)',
          marginBottom: '1rem'
        }}>
          LIVE & STATIC
        </p>
        <h1>American Bingo</h1>
        <div style={{ position: 'relative', display: 'inline-block' }}>
           <p className="lede" style={{ transform: 'rotate(-1deg)' }}>
            這不是一般的賓果。這是免後端、極速連動的「新粗獷主義」賓果局。
          </p>
        </div>
      </section>

      <div className="session-grid">
        <div className="stack" style={{ gap: '4rem' }}>
          <section className="panel panel--primary">
            <SessionStatus />
          </section>
          
          <section className="panel" style={{ background: 'var(--neon-cyan)', transform: 'rotate(-1deg)' }}>
            <h2 style={{ marginBottom: '2rem' }}>
              <span style={{ background: 'var(--deep-ink)', color: 'white', padding: '4px 12px' }}>HOST</span> 
              控制台
            </h2>
            <HostPanel />
          </section>

          {session.status === 'active' && (
            <section className="panel" style={{ background: 'white', transform: 'rotate(1.5deg)' }}>
              <h2 style={{ marginBottom: '2rem' }}>叫號動態</h2>
              <CallHistory />
            </section>
          )}
        </div>

        <aside className="panel panel--sidebar">
          <h2 style={{ borderBottom: '4px solid var(--deep-ink)', paddingBottom: '1rem', marginBottom: '2rem' }}>
            Player Roster
          </h2>
          <PlayerRoster />
          
          <div style={{ marginTop: '3rem', fontSize: '0.8rem', fontWeight: 800 }}>
             ID: {session.sessionId.toUpperCase()}
          </div>
        </aside>
      </div>

      <footer style={{ marginTop: '8rem', textAlign: 'center' }}>
        <div style={{ 
          display: 'inline-block', 
          border: '3px solid var(--deep-ink)', 
          padding: '1rem 2rem', 
          background: 'white',
          fontWeight: 900
        }}>
          BUILT WITH ANTI-GRAVITY PROTOCOL
        </div>
      </footer>
    </main>
  );
}
