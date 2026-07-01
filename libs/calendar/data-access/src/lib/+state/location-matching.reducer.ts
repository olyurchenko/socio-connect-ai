import { createReducer, on } from '@ngrx/store';
import { LocationMatchingState } from '@socio-connect/calendar/utils-models';
import { LocationMatchingActions } from './location-matching.actions';

export const LOCATION_MATCHING_FEATURE_KEY = 'locationMatching';

export const initialLocationMatchingState: LocationMatchingState = {
  event: null,

  regions: [],
  regionsLoadingState: 'idle',

  categories: [],
  categoriesLoadingState: 'idle',

  radiusMeters: null,
  radiusLoadingState: 'idle',

  locations: [],
  locationsLoadingState: 'idle',
  locationsError: null,

  activeRegionIds: [],
  activeCategoryIds: [],
};

export const locationMatchingReducer = createReducer(
  initialLocationMatchingState,

  on(LocationMatchingActions.enterFlow, (state, { event }) => ({
    ...initialLocationMatchingState,
    event,
    regionsLoadingState: 'loading' as const,
    categoriesLoadingState: 'loading' as const,
    radiusLoadingState: 'loading' as const,
    locationsLoadingState: 'loading' as const,
  })),

  // ─── Regions ────────────────────────────────────────────────────────────────

  on(LocationMatchingActions.loadRegionsSuccess, (state, { regions }) => ({
    ...state,
    regions,
    regionsLoadingState: 'success' as const,
    activeRegionIds: state.activeRegionIds.length
      ? state.activeRegionIds
      : regions.map((r) => r.id),
  })),

  on(LocationMatchingActions.loadRegionsFailure, (state) => ({
    ...state,
    regionsLoadingState: 'error' as const,
  })),

  // ─── Categories ─────────────────────────────────────────────────────────────

  on(LocationMatchingActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    categoriesLoadingState: 'success' as const,
    activeCategoryIds: state.activeCategoryIds.length
      ? state.activeCategoryIds
      : categories.map((c) => c.id),
  })),

  on(LocationMatchingActions.loadCategoriesFailure, (state) => ({
    ...state,
    categoriesLoadingState: 'error' as const,
  })),

  // ─── Radius ─────────────────────────────────────────────────────────────────

  on(LocationMatchingActions.loadRadiusSuccess, (state, { radiusMeters }) => ({
    ...state,
    radiusMeters,
    radiusLoadingState: 'success' as const,
  })),

  on(LocationMatchingActions.loadRadiusFailure, (state) => ({
    ...state,
    radiusLoadingState: 'error' as const,
  })),

  // ─── Locations ──────────────────────────────────────────────────────────────

  on(LocationMatchingActions.loadLocations, (state) => ({
    ...state,
    locationsLoadingState: 'loading' as const,
    locationsError: null,
  })),

  on(LocationMatchingActions.loadLocationsSuccess, (state, { locations }) => ({
    ...state,
    locations,
    locationsLoadingState: 'success' as const,
  })),

  on(LocationMatchingActions.loadLocationsFailure, (state, { error }) => ({
    ...state,
    locationsLoadingState: 'error' as const,
    locationsError: error,
  })),

  // ─── Filters ────────────────────────────────────────────────────────────────

  on(LocationMatchingActions.toggleRegion, (state, { id }) => ({
    ...state,
    activeRegionIds: state.activeRegionIds.includes(id)
      ? state.activeRegionIds.filter((r) => r !== id)
      : [...state.activeRegionIds, id],
  })),

  on(LocationMatchingActions.toggleCategory, (state, { id }) => ({
    ...state,
    activeCategoryIds: state.activeCategoryIds.includes(id)
      ? state.activeCategoryIds.filter((c) => c !== id)
      : [...state.activeCategoryIds, id],
  })),

  // ─── Selection ──────────────────────────────────────────────────────────────

  on(LocationMatchingActions.setLocationSelectionSuccess, (state, { locationId, selected, reason }) => ({
    ...state,
    locations: state.locations.map((l) =>
      l.id === locationId ? { ...l, selected, deselectReason: selected ? undefined : reason } : l,
    ),
  })),

  on(LocationMatchingActions.bulkSetSelectionSuccess, (state, { locationIds, selected, reason }) => ({
    ...state,
    locations: state.locations.map((l) =>
      locationIds.includes(l.id)
        ? { ...l, selected, deselectReason: selected ? undefined : reason }
        : l,
    ),
  })),
);
