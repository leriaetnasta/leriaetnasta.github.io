import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ContentState, Content_Store } from './content.state';

/**
 * content state slice
 */
export const selectContentState =
  createFeatureSelector<ContentState>(Content_Store);

/**
 * the active locale's content, null until the first load resolves
 */
export const selectContent = createSelector(
  selectContentState,
  (state) => state.content
);

/**
 * a request is in flight
 */
export const selectContentIsPending = createSelector(
  selectContentState,
  (state) => state.isPending
);

/**
 * the last request failed
 */
export const selectContentIsFailure = createSelector(
  selectContentState,
  (state) => state.isFailure
);
