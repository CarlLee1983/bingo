import type { SessionState } from './session-types';

export const SESSION_STORAGE_KEY = 'bingo.session.v1';
export const LOCAL_PLAYER_ID_KEY = 'bingo.local_player_id.v1';

function hasValidSnapshotShape(value: unknown): value is SessionState {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const snapshot = value as Partial<SessionState> & { players?: unknown; cards?: unknown };

  return (
    snapshot.schemaVersion === 1 &&
    typeof snapshot.sessionId === 'string' &&
    (snapshot.status === 'lobby' || snapshot.status === 'active') &&
    (snapshot.hostId === null || typeof snapshot.hostId === 'string') &&
    Array.isArray(snapshot.players) &&
    typeof snapshot.cards === 'object' &&
    snapshot.cards !== null &&
    Array.isArray(snapshot.calledNumbers) &&
    Array.isArray(snapshot.winners) &&
    (snapshot.winningPattern === null || typeof snapshot.winningPattern === 'string') &&
    Array.isArray(snapshot.activePatternIds) &&
    typeof snapshot.createdAt === 'number' &&
    typeof snapshot.updatedAt === 'number'
  );
}

export function loadSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!hasValidSnapshotShape(parsed)) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn('LocalStorage error during loadSession:', error);
    return null;
  }
}

export function saveSession(snapshot: SessionState): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (error) {
    console.warn('LocalStorage error during saveSession:', error);
  }
}

export function saveLocalPlayerId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(LOCAL_PLAYER_ID_KEY, id);
    } else {
      localStorage.removeItem(LOCAL_PLAYER_ID_KEY);
    }
  } catch (error) {
    console.warn('LocalStorage error during saveLocalPlayerId:', error);
  }
}

export function getLocalPlayerId(): string | null {
  try {
    return localStorage.getItem(LOCAL_PLAYER_ID_KEY);
  } catch (error) {
    console.warn('LocalStorage error during getLocalPlayerId:', error);
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(LOCAL_PLAYER_ID_KEY);
  } catch (error) {
    console.warn('LocalStorage error during clearSession:', error);
  }
}
