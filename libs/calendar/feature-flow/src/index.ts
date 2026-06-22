export { CalendarFlowComponent } from './lib/calendar-flow/calendar-flow.component';
export { FilterPanelComponent } from './lib/filter-panel/filter-panel.component';
export { CalendarGridComponent } from './lib/calendar-grid/calendar-grid.component';
export { DaySidenavComponent } from './lib/day-sidenav/day-sidenav.component';

import { Routes } from '@angular/router';
import { CalendarFlowComponent } from './lib/calendar-flow/calendar-flow.component';

export const calendarFlowRoutes: Routes = [
  {
    path: '',
    component: CalendarFlowComponent,
  },
];
