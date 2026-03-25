import type { Player, SessionAction, SessionState, BingoCardGrid } from './session-types';
import { generateCardGrid } from './card-generator';
import { checkWin } from './win-detection';
import { WIN_PATTERNS, STANDARD_PATTERN_IDS } from './win-patterns';

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
    cards: {},
    calledNumbers: [],
    winners: [],
    winningPattern: null,
    activePatternIds: STANDARD_PATTERN_IDS,
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
    cards: {},
    calledNumbers: [],
    winners: [],
    winningPattern: null,
    activePatternIds: STANDARD_PATTERN_IDS,
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

function startGame(state: SessionState): SessionState {
  const now = Date.now();
  const cards: Record<string, BingoCardGrid> = {};

  state.players.forEach(player => {
    cards[player.id] = generateCardGrid();
  });

  return {
    ...state,
    status: 'active',
    cards,
    calledNumbers: [],
    winners: [],
    winningPattern: null,
    updatedAt: now,
  };
}

function drawNumber(state: SessionState): SessionState {
  if (state.status !== 'active' || state.winners.length > 0) {
    return state;
  }

  const now = Date.now();
  const pool = Array.from({ length: 75 }, (_, i) => i + 1)
    .filter(n => !state.calledNumbers.includes(n));

  if (pool.length === 0) {
    return state;
  }

  const randomIndex = Math.floor(Math.random() * pool.length);
  const nextNumber = pool[randomIndex];
  const nextCalledNumbers = state.calledNumbers.concat(nextNumber);

  // Check for winners using the active pattern set from state
  const winners: string[] = [];
  let winningPattern: string | null = null;
  const activePatterns = state.activePatternIds.map(id => WIN_PATTERNS[id]);

  Object.entries(state.cards).forEach(([playerId, grid]) => {
    const patternId = checkWin(grid, nextCalledNumbers, activePatterns);
    if (patternId) {
      winners.push(playerId);
      winningPattern = patternId; // Use the first found pattern ID for now
    }
  });

  return {
    ...state,
    calledNumbers: nextCalledNumbers,
    winners,
    winningPattern,
    updatedAt: now,
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
    case 'session/start':
      return startGame(state);
    case 'session/draw':
      return drawNumber(state);
    case 'session/reset':
      return createInitialSession();
    case 'session/load':
      return action.snapshot;
    default:
      return state;
  }
}
