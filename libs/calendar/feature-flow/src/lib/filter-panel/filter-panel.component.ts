import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  CalendarDayActions,
  CalendarEventActions,
  CalendarFilterActions,
  CalendarReferenceActions,
  selectActiveCountryCode,
  selectActiveLabelIds,
  selectActiveEventTypes,
  selectCountries,
  selectEventLabels,
  selectEventTypeCounts,
  selectFilters,
  selectSelectedMonth,
  selectShowDismissed,
  selectTotalEventsCount,
} from '@socio-connect/calendar/data-access';
import {
  EventType,
  buildMonthOptions,
  getCurrentMonthValue,
} from '@socio-connect/calendar/utils-models';
import {
  UiButtonComponent,
  UiSelectComponent,
  UiSlideToggleComponent,
  UiChipsComponent,
} from '@socio-connect/shared/ui-material-wrappers';

@Component({
  selector: 'sc-filter-panel',
  standalone: true,
  imports: [
    CommonModule,
    MatBadgeModule,
    MatTooltipModule,
    UiButtonComponent,
    UiSelectComponent,
    UiSlideToggleComponent,
    UiChipsComponent,
  ],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterPanelComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // ─── Store Signals ──────────────────────────────────────────────────────────
  protected readonly filters = this.store.selectSignal(selectFilters);
  protected readonly selectedMonth = this.store.selectSignal(selectSelectedMonth);
  protected readonly activeEventTypes = this.store.selectSignal(selectActiveEventTypes);
  protected readonly activeLabelIds = this.store.selectSignal(selectActiveLabelIds);
  protected readonly activeCountryCode = this.store.selectSignal(selectActiveCountryCode);
  protected readonly showDismissed = this.store.selectSignal(selectShowDismissed);
  protected readonly totalEventsCount = this.store.selectSignal(selectTotalEventsCount);
  protected readonly eventTypeCounts = this.store.selectSignal(selectEventTypeCounts);
  protected readonly eventLabels = this.store.selectSignal(selectEventLabels);
  protected readonly countries = this.store.selectSignal(selectCountries);

  // ─── Static Options ─────────────────────────────────────────────────────────
  protected readonly monthOptions = buildMonthOptions(true, 13);

  protected readonly eventTypeOptions = [
    {
      value: EventType.LOCATION,
      label: 'Location Events',
      icon: 'location_on',
      colorVar: '--sc-event-location',
      bgVar: '--sc-event-location-bg',
    },
    {
      value: EventType.CALENDAR,
      label: 'Calendar Events',
      icon: 'event',
      colorVar: '--sc-event-calendar',
      bgVar: '--sc-event-calendar-bg',
    },
    {
      value: EventType.WEATHER,
      label: 'Weather Events',
      icon: 'cloud',
      colorVar: '--sc-event-weather',
      bgVar: '--sc-event-weather-bg',
    },
  ];

  readonly EventType = EventType;

  ngOnInit(): void {
    this.store.dispatch(CalendarReferenceActions.loadEventLabels());
    this.store.dispatch(CalendarReferenceActions.loadCountries());

    const qp = this.route.snapshot.queryParams as Record<string, string>;
    if (Object.keys(qp).length) {
      this.store.dispatch(CalendarFilterActions.loadFromQueryParams({ params: qp }));
    }
  }

  get countrySelectOptions() {
    return this.countries().map((c) => ({ value: c.code, label: c.name }));
  }

  get labelChipItems() {
    return this.eventLabels().map((l) => ({
      value: l.id,
      label: l.name,
      color: l.color,
    }));
  }

  onMonthChange(month: string | string[] | null): void {
    if (typeof month === 'string') {
      this.store.dispatch(CalendarFilterActions.setMonth({ month }));
    }
  }

  onEventTypeToggle(type: EventType): void {
    this.store.dispatch(CalendarFilterActions.toggleEventType({ eventType: type }));
  }

  isEventTypeActive(type: EventType): boolean {
    return this.activeEventTypes().includes(type);
  }

  onLabelChipSelected(labelId: string): void {
    this.store.dispatch(CalendarFilterActions.toggleLabel({ labelId }));
  }

  onLabelChipsChange(selectedIds: string[]): void {
    const current = this.activeLabelIds();
    const added = selectedIds.find((id) => !current.includes(id));
    const removed = current.find((id) => !selectedIds.includes(id));
    if (added) this.store.dispatch(CalendarFilterActions.toggleLabel({ labelId: added }));
    if (removed) this.store.dispatch(CalendarFilterActions.toggleLabel({ labelId: removed }));
  }

  onCountryChange(code: string | string[] | null): void {
    this.store.dispatch(
      CalendarFilterActions.setCountry({
        countryCode: typeof code === 'string' ? code : null,
      }),
    );
  }

  onDismissedToggle(val: boolean): void {
    this.store.dispatch(CalendarFilterActions.toggleShowDismissed());
  }

  onResetFilters(): void {
    this.store.dispatch(CalendarFilterActions.resetFilters());
  }
}
