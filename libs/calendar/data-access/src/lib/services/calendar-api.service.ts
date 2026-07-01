// TODO: Remove mocks and restore HTTP calls when BE is ready
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  CalendarEvent,
  CalendarFilters,
  Country,
  EventActionResponse,
  EventLabel,
  EventStatus,
  EventType,
  MonthEventsResponse,
  PaginatedResponse,
} from '@socio-connect/calendar/utils-models';

const MOCK_LABELS: EventLabel[] = [
  { id: 'label-1', name: 'Marketing', color: '#6366f1' },
  { id: 'label-2', name: 'Product Launch', color: '#f59e0b' },
  { id: 'label-3', name: 'Community', color: '#10b981' },
  { id: 'label-4', name: 'Sales', color: '#ef4444' },
];

const MOCK_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flagEmoji: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flagEmoji: '🇬🇧' },
  { code: 'DE', name: 'Germany', flagEmoji: '🇩🇪' },
  { code: 'UA', name: 'Ukraine', flagEmoji: '🇺🇦' },
  { code: 'FR', name: 'France', flagEmoji: '🇫🇷' },
];

const MOCK_EVENTS: CalendarEvent[] = [
  // ── Today: July 1 — mix of statuses to test full flow ──────────────────────
  {
    id: 'evt-1',
    title: 'Kyiv Tech Meetup',
    type: EventType.LOCATION,
    status: EventStatus.ACTIVE,
    labelId: 'label-3',
    label: MOCK_LABELS[2],
    startDate: '2026-07-01',
    locationCount: 1,
    location: { city: 'Kyiv', countryCode: 'UA', latitude: 50.4501, longitude: 30.5234 },
    subtype: 'Tech',
    providerRank: 82,
    eligibleLocationsCount: 34,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'evt-2',
    title: 'Summer Sale Campaign',
    type: EventType.CALENDAR,
    status: EventStatus.ACTIVE,
    labelId: 'label-1',
    label: MOCK_LABELS[0],
    startDate: '2026-07-01',
    locationCount: 0,
    location: { city: 'Chicago', countryCode: 'US', latitude: 41.8781, longitude: -87.6298 },
    isRecurring: false,
    subtype: 'Retail',
    providerRank: 64,
    eligibleLocationsCount: 58,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'evt-3',
    title: 'Thunderstorm Warning',
    type: EventType.WEATHER,
    status: EventStatus.ACTIVE,
    labelId: 'label-3',
    label: MOCK_LABELS[2],
    startDate: '2026-07-01',
    locationCount: 0,
    location: { city: 'Miami', countryCode: 'US', latitude: 25.7617, longitude: -80.1918 },
    subtype: 'Storm',
    providerRank: 91,
    eligibleLocationsCount: 47,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'evt-4',
    title: 'Product Launch Webinar',
    type: EventType.CALENDAR,
    status: EventStatus.USED,
    labelId: 'label-2',
    label: MOCK_LABELS[1],
    startDate: '2026-07-01',
    locationCount: 0,
    location: { city: 'San Francisco', countryCode: 'US', latitude: 37.7749, longitude: -122.4194 },
    subtype: 'Product Launch',
    providerRank: 55,
    eligibleLocationsCount: 21,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'evt-5',
    title: 'London Marathon',
    type: EventType.LOCATION,
    status: EventStatus.DISMISSED,
    labelId: 'label-4',
    label: MOCK_LABELS[3],
    startDate: '2026-07-01',
    locationCount: 1,
    location: { city: 'London', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278 },
    dismissalReason: 'Not relevant this quarter',
    subtype: 'Sports',
    providerRank: 100,
    eligibleLocationsCount: 58,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  // ── Other July dates ─────────────────────────────────────────────────────────
  {
    id: 'evt-6',
    title: 'New York Tech Summit',
    type: EventType.LOCATION,
    status: EventStatus.ACTIVE,
    labelId: 'label-2',
    label: MOCK_LABELS[1],
    startDate: '2026-07-25',
    endDate: '2026-07-27',
    locationCount: 1,
    location: { city: 'New York', countryCode: 'US', latitude: 40.7128, longitude: -74.006 },
    subtype: 'Technology',
    providerRank: 76,
    eligibleLocationsCount: 42,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'evt-7',
    title: 'Black Friday Pre-Sale',
    type: EventType.CALENDAR,
    status: EventStatus.ACTIVE,
    labelId: 'label-1',
    label: MOCK_LABELS[0],
    startDate: '2026-07-28',
    locationCount: 0,
    location: { city: 'Manchester', countryCode: 'GB', latitude: 53.4808, longitude: -2.2426 },
    subtype: 'Retail',
    providerRank: 68,
    eligibleLocationsCount: 65,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'evt-8',
    title: 'Paris Fashion Week',
    type: EventType.LOCATION,
    status: EventStatus.ACTIVE,
    labelId: 'label-1',
    label: MOCK_LABELS[0],
    startDate: '2026-07-28',
    locationCount: 1,
    location: { city: 'Paris', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522 },
    subtype: 'Fashion',
    providerRank: 88,
    eligibleLocationsCount: 39,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'evt-9',
    title: 'Heavy Rain Warning',
    type: EventType.WEATHER,
    status: EventStatus.ACTIVE,
    labelId: 'label-3',
    label: MOCK_LABELS[2],
    startDate: '2026-07-15',
    locationCount: 0,
    location: { city: 'Hamburg', countryCode: 'DE', latitude: 53.5511, longitude: 9.9937 },
    subtype: 'Rain',
    providerRank: 73,
    eligibleLocationsCount: 51,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'evt-10',
    title: 'Community Meetup Berlin',
    type: EventType.LOCATION,
    status: EventStatus.USED,
    labelId: 'label-3',
    label: MOCK_LABELS[2],
    startDate: '2026-07-05',
    locationCount: 1,
    location: { city: 'Berlin', countryCode: 'DE', latitude: 52.52, longitude: 13.405 },
    isRecurring: true,
    subtype: 'Community',
    providerRank: 60,
    eligibleLocationsCount: 28,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'evt-11',
    title: 'Sales Q2 Review',
    type: EventType.CALENDAR,
    status: EventStatus.ACTIVE,
    labelId: 'label-4',
    label: MOCK_LABELS[3],
    startDate: '2026-07-30',
    locationCount: 0,
    location: { city: 'Lyon', countryCode: 'FR', latitude: 45.764, longitude: 4.8357 },
    subtype: 'Sales',
    providerRank: 45,
    eligibleLocationsCount: 19,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'evt-12',
    title: 'Heat Wave Alert',
    type: EventType.WEATHER,
    status: EventStatus.ACTIVE,
    labelId: 'label-3',
    label: MOCK_LABELS[2],
    startDate: '2026-07-30',
    locationCount: 0,
    location: { city: 'Odesa', countryCode: 'UA', latitude: 46.4825, longitude: 30.7233 },
    subtype: 'Heat',
    providerRank: 79,
    eligibleLocationsCount: 44,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'evt-13',
    title: 'Berlin Product Conf',
    type: EventType.LOCATION,
    status: EventStatus.ACTIVE,
    labelId: 'label-2',
    label: MOCK_LABELS[1],
    startDate: '2026-07-18',
    locationCount: 1,
    location: { city: 'Berlin', countryCode: 'DE', latitude: 52.52, longitude: 13.405 },
    subtype: 'Conference',
    providerRank: 70,
    eligibleLocationsCount: 33,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'evt-14',
    title: 'Recurring Sales Sync',
    type: EventType.CALENDAR,
    status: EventStatus.ACTIVE,
    labelId: 'label-4',
    label: MOCK_LABELS[3],
    startDate: '2026-07-24',
    locationCount: 0,
    location: { city: 'Bristol', countryCode: 'GB', latitude: 51.4545, longitude: -2.5879 },
    isRecurring: true,
    subtype: 'Sales',
    providerRank: 50,
    eligibleLocationsCount: 25,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
];

@Injectable({ providedIn: 'root' })
export class CalendarApiService {
  getMonthEvents(filters: CalendarFilters): Observable<MonthEventsResponse> {
    let events = MOCK_EVENTS.filter((e) => e.startDate.startsWith(filters.month));

    if (filters.eventTypes.length) {
      events = events.filter((e) => filters.eventTypes.includes(e.type));
    }
    if (filters.labelIds.length) {
      events = events.filter((e) => filters.labelIds.includes(e.labelId));
    }
    if (filters.countryCode) {
      events = events.filter((e) => e.location?.countryCode === filters.countryCode);
    }
    if (!filters.showDismissed) {
      events = events.filter((e) => e.status !== EventStatus.DISMISSED);
    }

    const typeCounts = {
      [EventType.LOCATION]: events.filter((e) => e.type === EventType.LOCATION).length,
      [EventType.CALENDAR]: events.filter((e) => e.type === EventType.CALENDAR).length,
      [EventType.WEATHER]: events.filter((e) => e.type === EventType.WEATHER).length,
    };

    return of({ events: events.map((e) => ({ ...e })), typeCounts }).pipe(delay(400));
  }

  getDayEvents(
    date: string,
    page: number,
    showDismissed = false,
    pageSize = 20,
  ): Observable<PaginatedResponse<CalendarEvent>> {
    let events = MOCK_EVENTS.filter((e) => e.startDate === date);

    if (!showDismissed) {
      events = events.filter((e) => e.status !== EventStatus.DISMISSED);
    }

    const start = (page - 1) * pageSize;
    const items = events.slice(start, start + pageSize);

    return of({
      items: items.map((e) => ({ ...e })),
      total: events.length,
      page,
      pageSize,
      hasMore: start + pageSize < events.length,
    }).pipe(delay(300));
  }

  getEventLabels(): Observable<EventLabel[]> {
    return of(MOCK_LABELS).pipe(delay(200));
  }

  getCountries(): Observable<Country[]> {
    return of(MOCK_COUNTRIES).pipe(delay(200));
  }

  dismissEvent(eventId: string, reason?: string): Observable<EventActionResponse> {
    const index = MOCK_EVENTS.findIndex((e) => e.id === eventId);
    if (index === -1) throw new Error(`Mock: event ${eventId} not found`);
    MOCK_EVENTS[index] = { ...MOCK_EVENTS[index], status: EventStatus.DISMISSED, dismissalReason: reason };
    return of({ event: { ...MOCK_EVENTS[index] }, message: 'Event dismissed' }).pipe(delay(300));
  }

  restoreEvent(eventId: string): Observable<EventActionResponse> {
    const index = MOCK_EVENTS.findIndex((e) => e.id === eventId);
    if (index === -1) throw new Error(`Mock: event ${eventId} not found`);
    MOCK_EVENTS[index] = { ...MOCK_EVENTS[index], status: EventStatus.ACTIVE, dismissalReason: undefined };
    return of({ event: { ...MOCK_EVENTS[index] }, message: 'Event restored' }).pipe(delay(300));
  }
}
