import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let http:    HttpTestingController;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule]
    });
    service = TestBed.inject(ItemService);
    http    = TestBed.inject(HttpTestingController);
  });

  it('update deve invocar PUT /items/{id}', () => {
    service.update('abc',{name:'X',category:0,currency:'BRL'}).subscribe();
    http.expectOne('items/abc').flush({});
  });

  afterEach(()=> http.verify());
});
