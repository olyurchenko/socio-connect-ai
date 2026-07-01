import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { LocationMatchingApiService } from '../services/location-matching-api.service';
import { LocationMatchingActions } from './location-matching.actions';
import {
  selectActiveCategoryIds,
  selectActiveRegionIds,
  selectLocationMatchingEvent,
  selectVisibleLocations,
} from './location-matching.selectors';

@Injectable()
export class LocationMatchingEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly api = inject(LocationMatchingApiService);

  // ─── Enter Flow → Kick Off All Requests ──────────────────────────────────

  onEnterFlow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationMatchingActions.enterFlow),
      switchMap(() => [
        LocationMatchingActions.loadRegions(),
        LocationMatchingActions.loadCategories(),
        LocationMatchingActions.loadRadius(),
        LocationMatchingActions.loadLocations({ regionIds: [], categoryIds: [] }),
      ]),
    ),
  );

  // ─── Regions / Categories / Radius ────────────────────────────────────────

  loadRegions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationMatchingActions.loadRegions),
      withLatestFrom(this.store.select(selectLocationMatchingEvent)),
      filter(([, event]) => event !== null),
      switchMap(([, event]) =>
        this.api.getRegions(event!).pipe(
          map((regions) => LocationMatchingActions.loadRegionsSuccess({ regions })),
          catchError(() =>
            of(LocationMatchingActions.loadRegionsFailure({ error: 'Failed to load regions' })),
          ),
        ),
      ),
    ),
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationMatchingActions.loadCategories),
      withLatestFrom(this.store.select(selectLocationMatchingEvent)),
      filter(([, event]) => event !== null),
      switchMap(([, event]) =>
        this.api.getCategories(event!).pipe(
          map((categories) => LocationMatchingActions.loadCategoriesSuccess({ categories })),
          catchError(() =>
            of(
              LocationMatchingActions.loadCategoriesFailure({ error: 'Failed to load categories' }),
            ),
          ),
        ),
      ),
    ),
  );

  loadRadius$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationMatchingActions.loadRadius),
      withLatestFrom(this.store.select(selectLocationMatchingEvent)),
      filter(([, event]) => event !== null),
      switchMap(([, event]) =>
        this.api.getMatchRadius(event!).pipe(
          map(({ radiusMeters }) => LocationMatchingActions.loadRadiusSuccess({ radiusMeters })),
          catchError(() =>
            of(LocationMatchingActions.loadRadiusFailure({ error: 'Failed to load radius' })),
          ),
        ),
      ),
    ),
  );

  // ─── Locations ─────────────────────────────────────────────────────────────

  loadLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationMatchingActions.loadLocations),
      withLatestFrom(this.store.select(selectLocationMatchingEvent)),
      filter(([, event]) => event !== null),
      switchMap(([{ regionIds, categoryIds }, event]) =>
        this.api.getMatchedLocations(event!, regionIds, categoryIds).pipe(
          map((locations) => LocationMatchingActions.loadLocationsSuccess({ locations })),
          catchError(() =>
            of(
              LocationMatchingActions.loadLocationsFailure({
                error: 'Failed to load locations',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  onFilterToggle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationMatchingActions.toggleRegion, LocationMatchingActions.toggleCategory),
      withLatestFrom(
        this.store.select(selectActiveRegionIds),
        this.store.select(selectActiveCategoryIds),
      ),
      map(([, regionIds, categoryIds]) =>
        LocationMatchingActions.loadLocations({ regionIds, categoryIds }),
      ),
    ),
  );

  // ─── Selection ─────────────────────────────────────────────────────────────

  onSetSelection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationMatchingActions.setLocationSelection),
      withLatestFrom(this.store.select(selectLocationMatchingEvent)),
      filter(([, event]) => event !== null),
      switchMap(([{ locationId, selected, reason }, event]) =>
        this.api.updateLocationSelection(event!.id, locationId, selected, reason).pipe(
          map(() =>
            LocationMatchingActions.setLocationSelectionSuccess({ locationId, selected, reason }),
          ),
        ),
      ),
    ),
  );

  onSelectAllVisible$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationMatchingActions.selectAllVisible),
      withLatestFrom(
        this.store.select(selectLocationMatchingEvent),
        this.store.select(selectVisibleLocations),
      ),
      filter(([, event]) => event !== null),
      switchMap(([, event, locations]) => {
        const locationIds = locations.map((l) => l.id);
        return this.api.bulkUpdateLocationSelection(event!.id, locationIds, true, undefined).pipe(
          map(() =>
            LocationMatchingActions.bulkSetSelectionSuccess({ locationIds, selected: true }),
          ),
        );
      }),
    ),
  );

  onDeselectAllVisible$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LocationMatchingActions.deselectAllVisible),
      withLatestFrom(
        this.store.select(selectLocationMatchingEvent),
        this.store.select(selectVisibleLocations),
      ),
      filter(([, event]) => event !== null),
      switchMap(([{ reason }, event, locations]) => {
        const locationIds = locations.filter((l) => l.selected).map((l) => l.id);
        return this.api.bulkUpdateLocationSelection(event!.id, locationIds, false, reason).pipe(
          map(() =>
            LocationMatchingActions.bulkSetSelectionSuccess({ locationIds, selected: false, reason }),
          ),
        );
      }),
    ),
  );
}
