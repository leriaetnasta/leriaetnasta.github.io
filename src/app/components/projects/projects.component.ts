import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { ContentProjects } from '@models/content.models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  styleUrls: ['./projects.style.scss'],
  templateUrl: './projects.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectsComponent {
  /**
   * side projects section copy
   */
  public readonly content = input.required<ContentProjects>();
}
