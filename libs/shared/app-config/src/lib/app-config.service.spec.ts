import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AppConfigService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads the config from /config.json', async () => {
    const loadPromise = service.load();
    httpMock.expectOne('/config.json').flush({ googleMapsApiKey: 'test-key' });
    await loadPromise;

    expect(service.googleMapsApiKey).toBe('test-key');
  });

  it('falls back to an empty key when the request fails', async () => {
    const loadPromise = service.load();
    httpMock.expectOne('/config.json').flush(null, { status: 404, statusText: 'Not Found' });
    await loadPromise;

    expect(service.googleMapsApiKey).toBe('');
  });
});
