import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ContentA11y, ContentAsk } from '@models/content.models';
import { ChatMessage, ChatRole } from '@models/ask.models';
import { Language } from '@models/preferences.models';
import { ImagePlaceholderComponent } from '@components/shared/image-placeholder/image-placeholder.component';

@Component({
  selector: 'app-ask-pres',
  standalone: true,
  imports: [ImagePlaceholderComponent],
  styleUrls: ['./ask-pres.style.scss'],
  templateUrl: './ask-pres.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AskPresComponent {
  /**
   * ask-about-me banner and CV-assistant copy
   */
  public readonly content = input.required<ContentAsk>();

  /**
   * accessible label copy
   */
  public readonly a11y = input.required<ContentA11y>();

  /**
   * the drawer is open
   */
  public readonly open = input(false);

  /**
   * the drawer is collapsed to the launcher, conversation kept
   */
  public readonly minimized = input(false);

  /**
   * the conversation so far
   */
  public readonly messages = input<ChatMessage[]>([]);

  /**
   * text in the composer
   */
  public readonly draft = input('');

  /**
   * an answer is still streaming in
   */
  public readonly busy = input(false);

  /**
   * the one-time notice is showing
   */
  public readonly noticeOpen = input(false);

  /**
   * the close confirmation is showing
   */
  public readonly confirmingClose = input(false);

  /**
   * the session timed out
   */
  public readonly ended = input(false);

  /**
   * the opening illustration is showing
   */
  public readonly booting = input(false);

  /**
   * the language buttons belong in the transcript
   */
  public readonly choosingLanguage = input(false);

  /**
   * the language the visitor picked, shown selected and locked in the transcript
   */
  public readonly selectedLanguage = input<Language | null>(null);

  /**
   * what the assistant is doing right now
   */
  public readonly thinking = input('');

  /**
   * the panel is in its larger size
   */
  public readonly wide = signal(false);

  /**
   * emits when the banner button opens the drawer
   */
  public readonly openAsk = output<void>();

  /**
   * emits when the panel should collapse to the launcher
   */
  public readonly minimizeAsk = output<void>();

  /**
   * emits when the panel should close for good
   */
  public readonly closeAsk = output<void>();

  /**
   * emits when the visitor tries to close, so the container can confirm
   */
  public readonly requestClose = output<void>();

  /**
   * emits when the visitor keeps the conversation instead of closing
   */
  public readonly cancelClose = output<void>();

  /**
   * emits when the notice is acknowledged
   */
  public readonly acceptNotice = output<void>();

  /**
   * emits when a timed-out session should start again
   */
  public readonly restart = output<void>();

  /**
   * emits when the transcript should be saved
   */
  public readonly download = output<void>();

  /**
   * emits the language the visitor picked
   */
  public readonly pickLanguage = output<Language>();

  /**
   * emits the composer's text as it is typed
   */
  public readonly draftChange = output<string>();

  /**
   * emits a question to send, typed or from a suggestion
   */
  public readonly send = output<string>();

  /**
   * role enum for the template
   */
  public readonly ChatRole = ChatRole;

  /**
   * the composer is worth sending
   */
  public readonly canSend = computed(() => this.draft().trim().length > 0 && !this.busy());

  /**
   * grow or shrink the panel
   */
  public toggleWide(): void {
    this.wide.update((wide) => !wide);
  }

  /**
   * track the composer as it is typed in
   */
  public onDraftInput(event: Event): void {
    this.draftChange.emit((event.target as HTMLInputElement).value);
  }

  /**
   * send the composed question
   */
  public onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.canSend()) {
      return;
    }
    this.send.emit(this.draft());
  }
}
