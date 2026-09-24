import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
  output,
} from '@angular/core';
import { ContentA11y, ContentItinerary, ItineraryStop } from '@models/content.models';

@Component({
  selector: 'app-itinerary-pres',
  standalone: true,
  imports: [],
  styleUrls: ['./itinerary-pres.style.scss'],
  templateUrl: './itinerary-pres.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ItineraryPresComponent {
  /**
   * itinerary section copy
   */
  public readonly content = input.required<ContentItinerary>();

  /**
   * accessible label copy
   */
  public readonly a11y = input.required<ContentA11y>();

  /**
   * index of the stop whose detail drawer is open, null when closed
   */
  public readonly openIndex = input<number | null>(null);

  /**
   * emits the index of the stop tapped on the track
   */
  public readonly open = output<number>();

  /**
   * emits when the detail drawer should close
   */
  public readonly close = output<void>();

  /**
   * the stop shown in the drawer, derived from openIndex
   */
  public readonly openStop = computed<ItineraryStop | null>(() => {
    const index = this.openIndex();
    return index === null ? null : this.content().stops[index];
  });
}
