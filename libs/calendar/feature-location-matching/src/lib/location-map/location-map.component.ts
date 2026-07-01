import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, MapCircle, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Store } from '@ngrx/store';
import {
  selectLocationMatchingEvent,
  selectRadiusMeters,
  selectVisibleLocations,
} from '@socio-connect/calendar/data-access';
import { EventType, MatchedLocation } from '@socio-connect/calendar/utils-models';
import { GoogleMapsLoaderService } from '../google-maps/google-maps-loader.service';

interface MapInfo {
  title: string;
  body: string;
}

@Component({
  selector: 'sc-location-map',
  standalone: true,
  imports: [CommonModule, GoogleMap, MapMarker, MapCircle, MapInfoWindow],
  templateUrl: './location-map.component.html',
  styleUrl: './location-map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationMapComponent {
  private readonly store = inject(Store);
  private readonly loader = inject(GoogleMapsLoaderService);

  @ViewChild(GoogleMap) private readonly googleMap?: GoogleMap;
  @ViewChild(MapInfoWindow) private readonly infoWindow?: MapInfoWindow;

  protected readonly mapsReady = signal(false);
  protected readonly activeInfo = signal<MapInfo | null>(null);

  protected readonly event = this.store.selectSignal(selectLocationMatchingEvent);
  protected readonly radiusMeters = this.store.selectSignal(selectRadiusMeters);
  protected readonly locations = this.store.selectSignal(selectVisibleLocations);

  protected readonly mapOptions: google.maps.MapOptions = {
    disableDefaultUI: false,
    gestureHandling: 'greedy',
  };

  protected readonly isLocationEvent = computed(() => this.event()?.type === EventType.LOCATION);

  protected readonly eventMarkerPosition = computed<google.maps.LatLngLiteral | null>(() => {
    const event = this.event();
    if (this.isLocationEvent() && event?.location?.latitude !== undefined) {
      return { lat: event.location.latitude, lng: event.location.longitude! };
    }
    return null;
  });

  protected readonly eventMarkerOptions = computed<google.maps.MarkerOptions>(() => ({
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 9,
      fillColor: '#f97316',
      fillOpacity: 1,
      strokeColor: '#fff',
      strokeWeight: 2,
    },
    zIndex: 10,
  }));

  protected readonly circleOptions = computed<google.maps.CircleOptions>(() => ({
    strokeColor: '#f97316',
    strokeOpacity: 0.6,
    strokeWeight: 2,
    fillColor: '#f97316',
    fillOpacity: 0.08,
    radius: this.radiusMeters() ?? 0,
  }));

  protected readonly center = computed<google.maps.LatLngLiteral>(() => {
    const eventPos = this.eventMarkerPosition();
    if (eventPos) return eventPos;
    const first = this.locations()[0];
    return first ? { lat: first.latitude, lng: first.longitude } : { lat: 0, lng: 0 };
  });

  constructor() {
    this.loader.load().then(() => this.mapsReady.set(true));

    effect(() => {
      const locations = this.locations();
      const eventPos = this.eventMarkerPosition();
      const map = this.googleMap?.googleMap;
      if (!map || !this.mapsReady() || !locations.length) return;

      const bounds = new google.maps.LatLngBounds();
      for (const location of locations) {
        bounds.extend({ lat: location.latitude, lng: location.longitude });
      }
      if (eventPos) bounds.extend(eventPos);
      map.fitBounds(bounds, 48);
    });
  }

  markerOptions(location: MatchedLocation): google.maps.MarkerOptions {
    return {
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillColor: location.selected ? '#2563eb' : '#9e9e9e',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 1.5,
      },
    };
  }

  openLocationInfo(location: MatchedLocation, marker: MapMarker): void {
    const days =
      location.lastPostDate === null
        ? null
        : Math.floor((Date.now() - Date.parse(location.lastPostDate)) / 86_400_000);

    this.activeInfo.set({
      title: location.name,
      body: days === null ? 'Never posted' : `${days} day${days === 1 ? '' : 's'} since last post`,
    });
    this.infoWindow?.open(marker);
  }

  openEventInfo(marker: MapMarker): void {
    const event = this.event();
    const radiusKm = this.radiusMeters() ? Math.round((this.radiusMeters() as number) / 1000) : null;

    this.activeInfo.set({
      title: event?.title ?? '',
      body: radiusKm !== null ? `${radiusKm}km radius` : '',
    });
    this.infoWindow?.open(marker);
  }
}
