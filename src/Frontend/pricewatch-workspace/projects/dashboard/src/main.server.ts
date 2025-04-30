import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from './environments/environment.server';
import { API_URL } from './app/core/tokens';

import { routes } from './app/app.routes';
import { RootComponent } from './app/root.compoment';

const bootstrap = () =>
  bootstrapApplication(RootComponent, {
    providers: [
      provideRouter(routes),
      provideHttpClient(withFetch()),
      provideAnimations(),
      provideClientHydration(),
      { provide: API_URL, useValue: environment.apiUrl}
    ]
  });

export default bootstrap;
