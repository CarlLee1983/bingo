import type { SessionState } from './session-types';

/**
 * Encodes a SessionState object into a URI-safe Base64 string.
 */
export function encodeSessionToUrl(state: SessionState): string {
  try {
    const json = JSON.stringify(state);
    // Use btoa with URI encoding to handle potential unicode and special characters
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
    const parsed = JSON.parse(json);
    
    // Basic structural check (could be more rigorous)
    if (parsed && typeof parsed === 'object' && parsed.schemaVersion === 1) {
      return parsed as SessionState;
    }
    return null;
  } catch (error) {
    console.error('Failed to decode session:', error);
    return null;
  }
}

/**
 * Generates a full shareable URL for the current session.
 */
export function getShareableUrl(state: SessionState): string {
  const encoded = encodeSessionToUrl(state);
  const url = new URL(window.location.href);
  url.searchParams.set('s', encoded);
  return url.toString();
}
