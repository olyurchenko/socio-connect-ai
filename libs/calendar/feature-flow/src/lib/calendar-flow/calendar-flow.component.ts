import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import {
  CalendarFlowActions,
  CalendarMonthActions,
  selectCurrentStepIndex,
  selectDaySidenavOpen,
  selectFilters,
} from '@socio-connect/calendar/data-access';
import { LocationMatchingStepComponent } from '@socio-connect/calendar/feature-location-matching';
import { UiSidenavComponent } from '@socio-connect/shared/ui-material-wrappers';
import { CalendarGridComponent } from '../calendar-grid/calendar-grid.component';
import { DaySidenavComponent } from '../day-sidenav/day-sidenav.component';

@Component({
  selector: 'sc-calendar-flow',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    UiSidenavComponent,
    CalendarGridComponent,
    DaySidenavComponent,
    LocationMatchingStepComponent,
  ],
  templateUrl: './calendar-flow.component.html',
  styleUrl: './calendar-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarFlowComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly daySidenavOpen = this.store.selectSignal(selectDaySidenavOpen);
  protected readonly filters = this.store.selectSignal(selectFilters);
  protected readonly currentStepIndex = this.store.selectSignal(selectCurrentStepIndex);

  readonly daySidenav = viewChild<UiSidenavComponent>('daySidenav');

  ngOnInit(): void {
    this.store.dispatch(
      CalendarMonthActions.loadMonthEvents({ filters: this.filters() }),
    );
  }

  onStepChanged(index: number): void {
    this.store.dispatch(CalendarFlowActions.goToStep({ index }));
  }
}
