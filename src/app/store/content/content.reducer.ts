import { ActionCreator, ReducerTypes, createReducer, on } from '@ngrx/store';
import * as actions from './content.actions';
import { ContentState } from './content.state';

/**
 * initial state
 */
export const ContentInitialState: ContentState = {
  content: null,
  isPending: false,
  isFailure: false,
};

/**
 * reducer features
 */
export const ContentReducerFeatures: ReducerTypes<
  ContentState,
  ActionCreator[]
>[] = [
  on(actions.setContent, (_state, { content }) => ({
    content,
    isPending: false,
    isFailure: false,
  })),

  on(actions.setContentFailure, (state) => ({
    ...state,
    isPending: false,
    isFailure: true,
  })),

  on(actions.setContentFromApi, (state) => ({
    ...state,
    isPending: true,
    isFailure: false,
  })),
];

/**
 * store reducer
 */
export const ContentReducer = createReducer(
  ContentInitialState,
  ...ContentReducerFeatures
);
