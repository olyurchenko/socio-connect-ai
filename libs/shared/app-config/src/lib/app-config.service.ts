import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from './app-config.model';

const FALLBACK_CONFIG: AppConfig = { googleMapsApiKey: '' };

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly http = inject(HttpClient);
  private config: AppConfig = FALLBACK_CONFIG;

  async load(): Promise<void> {
    try {
      this.config = await firstValueFrom(this.http.get<AppConfig>('/config.json'));
    } catch (error) {
      console.warn('Failed to load /config.json — falling back to empty app config', error);
      this.config = FALLBACK_CONFIG;
    }
  }

  get googleMapsApiKey(): string {
    return this.config.googleMapsApiKey;
  }
}
