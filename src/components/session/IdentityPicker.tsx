import { useState } from 'react';
import { useSession } from '../../features/session/session-provider';

export function IdentityPicker() {
  const { session, setLocalPlayerId, connectToHost, syncStatus } = useSession();
  const [targetPeerId, setTargetPeerId] = useState('');

  if (session.players.length === 0) {
    return (
      <section className="panel">
        <h2>Welcome to Bingo</h2>
        <p className="empty-state">Waiting for the host to set up the game...</p>
      </section>
    );
  }

  return (
    <section className="panel stack">
      <div style={{ borderBottom: '1px solid rgba(85,58,26,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem' }}>Step 1: Real-time Sync (Optional)</h2>
        <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
          Status: <strong>{syncStatus}</strong>
        </p>
        <div className="stack" style={{ marginTop: '0.5rem', gap: '0.5rem' }}>
          <input 
            placeholder="Enter Host's Sync ID" 
            value={targetPeerId}
            onChange={e => setTargetPeerId(e.target.value)}
            style={{ fontSize: '0.9rem' }}
          />
          <button 
            className="button--ghost"
            onClick={() => connectToHost(targetPeerId)} 
            style={{ padding: '0.5rem' }}
          >
            Link to Host
          </button>
        </div>
        <p style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '0.5rem' }}>
          Linking lets you see new numbers in real-time.
        </p>
      </div>

      <h2>Step 2: Who are you?</h2>
      <p className="lede">Pick your name to see your Bingo card and join the game.</p>
      
      <div className="roster__list" style={{ marginTop: '1rem' }}>
        {session.players.map((player) => (
          <button 
            key={player.id} 
            className="roster__item" 
            style={{ 
              width: '100%', 
              textAlign: 'left', 
              background: 'white', 
              color: '#2c231e', 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            onClick={() => setLocalPlayerId(player.id)}
          >
            <span style={{ fontWeight: 600 }}>{player.name}</span>
            {player.id === session.hostId && <small style={{ opacity: 0.6 }}> (Host)</small>}
          </button>
        ))}
      </div>
      
      <p style={{ fontSize: '0.75rem', opacity: 0.7, textAlign: 'center', marginTop: '1rem' }}>
        Don't see your name? Ask the host to add you.
      </p>
    </section>
  );
}
