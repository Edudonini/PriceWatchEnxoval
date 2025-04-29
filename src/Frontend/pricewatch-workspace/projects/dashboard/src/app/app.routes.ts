import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'items',
    loadChildren: () =>
      import('./features/items/items.routes').then(m => m.default)
  }
];
