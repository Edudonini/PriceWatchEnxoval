import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'items', pathMatch: 'full' },

  {
    path: 'items',
    loadComponent: () =>
      import('./features/items/item-list/item-list.component')
      .then(m => m.ItemListComponent),

    children: [
      {
        path: ':id/history',
        loadComponent: () =>
          import('./features/items/item-history/item-history.page')
          .then(m => m.ItemHistoryPageComponent)
      }
    ]
  },

  { path: '**', redirectTo: 'items' }
];
