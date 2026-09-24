import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  signal,
} from '@angular/core';
import { ContentA11y, ContentItinerary } from '@models/content.models';
import { ItineraryPresComponent } from '../presenter/itinerary-pres.component';

@Component({
  selector: 'app-itinerary-cont',
  standalone: true,
  imports: [ItineraryPresComponent],
  templateUrl: './itinerary-cont.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ItineraryContComponent {
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
  public readonly openIndex = signal<number | null>(null);

  /**
   * open a stop's detail drawer
   */
  public open(index: number): void {
    this.openIndex.set(index);
  }

  /**
   * close the detail drawer
   */
  public close(): void {
    this.openIndex.set(null);
  }
}
