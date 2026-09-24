import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { WorkItemIcon } from '@models/content.models';

@Component({
  selector: 'app-image-placeholder',
  standalone: true,
  imports: [],
  styleUrls: ['./image-placeholder.style.scss'],
  templateUrl: './image-placeholder.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ImagePlaceholderComponent {
  /**
   * text hinting at the photo this slot is meant to hold
   */
  public readonly caption = input.required<string>();

  /**
   * warm hero-style gradient instead of the neutral card gradient
   */
  public readonly warm = input(false);

  /**
   * inline glyph drawn above the caption while there's no real photo yet
   */
  public readonly icon = input<WorkItemIcon | undefined>(undefined);

  /**
   * data lines running from each energy source into the hub, with a
   * staggered start so the packets don't travel in lockstep
   */
  protected readonly flows = [
    'M182 98 C270 98 300 164 344 168',
    'M184 183 C260 183 300 172 344 172',
    'M170 258 C270 258 300 180 344 176',
  ].map((d, i) => ({ d, offsetPath: `path('${d}')`, delay: `${-i * 1.6}s` }));
}
