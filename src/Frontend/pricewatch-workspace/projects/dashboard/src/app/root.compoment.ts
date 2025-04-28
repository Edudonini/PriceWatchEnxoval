import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',          // ← seletor explícito
  standalone: true,              // ← obrigatório em bootstrapApplication
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
export class RootComponent {}
