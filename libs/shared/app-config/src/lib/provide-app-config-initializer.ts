import { EnvironmentProviders, inject, provideAppInitializer } from '@angular/core';
import { AppConfigService } from './app-config.service';

export function provideAppConfigInitializer(): EnvironmentProviders {
  return provideAppInitializer(() => inject(AppConfigService).load());
}
