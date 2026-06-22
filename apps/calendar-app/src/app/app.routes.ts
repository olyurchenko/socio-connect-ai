import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'calendar-flow',
    pathMatch: 'full',
  },
  {
    path: 'calendar-flow',
    loadChildren: () =>
      import('@socio-connect/calendar/feature-flow').then(
        (m) => m.calendarFlowRoutes,
      ),
  },
  {
    path: '**',
    redirectTo: 'calendar-flow',
  },
];
