import { createReducer, on } from '@ngrx/store';
import {
  CalendarState,
  EventType,
  getCurrentMonthValue,
} from '@socio-connect/calendar/utils-models';
import {
  CalendarDayActions,
  CalendarEventActions,
  CalendarFilterActions,
  CalendarFlowActions,
  CalendarMonthActions,
  CalendarReferenceActions,
} from './calendar.actions';

export const CALENDAR_FEATURE_KEY = 'calendar';

export const initialCalendarState: CalendarState = {
  currentStepIndex: 0,

  filters: {
    month: getCurrentMonthValue(),
    eventTypes: [],
    labelIds: [],
    countryCode: null,
    showDismissed: false,
  },

  monthEvents: [],
  monthEventsLoadingState: 'idle',
  monthEventsError: null,
  eventTypeCounts: {
    [EventType.LOCATION]: 0,
    [EventType.CALENDAR]: 0,
    [EventType.WEATHER]: 0,
  },

  selectedDay: null,
  dayEvents: [],
  dayEventsLoadingState: 'idle',
  dayEventsError: null,
  dayEventsTotalCount: 0,
  dayEventsCurrentPage: 1,
  dayEventsHasMore: false,

  eventLabels: [],
  eventLabelsLoadingState: 'idle',

  countries: [],
  countriesLoadingState: 'idle',

  pendingEventActionId: null,
  eventActionLoadingState: 'idle',
  eventActionError: null,
};

export const calendarReducer = createReducer(
  initialCalendarState,

  // ─── Filter Reducers ────────────────────────────────────────────────────────

  on(CalendarFilterActions.setFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),

  on(CalendarFilterActions.setMonth, (state, { month }) => ({
    ...state,
    filters: { ...state.filters, month },
  })),

  on(CalendarFilterActions.toggleEventType, (state, { eventType }) => {
    const types = state.filters.eventTypes as string[];
    const updated = types.includes(eventType)
      ? types.filter((t) => t !== eventType)
      : [...types, eventType];
    return {
      ...state,
      filters: {
        ...state.filters,
        eventTypes: updated as typeof state.filters.eventTypes,
      },
    };
  }),

  on(CalendarFilterActions.toggleLabel, (state, { labelId }) => {
    const ids = state.filters.labelIds;
    const updated = ids.includes(labelId)
      ? ids.filter((id) => id !== labelId)
      : [...ids, labelId];
    return { ...state, filters: { ...state.filters, labelIds: updated } };
  }),

  on(CalendarFilterActions.setCountry, (state, { countryCode }) => ({
    ...state,
    filters: { ...state.filters, countryCode },
  })),

  on(CalendarFilterActions.toggleShowDismissed, (state) => ({
    ...state,
    filters: {
      ...state.filters,
      showDismissed: !state.filters.showDismissed,
    },
  })),

  on(CalendarFilterActions.resetFilters, (state) => ({
    ...state,
    filters: {
      ...initialCalendarState.filters,
      month: state.filters.month,
    },
  })),

  on(CalendarFilterActions.loadFromQueryParams, (state, { params }) => ({
    ...state,
    filters: {
      month: params['month'] ?? state.filters.month,
      eventTypes: params['types']
        ? (params['types'].split(',') as typeof state.filters.eventTypes)
        : state.filters.eventTypes,
      labelIds: params['labels'] ? params['labels'].split(',') : state.filters.labelIds,
      countryCode: params['country'] ?? state.filters.countryCode,
      showDismissed: params['dismissed'] === 'true',
    },
  })),

  // ─── Month Events Reducers ──────────────────────────────────────────────────

  on(CalendarMonthActions.loadMonthEvents, (state) => ({
    ...state,
    monthEventsLoadingState: 'loading' as const,
    monthEventsError: null,
  })),

  on(CalendarMonthActions.loadMonthEventsSuccess, (state, { events, typeCounts }) => ({
    ...state,
    monthEvents: events,
    eventTypeCounts: typeCounts,
    monthEventsLoadingState: 'success' as const,
    monthEventsError: null,
  })),

  on(CalendarMonthActions.loadMonthEventsFailure, (state, { error }) => ({
    ...state,
    monthEventsLoadingState: 'error' as const,
    monthEventsError: error,
  })),

  // ─── Day Events Reducers ────────────────────────────────────────────────────

  on(CalendarDayActions.selectDay, (state, { date }) => ({
    ...state,
    selectedDay: date,
    dayEvents: [],
    dayEventsCurrentPage: 1,
    dayEventsHasMore: false,
    dayEventsTotalCount: 0,
  })),

  on(CalendarDayActions.closeDaySidenav, (state) => ({
    ...state,
    selectedDay: null,
    dayEvents: [],
  })),

  on(CalendarDayActions.loadDayEvents, (state) => ({
    ...state,
    dayEventsLoadingState: 'loading' as const,
    dayEventsError: null,
  })),

  on(CalendarDayActions.loadDayEventsSuccess, (state, { response, page }) => ({
    ...state,
    dayEvents: page === 1 ? response.items : [...state.dayEvents, ...response.items],
    dayEventsTotalCount: response.total,
    dayEventsCurrentPage: page,
    dayEventsHasMore: response.hasMore,
    dayEventsLoadingState: 'success' as const,
    dayEventsError: null,
  })),

  on(CalendarDayActions.loadDayEventsFailure, (state, { error }) => ({
    ...state,
    dayEventsLoadingState: 'error' as const,
    dayEventsError: error,
  })),

  // ─── Reference Data Reducers ────────────────────────────────────────────────

  on(CalendarReferenceActions.loadEventLabels, (state) => ({
    ...state,
    eventLabelsLoadingState: 'loading' as const,
  })),

  on(CalendarReferenceActions.loadEventLabelsSuccess, (state, { labels }) => ({
    ...state,
    eventLabels: labels,
    eventLabelsLoadingState: 'success' as const,
  })),

  on(CalendarReferenceActions.loadEventLabelsFailure, (state) => ({
    ...state,
    eventLabelsLoadingState: 'error' as const,
  })),

  on(CalendarReferenceActions.loadCountries, (state) => ({
    ...state,
    countriesLoadingState: 'loading' as const,
  })),

  on(CalendarReferenceActions.loadCountriesSuccess, (state, { countries }) => ({
    ...state,
    countries,
    countriesLoadingState: 'success' as const,
  })),

  on(CalendarReferenceActions.loadCountriesFailure, (state) => ({
    ...state,
    countriesLoadingState: 'error' as const,
  })),

  // ─── Event Action Reducers ──────────────────────────────────────────────────

  on(CalendarEventActions.dismissEvent, (state, { eventId }) => ({
    ...state,
    pendingEventActionId: eventId,
    eventActionLoadingState: 'loading' as const,
    eventActionError: null,
  })),

  on(CalendarEventActions.dismissEventSuccess, (state, { event }) => ({
    ...state,
    pendingEventActionId: null,
    eventActionLoadingState: 'success' as const,
    dayEvents: state.dayEvents.map((e) => (e.id === event.id ? event : e)),
    monthEvents: state.monthEvents.map((e) => (e.id === event.id ? event : e)),
  })),

  on(CalendarEventActions.dismissEventFailure, (state, { error }) => ({
    ...state,
    pendingEventActionId: null,
    eventActionLoadingState: 'error' as const,
    eventActionError: error,
  })),

  on(CalendarEventActions.restoreEvent, (state, { eventId }) => ({
    ...state,
    pendingEventActionId: eventId,
    eventActionLoadingState: 'loading' as const,
    eventActionError: null,
  })),

  on(CalendarEventActions.restoreEventSuccess, (state, { event }) => ({
    ...state,
    pendingEventActionId: null,
    eventActionLoadingState: 'success' as const,
    dayEvents: state.dayEvents.map((e) => (e.id === event.id ? event : e)),
    monthEvents: state.monthEvents.map((e) => (e.id === event.id ? event : e)),
  })),

  on(CalendarEventActions.restoreEventFailure, (state, { error }) => ({
    ...state,
    pendingEventActionId: null,
    eventActionLoadingState: 'error' as const,
    eventActionError: error,
  })),

  // ─── Flow Navigation Reducers ───────────────────────────────────────────────

  on(CalendarFlowActions.goToStep, (state, { index }) => ({
    ...state,
    currentStepIndex: index,
  })),
);
