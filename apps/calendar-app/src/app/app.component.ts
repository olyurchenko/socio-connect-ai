import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UiSidenavComponent } from '@socio-connect/shared/ui-material-wrappers';
import { FilterPanelComponent } from '@socio-connect/calendar/feature-flow';

@Component({
  selector: 'sc-app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, UiSidenavComponent, FilterPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  readonly navItems = [
    {
      label: 'Calendar Flow',
      icon: 'calendar_month',
      route: '/calendar-flow',
    },
  ] as const;
}
