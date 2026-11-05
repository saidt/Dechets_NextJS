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