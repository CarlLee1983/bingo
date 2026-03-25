import { useSession } from '../../features/session/session-provider';
import { BingoCard } from './BingoCard';

export function PlayerRoster() {
  const { session } = useSession();

  return (
    <section className="roster">
      <div className="panel__header">
        <h2>Player roster</h2>
        <p>{session.players.length} player(s)</p>
      </div>

      {session.players.length === 0 ? (
        <p className="empty-state">No players yet. Create the session to begin.</p>
      ) : (
        <ol className="roster__list" data-testid="player-roster">
          {session.players.map((player) => {
            const isWinner = session.winners.includes(player.id);
            return (
              <li 
                key={player.id} 
                className={`roster__item ${session.status === 'active' ? 'roster__item--active' : ''} ${isWinner ? 'roster__item--winner' : ''}`}
              >
                <div className="roster__item-header">
                  <span>{player.name}</span>
                  {player.id === session.hostId ? <strong>Host</strong> : null}
                  {isWinner && <strong style={{ color: '#8c5b17' }}>Winner!</strong>}
                </div>
                
                {session.status === 'active' && session.cards[player.id] && (
                  <BingoCard 
                    grid={session.cards[player.id]} 
                    calledNumbers={session.calledNumbers}
                  />
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
