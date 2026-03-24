export type SessionStatus = 'lobby' | 'active';

export type Player = {
  id: string;
  name: string;
  joinedAt: number;
};

export type SessionState = {
  schemaVersion: 1;
  sessionId: string;
  status: SessionStatus;
  hostId: string | null;
  players: Player[];
  createdAt: number;
  updatedAt: number;
};

export type SessionAction =
  | { type: 'session/create'; hostName: string }
  | { type: 'player/add'; name: string }
  | { type: 'session/reset' }
  | { type: 'session/load'; snapshot: SessionState };
