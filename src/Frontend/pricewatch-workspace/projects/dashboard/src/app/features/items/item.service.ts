import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';

/* ------------------------------------------------------------------ */
/*  Modelos usados no front                                            */
/* ------------------------------------------------------------------ */

export interface Item {
  id: string;
  name: string;
  category: number;          
  defaultCurrency: string;   
  latestPrice?: number | null;      
  priceHistory: PriceHistory[];
}

export interface CreateItemCommand {
  name: string;
  category: number;
  currency: string;
}

export interface PriceHistory {
  id: string;
  amount: number;
  capturedAtUtc: string;
}

/* ------------------------------------------------------------------ */
/*  Serviço                                                            */
/* ------------------------------------------------------------------ */

@Injectable({ providedIn: 'root' })
export class ItemService {
  private api = inject(ApiService);

  list()  { return this.api.get<Item[]>('items'); }

  create(c: CreateItemCommand) {
    return this.api.post<Item>('items', c);
  }

  update(id: string, payload: CreateItemCommand) {
    return this.api.put<Item>(`items/${id}`, payload);   // ← crases!
  }

  remove(id: string) {
    return this.api.delete<void>(`items/${id}`);         // ← crases!
  }

  history(id: string) {
    return this.api.get<PriceHistory[]>(`items/${id}/history`);
  }
}

