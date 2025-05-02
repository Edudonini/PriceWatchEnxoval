import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { ItemService, PriceHistory } from '../item.service';

@Component({
  selector: 'pw-item-history',
  standalone: true,
  imports: [CommonModule, MatListModule],
  templateUrl: './item-history.component.html'
})
export class ItemHistoryComponent {

  private svc   = inject(ItemService);
  private route = inject(ActivatedRoute);

  hist$ = this.svc.history(this.route.snapshot.params['id']);
}
