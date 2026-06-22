import { createFeature } from '@ngrx/store';
import { CALENDAR_FEATURE_KEY, calendarReducer } from './calendar.reducer';

export const calendarFeature = createFeature({
  name: CALENDAR_FEATURE_KEY,
  reducer: calendarReducer,
});
