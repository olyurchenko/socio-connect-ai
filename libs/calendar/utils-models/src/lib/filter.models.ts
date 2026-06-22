import { EventType } from './event.models';

// ─── Filter State ─────────────────────────────────────────────────────────────

export interface CalendarFilters {
  month: string;
  eventTypes: EventType[];
  labelIds: string[];
  countryCode: string | null;
  showDismissed: boolean;
}

export const DEFAULT_FILTERS: Readonly<CalendarFilters> = {
  month: '',
  eventTypes: [],
  labelIds: [],
  countryCode: null,
  showDismissed: false,
} as const;

// ─── Query Params Serialization ───────────────────────────────────────────────

export interface CalendarQueryParams {
  month?: string;
  types?: string;
  labels?: string;
  country?: string;
  dismissed?: string;
}

export function filtersToQueryParams(filters: CalendarFilters): CalendarQueryParams {
  const params: CalendarQueryParams = {};

  if (filters.month) params.month = filters.month;
  if (filters.eventTypes.length) params.types = filters.eventTypes.join(',');
  if (filters.labelIds.length) params.labels = filters.labelIds.join(',');
  if (filters.countryCode) params.country = filters.countryCode;
  if (filters.showDismissed) params.dismissed = 'true';

  return params;
}

export function queryParamsToFilters(
  params: CalendarQueryParams,
  currentMonth: string,
): CalendarFilters {
  return {
    month: params.month ?? currentMonth,
    eventTypes: params.types
      ? (params.types.split(',') as EventType[]).filter((t) =>
          Object.values(EventType).includes(t),
        )
      : [],
    labelIds: params.labels ? params.labels.split(',') : [],
    countryCode: params.country ?? null,
    showDismissed: params.dismissed === 'true',
  };
}

// ─── Month Picker ─────────────────────────────────────────────────────────────

export interface MonthOption {
  value: string;
  label: string;
  isPast: boolean;
}

export function buildMonthOptions(
  startFromCurrentMonth: boolean,
  rangeMonths = 13,
): MonthOption[] {
  const now = new Date();
  const options: MonthOption[] = [];

  for (let i = 0; i < rangeMonths; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    options.push({ value, label, isPast: false });
  }

  if (!startFromCurrentMonth) {
    for (let i = 1; i <= 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      options.unshift({ value, label, isPast: true });
    }
  }

  return options;
}

export function getCurrentMonthValue(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
