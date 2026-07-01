import { Injectable, inject } from '@angular/core';
import { GOOGLE_MAPS_API_KEY } from './google-maps-api-key.token';

@Injectable({ providedIn: 'root' })
export class GoogleMapsLoaderService {
  private readonly apiKey = inject(GOOGLE_MAPS_API_KEY);
  private loadPromise: Promise<void> | null = null;

  load(): Promise<void> {
    if (!this.loadPromise) {
      this.loadPromise = this.injectScript();
    }
    return this.loadPromise;
  }

  private injectScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined' && google.maps) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places&language=en-US&loading=async`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps JavaScript API'));
      document.head.appendChild(script);
    });
  }
}
