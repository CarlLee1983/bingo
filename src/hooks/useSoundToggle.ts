import { useState, useCallback } from 'react';

const STORAGE_KEY = 'bingo-sound-muted';

export function useSoundToggle() {
  const [muted, setMuted] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  const toggle = useCallback(() => {
    setMuted(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return { muted, toggle };
}
