import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { of } from 'rxjs';

import { ItemHistoryComponent } from './item-history.component';
import { ItemService, PriceHistory } from '../item.service';

describe('ItemHistoryComponent', () => {
  let component: ItemHistoryComponent;
  let fixture: ComponentFixture<ItemHistoryComponent>;
  let svc: jasmine.SpyObj<ItemService>;

  const mockHistory: PriceHistory = {
    labels: ['2024-01-01', '2024-01-02'],
    datasets: [{
      label: 'Preço',
      data: [100, 200],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  beforeEach(async () => {
    svc = jasmine.createSpyObj<ItemService>('ItemService', ['getHistory']);
    svc.getHistory.and.returnValue(of(mockHistory));

    await TestBed.configureTestingModule({
      imports: [
        ItemHistoryComponent,
        HttpClientModule,
        NoopAnimationsModule,
        NgChartsModule
      ],
      providers: [
        { provide: ItemService, useValue: svc }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemHistoryComponent);
    component = fixture.componentInstance;
    component.id = '1';
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar o histórico do item', () => {
    expect(svc.getHistory).toHaveBeenCalledWith('1');
    expect(component.data).toEqual(mockHistory);
  });

  it('deve atualizar o gráfico quando o histórico mudar', () => {
    const newHistory: PriceHistory = {
      labels: ['2024-01-03', '2024-01-04'],
      datasets: [{
        label: 'Preço',
        data: [300, 400],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
    
    svc.getHistory.and.returnValue(of(newHistory));
    component.ngOnChanges({ id: { currentValue: '2', previousValue: '1', firstChange: false, isFirstChange: () => false } });
    fixture.detectChanges();
    
    expect(component.data).toEqual(newHistory);
  });
}); 