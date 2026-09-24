import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { ContentCerts } from '@models/content.models';

@Component({
  selector: 'app-certs',
  standalone: true,
  imports: [],
  styleUrls: ['./certs.style.scss'],
  templateUrl: './certs.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CertsComponent {
  /**
   * certifications section copy
   */
  public readonly content = input.required<ContentCerts>();
}
