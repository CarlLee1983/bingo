import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import {
  createInitialSession,
  sessionReducer,
} from './session-reducer';
import { clearSession, loadSession, saveSession, getLocalPlayerId, saveLocalPlayerId } from './session-storage';
import { decodeSessionFromUrl } from './session-sharing';
import type { SessionState } from './session-types';

type SessionContextValue = {
  session: SessionState;
  localPlayerId: string | null;
  setLocalPlayerId(id: string | null): void;
  createSession(hostName: string): void;
  addPlayer(name: string): void;
  startSession(): void;
  drawNumber(): void;
  resetSession(): void;
  loadSessionFromSnapshot(snapshot: SessionState): void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function initializeSession(): SessionState {
  // Priority 1: URL snapshot for cross-device sync
  const urlParams = new URLSearchParams(window.location.search);
  const encoded = urlParams.get('s');
  if (encoded) {
    const decoded = decodeSessionFromUrl(encoded);
    if (decoded) {
      // Clear URL to prevent re-loading on manual refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('s');
      window.history.replaceState({}, '', url.toString());
      return decoded;
    }
  }

  // Priority 2: LocalStorage
  const persisted = loadSession();
  return persisted ?? createInitialSession();
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, dispatch] = useReducer(sessionReducer, undefined, initializeSession);
  const [localPlayerId, setLocalPlayerIdState] = useState<string | null>(getLocalPlayerId());

  const setLocalPlayerId = (id: string | null) => {
    setLocalPlayerIdState(id);
    saveLocalPlayerId(id);
  };

  useEffect(() => {
    saveSession(session);
    
    // Auto-clear local identity if player is no longer in the session
    if (localPlayerId && !session.players.some(p => p.id === localPlayerId)) {
      setLocalPlayerId(null);
    }
    
    // Auto-assign host identity if we are the one who created it and haven't picked someone else
    if (session.hostId && !localPlayerId && session.players.length === 1 && session.players[0].id === session.hostId) {
      setLocalPlayerId(session.hostId);
    }
  }, [session, localPlayerId]);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      localPlayerId,
      setLocalPlayerId,
      createSession(hostName: string) {
        dispatch({ type: 'session/create', hostName });
      },
      addPlayer(name: string) {
        dispatch({ type: 'player/add', name });
      },
      startSession() {
        dispatch({ type: 'session/start' });
      },
      drawNumber() {
        dispatch({ type: 'session/draw' });
      },
      resetSession() {
        clearSession();
        setLocalPlayerId(null);
        dispatch({ type: 'session/reset' });
      },
      loadSessionFromSnapshot(snapshot: SessionState) {
        dispatch({ type: 'session/load', snapshot });
      },
    }),
    [session, localPlayerId],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }

  return context;
}
