import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, Chart, registerables } from 'chart.js';
import { firstValueFrom } from 'rxjs';

import { ItemService, PriceHistory } from '../item.service';

// Registra todos os componentes necessários do Chart.js
Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'pw-item-history',
  imports: [CommonModule, NgChartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-container">
      <canvas #chartCanvas
        *ngIf="data.labels?.length"
        baseChart
        [type]="'line'"
        [data]="data"
        [options]="opts">
      </canvas>
      <p *ngIf="!data.labels?.length">
        {{ loading ? 'Carregando dados...' : 'Sem dados de histórico para este item.' }}
      </p>
      <pre>{{ debugInfo }}</pre>
    </div>
  `,
  styles: [`
    .chart-container {
      display: block;
      width: 100%;
      height: 300px;
      position: relative;
    }
    pre {
      font-size: 12px;
      margin-top: 10px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
      overflow: auto;
    }
  `]
})
export class ItemHistoryComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() id!: string;
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  
  private svc = inject(ItemService);
  private cdr = inject(ChangeDetectorRef);
  
  loading = false;
  debugInfo = '';

  data: ChartData<'line'> = { 
    labels: [], 
    datasets: [{
      data: [],
      label: 'Preço',
      fill: false,
      tension: 0.3,
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      pointBackgroundColor: '#2196F3',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#2196F3'
    }]
  };

  opts: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        type: 'category',
        display: true,
        title: {
          display: true,
          text: 'Data'
        }
      },
      y: {
        type: 'linear',
        display: true,
        title: {
          display: true,
          text: 'Preço'
        },
        beginAtZero: true
      }
    },
    elements: {
      line: {
        tension: 0.3
      }
    }
  };

  ngOnInit() {
    Promise.resolve().then(() => {
      this.updateDebugInfo('Componente inicializado', null);
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    Promise.resolve().then(() => {
      this.updateDebugInfo('Canvas element', this.chart?.chart);
      if (this.chart?.chart) {
        const ctx = this.chart.chart.ctx;
        this.updateDebugInfo('Canvas context', ctx);
      }
      this.cdr.detectChanges();
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    this.updateDebugInfo('ID recebido', this.id);
    if (changes['id'] && this.id) {
      this.loading = true;
      this.cdr.detectChanges();
      
      try {
        this.updateDebugInfo('Buscando histórico para o ID', this.id);
        const h = await firstValueFrom(this.svc.history(this.id));
        this.updateDebugInfo('Dados recebidos', h);
        this.buildChart(h);
      } catch (err) {
        this.updateDebugInfo('Erro ao buscar histórico', err);
        console.error('Erro ao buscar histórico:', err);
      } finally {
        this.loading = false;
        this.cdr.detectChanges();
      }
    }
  }

  private buildChart(h: PriceHistory[]) {
    this.updateDebugInfo('Construindo gráfico com dados', h);
    if (!h || h.length === 0) {
      this.updateDebugInfo('Nenhum dado para construir o gráfico', null);
      this.data = { 
        labels: [], 
        datasets: [{
          data: [],
          label: 'Preço',
          fill: false,
          tension: 0.3,
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          pointBackgroundColor: '#2196F3',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#2196F3'
        }]
      };
      return;
    }

    const sorted = [...h].sort((a, b) =>
      new Date(a.capturedAtUtc).getTime() - new Date(b.capturedAtUtc).getTime()
    );

    this.updateDebugInfo('Dados ordenados', sorted);

    const labels = sorted.map(x => new Date(x.capturedAtUtc).toLocaleDateString());
    const values = sorted.map(x => x.amount);

    this.updateDebugInfo('Labels', labels);
    this.updateDebugInfo('Values', values);

    this.data = {
      labels,
      datasets: [{
        data: values,
        label: 'Preço',
        fill: false,
        tension: 0.3,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        pointBackgroundColor: '#2196F3',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#2196F3'
      }]
    };

    this.updateDebugInfo('Dados do gráfico configurados', this.data);
    this.cdr.detectChanges();
  }

  private updateDebugInfo(label: string, value: any) {
    const timestamp = new Date().toISOString();
    this.debugInfo = `${this.debugInfo}\n[${timestamp}] ${label}: ${JSON.stringify(value, null, 2)}`;
    console.log(label, value);
  }
}
