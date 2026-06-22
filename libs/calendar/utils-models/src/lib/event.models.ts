// ─── Enums ────────────────────────────────────────────────────────────────────

export enum EventType {
  LOCATION = 'LOCATION',
  CALENDAR = 'CALENDAR',
  WEATHER = 'WEATHER',
}

export enum EventStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  DISMISSED = 'DISMISSED',
}

// ─── Core Domain Models ───────────────────────────────────────────────────────

export interface EventLabel {
  id: string;
  name: string;
  color: string;
}

export interface Country {
  code: string;
  name: string;
  flagEmoji?: string;
}

export interface EventLocation {
  city: string;
  area?: string;
  street?: string;
  countryCode: string;
  latitude?: number;
  longitude?: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  status: EventStatus;
  labelId: string;
  label?: EventLabel;
  startDate: string;
  endDate?: string;
  locationCount: number;
  location?: EventLocation;
  dismissalReason?: string;
  isRecurring?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Calendar Day Model ───────────────────────────────────────────────────────

export interface CalendarDay {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  events: CalendarEvent[];
  hasOverflow: boolean;
}

// ─── Response Wrappers ────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface EventTypeCounts {
  [EventType.LOCATION]: number;
  [EventType.CALENDAR]: number;
  [EventType.WEATHER]: number;
}
