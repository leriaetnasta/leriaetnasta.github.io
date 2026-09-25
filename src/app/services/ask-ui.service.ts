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
   * backing signal for the collapsed state
   */
  private readonly minimizedSignal = signal(false);

  /**
   * the assistant panel is open
   */
  public readonly open: Signal<boolean> = this.openSignal.asReadonly();

  /**
   * the panel is collapsed to the launcher, session still alive
   */
  public readonly minimized: Signal<boolean> = this.minimizedSignal.asReadonly();

  /**
   * show the assistant panel, restoring it if it was minimized
   */
  public openPanel(): void {
    this.openSignal.set(true);
    this.minimizedSignal.set(false);
  }

  /**
   * collapse the panel to the launcher without ending the session
   */
  public minimize(): void {
    this.minimizedSignal.set(true);
  }

  /**
   * hide the assistant panel, keeping the conversation
   */
  public closePanel(): void {
    this.openSignal.set(false);
    this.minimizedSignal.set(false);
  }
}
