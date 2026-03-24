import type { Player, SessionAction, SessionState } from './session-types';

function createId() {
  return crypto.randomUUID();
}

function createPlayer(name: string, joinedAt: number): Player {
  return {
    id: createId(),
    name: name.trim() || 'Player',
    joinedAt,
  };
}

export function createInitialSession(): SessionState {
  const now = Date.now();

  return {
    schemaVersion: 1,
    sessionId: createId(),
    status: 'lobby',
    hostId: null,
    players: [],
    createdAt: now,
    updatedAt: now,
  };
}

function createSession(hostName: string): SessionState {
  const now = Date.now();
  const host = createPlayer(hostName, now);

  return {
    schemaVersion: 1,
    sessionId: createId(),
    status: 'lobby',
    hostId: host.id,
    players: [host],
    createdAt: now,
    updatedAt: now,
  };
}

function addPlayer(state: SessionState, name: string): SessionState {
  const now = Date.now();

  return {
    ...state,
    updatedAt: now,
    players: state.players.concat(createPlayer(name, now)),
  };
}

export function sessionReducer(
  state: SessionState,
  action: SessionAction,
): SessionState {
  switch (action.type) {
    case 'session/create':
      return createSession(action.hostName);
    case 'player/add':
      return addPlayer(state, action.name);
    case 'session/reset':
      return createInitialSession();
    case 'session/load':
      return action.snapshot;
    default:
      return state;
  }
}
