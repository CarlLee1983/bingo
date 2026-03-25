import { useSession } from '../../features/session/session-provider';
import { BingoCard } from './BingoCard';
import { CallHistory } from './CallHistory';
import { HostPanel } from './HostPanel';
import { WinnerAnnouncement } from './WinnerAnnouncement';

export function PlayerDashboard() {
  const { session, localPlayerId, setLocalPlayerId } = useSession();
  
  const player = session.players.find(p => p.id === localPlayerId);
  if (!player) return null;

  const isHost = localPlayerId === session.hostId;
  const isWinner = session.winners.includes(localPlayerId);

  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <WinnerAnnouncement />

      <header className="hero" style={{ textAlign: 'center' }}>
        <p className="eyebrow">Player View</p>
        <h1>{player.name}'s Bingo</h1>
        {isHost && <span style={{ fontSize: '0.8rem', opacity: 0.6 }}> (You are the Host)</span>}
      </header>

      {/* Main Section for the Player's own Card */}
      <section className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1rem' }}>
           <h2 style={{ fontSize: '1.25rem' }}>Your Card</h2>
           {isWinner && <strong style={{ color: '#8c5b17' }}>🎉 You Win!</strong>}
        </div>
        
        {session.status === 'active' && session.cards[localPlayerId!] ? (
          <BingoCard 
            grid={session.cards[localPlayerId!]} 
            calledNumbers={session.calledNumbers}
          />
        ) : (
          <p className="empty-state">Waiting for the host to start the game...</p>
        )}
        
        <p style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '1rem' }}>
          Tap numbers to mark them manually.
        </p>
      </section>

      {/* Shared Game Information */}
      {session.status === 'active' && (
        <section className="panel">
          <CallHistory />
        </section>
      )}

      {/* Host Controls (Only visible to the Host) */}
      {isHost && (
        <section className="panel">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Host Controls</h2>
          <HostPanel />
        </section>
      )}

      {/* Footer Actions */}
      <footer style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button 
          className="button--ghost" 
          onClick={() => setLocalPlayerId(null)}
          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
        >
          Not {player.name}? Switch Player
        </button>
      </footer>
    </div>
  );
}
