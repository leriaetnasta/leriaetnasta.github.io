import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
import { ContentA11y, ContentAsk } from '@models/content.models';
import { ChatMessage, ChatRole } from '@models/ask.models';

@Component({
  selector: 'app-ask-pres',
  standalone: true,
  imports: [],
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
   * the conversation so far
   */
  public readonly messages = input<ChatMessage[]>([]);

  /**
   * text in the composer
   */
  public readonly draft = input('');

  /**
   * emits when the banner button opens the drawer
   */
  public readonly openAsk = output<void>();

  /**
   * emits when the drawer should close
   */
  public readonly closeAsk = output<void>();

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
  public readonly canSend = computed(() => this.draft().trim().length > 0);

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
