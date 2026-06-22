import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CalendarEvent,
  CalendarFilters,
  Country,
  EventLabel,
  EventTypeCounts,
  PaginatedResponse,
} from '@socio-connect/calendar/utils-models';

// ─── Filter Actions ───────────────────────────────────────────────────────────

export const CalendarFilterActions = createActionGroup({
  source: 'Calendar Filters',
  events: {
    'Set Filters': props<{ filters: Partial<CalendarFilters> }>(),
    'Set Month': props<{ month: string }>(),
    'Toggle Event Type': props<{ eventType: string }>(),
    'Toggle Label': props<{ labelId: string }>(),
    'Set Country': props<{ countryCode: string | null }>(),
    'Toggle Show Dismissed': emptyProps(),
    'Reset Filters': emptyProps(),
    'Load From Query Params': props<{ params: Record<string, string> }>(),
  },
});

// ─── Month Events Actions ─────────────────────────────────────────────────────

export const CalendarMonthActions = createActionGroup({
  source: 'Calendar Month Events',
  events: {
    'Load Month Events': props<{ filters: CalendarFilters }>(),
    'Load Month Events Success': props<{
      events: CalendarEvent[];
      typeCounts: EventTypeCounts;
    }>(),
    'Load Month Events Failure': props<{ error: string }>(),
  },
});

// ─── Day Events Actions ───────────────────────────────────────────────────────

export const CalendarDayActions = createActionGroup({
  source: 'Calendar Day Events',
  events: {
    'Select Day': props<{ date: string }>(),
    'Close Day Sidenav': emptyProps(),
    'Load Day Events': props<{ date: string; page: number }>(),
    'Load Day Events Success': props<{
      response: PaginatedResponse<CalendarEvent>;
      page: number;
    }>(),
    'Load Day Events Failure': props<{ error: string }>(),
    'Load More Day Events': emptyProps(),
  },
});

// ─── Reference Data Actions ───────────────────────────────────────────────────

export const CalendarReferenceActions = createActionGroup({
  source: 'Calendar Reference Data',
  events: {
    'Load Event Labels': emptyProps(),
    'Load Event Labels Success': props<{ labels: EventLabel[] }>(),
    'Load Event Labels Failure': props<{ error: string }>(),

    'Load Countries': emptyProps(),
    'Load Countries Success': props<{ countries: Country[] }>(),
    'Load Countries Failure': props<{ error: string }>(),
  },
});

// ─── Event Action Actions ─────────────────────────────────────────────────────

export const CalendarEventActions = createActionGroup({
  source: 'Calendar Event Actions',
  events: {
    'Use Event': props<{ eventId: string }>(),
    'Use Event Success': props<{ event: CalendarEvent }>(),
    'Use Event Failure': props<{ error: string }>(),

    'Dismiss Event': props<{ eventId: string; reason?: string }>(),
    'Dismiss Event Success': props<{ event: CalendarEvent }>(),
    'Dismiss Event Failure': props<{ error: string }>(),

    'Restore Event': props<{ eventId: string }>(),
    'Restore Event Success': props<{ event: CalendarEvent }>(),
    'Restore Event Failure': props<{ error: string }>(),
  },
});
