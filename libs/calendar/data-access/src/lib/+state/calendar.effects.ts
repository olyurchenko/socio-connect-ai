import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  debounceTime,
  exhaustMap,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { CalendarApiService } from '../services/calendar-api.service';
import {
  CalendarDayActions,
  CalendarEventActions,
  CalendarFilterActions,
  CalendarMonthActions,
  CalendarReferenceActions,
} from './calendar.actions';
import {
  selectDayEventsCurrentPage,
  selectFilters,
  selectSelectedDay,
} from './calendar.selectors';

@Injectable()
export class CalendarEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(CalendarApiService);
  private readonly router = inject(Router);

  // ─── Filter → URL Sync ────────────────────────────────────────────────────

  syncFiltersToUrl$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CalendarFilterActions.setFilters,
          CalendarFilterActions.setMonth,
          CalendarFilterActions.toggleEventType,
          CalendarFilterActions.toggleLabel,
          CalendarFilterActions.setCountry,
          CalendarFilterActions.toggleShowDismissed,
          CalendarFilterActions.resetFilters,
        ),
        debounceTime(50),
        withLatestFrom(this.store.select(selectFilters)),
        tap(([, filters]) => {
          const queryParams: Record<string, string | null> = {
            month: filters.month || null,
            types: filters.eventTypes.length ? filters.eventTypes.join(',') : null,
            labels: filters.labelIds.length ? filters.labelIds.join(',') : null,
            country: filters.countryCode ?? null,
            dismissed: filters.showDismissed ? 'true' : null,
          };
          this.router.navigate([], {
            queryParams,
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        }),
      ),
    { dispatch: false },
  );

  // ─── Load Month Events on Filter Change ───────────────────────────────────

  loadMonthEventsOnFilterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CalendarFilterActions.setFilters,
        CalendarFilterActions.setMonth,
        CalendarFilterActions.toggleEventType,
        CalendarFilterActions.toggleLabel,
        CalendarFilterActions.setCountry,
        CalendarFilterActions.toggleShowDismissed,
        CalendarFilterActions.resetFilters,
        CalendarFilterActions.loadFromQueryParams,
      ),
      debounceTime(150),
      withLatestFrom(this.store.select(selectFilters)),
      map(([, filters]) => CalendarMonthActions.loadMonthEvents({ filters })),
    ),
  );

  // ─── Load Month Events ────────────────────────────────────────────────────

  loadMonthEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarMonthActions.loadMonthEvents),
      switchMap(({ filters }) =>
        this.api.getMonthEvents(filters).pipe(
          map(({ events, typeCounts }) =>
            CalendarMonthActions.loadMonthEventsSuccess({ events, typeCounts }),
          ),
          catchError((err) =>
            of(
              CalendarMonthActions.loadMonthEventsFailure({
                error: err?.message ?? 'Failed to load events',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // ─── Load Day Events on Day Selection ────────────────────────────────────

  loadDayEventsOnSelect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarDayActions.selectDay),
      map(({ date }) => CalendarDayActions.loadDayEvents({ date, page: 1 })),
    ),
  );

  // ─── Load Day Events (Initial + Pagination) ───────────────────────────────

  loadDayEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarDayActions.loadDayEvents),
      withLatestFrom(this.store.select(selectFilters)),
      switchMap(([{ date, page }, filters]) =>
        this.api.getDayEvents(date, page, filters.showDismissed).pipe(
          map((response) =>
            CalendarDayActions.loadDayEventsSuccess({ response, page }),
          ),
          catchError((err) =>
            of(
              CalendarDayActions.loadDayEventsFailure({
                error: err?.message ?? 'Failed to load day events',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // ─── Load More Day Events (Infinite Scroll) ───────────────────────────────

  loadMoreDayEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarDayActions.loadMoreDayEvents),
      withLatestFrom(
        this.store.select(selectSelectedDay),
        this.store.select(selectDayEventsCurrentPage),
      ),
      map(([, date, page]) =>
        CalendarDayActions.loadDayEvents({ date: date!, page: page + 1 }),
      ),
    ),
  );

  // ─── Load Reference Data ──────────────────────────────────────────────────

  loadEventLabels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarReferenceActions.loadEventLabels),
      exhaustMap(() =>
        this.api.getEventLabels().pipe(
          map((labels) => CalendarReferenceActions.loadEventLabelsSuccess({ labels })),
          catchError(() =>
            of(
              CalendarReferenceActions.loadEventLabelsFailure({
                error: 'Failed to load labels',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarReferenceActions.loadCountries),
      exhaustMap(() =>
        this.api.getCountries().pipe(
          map((countries) =>
            CalendarReferenceActions.loadCountriesSuccess({ countries }),
          ),
          catchError(() =>
            of(
              CalendarReferenceActions.loadCountriesFailure({
                error: 'Failed to load countries',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // ─── Event Actions ────────────────────────────────────────────────────────

  useEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarEventActions.useEvent),
      exhaustMap(({ eventId }) =>
        this.api.useEvent(eventId).pipe(
          map(({ event }) => CalendarEventActions.useEventSuccess({ event })),
          catchError((err) =>
            of(
              CalendarEventActions.useEventFailure({
                error: err?.message ?? 'Failed to use event',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  dismissEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarEventActions.dismissEvent),
      exhaustMap(({ eventId, reason }) =>
        this.api.dismissEvent(eventId, reason).pipe(
          map(({ event }) => CalendarEventActions.dismissEventSuccess({ event })),
          catchError((err) =>
            of(
              CalendarEventActions.dismissEventFailure({
                error: err?.message ?? 'Failed to dismiss event',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  restoreEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarEventActions.restoreEvent),
      exhaustMap(({ eventId }) =>
        this.api.restoreEvent(eventId).pipe(
          map(({ event }) => CalendarEventActions.restoreEventSuccess({ event })),
          catchError((err) =>
            of(
              CalendarEventActions.restoreEventFailure({
                error: err?.message ?? 'Failed to restore event',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  reloadDayEventsAfterAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CalendarEventActions.dismissEventSuccess,
        CalendarEventActions.restoreEventSuccess,
      ),
      withLatestFrom(this.store.select(selectSelectedDay)),
      map(([, date]) => CalendarDayActions.loadDayEvents({ date: date!, page: 1 })),
    ),
  );
}
