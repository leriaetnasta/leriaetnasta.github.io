import { Injectable, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Content } from '@models/content.models';
import { Language } from '@models/preferences.models';
import { contentUrl } from '@constants/content.constants';
import { setContentFromApi } from '@store/content/content.actions';
import {
  selectContent,
  selectContentIsFailure,
  selectContentIsPending,
} from '@store/content/content.selectors';

/**
 * Content Service
 *
 * loads the active locale's copy from its published JSON file, so the site's
 * text can be edited without touching code or rebuilding
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  /**
   * NgRx store
   */
  private readonly store = inject(Store);

  /**
   * fetches the locale files
   */
  private readonly http = inject(HttpClient);

  /**
   * the active locale's content, null until the first load resolves
   */
  public readonly content: Signal<Content | null> = toSignal(
    this.store.select(selectContent),
    { initialValue: null }
  );

  /**
   * a locale request is in flight
   */
  public readonly isPending: Signal<boolean> = toSignal(
    this.store.select(selectContentIsPending),
    { initialValue: false }
  );

  /**
   * the last locale request failed
   */
  public readonly isFailure: Signal<boolean> = toSignal(
    this.store.select(selectContentIsFailure),
    { initialValue: false }
  );

  /**
   * load a locale's content into the store
   */
  public loadContent(language: Language): void {
    this.store.dispatch(
      setContentFromApi({ call: this.fetchContent(language) })
    );
  }

  /**
   * build the fetch the store effect runs
   */
  private fetchContent(language: Language): Observable<Content> {
    return this.http.get<Content>(contentUrl(language));
  }
}
