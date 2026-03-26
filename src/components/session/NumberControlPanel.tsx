import React from 'react';

export interface NumberControlPanelProps {
  latestNumber: number | null;
  totalNumbers: number;
  onDrawNumber: () => void;
  disabled?: boolean;
}

export const NumberControlPanel: React.FC<NumberControlPanelProps> = ({
  latestNumber,
  totalNumbers,
  onDrawNumber,
  disabled = false,
}) => {
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
      <div style={{ fontSize: '9px', color: '#999', textAlign: 'center' }}>
        {totalNumbers} / 75
      </div>
    </div>
  );
};
