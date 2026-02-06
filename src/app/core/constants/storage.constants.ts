/**
 * Storage keys constants
 * Centralized storage keys to avoid typos and improve maintainability
 */

/**
 * Authentication storage keys
 */
export const AUTH_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  IS_ADMIN: 'isAdmin',
} as const;

/**
 * Application storage keys
 */
export const APP_STORAGE_KEYS = {
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  LAST_ROUTE: 'app_last_route',
} as const;

/**
 * All storage keys combined
 */
export const STORAGE_KEYS = {
  ...AUTH_STORAGE_KEYS,
  ...APP_STORAGE_KEYS,
} as const;

/**
 * Type-safe storage key type
 */
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
