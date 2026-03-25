import React, { useState } from 'react';
import type { BingoCardGrid } from '../../features/session/session-types';
import { isSquareMarked } from '../../features/session/win-detection';

interface BingoCardProps {
  grid: BingoCardGrid;
  calledNumbers: number[];
}

const HEADERS = ['B', 'I', 'N', 'G', 'O'];

export const BingoCard: React.FC<BingoCardProps> = ({ grid, calledNumbers }) => {
  // Local state for manual marking (player's device only)
  const [userMarked, setUserMarked] = useState<Set<number | 'FREE'>>(new Set());

  const toggleMark = (cell: number | 'FREE') => {
    setUserMarked(prev => {
      const next = new Set(prev);
      if (next.has(cell)) {
        next.delete(cell);
      } else {
        next.add(cell);
      }
      return next;
    });
  };

  return (
    <div className="bingo-card">
      {HEADERS.map(h => (
        <div key={h} className="bingo-card__header">
          {h}
        </div>
      ))}
      
      {grid.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((cell, colIndex) => {
            const hostMarked = isSquareMarked(cell, calledNumbers);
            const playerMarked = userMarked.has(cell);
            
            return (
              <div 
                key={`${rowIndex}-${colIndex}`} 
                onClick={() => toggleMark(cell)}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                className={`bingo-card__cell ${cell === 'FREE' ? 'bingo-card__cell--free' : ''} ${hostMarked ? 'bingo-card__cell--marked' : ''} ${playerMarked && !hostMarked ? 'bingo-card__cell--user-marked' : ''}`}
              >
                {cell}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};
