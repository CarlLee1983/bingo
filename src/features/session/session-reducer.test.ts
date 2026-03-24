import { describe, expect, it, vi } from 'vitest';
import {
  createInitialSession,
  sessionReducer,
} from './session-reducer';

describe('sessionReducer', () => {
  it('creates a new lobby session with a seeded host', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

    const next = sessionReducer(createInitialSession(), {
      type: 'session/create',
      hostName: ' Alice ',
    });

    expect(next.schemaVersion).toBe(1);
    expect(next.sessionId).toEqual(expect.any(String));
    expect(next.sessionId).not.toHaveLength(0);
    expect(next.status).toBe('lobby');
    expect(next.hostId).toEqual(expect.any(String));
    expect(next.players).toHaveLength(1);
    expect(next.players[0]).toMatchObject({
      name: 'Alice',
      joinedAt: 1_700_000_000_000,
    });
    expect(next.players[0].id).toBe(next.hostId);
    expect(next.createdAt).toBe(1_700_000_000_000);
    expect(next.updatedAt).toBe(1_700_000_000_000);
  });

  it('adds a new player without replacing the roster', () => {
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(1_700_000_000_000)
      .mockReturnValueOnce(1_700_000_000_100)
      .mockReturnValueOnce(1_700_000_000_200);

    const created = sessionReducer(createInitialSession(), {
      type: 'session/create',
      hostName: 'Host',
    });
    const next = sessionReducer(created, {
      type: 'player/add',
      name: ' Bob ',
    });

    expect(next.players).toHaveLength(2);
    expect(next.players[0]).toMatchObject({ name: 'Host' });
    expect(next.players[0].id).toBe(created.hostId);
    expect(next.players[1]).toMatchObject({
      name: 'Bob',
      joinedAt: 1_700_000_000_200,
    });
    expect(next.players[1].id).toEqual(expect.any(String));
    expect(next.hostId).toBe(created.hostId);
  });

  it('resets to a brand new lobby session', () => {
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(1_700_000_000_000)
      .mockReturnValueOnce(1_700_000_000_100)
      .mockReturnValueOnce(1_700_000_001_000);

    const created = sessionReducer(createInitialSession(), {
      type: 'session/create',
      hostName: 'Host',
    });
    const next = sessionReducer(created, { type: 'session/reset' });

    expect(next.schemaVersion).toBe(1);
    expect(next.sessionId).toEqual(expect.any(String));
    expect(next.sessionId).not.toBe(created.sessionId);
    expect(next.status).toBe('lobby');
    expect(next.hostId).toBeNull();
    expect(next.players).toEqual([]);
    expect(next.createdAt).toBe(1_700_000_001_000);
    expect(next.updatedAt).toBe(1_700_000_001_000);
  });
});
