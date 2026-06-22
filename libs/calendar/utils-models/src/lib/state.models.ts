import {
  CalendarEvent,
  Country,
  EventLabel,
  EventTypeCounts,
} from './event.models';
import { CalendarFilters } from './filter.models';

// ─── Async State Helpers ──────────────────────────────────────────────────────

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncData<T> {
  data: T;
  loadingState: LoadingState;
  error: string | null;
}

export function createAsyncData<T>(initialData: T): AsyncData<T> {
  return { data: initialData, loadingState: 'idle', error: null };
}

// ─── NgRx Calendar State ──────────────────────────────────────────────────────

export interface CalendarState {
  filters: CalendarFilters;

  monthEvents: CalendarEvent[];
  monthEventsLoadingState: LoadingState;
  monthEventsError: string | null;
  eventTypeCounts: EventTypeCounts;

  selectedDay: string | null;
  dayEvents: CalendarEvent[];
  dayEventsLoadingState: LoadingState;
  dayEventsError: string | null;
  dayEventsTotalCount: number;
  dayEventsCurrentPage: number;
  dayEventsHasMore: boolean;

  eventLabels: EventLabel[];
  eventLabelsLoadingState: LoadingState;

  countries: Country[];
  countriesLoadingState: LoadingState;

  pendingEventActionId: string | null;
  eventActionLoadingState: LoadingState;
  eventActionError: string | null;
}
