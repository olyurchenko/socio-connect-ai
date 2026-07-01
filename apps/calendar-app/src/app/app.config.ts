import { ApplicationConfig, isDevMode } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withRouterConfig,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import {
  CalendarEffects,
  LocationMatchingEffects,
  calendarFeature,
  locationMatchingFeature,
} from '@socio-connect/calendar/data-access';
import { GOOGLE_MAPS_API_KEY } from '@socio-connect/calendar/feature-location-matching';
import { appRoutes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    provideStore({
      router: routerReducer,
      [calendarFeature.name]: calendarFeature.reducer,
      [locationMatchingFeature.name]: locationMatchingFeature.reducer,
    }),
    provideEffects([CalendarEffects, LocationMatchingEffects]),
    { provide: GOOGLE_MAPS_API_KEY, useValue: environment.googleMapsApiKey },
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
