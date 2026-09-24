import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { ContentHero } from '@models/content.models';
import { ImagePlaceholderComponent } from '@components/shared/image-placeholder/image-placeholder.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ImagePlaceholderComponent],
  styleUrls: ['./hero.style.scss'],
  templateUrl: './hero.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeroComponent {
  /**
   * hero section copy
   */
  public readonly content = input.required<ContentHero>();
}
