import React from 'react';
import { useSession } from '../../features/session/session-provider';

export const CallHistory: React.FC = () => {
  const { session } = useSession();
  const { calledNumbers } = session;

  const latest = calledNumbers.length > 0 ? calledNumbers[calledNumbers.length - 1] : null;
  
  // Generate 1-75 for the master board
  const masterNumbers = Array.from({ length: 75 }, (_, i) => i + 1);

  if (calledNumbers.length === 0) {
    return (
      <div className="call-history" style={{ textAlign: 'center', padding: '2rem' }}>
        <p className="empty-state" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
          🛸 準備就緒，等待開號...
        </p>
      </div>
    );
  }

  return (
    <div className="call-history">
      <div className="stack" style={{ alignItems: 'center', gap: '3rem' }}>
        {/* Massive Latest Ball */}
        <div style={{ position: 'relative', padding: '1rem' }}>
          <div className="call-history__item--latest">
            {latest}
          </div>
        </div>

        {/* Master Board (1-75 Grid) */}
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <p className="eyebrow" style={{ margin: 0 }}>Number Master Board</p>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 900 }}>
              {calledNumbers.length} / 75
            </span>
          </div>
          
          <div className="master-board">
            {masterNumbers.map((num) => {
              const isCalled = calledNumbers.includes(num);
              const isLatest = num === latest;
              
              return (
                <div 
                  key={num} 
                  className={`master-board__cell ${isCalled ? 'master-board__cell--called' : ''} ${isLatest ? 'master-board__cell--latest' : ''}`}
                >
                  {num}
                </div>
              );
            })}
          </div>
          
          <p style={{ 
            marginTop: '1.5rem', 
            fontSize: '0.7rem', 
            fontFamily: 'var(--font-mono)', 
            textAlign: 'center', 
            opacity: 0.6,
            fontWeight: 700 
          }}>
            PANEL CONTROL v1.0 // ALL NUMBERS SYNCED
          </p>
        </div>
      </div>
    </div>
  );
};
