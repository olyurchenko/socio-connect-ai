import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarEvent, EventStatus, EventType } from '@socio-connect/calendar/utils-models';
import { UiButtonComponent } from '@socio-connect/shared/ui-material-wrappers';

@Component({
  selector: 'sc-day-event-item',
  standalone: true,
  imports: [FormsModule, UiButtonComponent],
  templateUrl: './day-event-item.component.html',
  styleUrl: './day-event-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayEventItemComponent {
  readonly event = input.required<CalendarEvent>();
  readonly isPastDay = input.required<boolean>();
  readonly isActionPending = input(false);
  readonly showDismissed = input(false);

  protected readonly EventStatus = EventStatus;

  protected readonly isDismissing = signal(false);
  protected readonly dismissReason = signal('');

  readonly onUse = output<void>();
  readonly onDismiss = output<string | undefined>();
  readonly onRestore = output<void>();

  startDismiss(): void {
    this.isDismissing.set(true);
    this.dismissReason.set('');
  }

  cancelDismiss(): void {
    this.isDismissing.set(false);
    this.dismissReason.set('');
  }

  confirmDismiss(): void {
    this.onDismiss.emit(this.dismissReason() || undefined);
    this.isDismissing.set(false);
    this.dismissReason.set('');
  }

  getEventTypeLabel(type: EventType): string {
    return { LOCATION: 'Location', CALENDAR: 'Events', WEATHER: 'Weather' }[type] ?? type;
  }

  getEventTypeIcon(type: EventType): string {
    return {
      LOCATION: 'location_on',
      CALENDAR: 'event',
      WEATHER: 'wb_cloudy',
    }[type] ?? 'event';
  }

  getEventTypeClass(type: EventType): string {
    return {
      LOCATION: 'tag--location',
      CALENDAR: 'tag--calendar',
      WEATHER: 'tag--weather',
    }[type] ?? '';
  }

  formatDuration(event: CalendarEvent): string {
    if (!event.startDate) return '';
    const start = new Date(event.startDate);
    const startStr = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (!event.endDate) return startStr;
    const end = new Date(event.endDate);
    return `${startStr} – ${end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }

  formatLocation(event: CalendarEvent): string {
    if (!event.location) return '';
    const parts: string[] = [event.location.city];
    if (event.location.area) parts.push(event.location.area);
    if (event.location.street) parts.push(event.location.street);
    return parts.join(', ');
  }
}
