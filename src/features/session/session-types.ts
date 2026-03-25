export type SessionStatus = 'lobby' | 'active';

export type Player = {
  id: string;
  name: string;
  joinedAt: number;
};

export type BingoCardGrid = (number | 'FREE')[][];

export type WinPattern = {
  id: string;
  label: string;
  squares: [number, number][]; // [row, col]
};

export type SessionState = {
  schemaVersion: 1;
  sessionId: string;
  status: SessionStatus;
  hostId: string | null;
  players: Player[];
  cards: Record<string, BingoCardGrid>;
  calledNumbers: number[];
  winners: string[];
  winningPattern: string | null;
  activePatternIds: string[];
  createdAt: number;
  updatedAt: number;
};

export type SessionAction =
  | { type: 'session/create'; hostName: string }
  | { type: 'player/add'; name: string }
  | { type: 'player/reroll-card'; playerId: string }
  | { type: 'session/start' }
  | { type: 'session/draw' }
  | { type: 'session/restart' }
  | { type: 'session/reset' }
  | { type: 'session/load'; snapshot: SessionState };
