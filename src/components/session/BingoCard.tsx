import React, { useState, useEffect, useMemo } from 'react';
import type { BingoCardGrid } from '../../features/session/session-types';
import { isSquareMarked, detectWinningLines } from '../../features/session/win-detection';
import { WIN_PATTERNS } from '../../features/session/win-patterns';

interface BingoCardProps {
  grid: BingoCardGrid;
  calledNumbers: number[];
}

const HEADERS = ['B', 'I', 'N', 'G', 'O'];

export const BingoCard: React.FC<BingoCardProps> = ({ grid, calledNumbers }) => {
  const [userMarked, setUserMarked] = useState<Set<number | 'FREE'>>(new Set());
  const [isVisible, setIsVisible] = useState(false);

  // Detect all winning patterns based on both host and player marks
  const winningPatterns = useMemo(() => {
    return detectWinningLines(grid, calledNumbers, Object.values(WIN_PATTERNS), userMarked);
  }, [grid, calledNumbers, userMarked]);

  // Set of all square coordinates that are part of a winning pattern
  const winningSquares = useMemo(() => {
    const set = new Set<string>();
    winningPatterns.forEach(id => {
      WIN_PATTERNS[id].squares.forEach(([r, c]) => {
        set.add(`${r}-${c}`);
      });
    });
    return set;
  }, [winningPatterns]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="bingo-card" style={{ 
      opacity: isVisible ? 1 : 0, 
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
    }}>
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
            const isWin = winningSquares.has(`${rowIndex}-${colIndex}`);
            
            return (
              <div 
                key={`${rowIndex}-${colIndex}`} 
                onClick={() => toggleMark(cell)}
                className={`bingo-card__cell 
                  ${cell === 'FREE' ? 'bingo-card__cell--free' : ''} 
                  ${hostMarked ? 'bingo-card__cell--marked' : ''} 
                  ${playerMarked && !hostMarked ? 'bingo-card__cell--user-marked' : ''}
                  ${isWin ? 'bingo-card__cell--win' : ''}
                `}
                style={{
                  transitionDelay: `${(rowIndex * 5 + colIndex) * 20}ms`
                }}
              >
                {cell === 'FREE' ? 'FREE\nSPACE' : cell}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};
