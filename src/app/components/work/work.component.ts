import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { ContentWork } from '@models/content.models';
import { ImagePlaceholderComponent } from '@components/shared/image-placeholder/image-placeholder.component';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [ImagePlaceholderComponent],
  styleUrls: ['./work.style.scss'],
  templateUrl: './work.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WorkComponent {
  /**
   * selected work section copy
   */
  public readonly content = input.required<ContentWork>();
}
