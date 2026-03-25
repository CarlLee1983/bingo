import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  createInitialSession,
  sessionReducer,
} from './session-reducer';
import { clearSession, loadSession, saveSession } from './session-storage';
import { decodeSessionFromUrl } from './session-sharing';
import type { SessionState } from './session-types';

type SessionContextValue = {
  session: SessionState;
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

  useEffect(() => {
    saveSession(session);
  }, [session]);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
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
        dispatch({ type: 'session/reset' });
      },
      loadSessionFromSnapshot(snapshot: SessionState) {
        dispatch({ type: 'session/load', snapshot });
      },
    }),
    [session],
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
