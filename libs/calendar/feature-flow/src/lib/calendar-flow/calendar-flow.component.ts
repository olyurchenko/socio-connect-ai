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
  CalendarMonthActions,
  selectDaySidenavOpen,
  selectFilters,
} from '@socio-connect/calendar/data-access';
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
  ],
  templateUrl: './calendar-flow.component.html',
  styleUrl: './calendar-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarFlowComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly daySidenavOpen = this.store.selectSignal(selectDaySidenavOpen);
  protected readonly filters = this.store.selectSignal(selectFilters);

  readonly daySidenav = viewChild<UiSidenavComponent>('daySidenav');

  ngOnInit(): void {
    this.store.dispatch(
      CalendarMonthActions.loadMonthEvents({ filters: this.filters() }),
    );
  }
}
