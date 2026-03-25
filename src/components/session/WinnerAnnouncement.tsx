import React from 'react';
import { useSession } from '../../features/session/session-provider';
import { WIN_PATTERNS } from '../../features/session/win-patterns';

export const WinnerAnnouncement: React.FC = () => {
  const { session } = useSession();
  const { winners, players, winningPattern: winningPatternId } = session;

  if (winners.length === 0 || !winningPatternId) {
    return null;
  }

  const winnerNames = winners
    .map(id => players.find(p => p.id === id)?.name)
    .filter(Boolean)
    .join(', ');

  const patternLabel = WIN_PATTERNS[winningPatternId]?.label || winningPatternId;

  return (
    <div className="winner-banner" style={{ 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h2>🎉 BINGO!</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
          <strong>{winnerNames}</strong>
        </p>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>
          Won with a <strong>{patternLabel}</strong>!
        </p>
      </div>
      
      {/* Decorative rays */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '200%',
        height: '200%',
        background: 'conic-gradient(from 0deg, transparent 0deg 20deg, rgba(255,255,255,0.1) 20deg 40deg, transparent 40deg)',
        animation: 'rotateRays 20s linear infinite',
        transform: 'translate(-50%, -50%)',
        zIndex: 1
      }} />
      
      <style>{`
        @keyframes rotateRays {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
