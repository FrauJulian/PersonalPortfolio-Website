import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import {BrowserModule, provideClientHydration, withEventReplay} from '@angular/platform-browser';

import {routes} from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withInMemoryScrolling({
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'top'
    })),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(BrowserModule),
    provideAnimations()
  ]
};
