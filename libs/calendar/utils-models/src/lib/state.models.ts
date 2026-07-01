import {
  CalendarEvent,
  Country,
  EventLabel,
  EventTypeCounts,
} from './event.models';
import { CalendarFilters } from './filter.models';
import { CategoryOption, MatchedLocation, RegionOption } from './location-matching.models';

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
  currentStepIndex: number;

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

// ─── NgRx Location Matching State ─────────────────────────────────────────────

export interface LocationMatchingState {
  event: CalendarEvent | null;

  regions: RegionOption[];
  regionsLoadingState: LoadingState;

  categories: CategoryOption[];
  categoriesLoadingState: LoadingState;

  radiusMeters: number | null;
  radiusLoadingState: LoadingState;

  locations: MatchedLocation[];
  locationsLoadingState: LoadingState;
  locationsError: string | null;

  activeRegionIds: string[];
  activeCategoryIds: string[];
}
