import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ApiService } from '../../core/api.service';

export interface Item {
  id: string;
  name: string;
  category: number;
  defaultCurrency: string;
  latestPrice?: number | null;
}

export interface PriceHistory {
  id: string;
  amount: number;
  capturedAtUtc: string;
}

export interface CreateItemCommand {
  name: string;
  category: number;
  currency: string;
}

@Injectable({ providedIn: 'root' })
export class ItemService {
  private api = inject(ApiService);
  private _items$ = new BehaviorSubject<Item[]>([]);

  /** fluxo lido pelas telas */
  items$ = this._items$.asObservable();

  /* ------------ crud ------------ */

  async refresh() {
    const data = await firstValueFrom(this.api.get<Item[]>('items'));
    this._items$.next(data);
  }

  async create(cmd: CreateItemCommand) {
    const it = await firstValueFrom(this.api.post<Item>('items', cmd));
    this._items$.next([...this._items$.value, it]);
  }

  async update(id: string, cmd: CreateItemCommand) {
    const it = await firstValueFrom(this.api.put<Item>(`items/${id}`, cmd));
    this._items$.next(this._items$.value.map(x => x.id === id ? it : x));
  }

  async remove(id: string) {
    await firstValueFrom(this.api.delete<void>(`items/${id}`));
    this._items$.next(this._items$.value.filter(x => x.id !== id));
  }

  history(id: string) {
    return this.api.get<PriceHistory[]>(`items/${id}/history`);
  }
}
