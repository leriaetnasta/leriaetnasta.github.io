import { Injectable, Signal, signal } from '@angular/core';

/**
 * Ask UI Service
 *
 * the assistant panel's open state, shared so the mobile side nav can open it
 * from outside the ask component
 */
@Injectable({ providedIn: 'root' })
export class AskUiService {
  /**
   * backing signal for the panel
   */
  private readonly openSignal = signal(false);

  /**
   * the assistant panel is open
   */
  public readonly open: Signal<boolean> = this.openSignal.asReadonly();

  /**
   * show the assistant panel
   */
  public openPanel(): void {
    this.openSignal.set(true);
  }

  /**
   * hide the assistant panel, keeping the conversation
   */
  public closePanel(): void {
    this.openSignal.set(false);
  }
}
