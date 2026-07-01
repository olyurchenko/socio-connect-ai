// ─── Reference Options ────────────────────────────────────────────────────────

export interface RegionOption {
  id: string;
  name: string;
  locationCount: number;
}

export interface CategoryOption {
  id: string;
  name: string;
  color: string;
  locationCount: number;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Grocery: '#16a34a',
  Pharmacy: '#2563eb',
  Restaurant: '#d97706',
  Café: '#92400e',
  Retail: '#7c3aed',
};

// ─── Matched Location ─────────────────────────────────────────────────────────

export interface RelevanceBreakdown {
  isNationwide: boolean;
  distancePercent: number;
  distanceKm?: number;
  categoryPercent: number;
  categoryLabel: string;
}

export interface MatchedLocation {
  id: string;
  name: string;
  area: string;
  regionId: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  relevanceScore: number;
  relevanceBreakdown: RelevanceBreakdown;
  lastPostDate: string | null;
  distanceMeters: number | null;
  latitude: number;
  longitude: number;
  selected: boolean;
  deselectReason?: string;
}

// ─── API Request/Response Models ──────────────────────────────────────────────

export interface GetMatchedLocationsRequest {
  eventId: string;
  regionIds: string[];
  categoryIds: string[];
}

export interface UpdateLocationSelectionRequest {
  eventId: string;
  locationId: string;
  selected: boolean;
  reason?: string;
}

export interface BulkUpdateLocationSelectionRequest {
  eventId: string;
  locationIds: string[];
  selected: boolean;
  reason?: string;
}
