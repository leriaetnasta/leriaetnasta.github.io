import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  input,
  signal,
} from '@angular/core';
import { ContentA11y, ContentAsk } from '@models/content.models';
import { ChatMessage, ChatRole, ChatStatus } from '@models/ask.models';
import { matchAnswer } from '@utils/ask.util';
import { AskService } from '@services/ask.service';
import { PreferencesService } from '@services/preferences.service';
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
   * streams answers from the assistant worker
   */
  private readonly ask = inject(AskService);

  /**
   * the language the visitor is reading the site in
   */
  private readonly preferences = inject(PreferencesService);

  /**
   * itinerary section copy
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
   * an answer is still arriving, so the composer stays disabled
   */
  public readonly busy = signal(false);

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
      this.append(ChatRole.Bot, this.content().greeting, 'done');
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
  public async send(question: string): Promise<void> {
    const text = question.trim();
    if (!text || this.busy()) {
      return;
    }

    this.append(ChatRole.Visitor, text);
    this.draft.set('');
    this.busy.set(true);

    const history = this.messages().filter((message) => message.status !== 'fallback');
    const answerId = this.append(ChatRole.Bot, '', 'streaming');

    try {
      for await (const token of this.ask.stream(this.preferences.language(), history)) {
        this.appendToken(answerId, token);
      }
      this.settle(answerId, 'done');
    } catch {
      // the worker is rate limited, down, or the visitor is offline
      this.replace(
        answerId,
        matchAnswer(text, this.content().answers, this.content().fallback),
        'fallback'
      );
    } finally {
      this.busy.set(false);
    }
  }

  /**
   * add a message to the conversation
   */
  private append(role: ChatRole, text: string, status?: ChatStatus): string {
    this.messageSeq += 1;
    const id = `ask-${this.messageSeq}`;
    this.messages.update((messages) => [...messages, { id, role, text, status }]);
    return id;
  }

  /**
   * grow the answer as tokens arrive
   */
  private appendToken(id: string, token: string): void {
    this.messages.update((messages) =>
      messages.map((message) =>
        message.id === id ? { ...message, text: message.text + token } : message
      )
    );
  }

  /**
   * swap an answer's whole text, used when falling back
   */
  private replace(id: string, text: string, status: ChatStatus): void {
    this.messages.update((messages) =>
      messages.map((message) => (message.id === id ? { ...message, text, status } : message))
    );
  }

  /**
   * drop the streaming cursor once the answer is complete
   */
  private settle(id: string, status: ChatStatus): void {
    this.messages.update((messages) =>
      messages.map((message) => (message.id === id ? { ...message, status } : message))
    );
  }
}
