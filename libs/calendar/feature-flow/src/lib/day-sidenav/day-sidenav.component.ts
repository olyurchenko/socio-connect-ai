import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import {
  CalendarDayActions,
  selectDayEventsLoading,
  selectDayEventsTotalCount,
  selectSelectedDay,
} from '@socio-connect/calendar/data-access';
import { DayEventListComponent } from '../day-event-list/day-event-list.component';

@Component({
  selector: 'sc-day-sidenav',
  standalone: true,
  imports: [MatDividerModule, DayEventListComponent],
  templateUrl: './day-sidenav.component.html',
  styleUrl: './day-sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaySidenavComponent {
  private readonly store = inject(Store);

  protected readonly selectedDay = this.store.selectSignal(selectSelectedDay);
  protected readonly totalCount = this.store.selectSignal(selectDayEventsTotalCount);
  protected readonly isLoading = this.store.selectSignal(selectDayEventsLoading);

  protected readonly formattedDate = computed(() => {
    const day = this.selectedDay();
    if (!day) return '';
    const date = new Date(day + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  });

  protected readonly isPastDay = computed(() => {
    const day = this.selectedDay();
    if (!day) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(day + 'T00:00:00') < today;
  });

  protected readonly eventCountLabel = computed(() => {
    const n = this.totalCount();
    return n === 1 ? '1 event on this day' : `${n} events on this day`;
  });

  close(): void {
    this.store.dispatch(CalendarDayActions.closeDaySidenav());
  }
}
