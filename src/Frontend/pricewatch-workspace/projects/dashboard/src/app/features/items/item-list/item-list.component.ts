import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { ItemService, Item } from '../item.service';
import { ItemFormDialogComponent } from '../item-form-dialog/item-form-dialog.component';

@Component({
  selector: 'pw-item-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
<h2>Itens monitorados</h2>
<button mat-raised-button color="primary" (click)="open()">NOVO ITEM</button>

<table mat-table [dataSource]="data ?? []" class="mat-elevation-z2 mt-3" *ngIf="items$ | async as data">
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef>Nome</th>
    <td mat-cell        *matCellDef="let r">{{ r.name }}</td>
  </ng-container>

  <ng-container matColumnDef="cat">
    <th mat-header-cell *matHeaderCellDef>Cat.</th>
    <td mat-cell        *matCellDef="let r">{{ r.category }}</td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="cols"></tr>
  <tr mat-row        *matRowDef="let row; columns: cols;"></tr>
</table>
`,
  styles: [`table{width:100%}`]
})
export class ItemListComponent {
  private svc = inject(ItemService);
  private dlg = inject(MatDialog);

  items$!: Observable<Item[]>;
  cols = ['name', 'cat'];

  ngOnInit(){ this.load(); }
  load(){ this.items$ = this.svc.list(); }

  open(){
    this.dlg.open(ItemFormDialogComponent,{width:'420px'})
        .afterClosed().subscribe(ok=>ok&&this.load());
  }
}
