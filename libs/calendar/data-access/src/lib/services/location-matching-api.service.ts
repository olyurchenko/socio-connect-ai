// TODO: Remove mocks and restore HTTP calls when BE is ready
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  CalendarEvent,
  CategoryOption,
  MatchedLocation,
  RegionOption,
} from '@socio-connect/calendar/utils-models';

const CATEGORY_POOL: Array<{ name: string; color: string }> = [
  { name: 'Grocery', color: '#16a34a' },
  { name: 'Pharmacy', color: '#2563eb' },
  { name: 'Restaurant', color: '#d97706' },
  { name: 'Café', color: '#92400e' },
  { name: 'Retail', color: '#7c3aed' },
];

const AREA_FRAGMENTS = [
  'North', 'South', 'East', 'West', 'Central',
  'Old Town', 'Riverside', 'Uptown', 'Harbor', 'Market Square',
];

const NATIONWIDE_ANCHORS = [
  { latitude: 51.5074, longitude: -0.1278 }, // London
  { latitude: 52.52, longitude: 13.405 }, // Berlin
  { latitude: 48.8566, longitude: 2.3522 }, // Paris
  { latitude: 40.7128, longitude: -74.006 }, // New York
  { latitude: 50.4501, longitude: 30.5234 }, // Kyiv
];

interface MockDataset {
  regions: RegionOption[];
  categories: CategoryOption[];
  radiusMeters: number;
  locations: MatchedLocation[];
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
  }
  return hash;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function haversineMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildDataset(event: CalendarEvent): MockDataset {
  const rng = mulberry32(hashString(event.id));
  const isNationwide = event.type !== 'LOCATION' || !event.location?.latitude;

  const anchor = isNationwide
    ? NATIONWIDE_ANCHORS[Math.floor(rng() * NATIONWIDE_ANCHORS.length)]
    : { latitude: event.location!.latitude!, longitude: event.location!.longitude! };

  const city = event.location?.city ?? 'the area';
  const regions: RegionOption[] = [
    { id: 'region-1', name: `${city} City`, locationCount: 0 },
    { id: 'region-2', name: `Co. ${city}`, locationCount: 0 },
    { id: 'region-3', name: `Greater ${city}`, locationCount: 0 },
  ];

  const categories: CategoryOption[] = CATEGORY_POOL.map((c, i) => ({
    id: `category-${i + 1}`,
    name: c.name,
    color: c.color,
    locationCount: 0,
  }));

  const radiusMeters = isNationwide ? 0 : 15000 + Math.floor(rng() * 15000);

  const total = 15 + Math.floor(rng() * 11); // 15–25 locations
  const locations: MatchedLocation[] = Array.from({ length: total }, (_, i) => {
    const region = regions[Math.floor(rng() * regions.length)];
    const category = categories[Math.floor(rng() * categories.length)];
    const area = AREA_FRAGMENTS[Math.floor(rng() * AREA_FRAGMENTS.length)];

    const jitterDegrees = isNationwide ? 4 : 0.15 * (0.2 + rng());
    const latitude = anchor.latitude + (rng() - 0.5) * 2 * jitterDegrees;
    const longitude = anchor.longitude + (rng() - 0.5) * 2 * jitterDegrees;

    const distanceMeters = isNationwide
      ? null
      : Math.round(haversineMeters(anchor.latitude, anchor.longitude, latitude, longitude));

    const distancePercent = isNationwide
      ? 100
      : Math.min(
          100,
          Math.max(40, Math.round(100 - (distanceMeters! / radiusMeters) * 45)),
        );

    const categoryPercent = Math.round(55 + rng() * 40);
    const relevanceScore = Math.max(40, Math.round((distancePercent + categoryPercent) / 2));

    const daysSincePost = rng() < 0.1 ? null : Math.floor(rng() * 30);
    const lastPostDate =
      daysSincePost === null ? null : new Date(Date.now() - daysSincePost * 86400000).toISOString();

    return {
      id: `${event.id}-loc-${i + 1}`,
      name: `${area} ${category.name}`,
      area: `${area} ${city}`,
      regionId: region.id,
      categoryId: category.id,
      categoryName: category.name,
      categoryColor: category.color,
      relevanceScore,
      relevanceBreakdown: {
        isNationwide,
        distancePercent,
        distanceKm: isNationwide ? undefined : Math.round((distanceMeters! / 1000) * 10) / 10,
        categoryPercent,
        categoryLabel: `${category.name} · ${event.subtype ?? event.label?.name ?? 'General'}`,
      },
      lastPostDate,
      distanceMeters,
      latitude,
      longitude,
      selected: true,
      deselectReason: undefined,
    } satisfies MatchedLocation;
  });

  for (const region of regions) {
    region.locationCount = locations.filter((l) => l.regionId === region.id).length;
  }
  for (const category of categories) {
    category.locationCount = locations.filter((l) => l.categoryId === category.id).length;
  }

  return { regions, categories, radiusMeters, locations };
}

const datasetCache = new Map<string, MockDataset>();

function getOrBuildDataset(event: CalendarEvent): MockDataset {
  let dataset = datasetCache.get(event.id);
  if (!dataset) {
    dataset = buildDataset(event);
    datasetCache.set(event.id, dataset);
  }
  return dataset;
}

@Injectable({ providedIn: 'root' })
export class LocationMatchingApiService {
  getRegions(event: CalendarEvent): Observable<RegionOption[]> {
    return of(getOrBuildDataset(event).regions.map((r) => ({ ...r }))).pipe(delay(350));
  }

  getCategories(event: CalendarEvent): Observable<CategoryOption[]> {
    return of(getOrBuildDataset(event).categories.map((c) => ({ ...c }))).pipe(delay(350));
  }

  getMatchRadius(event: CalendarEvent): Observable<{ radiusMeters: number }> {
    return of({ radiusMeters: getOrBuildDataset(event).radiusMeters }).pipe(delay(250));
  }

  getMatchedLocations(
    event: CalendarEvent,
    regionIds: string[],
    categoryIds: string[],
  ): Observable<MatchedLocation[]> {
    const dataset = getOrBuildDataset(event);
    const effectiveRegionIds = regionIds.length ? regionIds : dataset.regions.map((r) => r.id);
    const effectiveCategoryIds = categoryIds.length
      ? categoryIds
      : dataset.categories.map((c) => c.id);

    const locations = dataset.locations
      .filter(
        (l) => effectiveRegionIds.includes(l.regionId) && effectiveCategoryIds.includes(l.categoryId),
      )
      .map((l) => ({ ...l, selected: true, deselectReason: undefined }));

    return of(locations).pipe(delay(400));
  }

  updateLocationSelection(
    eventId: string,
    locationId: string,
    selected: boolean,
    reason: string | undefined,
  ): Observable<string> {
    const location = datasetCache.get(eventId)?.locations.find((l) => l.id === locationId);
    if (location) {
      location.selected = selected;
      location.deselectReason = selected ? undefined : reason;
    }
    return of('Location selection updated').pipe(delay(150));
  }

  bulkUpdateLocationSelection(
    eventId: string,
    locationIds: string[],
    selected: boolean,
    reason: string | undefined,
  ): Observable<string> {
    const dataset = datasetCache.get(eventId);
    if (dataset) {
      for (const location of dataset.locations) {
        if (locationIds.includes(location.id)) {
          location.selected = selected;
          location.deselectReason = selected ? undefined : reason;
        }
      }
    }
    return of('Locations updated').pipe(delay(200));
  }
}
