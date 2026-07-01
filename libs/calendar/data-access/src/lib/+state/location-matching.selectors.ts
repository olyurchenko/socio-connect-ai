import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LocationMatchingState } from '@socio-connect/calendar/utils-models';
import { LOCATION_MATCHING_FEATURE_KEY } from './location-matching.reducer';

export const selectLocationMatchingFeature = createFeatureSelector<LocationMatchingState>(
  LOCATION_MATCHING_FEATURE_KEY,
);

export const selectLocationMatchingEvent = createSelector(
  selectLocationMatchingFeature,
  (state) => state.event,
);

export const selectRegions = createSelector(selectLocationMatchingFeature, (state) => state.regions);

export const selectCategories = createSelector(
  selectLocationMatchingFeature,
  (state) => state.categories,
);

export const selectRadiusMeters = createSelector(
  selectLocationMatchingFeature,
  (state) => state.radiusMeters,
);

export const selectActiveRegionIds = createSelector(
  selectLocationMatchingFeature,
  (state) => state.activeRegionIds,
);

export const selectActiveCategoryIds = createSelector(
  selectLocationMatchingFeature,
  (state) => state.activeCategoryIds,
);

export const selectVisibleLocations = createSelector(
  selectLocationMatchingFeature,
  (state) => state.locations,
);

export const selectLocationsLoading = createSelector(
  selectLocationMatchingFeature,
  (state) => state.locationsLoadingState === 'loading',
);

export const selectSelectedLocations = createSelector(selectVisibleLocations, (locations) =>
  locations.filter((l) => l.selected),
);

export const selectSelectedLocationsCount = createSelector(
  selectSelectedLocations,
  (locations) => locations.length,
);

export const selectLocationMatchingInitialLoading = createSelector(
  selectLocationMatchingFeature,
  (state) =>
    state.regionsLoadingState === 'loading' ||
    state.categoriesLoadingState === 'loading' ||
    state.radiusLoadingState === 'loading' ||
    (state.locationsLoadingState === 'loading' && state.locations.length === 0),
);
