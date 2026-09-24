import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as ContentActions from './content.actions';

/**
 * content effects
 */
@Injectable()
export class ContentEffect {
  /**
   * run the call from setContentFromApi, map to success or failure
   */
  public loadContent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ContentActions.setContentFromApi),
      switchMap((action) =>
        action.call.pipe(
          map((content) => ContentActions.setContent({ content })),
          catchError((error) => of(ContentActions.setContentFailure({ error })))
        )
      )
    )
  );

  constructor(protected actions$: Actions) {}
}
