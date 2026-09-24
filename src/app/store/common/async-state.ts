import { Observable } from 'rxjs';

/**
 * feature states extend this to expose request progress
 */
export interface AsyncState {
  isPending: boolean;
  isFailure: boolean;
}

/**
 * payload for *FromApi actions: carries the API call observable for the effect
 */
export interface ApiActionPayload<T> {
  call: Observable<T>;
}
