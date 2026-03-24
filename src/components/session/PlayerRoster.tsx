import { useSession } from '../../features/session/session-provider';

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
          {session.players.map((player) => (
            <li key={player.id} className="roster__item">
              <span>{player.name}</span>
              {player.id === session.hostId ? <strong>Host</strong> : null}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
