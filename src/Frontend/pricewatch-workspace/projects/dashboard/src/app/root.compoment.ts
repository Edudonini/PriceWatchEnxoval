import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-root',          // ← seletor explícito
  standalone: true,              // ← obrigatório em bootstrapApplication
  imports: [RouterOutlet, BaseChartDirective],
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {}
