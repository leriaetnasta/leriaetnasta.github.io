import { createAction, props } from '@ngrx/store';
import { Content } from '@models/content.models';
import { ApiActionPayload } from '../common/async-state';

const ACTION_SET = '[Content] set';
const ACTION_SET_FROM_API = '[Content] set from api';
const ACTION_SET_FAILURE = '[Content] set failure';

/**
 * replace the active locale's content
 */
export const setContent = createAction(
  ACTION_SET,
  props<{ content: Content }>()
);

/**
 * mark the request failed
 */
export const setContentFailure = createAction(
  ACTION_SET_FAILURE,
  props<{ error: unknown }>()
);

/**
 * trigger a load: the effect runs payload.call and dispatches set/setFailure
 */
export const setContentFromApi = createAction(
  ACTION_SET_FROM_API,
  props<ApiActionPayload<Content>>()
);
