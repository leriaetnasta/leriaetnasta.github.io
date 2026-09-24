import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { ContentWriting } from '@models/content.models';

@Component({
  selector: 'app-writing',
  standalone: true,
  imports: [],
  styleUrls: ['./writing.style.scss'],
  templateUrl: './writing.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WritingComponent {
  /**
   * writing section copy
   */
  public readonly content = input.required<ContentWriting>();
}
