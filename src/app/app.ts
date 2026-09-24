import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  effect,
  inject,
} from '@angular/core';
import { PreferencesService } from '@services/preferences.service';
import { ContentService } from '@services/content.service';
import { HeaderContComponent } from '@components/header/container/header-cont.component';
import { HeroComponent } from '@components/hero/hero.component';
import { ItineraryContComponent } from '@components/itinerary/container/itinerary-cont.component';
import { WorkComponent } from '@components/work/work.component';
import { ProjectsComponent } from '@components/projects/projects.component';
import { WritingComponent } from '@components/writing/writing.component';
import { TeachingComponent } from '@components/teaching/teaching.component';
import { AskContComponent } from '@components/ask/container/ask-cont.component';
import { CertsComponent } from '@components/certs/certs.component';
import { ContactComponent } from '@components/contact/contact.component';
import { FooterComponent } from '@components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderContComponent,
    HeroComponent,
    ItineraryContComponent,
    WorkComponent,
    ProjectsComponent,
    WritingComponent,
    TeachingComponent,
    AskContComponent,
    CertsComponent,
    ContactComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class App {
  /**
   * theme and language
   */
  private readonly preferences = inject(PreferencesService);

  /**
   * loads and holds the active locale's copy
   */
  private readonly contentService = inject(ContentService);

  /**
   * the active locale's content, null until the first load resolves
   */
  public readonly content = this.contentService.content;

  constructor() {
    // load the locale file for the language preference read at startup;
    // later switches are triggered from the header's language control
    this.contentService.loadContent(this.preferences.language());

    // mirror the loaded locale's lang/dir onto <html> and <title>
    effect(() => {
      const content = this.content();
      if (!content) {
        return;
      }
      document.documentElement.lang = content.meta.htmlLang;
      document.documentElement.dir = content.meta.dir;
      document.title = content.meta.pageTitle;
    });
  }
}
