import React from 'react';
import { useSoundToggle } from '../../hooks/useSoundToggle';

export interface NumberControlPanelProps {
  latestNumber: number | null;
  totalNumbers: number;
  onDrawNumber: () => void;
  onRestart?: () => void;
  disabled?: boolean;
}

export const NumberControlPanel: React.FC<NumberControlPanelProps> = ({
  latestNumber,
  totalNumbers,
  onDrawNumber,
  onRestart,
  disabled = false,
}) => {
  const { muted, toggle } = useSoundToggle();

  return (
    <div className="number-control-panel">
      <div className="number-control-panel__display">
        <div className="number-control-panel__label">Latest</div>
        <div className="number-control-panel__number">
          {latestNumber ?? '-'}
        </div>
      </div>
      <button
        className="number-control-panel__button"
        onClick={onDrawNumber}
        disabled={disabled}
        type="button"
      >
        Draw
      </button>

      {onRestart && (
        <button
          className="number-control-panel__button"
          onClick={onRestart}
          type="button"
          style={{ background: 'var(--neon-pink)', color: 'white', marginTop: '4px', fontSize: '10px', padding: '4px' }}
        >
          Restart
        </button>
      )}

      <div style={{ fontSize: '9px', color: '#999', textAlign: 'center', marginTop: '4px' }}>
        {totalNumbers} / 75
      </div>
      <button
        className="number-control-panel__mute-button"
        onClick={toggle}
        type="button"
        title={muted ? '開啟音效' : '關閉音效'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
};
