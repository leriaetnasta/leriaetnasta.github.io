import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { ContentContact } from '@models/content.models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  styleUrls: ['./contact.style.scss'],
  templateUrl: './contact.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ContactComponent {
  /**
   * contact section copy
   */
  public readonly content = input.required<ContentContact>();
}
