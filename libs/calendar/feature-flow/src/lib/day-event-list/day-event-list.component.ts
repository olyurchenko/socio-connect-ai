import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  CalendarDayActions,
  CalendarEventActions,
  selectDayEvents,
  selectDayEventsHasMore,
  selectDayEventsLoading,
  selectEventActionLoading,
  selectFilters,
  selectPendingEventActionId,
  selectSelectedDay,
} from '@socio-connect/calendar/data-access';
import { CalendarEvent } from '@socio-connect/calendar/utils-models';
import { UiSpinnerComponent, UiButtonComponent } from '@socio-connect/shared/ui-material-wrappers';
import { DayEventItemComponent } from '../day-event-item/day-event-item.component';

@Component({
  selector: 'sc-day-event-list',
  standalone: true,
  imports: [UiSpinnerComponent, UiButtonComponent, DayEventItemComponent],
  templateUrl: './day-event-list.component.html',
  styleUrl: './day-event-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayEventListComponent {
  private readonly store = inject(Store);

  protected readonly dayEvents = this.store.selectSignal(selectDayEvents);
  protected readonly isLoading = this.store.selectSignal(selectDayEventsLoading);
  protected readonly hasMore = this.store.selectSignal(selectDayEventsHasMore);
  protected readonly filters = this.store.selectSignal(selectFilters);
  protected readonly pendingActionId = this.store.selectSignal(selectPendingEventActionId);
  protected readonly actionLoading = this.store.selectSignal(selectEventActionLoading);
  protected readonly selectedDay = this.store.selectSignal(selectSelectedDay);

  protected readonly isPastDay = computed(() => {
    const day = this.selectedDay();
    if (!day) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(day + 'T00:00:00') < today;
  });

  loadMore(): void {
    if (this.hasMore() && !this.isLoading()) {
      this.store.dispatch(CalendarDayActions.loadMoreDayEvents());
    }
  }

  isActionPending(eventId: string): boolean {
    return this.actionLoading() && this.pendingActionId() === eventId;
  }

  useEvent(event: CalendarEvent): void {
    if (this.isPastDay()) return;
    this.store.dispatch(CalendarEventActions.useEvent({ eventId: event.id }));
  }

  dismissEvent(event: CalendarEvent, reason: string | undefined): void {
    if (this.isPastDay()) return;
    this.store.dispatch(CalendarEventActions.dismissEvent({ eventId: event.id, reason }));
  }

  restoreEvent(event: CalendarEvent): void {
    if (this.isPastDay()) return;
    this.store.dispatch(CalendarEventActions.restoreEvent({ eventId: event.id }));
  }
}
