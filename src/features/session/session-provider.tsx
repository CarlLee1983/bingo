import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import {
  createInitialSession,
  sessionReducer,
} from './session-reducer';
import { clearSession, loadSession, saveSession, getLocalPlayerId, saveLocalPlayerId } from './session-storage';
import { decodeSessionFromUrl } from './session-sharing';
import { syncService } from './sync-service';
import type { SessionState } from './session-types';

type SessionContextValue = {
  session: SessionState;
  localPlayerId: string | null;
  peerId: string | null;
  syncStatus: string;
  setLocalPlayerId(id: string | null): void;
  connectToHost(hostPeerId: string): void;
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
  const [peerId, setPeerId] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>('Initializing sync...');

  const setLocalPlayerId = (id: string | null) => {
    setLocalPlayerIdState(id);
    saveLocalPlayerId(id);
  };

  // Initialize Sync Service
  useEffect(() => {
    syncService.init(
      (remoteState) => dispatch({ type: 'session/load', snapshot: remoteState }),
      (status) => setSyncStatus(status)
    ).then(id => {
      setPeerId(id);
      
      // Auto-connect if 'p' param exists
      const urlParams = new URLSearchParams(window.location.search);
      const hostPeerId = urlParams.get('p');
      if (hostPeerId) {
        syncService.connectToHost(hostPeerId);
      }

      // Cleanup URL params once processed
      const url = new URL(window.location.href);
      if (url.searchParams.has('s') || url.searchParams.has('p')) {
        url.searchParams.delete('s');
        url.searchParams.delete('p');
        window.history.replaceState({}, '', url.toString());
      }
    });

    return () => syncService.destroy();
  }, []);

  useEffect(() => {
    saveSession(session);
    
    // Auto-clear local identity if player is no longer in the session
    if (localPlayerId && !session.players.some(p => p.id === localPlayerId)) {
      setLocalPlayerId(null);
    }
    
    // Auto-assign host identity if we are the one who created it
    if (session.hostId && !localPlayerId && session.players.length === 1 && session.players[0].id === session.hostId) {
      setLocalPlayerId(session.hostId);
    }

    // HOST BROADCAST: If I am the host, broadcast my state to all connected players
    if (session.hostId && localPlayerId === session.hostId) {
      syncService.broadcast(session);
    }
  }, [session, localPlayerId]);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      localPlayerId,
      peerId,
      syncStatus,
      setLocalPlayerId,
      connectToHost(hostPeerId: string) {
        syncService.connectToHost(hostPeerId);
      },
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
    [session, localPlayerId, peerId, syncStatus],
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
