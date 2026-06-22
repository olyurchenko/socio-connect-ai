import { CalendarEvent, EventTypeCounts } from './event.models';

// ─── API Request Models ───────────────────────────────────────────────────────

export interface GetMonthEventsRequest {
  month: string;
  types?: string[];
  labelIds?: string[];
  countryCode?: string | null;
  showDismissed?: boolean;
}

export interface GetDayEventsRequest {
  date: string;
  page: number;
  pageSize: number;
  showDismissed?: boolean;
}

export interface UseEventRequest {
  eventId: string;
}

export interface DismissEventRequest {
  eventId: string;
  reason?: string;
}

export interface RestoreEventRequest {
  eventId: string;
}

// ─── API Response Models ──────────────────────────────────────────────────────

export interface MonthEventsResponse {
  events: CalendarEvent[];
  typeCounts: EventTypeCounts;
}

export interface EventActionResponse {
  event: CalendarEvent;
  message: string;
}

// ─── API Error ────────────────────────────────────────────────────────────────

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
