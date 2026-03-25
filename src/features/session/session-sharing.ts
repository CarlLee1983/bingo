import type { SessionState } from './session-types';

// Map long keys to short keys for URL compression
const KEY_MAP: Record<string, string> = {
  schemaVersion: 'v',
  sessionId: 'i',
  status: 's',
  hostId: 'h',
  players: 'p',
  cards: 'c',
  calledNumbers: 'n',
  winners: 'w',
  winningPattern: 't',
  activePatternIds: 'a',
  createdAt: 'cr',
  updatedAt: 'u',
};

const REV_KEY_MAP = Object.fromEntries(
  Object.entries(KEY_MAP).map(([k, v]) => [v, k])
);

function minifyState(state: any) {
  const minified: any = {};
  for (const key in state) {
    const shortKey = KEY_MAP[key] || key;
    minified[shortKey] = state[key];
  }
  return minified;
}

function expandState(minified: any) {
  const expanded: any = {};
  for (const shortKey in minified) {
    const key = REV_KEY_MAP[shortKey] || shortKey;
    expanded[key] = minified[shortKey];
  }
  return expanded;
}

/**
 * Encodes a SessionState object into a URI-safe Base64 string.
 */
export function encodeSessionToUrl(state: SessionState): string {
  try {
    // Only encode essential state for sharing to keep URL short
    // We can omit timestamps if needed, but for now we just minify keys
    const minified = minifyState(state);
    const json = JSON.stringify(minified);
    return btoa(encodeURIComponent(json));
  } catch (error) {
    console.error('Failed to encode session:', error);
    return '';
  }
}

/**
 * Decodes a URI-safe Base64 string back into a SessionState object.
 */
export function decodeSessionFromUrl(encoded: string): SessionState | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const minified = JSON.parse(json);
    const expanded = expandState(minified);
    
    // Basic structural check
    if (expanded && typeof expanded === 'object' && (expanded.schemaVersion === 1 || expanded.v === 1)) {
      return expanded as SessionState;
    }
    return null;
  } catch (error) {
    console.error('Failed to decode session:', error);
    return null;
  }
}

/**
 * Generates a full shareable URL for the current session.
 * Optionally includes a peerId for real-time sync.
 */
export function getShareableUrl(state: SessionState, peerId?: string | null): string {
  const encoded = encodeSessionToUrl(state);
  const url = new URL(window.location.href);
  url.searchParams.set('s', encoded);
  if (peerId) {
    url.searchParams.set('p', peerId);
  }
  return url.toString();
}
