import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Router con binding de inputs y transiciones
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),
    
    // HttpClient con interceptores funcionales
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loggingInterceptor,
        authInterceptor
      ])
    ),
    
    // Animaciones
    provideAnimations()
  ]
};
