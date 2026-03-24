import { useSession } from '../../features/session/session-provider';

export function SessionStatus() {
  const { session } = useSession();

  return (
    <section className="session-status">
      <div>
        <p className="eyebrow">Session status</p>
        <h2 data-testid="session-status-value">{session.status}</h2>
      </div>

      <dl className="status-grid">
        <div>
          <dt>Session ID</dt>
          <dd data-testid="session-id">{session.sessionId}</dd>
        </div>
        <div>
          <dt>Players</dt>
          <dd data-testid="player-count">{session.players.length}</dd>
        </div>
      </dl>
    </section>
  );
}
