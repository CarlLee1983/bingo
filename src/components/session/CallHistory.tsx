import React from 'react';
import { useSession } from '../../features/session/session-provider';

export const CallHistory: React.FC = () => {
  const { session } = useSession();
  const { calledNumbers } = session;

  if (calledNumbers.length === 0) {
    return (
      <div className="panel call-history">
        <p className="empty-state">No numbers called yet.</p>
      </div>
    );
  }

  // Show last 25 numbers in history
  const history = [...calledNumbers].reverse().slice(0, 25);
  const latest = history[0];

  return (
    <div className="panel call-history">
      <div className="panel__header">
        <h2>Call History</h2>
        <p>{calledNumbers.length} total calls</p>
      </div>
      
      <div className="stack">
        <div className="hero" style={{ textAlign: 'center' }}>
          <p className="eyebrow">Latest Call</p>
          <div style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1 }}>
            {latest}
          </div>
        </div>

        <ul className="call-history__list">
          {history.map((num, idx) => (
            <li 
              key={`${num}-${idx}`} 
              className={`call-history__item ${idx === 0 ? 'call-history__item--latest' : ''}`}
            >
              {num}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
