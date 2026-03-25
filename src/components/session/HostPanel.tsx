import { FormEvent, useState } from 'react';
import { useSession } from '../../features/session/session-provider';
import { getShareableUrl } from '../../features/session/session-sharing';

export function HostPanel() {
  const { createSession, addPlayer, startSession, drawNumber, restartSession, resetSession, session, peerId } = useSession();
  const [hostName, setHostName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');
  const [showQRCode, setShowQRCode] = useState(false);

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

  function handleShare() {
    const url = getShareableUrl(session, peerId);
    navigator.clipboard.writeText(url).then(() => {
      setShareStatus('copied');
      setShowQRCode(true);
      setTimeout(() => setShareStatus('idle'), 2000);
    });
  }

  const shareUrl = getShareableUrl(session, peerId);
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

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
          
          {(session.winners.length > 0 || session.calledNumbers.length >= 75) && (
            <div className="stack" style={{ marginTop: '1rem' }}>
              <p className="empty-state" style={{ textAlign: 'center' }}>Game ended. A winner has been found!</p>
              <button 
                type="button" 
                onClick={restartSession}
                style={{ background: 'var(--neon-cyan)', color: 'var(--deep-ink)' }}
              >
                Quick Restart (Keep Cards)
              </button>
            </div>
          )}
        </div>
      )}

      <div className="stack" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(85,58,26,0.1)' }}>
        <button 
          className="button--primary" 
          type="button" 
          onClick={handleShare}
          disabled={!session.hostId}
        >
          {shareStatus === 'copied' ? 'Link Copied!' : 'Share Session Link'}
        </button>

        {showQRCode && (
          <div className="stack" style={{ alignItems: 'center', marginTop: '1rem' }}>
            <div style={{ background: 'white', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <img 
                src={qrCodeApiUrl} 
                alt="Session QR Code" 
                style={{ display: 'block', width: '160px', height: '160px' }}
              />
            </div>
            <p style={{ fontSize: '0.75rem', opacity: 0.8, textAlign: 'center', margin: '0.5rem 0' }}>
              Friends can scan this code to join!
            </p>
            <button 
              className="button--ghost" 
              style={{ padding: '4px 12px', fontSize: '0.7rem' }}
              onClick={() => setShowQRCode(false)}
            >
              Hide QR Code
            </button>
          </div>
        )}

        <p style={{ fontSize: '0.75rem', opacity: 0.7, textAlign: 'center' }}>
          Copy this link for others to join. Scan the link to sync players & cards.
        </p>
      </div>

      <button className="button--ghost" type="button" onClick={resetSession} style={{ marginTop: '2rem' }}>
        Reset session
      </button>
    </section>
  );
}
