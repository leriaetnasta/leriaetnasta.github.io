import { Injectable, Signal, signal } from '@angular/core';
import { Language, Theme } from '@models/preferences.models';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_THEME,
  STORAGE_KEYS,
  SUPPORTED_LANGUAGES,
} from '@constants/preferences.constants';

/**
 * Preferences Service
 *
 * theme and language, persisted to localStorage and mirrored onto
 * `<html>` so CSS and `lang`/`dir` pick them up without a reload
 */
@Injectable({ providedIn: 'root' })
export class PreferencesService {
  /**
   * backing signal for theme
   */
  private readonly themeSignal = signal<Theme>(this.readTheme());

  /**
   * backing signal for language
   */
  private readonly languageSignal = signal<Language>(this.readLanguage());

  /**
   * active colour scheme
   */
  public readonly theme: Signal<Theme> = this.themeSignal.asReadonly();

  /**
   * active UI language
   */
  public readonly language: Signal<Language> = this.languageSignal.asReadonly();

  constructor() {
    this.applyTheme(this.themeSignal());
  }

  /**
   * flip between light and dark, persisting the choice
   */
  public toggleTheme(): void {
    this.setTheme(this.themeSignal() === 'dark' ? 'light' : 'dark');
  }

  /**
   * set the colour scheme directly, persisting the choice
   */
  public setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    this.applyTheme(theme);
  }

  /**
   * switch the UI language, persisting the choice
   */
  public setLanguage(language: Language): void {
    this.languageSignal.set(language);
    localStorage.setItem(STORAGE_KEYS.language, language);
  }

  /**
   * mirror the theme onto `<html>` so global CSS custom properties pick it up
   */
  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  /**
   * persisted theme, falling back to the default
   */
  private readTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEYS.theme);
    return stored === 'dark' || stored === 'light' ? stored : DEFAULT_THEME;
  }

  /**
   * persisted language, falling back to the browser's language, then the default
   */
  private readLanguage(): Language {
    const stored = localStorage.getItem(STORAGE_KEYS.language);
    if (this.isSupported(stored)) {
      return stored;
    }
    const browserLanguage = navigator.language.slice(0, 2);
    return this.isSupported(browserLanguage) ? browserLanguage : DEFAULT_LANGUAGE;
  }

  /**
   * narrow a raw string to a language this site ships content for
   */
  private isSupported(value: string | null): value is Language {
    return SUPPORTED_LANGUAGES.includes(value as Language);
  }
}
