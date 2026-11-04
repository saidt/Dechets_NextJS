"use client";

import { useEffect, useState } from "react";

/**
 * useState backed by sessionStorage (e.g. the selected tab of a page).
 *
 * Client components are also rendered on the server for a full page load, where
 * sessionStorage does not exist. So the first render always uses defaultValue
 * (same on server and client, no hydration mismatch); the stored value is read
 * after mount, and every change is written back.
 */
export function useSessionStorageState(key: string, defaultValue: string) {
  const [value, setValue] = useState<string>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        setValue(stored);
      }
    }
    catch {
      // storage unavailable (private mode, blocked): keep defaultValue
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return; // don't overwrite the stored value with defaultValue before it is read
    try {
      sessionStorage.setItem(key, value);
    }
    catch {
      // storage unavailable: nothing to persist
    }
  }, [key, value, loaded]);

  return [value, setValue] as const;
}
