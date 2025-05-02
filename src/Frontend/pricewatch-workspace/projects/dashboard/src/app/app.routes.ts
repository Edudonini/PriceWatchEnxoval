import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'items',
    loadChildren: () =>
      import('./features/items/items.routes').then(m => m.default)
  },
  {
    path: 'items/:id/history',
    loadComponent: () => import(
      './features/items/item-history/item-history.component'
    ).then(m => m.ItemHistoryComponent)
  }  
];
