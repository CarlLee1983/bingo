import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  createInitialSession,
  sessionReducer,
} from './session-reducer';
import { clearSession, loadSession, saveSession } from './session-storage';
import type { SessionState } from './session-types';

type SessionContextValue = {
  session: SessionState;
  createSession(hostName: string): void;
  addPlayer(name: string): void;
  resetSession(): void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function initializeSession(): SessionState {
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
      resetSession() {
        clearSession();
        dispatch({ type: 'session/reset' });
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
