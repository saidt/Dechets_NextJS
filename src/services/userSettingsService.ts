"use client";

import { localLog } from "@/components/logger/localLog";
import { getAllCookies } from "@/lib/html";
import { removeEmptyValues } from "@/lib/lib";
import { TableState } from "@/lib/types";

const USER_SETTINGS_KEY = process.env.NEXT_PUBLIC_CONTEXT_SETTINGS_KEY || 'userSettings'

interface UserSettings<T extends Record<string, any>> {
  tableName?: string;
  state?: TableState<T>;
  lastViewedId?: string | number;
}

const getSettings = <T extends Record<string, any>>(userId: string, tableName: string): UserSettings<T> => {
  try {
    const settings = localStorage.getItem(`${userId}-${tableName}-${USER_SETTINGS_KEY}`);
    return settings ? JSON.parse(settings) : {};
  }
  catch {
    const allCookies = getAllCookies();
    localLog("error", "Parse user settings from localStorage", allCookies, {});
    return {};
  }
};

const saveSettings = <T extends Record<string, any>>(userId: string, tableName: string, settings: UserSettings<T>): void => {
  try {
    if (settings.state?.filter) {
      const filldValues = removeEmptyValues(settings.state.filter)
      settings.state.filter = JSON.parse(JSON.stringify(filldValues))
    }
    localStorage.setItem(`${userId}-${tableName}-${USER_SETTINGS_KEY}`, JSON.stringify(settings));
  }
  catch {
    const allCookies = getAllCookies();
    localLog("error", "Save user settings to localStorage", allCookies, {});
  }
};

const deleteSettings = (userId: string, tableName: string): void => {
  try {
    localStorage.removeItem(`${userId}-${tableName}-${USER_SETTINGS_KEY}`);
  }
  catch {
    const allCookies = getAllCookies();
    localLog("error", "Delete user settings to localStorage", allCookies, {});
  }
};

export const saveTableState = <T extends Record<string, any>>(
  userId: string,
  tableName: string,
  state: TableState<T>
): void => {
  var settings : UserSettings<T> = getSettings(userId, tableName);
  
  if (!settings) {
    settings = {};
  }
  if (!settings.state) {
    settings.state = {
      page: 0,
      pageSize: 0,
      sort: null,
      filter: {},
      quickSearch: ""
    };
  }
  settings.state = state;
  saveSettings(userId, tableName, settings);
};

export const loadTableState = <T extends Record<string, any>>(
  userId: string,
  tableName: string
): TableState<T> | null => {
  const settings : UserSettings<T> = getSettings(userId, tableName);
  return settings?.state || null;
};

export const deleteTableState = (
  userId: string,
  tableName: string ): void => {
    deleteSettings(userId, tableName);
}

export const saveLastViewedId = (
  userId: string,
  tableName: string,
  id: string | number
): void => {
  var settings = getSettings(userId,tableName);
  if (!settings) {
    settings = {};
  }
  settings.lastViewedId = id;
  saveSettings(userId, tableName, settings);
};

export const loadLastViewedId = (
  userId: string,
  tableName: string): string | number | null => {
  const settings = getSettings(userId, tableName);
  return settings.lastViewedId || null;
};
// ---- List state for the browser tab (sessionStorage) ----
// Saved after every change of a list's state (page, size, sort, filters, quick
// search) and read first when the list is displayed again; the saved context
// (localStorage, "Save / Read context") is only the fallback. Keyed by user,
// table and page path, so a child list keeps one state per parent record.

const sessionTableKey = (userId: string, tableName: string, path: string) =>
  `${userId}-${tableName}-${path}-${USER_SETTINGS_KEY}`;

export const saveSessionTableState = <T extends Record<string, any>>(
  userId: string,
  tableName: string,
  path: string,
  state: TableState<T>
): void => {
  if (typeof window === 'undefined') return; // server render: no sessionStorage
  try {
    const cleanState = { ...state, filter: removeEmptyValues(state.filter) };
    sessionStorage.setItem(sessionTableKey(userId, tableName, path), JSON.stringify(cleanState));
  }
  catch {
    // storage full or blocked: the list still works, it just won't be restored
  }
};

export const loadSessionTableState = <T extends Record<string, any>>(
  userId: string,
  tableName: string,
  path: string
): TableState<T> | null => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = sessionStorage.getItem(sessionTableKey(userId, tableName, path));
    return saved ? JSON.parse(saved) : null;
  }
  catch {
    return null;
  }
};

/**
 * Removes every list state kept for this browser tab (sessionStorage), so a new login
 * starts from the saved contexts (localStorage) or the lists' defaults. The saved
 * contexts themselves are kept ("Supprimer contexte" removes one).
 */
export const clearSessionTableStates = (): void => {
  if (typeof window === 'undefined') return;
  try {
    const suffix = `-${USER_SETTINGS_KEY}`;
    for (const key of Object.keys(sessionStorage)) {
      if (key.endsWith(suffix)) sessionStorage.removeItem(key);
    }
  }
  catch {
    // storage blocked: nothing to clear
  }
};
