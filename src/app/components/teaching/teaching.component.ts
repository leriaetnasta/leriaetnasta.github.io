import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { ContentTeaching } from '@models/content.models';

@Component({
  selector: 'app-teaching',
  standalone: true,
  imports: [],
  styleUrls: ['./teaching.style.scss'],
  templateUrl: './teaching.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TeachingComponent {
  /**
   * teaching section copy
   */
  public readonly content = input.required<ContentTeaching>();
}
