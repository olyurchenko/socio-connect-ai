import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CalendarEvent,
  CategoryOption,
  MatchedLocation,
  RegionOption,
} from '@socio-connect/calendar/utils-models';

export const LocationMatchingActions = createActionGroup({
  source: 'Location Matching',
  events: {
    'Enter Flow': props<{ event: CalendarEvent }>(),

    'Load Regions': emptyProps(),
    'Load Regions Success': props<{ regions: RegionOption[] }>(),
    'Load Regions Failure': props<{ error: string }>(),

    'Load Categories': emptyProps(),
    'Load Categories Success': props<{ categories: CategoryOption[] }>(),
    'Load Categories Failure': props<{ error: string }>(),

    'Load Radius': emptyProps(),
    'Load Radius Success': props<{ radiusMeters: number }>(),
    'Load Radius Failure': props<{ error: string }>(),

    'Load Locations': props<{ regionIds: string[]; categoryIds: string[] }>(),
    'Load Locations Success': props<{ locations: MatchedLocation[] }>(),
    'Load Locations Failure': props<{ error: string }>(),

    'Toggle Region': props<{ id: string }>(),
    'Toggle Category': props<{ id: string }>(),

    'Set Location Selection': props<{
      locationId: string;
      selected: boolean;
      reason?: string;
    }>(),
    'Set Location Selection Success': props<{
      locationId: string;
      selected: boolean;
      reason?: string;
    }>(),

    'Select All Visible': emptyProps(),
    'Deselect All Visible': props<{ reason?: string }>(),
    'Bulk Set Selection Success': props<{
      locationIds: string[];
      selected: boolean;
      reason?: string;
    }>(),
  },
});
