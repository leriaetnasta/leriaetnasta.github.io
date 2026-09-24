import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { ContentA11y, ContentAsk } from '@models/content.models';
import { ChatMessage, ChatRole } from '@models/ask.models';
import { matchAnswer } from '@utils/ask.util';
import { AskPresComponent } from '../presenter/ask-pres.component';

@Component({
  selector: 'app-ask-cont',
  standalone: true,
  imports: [AskPresComponent],
  templateUrl: './ask-cont.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AskContComponent {
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
  public readonly open = signal(false);

  /**
   * the conversation, seeded with the greeting on first open
   */
  public readonly messages = signal<ChatMessage[]>([]);

  /**
   * text in the composer
   */
  public readonly draft = signal('');

  /**
   * counter behind message ids
   */
  private messageSeq = 0;

  /**
   * open the assistant drawer, greeting on first open
   */
  public openAsk(): void {
    this.open.set(true);
    if (!this.messages().length) {
      this.append(ChatRole.Bot, this.content().greeting);
    }
  }

  /**
   * close the assistant drawer, keeping the conversation
   */
  public closeAsk(): void {
    this.open.set(false);
  }

  /**
   * track the composer as it is typed in
   */
  public onDraftChange(value: string): void {
    this.draft.set(value);
  }

  /**
   * send the composed question, or a suggested one
   */
  public send(question: string): void {
    const text = question.trim();
    if (!text) {
      return;
    }
    this.append(ChatRole.Visitor, text);
    this.append(
      ChatRole.Bot,
      matchAnswer(text, this.content().answers, this.content().fallback)
    );
    this.draft.set('');
  }

  /**
   * add a message to the conversation
   */
  private append(role: ChatRole, text: string): void {
    this.messageSeq += 1;
    this.messages.update((messages) => [
      ...messages,
      { id: `ask-${this.messageSeq}`, role, text },
    ]);
  }
}
