import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CalendarState, EventType } from '@socio-connect/calendar/utils-models';
import { CALENDAR_FEATURE_KEY } from './calendar.reducer';

// ─── Feature Selector ─────────────────────────────────────────────────────────

export const selectCalendarFeature =
  createFeatureSelector<CalendarState>(CALENDAR_FEATURE_KEY);

// ─── Filter Selectors ─────────────────────────────────────────────────────────

export const selectFilters = createSelector(
  selectCalendarFeature,
  (state) => state.filters,
);

export const selectSelectedMonth = createSelector(
  selectFilters,
  (filters) => filters.month,
);

export const selectActiveEventTypes = createSelector(
  selectFilters,
  (filters) => filters.eventTypes,
);

export const selectActiveLabelIds = createSelector(
  selectFilters,
  (filters) => filters.labelIds,
);

export const selectActiveCountryCode = createSelector(
  selectFilters,
  (filters) => filters.countryCode,
);

export const selectShowDismissed = createSelector(
  selectFilters,
  (filters) => filters.showDismissed,
);

// ─── Month Events Selectors ───────────────────────────────────────────────────

export const selectMonthEvents = createSelector(
  selectCalendarFeature,
  (state) => state.monthEvents,
);

export const selectMonthEventsLoadingState = createSelector(
  selectCalendarFeature,
  (state) => state.monthEventsLoadingState,
);

export const selectMonthEventsLoading = createSelector(
  selectMonthEventsLoadingState,
  (s) => s === 'loading',
);

export const selectMonthEventsError = createSelector(
  selectCalendarFeature,
  (state) => state.monthEventsError,
);

export const selectEventTypeCounts = createSelector(
  selectCalendarFeature,
  (state) => state.eventTypeCounts,
);

export const selectTotalEventsCount = createSelector(
  selectEventTypeCounts,
  (counts) =>
    counts[EventType.LOCATION] + counts[EventType.CALENDAR] + counts[EventType.WEATHER],
);

// ─── Day Events Selectors ─────────────────────────────────────────────────────

export const selectSelectedDay = createSelector(
  selectCalendarFeature,
  (state) => state.selectedDay,
);

export const selectDaySidenavOpen = createSelector(
  selectSelectedDay,
  (day) => day !== null,
);

export const selectDayEvents = createSelector(
  selectCalendarFeature,
  (state) => state.dayEvents,
);

export const selectDayEventsLoadingState = createSelector(
  selectCalendarFeature,
  (state) => state.dayEventsLoadingState,
);

export const selectDayEventsLoading = createSelector(
  selectDayEventsLoadingState,
  (s) => s === 'loading',
);

export const selectDayEventsTotalCount = createSelector(
  selectCalendarFeature,
  (state) => state.dayEventsTotalCount,
);

export const selectDayEventsHasMore = createSelector(
  selectCalendarFeature,
  (state) => state.dayEventsHasMore,
);

export const selectDayEventsCurrentPage = createSelector(
  selectCalendarFeature,
  (state) => state.dayEventsCurrentPage,
);

// ─── Reference Data Selectors ─────────────────────────────────────────────────

export const selectEventLabels = createSelector(
  selectCalendarFeature,
  (state) => state.eventLabels,
);

export const selectEventLabelsLoading = createSelector(
  selectCalendarFeature,
  (state) => state.eventLabelsLoadingState === 'loading',
);

export const selectCountries = createSelector(
  selectCalendarFeature,
  (state) => state.countries,
);

export const selectCountriesLoading = createSelector(
  selectCalendarFeature,
  (state) => state.countriesLoadingState === 'loading',
);

// ─── Event Action Selectors ───────────────────────────────────────────────────

export const selectPendingEventActionId = createSelector(
  selectCalendarFeature,
  (state) => state.pendingEventActionId,
);

export const selectEventActionLoading = createSelector(
  selectCalendarFeature,
  (state) => state.eventActionLoadingState === 'loading',
);

export const selectEventActionError = createSelector(
  selectCalendarFeature,
  (state) => state.eventActionError,
);
