import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  inject,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCurrentStepIndex } from '@socio-connect/calendar/data-access';
import { FilterPanelComponent } from '@socio-connect/calendar/feature-filter';
import { LocationSidebarComponent } from '@socio-connect/calendar/feature-location-matching';
import { UiSidenavComponent } from '@socio-connect/shared/ui-material-wrappers';

@Component({
  selector: 'sc-app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    UiSidenavComponent,
    FilterPanelComponent,
    LocationSidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  private readonly store = inject(Store);

  readonly navItems = [
    {
      label: 'Calendar Flow',
      icon: 'calendar_month',
      route: '/calendar-flow',
    },
  ] as const;

  protected readonly currentStepIndex = this.store.selectSignal(selectCurrentStepIndex);
  protected readonly isLocationMatchingStep = computed(() => this.currentStepIndex() === 1);
}
