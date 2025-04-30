import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';

export interface Item {
  id: string;
  name: string;
  category: number;
  defaultCurrency: string;
  lastestPrice?: number,
  priceHistory: unknown[];
}
export interface CreateItemCommand {
  name: string;
  category: number;
  currency: string;
}

@Injectable({ providedIn: 'root' })
export class ItemService {
  private api = inject(ApiService);

  list()  { return this.api.get<Item[]>('items'); }
  create(c: CreateItemCommand): Observable<Item> { return this.api.post<Item>('items', c); }

  update(Id: string, payload: CreateItemCommand){
    return this.api.put<Item>('items/${id}', payload);
  }
  remove(Id:string){
    return this.api.delete<void>('items/${id}');
  }
}
