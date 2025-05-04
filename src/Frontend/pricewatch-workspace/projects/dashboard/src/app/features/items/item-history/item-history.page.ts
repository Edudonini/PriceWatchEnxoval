// src/app/features/items/item-history/item-history.page.ts
import { Component }              from '@angular/core';
import { ActivatedRoute }         from '@angular/router';
import { RouterModule, RouterLink } from '@angular/router';
import { CommonModule }           from '@angular/common';
import { MatButtonModule }        from '@angular/material/button';

import { ItemHistoryComponent }   from './item-history.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,        
    RouterLink,          
    ItemHistoryComponent,
    MatButtonModule
  ],
  template: `
    <h2 class="mb-2">Histórico de preços</h2>
    <button routerLink=".." mat-button>⟵ Voltar</button>
    <pw-item-history [id]="id!"></pw-item-history>
  `
})
export class ItemHistoryPageComponent {
  id = this.route.snapshot.paramMap.get('id');
  constructor(private route: ActivatedRoute) {}
}
