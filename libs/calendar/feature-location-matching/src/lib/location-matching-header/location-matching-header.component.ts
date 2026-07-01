import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { CalendarFlowActions } from '@socio-connect/calendar/data-access';
import { CalendarEvent, EventType } from '@socio-connect/calendar/utils-models';

const TYPE_LABELS: Record<string, string> = {
  [EventType.LOCATION]: 'Location Event',
  [EventType.CALENDAR]: 'Calendar Event',
  [EventType.WEATHER]: 'Weather Event',
};

@Component({
  selector: 'sc-location-matching-header',
  standalone: true,
  imports: [],
  templateUrl: './location-matching-header.component.html',
  styleUrl: './location-matching-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationMatchingHeaderComponent {
  private readonly store = inject(Store);

  readonly event = input.required<CalendarEvent>();
  readonly radiusMeters = input<number | null>(null);

  protected readonly typeClass = computed(() => `type-badge--${this.event().type.toLowerCase()}`);

  protected readonly typeLabel = computed(() => {
    const event = this.event();
    const base = TYPE_LABELS[event.type] ?? event.type;
    return event.subtype ? `${base} · ${event.subtype}` : base;
  });

  protected readonly metaText = computed(() => {
    const event = this.event();
    const eligible = event.eligibleLocationsCount ?? 0;
    const rank = event.providerRank;
    const rankText = rank !== undefined ? ` · rank ${rank}` : '';

    if (event.type === EventType.LOCATION && this.radiusMeters()) {
      const km = Math.round((this.radiusMeters() as number) / 1000);
      return `${eligible} eligible locations within ${km}km${rankText}`;
    }
    return `${eligible} eligible locations nationwide${rankText}`;
  });

  changeTrigger(): void {
    this.store.dispatch(CalendarFlowActions.goToStep({ index: 0 }));
  }
}
