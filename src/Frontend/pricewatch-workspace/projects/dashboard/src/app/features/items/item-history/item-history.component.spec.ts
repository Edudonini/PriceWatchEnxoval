import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { ItemHistoryComponent } from './item-history.component';
import { ItemService, PriceHistory } from '../item.service';

// Registra todos os componentes necessários do Chart.js
Chart.register(...registerables);

describe('ItemHistoryComponent', () => {
  let component: ItemHistoryComponent;
  let fixture: ComponentFixture<ItemHistoryComponent>;
  let svc: jasmine.SpyObj<ItemService>;
  let cdr: ChangeDetectorRef;

  const mockHistory: PriceHistory[] = [
    { id: '1', amount: 100, capturedAtUtc: '2024-01-01T00:00:00Z' },
    { id: '2', amount: 200, capturedAtUtc: '2024-01-02T00:00:00Z' }
  ];

  beforeEach(async () => {
    svc = jasmine.createSpyObj<ItemService>('ItemService', ['history']);
    svc.history.and.returnValue(of(mockHistory));

    await TestBed.configureTestingModule({
      imports: [
        ItemHistoryComponent,
        BaseChartDirective,
        HttpClientModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ItemService, useValue: svc },
        { provide: ChangeDetectorRef, useValue: { detectChanges: () => {} } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemHistoryComponent);
    component = fixture.componentInstance;
    cdr = TestBed.inject(ChangeDetectorRef);
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar o histórico quando o ID é fornecido', fakeAsync(() => {
    component.id = '1';
    fixture.detectChanges();
    tick();
    expect(svc.history).toHaveBeenCalledWith('1');
    expect(component.data.labels?.length).toBeGreaterThan(0);
  }));

  it('deve ordenar os dados por data', fakeAsync(() => {
    component.id = '1';
    fixture.detectChanges();
    tick();
    const sorted = [...mockHistory].sort((a, b) =>
      new Date(a.capturedAtUtc).getTime() - new Date(b.capturedAtUtc).getTime()
    );
    expect(component.data.datasets[0].data).toEqual(sorted.map(x => x.amount));
  }));

  it('deve mostrar mensagem quando não há dados', fakeAsync(() => {
    svc.history.and.returnValue(of([]));
    component.id = '1';
    fixture.detectChanges();
    tick();
    const message = fixture.nativeElement.querySelector('p');
    expect(message.textContent).toContain('Sem dados de histórico para este item');
  }));

  it('deve atualizar o debugInfo corretamente', fakeAsync(() => {
    component.id = '1';
    fixture.detectChanges();
    tick();
    expect(component.debugInfo).toContain('ID recebido');
    expect(component.debugInfo).toContain('Buscando histórico');
  }));
}); 