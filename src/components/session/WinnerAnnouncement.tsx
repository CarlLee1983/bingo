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
    <div className="winner-banner">
      <h2>BINGO!</h2>
      <p>
        {winnerNames} won with a {patternLabel}!
      </p>
    </div>
  );
};
