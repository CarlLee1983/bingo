import React from 'react';
import type { BingoCardGrid } from '../../features/session/session-types';
import { isSquareMarked } from '../../features/session/win-detection';

interface BingoCardProps {
  grid: BingoCardGrid;
  calledNumbers: number[];
}

const HEADERS = ['B', 'I', 'N', 'G', 'O'];

export const BingoCard: React.FC<BingoCardProps> = ({ grid, calledNumbers }) => {
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
            const marked = isSquareMarked(cell, calledNumbers);
            return (
              <div 
                key={`${rowIndex}-${colIndex}`} 
                className={`bingo-card__cell ${cell === 'FREE' ? 'bingo-card__cell--free' : ''} ${marked ? 'bingo-card__cell--marked' : ''}`}
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
