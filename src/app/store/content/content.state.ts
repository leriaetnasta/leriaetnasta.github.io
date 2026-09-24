import { Content } from '@models/content.models';
import { AsyncState } from '../common/async-state';

/**
 * content store state
 */
export interface ContentState extends AsyncState {
  content: Content | null;
}

/**
 * store name
 */
export const Content_Store = 'Content';

/**
 * content store shape
 */
export interface ContentStore {
  [Content_Store]: ContentState;
}
