import { useEffect, useRef } from 'react';
import { useSession } from '../../features/session/session-provider';
import { BingoCard } from './BingoCard';
import { CallHistory } from './CallHistory';
import { HostPanel } from './HostPanel';
import { WinnerAnnouncement } from './WinnerAnnouncement';
import { PlayerRoster } from './PlayerRoster';
import { NumberControlPanel } from './NumberControlPanel';
import { useSound } from '../../hooks/useSound';
import { useSoundToggle } from '../../hooks/useSoundToggle';

export function PlayerDashboard() {
  const { session, localPlayerId, setLocalPlayerId, rerollCard, drawNumber } = useSession();

  const player = session.players.find(p => p.id === localPlayerId);
  if (!player) return null;

  const isHost = localPlayerId === session.hostId;
  const isWinner = session.winners.includes(localPlayerId);
  const hasCard = !!session.cards[localPlayerId!];

  // 計算最新號碼
  const latestNumber = session.calledNumbers.length > 0
    ? session.calledNumbers[session.calledNumbers.length - 1]
    : null;

  // 音效觸發邏輯
  const { muted } = useSoundToggle();
  const { playDrawSound, playWinSound } = useSound(muted);
  const prevCalledCountRef = useRef(session.calledNumbers.length);
  const prevWinnersRef = useRef(session.winners.length);

  // 骰號音效
  useEffect(() => {
    if (session.calledNumbers.length > prevCalledCountRef.current) {
      playDrawSound();
    }
    prevCalledCountRef.current = session.calledNumbers.length;
  }, [session.calledNumbers.length, playDrawSound]);

  // 贏家音效
  useEffect(() => {
    if (session.winners.length > 0 && prevWinnersRef.current === 0) {
      playWinSound();
    }
    prevWinnersRef.current = session.winners.length;
  }, [session.winners.length, playWinSound]);

  return (
    <div className="stack" style={{ gap: '1.5rem' }}>
      <WinnerAnnouncement />

      <header className="hero" style={{ textAlign: 'center' }}>
        <p className="eyebrow" style={{ background: 'var(--neon-pink)', color: 'white', padding: '2px 8px', transform: 'rotate(-1deg)', display: 'inline-block' }}>
          Player View
        </p>
        <h1>{player.name}'s Bingo</h1>
        {isHost && <div style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '0.5rem' }}>👑 YOU ARE THE HOST</div>}
      </header>

      {/* Lobby Info for Host: Show how many players are in */}
      {isHost && session.status === 'lobby' && (
        <section className="panel" style={{ background: 'var(--neon-yellow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem' }}>Current Players</h2>
            <span className="eyebrow" style={{ fontSize: '1rem', background: 'var(--deep-ink)', color: 'white', padding: '4px 12px' }}>
              {session.players.length} Total
            </span>
          </div>
          <PlayerRoster />
        </section>
      )}

      {/* Host 專用：浮動面板 */}
      {isHost && session.status === 'active' && (
        <NumberControlPanel
          latestNumber={latestNumber}
          totalNumbers={session.calledNumbers.length}
          onDrawNumber={drawNumber}
          disabled={session.winners.length > 0 || session.calledNumbers.length >= 75}
        />
      )}

      {/* Main Section for the Player's own Card */}
      <section className="panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '1.5rem', alignItems: 'center' }}>
           <h2 style={{ fontSize: '1.5rem' }}>
             {session.status === 'lobby' ? 'Card Preview' : 'Your Card'}
           </h2>
           {isWinner && <strong style={{ color: 'var(--neon-pink)', fontSize: '1.25rem' }}>🎉 YOU WIN!</strong>}
        </div>
        
        {hasCard ? (
          <div className="stack" style={{ alignItems: 'center' }}>
            <BingoCard
              grid={session.cards[localPlayerId!]}
              calledNumbers={session.calledNumbers}
              latestNumber={latestNumber}
              isHost={isHost}
            />
            
            {session.status === 'lobby' && (
              <div className="stack" style={{ marginTop: '2rem', alignItems: 'center' }}>
                <p style={{ fontWeight: 700, textAlign: 'center' }}>不滿意這張卡片嗎？</p>
                <button 
                  onClick={() => rerollCard(localPlayerId!)}
                  style={{ background: 'var(--neon-cyan)', color: 'var(--deep-ink)' }}
                >
                  🎲 重新抽卡 (Reroll)
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="empty-state">Loading your card...</p>
        )}
        
        {session.status === 'active' && (
          <p style={{ fontSize: '0.875rem', fontWeight: 800, marginTop: '1.5rem', opacity: 0.8 }}>
            👉 提示：點擊數字手動蓋章。
          </p>
        )}

        {session.status === 'lobby' && !isHost && (
          <div style={{ marginTop: '2rem', padding: '1rem', border: '3px dashed var(--deep-ink)', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontWeight: 800 }}>等候 Host 開始遊戲...</p>
          </div>
        )}
      </section>

      {/* Shared Game Information */}
      {session.status === 'active' && (
        <section className="panel" style={{ borderLeft: '8px solid var(--neon-pink)' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>叫號記錄</h2>
          <CallHistory />
        </section>
      )}

      {/* Host Controls (Only visible to the Host) */}
      {isHost && (
        <section className="panel" style={{ border: '4px solid var(--neon-pink)', background: '#fffafa' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            <span style={{ background: 'var(--neon-pink)', color: 'white', padding: '4px 12px' }}>HOST</span>
            控制台
          </h2>
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
