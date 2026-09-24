import { Language, Theme } from '@models/preferences.models';

/**
 * localStorage keys for persisted UI preferences
 */
export const STORAGE_KEYS = {
  theme: 'lt-theme',
  language: 'lt-language',
} as const;

/**
 * theme used when nothing is persisted yet
 */
export const DEFAULT_THEME: Theme = 'light';

/**
 * language used when nothing is persisted and the browser gives no match
 */
export const DEFAULT_LANGUAGE: Language = 'en';

/**
 * languages the site ships content for
 */
export const SUPPORTED_LANGUAGES: readonly Language[] = ['en', 'fr'];
