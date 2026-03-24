import { FormEvent, useState } from 'react';
import { useSession } from '../../features/session/session-provider';

export function HostPanel() {
  const { createSession, addPlayer, resetSession, session } = useSession();
  const [hostName, setHostName] = useState('');
  const [playerName, setPlayerName] = useState('');

  function handleCreateSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createSession(hostName);
    setPlayerName('');
  }

  function handleAddPlayer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addPlayer(playerName);
    setPlayerName('');
  }

  return (
    <section className="host-panel">
      <form className="stack" onSubmit={handleCreateSession}>
        <label className="field">
          <span>Host name</span>
          <input
            aria-label="Host name"
            value={hostName}
            onChange={(event) => setHostName(event.currentTarget.value)}
            placeholder="Enter host name"
          />
        </label>
        <button type="submit">Create session</button>
      </form>

      <form className="stack" onSubmit={handleAddPlayer}>
        <label className="field">
          <span>Player name</span>
          <input
            aria-label="Player name"
            value={playerName}
            onChange={(event) => setPlayerName(event.currentTarget.value)}
            placeholder="Add a player"
          />
        </label>
        <button type="submit" disabled={!session.hostId}>
          Add player
        </button>
      </form>

      <button className="button--ghost" type="button" onClick={resetSession}>
        Reset session
      </button>
    </section>
  );
}
