import { ActionReducerMap, MetaReducer, RuntimeChecks } from '@ngrx/store';

/**
 * Root reducers.
 */
export const rootReducers: ActionReducerMap<Record<string, never>> = {};

/**
 * meta reducers
 */
export const metaReducers: MetaReducer[] = [];

/**
 * Runtime checks Configuration.
 *
 * strictActionWithinNgZone stays off: this app is zoneless (no zone.js), so
 * there is no Angular zone for a dispatch to be "outside" of.
 */
export const runtimeChecks: Partial<RuntimeChecks> = {
  strictActionImmutability: false,
  strictActionSerializability: false,
  strictStateImmutability: true,
  strictStateSerializability: false,
  strictActionWithinNgZone: false,
  strictActionTypeUniqueness: true,
};
