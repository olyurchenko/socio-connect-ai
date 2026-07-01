import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ConnectionPositionPair, OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { MatchedLocation } from '@socio-connect/calendar/utils-models';

const STALE_DAYS_THRESHOLD = 14;

@Component({
  selector: 'sc-location-row',
  standalone: true,
  imports: [CommonModule, OverlayModule, FormsModule],
  templateUrl: './location-row.component.html',
  styleUrl: './location-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationRowComponent {
  readonly location = input.required<MatchedLocation>();

  readonly selectionChange = output<{ selected: boolean; reason?: string }>();

  protected readonly isReasonPopoverOpen = signal(false);
  protected readonly isTooltipOpen = signal(false);
  protected readonly reasonText = signal('');

  protected readonly overlayPositions: ConnectionPositionPair[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
  ];

  protected readonly relevanceColor = computed(() => {
    const score = this.location().relevanceScore;
    if (score >= 70) return '#16a34a';
    if (score >= 50) return '#d97706';
    return '#dc2626';
  });

  protected readonly distanceText = computed(() => {
    const breakdown = this.location().relevanceBreakdown;
    if (breakdown.isNationwide) {
      return `${breakdown.distancePercent}% (applies nationwide)`;
    }
    return `${breakdown.distancePercent}% (${breakdown.distanceKm} km from event centre)`;
  });

  private readonly daysSincePost = computed(() => {
    const date = this.location().lastPostDate;
    return date === null ? null : Math.floor((Date.now() - Date.parse(date)) / 86_400_000);
  });

  protected readonly isStale = computed(() => {
    const days = this.daysSincePost();
    return days === null || days > STALE_DAYS_THRESHOLD;
  });

  protected readonly lastPostLabel = computed(() => {
    const date = this.location().lastPostDate;
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  });

  onCheckboxClick(): void {
    if (this.location().selected) {
      this.reasonText.set('');
      this.isReasonPopoverOpen.set(true);
    } else {
      this.selectionChange.emit({ selected: true });
    }
  }

  skipReason(): void {
    this.isReasonPopoverOpen.set(false);
    this.selectionChange.emit({ selected: false });
  }

  confirmReason(): void {
    this.isReasonPopoverOpen.set(false);
    this.selectionChange.emit({ selected: false, reason: this.reasonText() || undefined });
  }
}
