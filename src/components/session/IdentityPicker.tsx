import { useSession } from '../../features/session/session-provider';

export function IdentityPicker() {
  const { session, setLocalPlayerId } = useSession();

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
      <h2>Who are you?</h2>
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
              color: '#2c231e', // Ensure text is dark on white background
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
