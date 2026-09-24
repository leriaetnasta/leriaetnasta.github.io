import { Language } from '@models/preferences.models';

/**
 * where the locale files are published; edit those files to change site copy,
 * no rebuild required
 */
export function contentUrl(language: Language): string {
  return `i18n/${language}.json`;
}
