import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearSession, loadSession, saveSession } from './session-storage';
import type { SessionState } from './session-types';

describe('session storage', () => {
  const snapshot: SessionState = {
    schemaVersion: 1,
    sessionId: 'session-1',
    status: 'lobby',
    hostId: 'player-1',
    players: [{ id: 'player-1', name: 'Host', joinedAt: 1 }],
    createdAt: 1,
    updatedAt: 2,
  };

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('saves and loads a versioned session snapshot', () => {
    saveSession(snapshot);

    expect(localStorage.getItem('bingo.session.v1')).toBe(JSON.stringify(snapshot));
    expect(loadSession()).toEqual(snapshot);
  });

  it('returns null for malformed or mismatched payloads', () => {
    localStorage.setItem('bingo.session.v1', '{bad json');
    expect(loadSession()).toBeNull();

    localStorage.setItem(
      'bingo.session.v1',
      JSON.stringify({ ...snapshot, schemaVersion: 2 }),
    );
    expect(loadSession()).toBeNull();
  });

  it('clears the stored snapshot', () => {
    saveSession(snapshot);
    clearSession();

    expect(localStorage.getItem('bingo.session.v1')).toBeNull();
  });
});
