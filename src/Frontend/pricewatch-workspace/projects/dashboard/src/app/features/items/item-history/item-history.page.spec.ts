import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ItemHistoryPageComponent } from './item-history.page';
import { ItemService } from '../item.service';
import { ItemHistoryComponent } from './item-history.component';

describe('ItemHistoryPageComponent', () => {
  let component: ItemHistoryPageComponent;
  let fixture: ComponentFixture<ItemHistoryPageComponent>;
  let svc: jasmine.SpyObj<ItemService>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    svc = jasmine.createSpyObj<ItemService>('ItemService', ['history']);
    svc.history.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        ItemHistoryPageComponent,
        HttpClientModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ItemService, useValue: svc },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: {
              paramMap: convertToParamMap({ id: 'test-id' })
            }
          } 
        },
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemHistoryPageComponent);
    component = fixture.componentInstance;
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve extrair o ID da rota', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component.id).toBe('test-id');
  }));

  it('deve passar o ID para o componente de histórico', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    const historyComponent = fixture.debugElement.query(
      By.directive(ItemHistoryComponent)
    );
    expect(historyComponent).toBeTruthy();
    expect(historyComponent.componentInstance.id).toBe('test-id');
  }));

  it('deve chamar o serviço de histórico com o ID correto', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(svc.history).toHaveBeenCalledWith('test-id');
  }));
}); 