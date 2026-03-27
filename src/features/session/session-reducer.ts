import type { Player, SessionAction, SessionState, BingoCardGrid } from './session-types';
import { generateCardGrid } from './card-generator';
import { checkWin } from './win-detection';
import { WIN_PATTERNS, STANDARD_PATTERN_IDS } from './win-patterns';

function createId() {
  // Short alphanumeric ID (8 characters)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
  return Array.from({ length: 8 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
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
  const hostCard = generateCardGrid();

  return {
    schemaVersion: 1,
    sessionId: createId(),
    status: 'lobby',
    hostId: host.id,
    players: [host],
    cards: {
      [host.id]: hostCard,
    },
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
  const player = createPlayer(name, now);
  const card = generateCardGrid();

  return {
    ...state,
    updatedAt: now,
    players: state.players.concat(player),
    cards: {
      ...state.cards,
      [player.id]: card,
    },
  };
}

function rerollPlayerCard(state: SessionState, playerId: string): SessionState {
  if (state.status !== 'lobby') return state;
  
  return {
    ...state,
    updatedAt: Date.now(),
    cards: {
      ...state.cards,
      [playerId]: generateCardGrid(),
    },
  };
}

function startGame(state: SessionState): SessionState {
  const now = Date.now();
  const cards = { ...state.cards };
  
  state.players.forEach(player => {
    if (!cards[player.id]) {
      cards[player.id] = generateCardGrid();
    }
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

function restartGame(state: SessionState): SessionState {
  const now = Date.now();

  return {
    ...state,
    status: 'active',
    calledNumbers: [],
    winners: [],
    winningPattern: null,
    updatedAt: now,
  };
}

function newRound(state: SessionState): SessionState {
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
    case 'player/reroll-card':
      return rerollPlayerCard(state, action.playerId);
    case 'session/start':
      return startGame(state);
    case 'session/restart':
      return restartGame(state);
    case 'session/new-round':
      return newRound(state);
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
