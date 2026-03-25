import type { SessionState } from './session-types';

export const SESSION_STORAGE_KEY = 'bingo.session.v1';

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
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!hasValidSnapshotShape(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(snapshot: SessionState): void {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
