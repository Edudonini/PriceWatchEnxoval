import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient }   from '@angular/common/http';
import { provideRouter }      from '@angular/router';

import { RootComponent } from './app/root.compoment';
import { routes }        from './app/app.routes';

bootstrapApplication(RootComponent, {
  providers: [
    provideHttpClient(),          // <-- sem withFetch()
    provideRouter(routes)
  ]
});
