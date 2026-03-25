import { FormEvent, useState } from 'react';
import { useSession } from '../../features/session/session-provider';

export function HostPanel() {
  const { createSession, addPlayer, startSession, resetSession, session } = useSession();
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
      {session.status === 'lobby' && (
        <>
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

          <button 
            type="button" 
            onClick={startSession} 
            disabled={session.players.length === 0}
          >
            Start Game
          </button>
        </>
      )}

      {session.status === 'active' && (
        <div className="stack">
          <button 
            type="button" 
            onClick={drawNumber}
            disabled={session.winners.length > 0 || session.calledNumbers.length >= 75}
          >
            Draw Next Number
          </button>
          
          {session.winners.length > 0 && (
            <p className="empty-state">Game ended. A winner has been found!</p>
          )}
        </div>
      )}

      <button className="button--ghost" type="button" onClick={resetSession}>
        Reset session
      </button>
    </section>
  );
}
