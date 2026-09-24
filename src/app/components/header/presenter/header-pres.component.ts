import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';
import {
  ContentA11y,
  ContentBrand,
  ContentNav,
  ContentSidebar,
} from '@models/content.models';
import { Language, Theme } from '@models/preferences.models';
import { SUPPORTED_LANGUAGES } from '@constants/preferences.constants';

@Component({
  selector: 'app-header-pres',
  standalone: true,
  imports: [],
  styleUrls: ['./header-pres.style.scss'],
  templateUrl: './header-pres.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeaderPresComponent {
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
   * accessible label copy
   */
  public readonly a11y = input.required<ContentA11y>();

  /**
   * active colour scheme
   */
  public readonly theme = input.required<Theme>();

  /**
   * active language
   */
  public readonly language = input.required<Language>();

  /**
   * mobile sidebar drawer open state
   */
  public readonly sidebarOpen = input(false);

  /**
   * emits when the hamburger opens the sidebar
   */
  public readonly menuOpen = output<void>();

  /**
   * emits when the sidebar should close
   */
  public readonly menuClose = output<void>();

  /**
   * emits when the theme toggle is pressed
   */
  public readonly themeToggle = output<void>();

  /**
   * emits the chosen language
   */
  public readonly languageChange = output<Language>();

  /**
   * languages offered by the switch
   */
  public readonly languages = SUPPORTED_LANGUAGES;

  /**
   * icon on the theme toggle
   */
  public themeIcon(): string {
    return this.theme() === 'dark' ? '☀' : '☾';
  }
}
