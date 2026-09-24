import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { ContentFooter } from '@models/content.models';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  styleUrls: ['./footer.style.scss'],
  templateUrl: './footer.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent {
  /**
   * footer copy
   */
  public readonly content = input.required<ContentFooter>();
}
