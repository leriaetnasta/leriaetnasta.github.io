import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
  input,
  signal,
} from '@angular/core';
import { PreferencesService } from '@services/preferences.service';
import { ContentService } from '@services/content.service';
import { AskUiService } from '@services/ask-ui.service';
import {
  ContentA11y,
  ContentBrand,
  ContentNav,
  ContentSidebar,
} from '@models/content.models';
import { Language } from '@models/preferences.models';
import { HeaderPresComponent } from '../presenter/header-pres.component';

@Component({
  selector: 'app-header-cont',
  standalone: true,
  imports: [HeaderPresComponent],
  templateUrl: './header-cont.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeaderContComponent {
  /**
   * preferences store: theme and language live here
   */
  private readonly preferences = inject(PreferencesService);

  /**
   * reloads the locale file when the language switches
   */
  private readonly contentService = inject(ContentService);

  /**
   * opens the assistant panel from the side nav
   */
  private readonly askUi = inject(AskUiService);

  /**
   * brand mark copy
   */
  public readonly brand = input.required<ContentBrand>();

  /**
   * desktop nav copy
   */
  public readonly nav = input.required<ContentNav>();

  /**
   * mobile sidebar copy
   */
  public readonly sidebar = input.required<ContentSidebar>();

  /**
   * label for the assistant entry in the side nav
   */
  public readonly askLabel = input('');

  /**
   * accessible label copy
   */
  public readonly a11y = input.required<ContentA11y>();

  /**
   * mobile sidebar drawer open state
   */
  public readonly sidebarOpen = signal(false);

  /**
   * active colour scheme, for the presenter's toggle icon
   */
  public readonly theme = this.preferences.theme;

  /**
   * active language, for the presenter's language switch
   */
  public readonly language = this.preferences.language;

  /**
   * open the mobile sidebar
   */
  public openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  /**
   * close the mobile sidebar
   */
  public closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  /**
   * flip light/dark
   */
  public toggleTheme(): void {
    this.preferences.toggleTheme();
  }

  /**
   * switch the site language, reloading its locale file
   */
  public setLanguage(language: Language): void {
    this.preferences.setLanguage(language);
    this.contentService.loadContent(language);
  }

  /**
   * open the assistant and close the side nav behind it
   */
  public openAsk(): void {
    this.closeSidebar();
    this.askUi.openPanel();
  }
}
