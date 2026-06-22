import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import {
  CalendarDayActions,
  selectEventLabels,
  selectFilters,
  selectMonthEvents,
  selectMonthEventsLoading,
  selectSelectedDay,
} from '@socio-connect/calendar/data-access';
import {
  CalendarDay,
  CalendarEvent,
  EventLabel,
  EventStatus,
  EventType,
} from '@socio-connect/calendar/utils-models';
import { UiSpinnerComponent } from '@socio-connect/shared/ui-material-wrappers';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_VISIBLE_EVENTS = 4;

@Component({
  selector: 'sc-calendar-grid',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, UiSpinnerComponent],
  templateUrl: './calendar-grid.component.html',
  styleUrl: './calendar-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarGridComponent {
  private readonly store = inject(Store);

  protected readonly isLoading = this.store.selectSignal(selectMonthEventsLoading);
  protected readonly filters = this.store.selectSignal(selectFilters);
  protected readonly allMonthEvents = this.store.selectSignal(selectMonthEvents);
  protected readonly eventLabels = this.store.selectSignal(selectEventLabels);
  protected readonly selectedDay = this.store.selectSignal(selectSelectedDay);

  protected readonly daysOfWeek = DAYS_OF_WEEK;
  protected readonly maxVisible = MAX_VISIBLE_EVENTS;

  // ─── Derived Signals ─────────────────────────────────────────────────────────

  protected readonly calendarDays = computed<CalendarDay[]>(() => {
    const { month } = this.filters();
    if (!month) return [];
    const [year, monthNum] = month.split('-').map(Number);
    return this.buildCalendarDays(year, monthNum, this.allMonthEvents(), this.eventLabels());
  });

  protected readonly currentMonthLabel = computed(() => {
    const { month } = this.filters();
    if (!month) return '';
    const [year, monthNum] = month.split('-').map(Number);
    return new Date(year, monthNum - 1, 1).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
  });

  // ─── Day Building ─────────────────────────────────────────────────────────────

  private buildCalendarDays(
    year: number,
    month: number,
    events: CalendarEvent[],
    labels: EventLabel[],
  ): CalendarDay[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekday = firstDay.getDay();

    const labelMap = new Map(labels.map((l) => [l.id, l]));

    const enrichedEvents = events.map((e) => ({
      ...e,
      label: labelMap.get(e.labelId),
    }));

    const days: CalendarDay[] = [];

    // Leading days from prev month
    const prevMonthLastDay = new Date(year, month - 1, 0).getDate();
    for (let i = startWeekday - 1; i >= 0; i--) {
      const date = new Date(year, month - 2, prevMonthLastDay - i);
      days.push(this.createDay(date, false, today, enrichedEvents));
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month - 1, d);
      days.push(this.createDay(date, true, today, enrichedEvents));
    }

    // Trailing days
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month, d);
      days.push(this.createDay(date, false, today, enrichedEvents));
    }

    return days;
  }

  private createDay(
    date: Date,
    isCurrentMonth: boolean,
    today: Date,
    events: CalendarEvent[],
  ): CalendarDay {
    const iso = this.toIsoDate(date);
    const dayEvents = events.filter((e) => e.startDate.startsWith(iso));
    return {
      date: iso,
      isCurrentMonth,
      isToday: date.getTime() === today.getTime(),
      isPast: date < today,
      events: dayEvents,
      hasOverflow: dayEvents.length > MAX_VISIBLE_EVENTS,
    };
  }

  private toIsoDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  // ─── Interaction ──────────────────────────────────────────────────────────────

  onDayClick(day: CalendarDay): void {
    this.store.dispatch(CalendarDayActions.selectDay({ date: day.date }));
  }

  // ─── Styling Helpers ──────────────────────────────────────────────────────────

  getEventTypeClass(type: EventType): string {
    return {
      [EventType.LOCATION]: 'event--location',
      [EventType.CALENDAR]: 'event--calendar',
      [EventType.WEATHER]: 'event--weather',
    }[type] ?? '';
  }

  getEventStatusClass(status: EventStatus): string {
    return {
      [EventStatus.USED]: 'event--used',
      [EventStatus.DISMISSED]: 'event--dismissed',
      [EventStatus.ACTIVE]: '',
    }[status] ?? '';
  }

  visibleEvents(day: CalendarDay): CalendarEvent[] {
    return day.events.slice(0, MAX_VISIBLE_EVENTS + 1);
  }

  isBlurred(index: number, day: CalendarDay): boolean {
    return index === MAX_VISIBLE_EVENTS && day.hasOverflow;
  }

  formatDayNumber(date: string): number {
    return parseInt(date.split('-')[2], 10);
  }

  isOverlayVisible(day: CalendarDay): boolean {
    return  day.events.length > 3;
  }
}
