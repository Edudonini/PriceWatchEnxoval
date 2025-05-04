// projects/dashboard/src/app/features/items/item.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

import { ItemService, CreateItemCommand, Item, PriceHistory } from './item.service';
import { ApiService } from '../../core/api.service';

describe('ItemService', () => {
  let svc: ItemService;
  let api: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    api = jasmine.createSpyObj<ApiService>('ApiService', [
      'get', 'post', 'put', 'delete'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        ItemService,
        { provide: ApiService, useValue: api }
      ]
    });

    svc = TestBed.inject(ItemService);
  });

  it('refresh() popula items$', async () => {
    const fake: Item[] = [
      { id: '1', name: 'X', category: 0, defaultCurrency: 'BRL' }
    ];
    api.get.and.returnValue(of(fake));

    await svc.refresh();

    svc.items$.subscribe((items: Item[]) => {
      expect(items).toEqual(fake);
    });
  });

  it('create() acrescenta item ao estado', async () => {
    const cmd: CreateItemCommand = { name: 'Y', category: 0, currency: 'BRL' };
    const created: Item = { id: '2', name: 'Y', category: 0, defaultCurrency: 'BRL' };
    const initial: Item[] = [
      { id: '1', name: 'X', category: 0, defaultCurrency: 'BRL' }
    ];

    api.get.and.returnValue(of(initial));
    api.post.and.returnValue(of(created));

    await svc.refresh();
    await svc.create(cmd);

    svc.items$.subscribe((items: Item[]) => {
      const found = items.find((i: Item) => i.id === '2');
      expect(found).toEqual(created);
    });
  });

  it('history() retorna histórico de preços', () => {
    const id = 'test-id';
    const fakeHistory: PriceHistory[] = [
      { id: '1', amount: 100, capturedAtUtc: '2024-05-01T00:00:00Z' },
      { id: '2', amount: 200, capturedAtUtc: '2024-05-02T00:00:00Z' }
    ];
    api.get.and.returnValue(of(fakeHistory));

    svc.history(id).subscribe((history: PriceHistory[]) => {
      expect(history).toEqual(fakeHistory);
      expect(api.get).toHaveBeenCalledWith(`items/${id}/history`);
    });
  });
});
