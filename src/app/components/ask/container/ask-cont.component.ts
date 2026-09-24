import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { ContentA11y, ContentAsk } from '@models/content.models';
import { ChatMessage, ChatRole, ChatStatus } from '@models/ask.models';
import { matchAnswer } from '@utils/ask.util';
import { AskService } from '@services/ask.service';
import { AskUiService } from '@services/ask-ui.service';
import { PreferencesService } from '@services/preferences.service';
import { ASK_IDLE_MS } from '@constants/ask.constants';
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
   * panel open state, shared with the header and side nav
   */
  private readonly ui = inject(AskUiService);

  /**
   * the language the visitor is reading the site in
   */
  private readonly preferences = inject(PreferencesService);

  /**
   * ask section copy
   */
  public readonly content = input.required<ContentAsk>();

  /**
   * accessible label copy
   */
  public readonly a11y = input.required<ContentA11y>();

  /**
   * the panel is open
   */
  public readonly open = this.ui.open;

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
   * the notice about what the assistant can answer, shown on every open
   */
  public readonly noticeOpen = signal(true);

  /**
   * closing is confirmed first, because it ends the session
   */
  public readonly confirmingClose = signal(false);

  /**
   * the session timed out and has to be restarted
   */
  public readonly ended = signal(false);

  /**
   * counter behind message ids
   */
  private messageSeq = 0;

  /**
   * pending idle timeout
   */
  private idleTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // the header and side nav open the panel without going through openAsk().
    // Only the open flag is tracked: reading messages here would re-run this on
    // every reply and pop the notice back up mid-conversation.
    effect(() => {
      const open = this.open();
      untracked(() => {
        if (!open) {
          clearTimeout(this.idleTimer);
          return;
        }
        this.noticeOpen.set(true);
        if (!this.messages().length) {
          this.append(ChatRole.Bot, this.content().greeting, 'done');
        }
        this.restartIdleTimer();
      });
    });
  }

  /**
   * open the assistant panel
   */
  public openAsk(): void {
    this.ui.openPanel();
  }

  /**
   * ask first, because closing ends the session
   */
  public requestClose(): void {
    if (this.ended() || this.messages().length <= 1) {
      this.closeAsk();
      return;
    }
    this.confirmingClose.set(true);
  }

  /**
   * stay in the conversation
   */
  public cancelClose(): void {
    this.confirmingClose.set(false);
  }

  /**
   * close the panel and drop the conversation
   */
  public closeAsk(): void {
    clearTimeout(this.idleTimer);
    this.confirmingClose.set(false);
    this.ended.set(false);
    this.messages.set([]);
    this.draft.set('');
    this.ui.closePanel();
  }

  /**
   * dismiss the notice for this session
   */
  public acceptNotice(): void {
    this.noticeOpen.set(false);
  }

  /**
   * clear the timed-out session and begin again
   */
  public restart(): void {
    this.ended.set(false);
    this.messages.set([]);
    this.draft.set('');
    this.append(ChatRole.Bot, this.content().greeting, 'done');
    this.restartIdleTimer();
  }

  /**
   * track the composer as it is typed in
   */
  public onDraftChange(value: string): void {
    this.draft.set(value);
  }

  /**
   * save the conversation as a text file
   */
  public download(): void {
    const content = this.content();
    const lines = [
      content.transcriptTitle,
      new Date().toLocaleString(),
      '',
      ...this.messages().map((message) => {
        const who =
          message.role === ChatRole.Visitor
            ? content.transcriptVisitor
            : content.transcriptBot;
        return `${who}: ${message.text}`;
      }),
    ];

    const blob = new Blob([lines.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'loubna-assistant.txt';
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * send the composed question, or a suggested one
   */
  public async send(question: string): Promise<void> {
    const text = question.trim();
    if (!text || this.busy() || this.ended()) {
      return;
    }

    this.append(ChatRole.Visitor, text);
    this.draft.set('');
    this.busy.set(true);
    this.restartIdleTimer();

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
      this.restartIdleTimer();
    }
  }

  /**
   * end the session after a stretch of silence
   */
  private restartIdleTimer(): void {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => this.ended.set(true), ASK_IDLE_MS);
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
