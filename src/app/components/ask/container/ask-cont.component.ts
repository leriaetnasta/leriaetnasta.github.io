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
import { ContentService } from '@services/content.service';
import { Language } from '@models/preferences.models';
import {
  ASK_BOOT_MS,
  ASK_COMPOSE_MS,
  ASK_IDLE_MS,
  ASK_THINK_MS,
  ASK_TOKEN_MS,
} from '@constants/ask.constants';
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
   * fetches the chosen locale's copy
   */
  private readonly contentService = inject(ContentService);

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
   * the opening illustration is showing, before the first message
   */
  public readonly booting = signal(false);

  /**
   * the visitor has not chosen a language for this conversation yet
   */
  public readonly choosingLanguage = signal(true);

  /**
   * what the assistant is doing while the visitor waits
   */
  public readonly thinking = signal('');

  /**
   * greet again as soon as the newly chosen locale's copy arrives
   */
  private readonly awaitingLocale = signal(false);

  /**
   * counter behind message ids
   */
  private messageSeq = 0;

  /**
   * pending idle timeout
   */
  private idleTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // the greeting after a language switch waits for the new locale's copy
    effect(() => {
      const greeting = this.content().greeting;
      untracked(() => {
        if (this.awaitingLocale()) {
          this.awaitingLocale.set(false);
          this.append(ChatRole.Bot, greeting, 'done');
        }
      });
    });

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
          this.boot();
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
    this.booting.set(false);
    this.choosingLanguage.set(true);
    this.thinking.set('');
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
    this.choosingLanguage.set(true);
    this.boot();
    this.restartIdleTimer();
  }

  /**
   * answer in the language the visitor picked, and reseed in that language
   */
  public pickLanguage(language: Language): void {
    this.choosingLanguage.set(false);
    this.messages.set([]);

    if (language === this.preferences.language()) {
      this.append(ChatRole.Bot, this.content().greeting, 'done');
      return;
    }

    // the locale file is being fetched; greet when its copy lands
    this.awaitingLocale.set(true);
    this.preferences.setLanguage(language);
    this.contentService.loadContent(language);
  }

  /**
   * hold on the illustration, then open with the bilingual greeting
   */
  private boot(): void {
    this.booting.set(true);
    setTimeout(() => {
      this.booting.set(false);
      this.append(ChatRole.Bot, this.content().languageAsk, 'done');
    }, ASK_BOOT_MS);
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

    const startedAt = Date.now();
    this.thinking.set(this.content().thinkingSearch);
    const composing = setTimeout(
      () => this.thinking.set(this.content().thinkingCompose),
      ASK_COMPOSE_MS
    );

    try {
      let first = true;
      for await (const token of this.ask.stream(this.preferences.language(), history)) {
        if (first) {
          // the edge answers faster than anyone can read a question being considered
          await pause(ASK_THINK_MS - (Date.now() - startedAt));
          this.thinking.set('');
          first = false;
        }
        this.appendToken(answerId, token);
        await pause(ASK_TOKEN_MS);
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
      clearTimeout(composing);
      this.thinking.set('');
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

/**
 * resolve after a delay, ignoring non-positive waits
 */
function pause(ms: number): Promise<void> {
  return ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
}
