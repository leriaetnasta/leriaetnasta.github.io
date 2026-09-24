import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { ContentEffect } from '@store/content/content.effect';
import { ContentReducer } from '@store/content/content.reducer';
import { Content_Store } from '@store/content/content.state';
import { metaReducers, rootReducers, runtimeChecks } from '@store/root-store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideStore(rootReducers, { metaReducers, runtimeChecks }),
    provideState(Content_Store, ContentReducer),
    provideEffects(ContentEffect),
  ],
};
