import { createFeature } from '@ngrx/store';
import { LOCATION_MATCHING_FEATURE_KEY, locationMatchingReducer } from './location-matching.reducer';

export const locationMatchingFeature = createFeature({
  name: LOCATION_MATCHING_FEATURE_KEY,
  reducer: locationMatchingReducer,
});
