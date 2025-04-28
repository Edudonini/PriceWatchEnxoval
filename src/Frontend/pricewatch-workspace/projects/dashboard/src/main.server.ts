import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app/app.routes';
import { RootComponent } from './app/root.compoment';

const bootstrap = () =>
  bootstrapApplication(RootComponent, {
    providers: [
      provideRouter(routes),
      provideHttpClient(),
      provideAnimations()
    ]
  });

export default bootstrap;
