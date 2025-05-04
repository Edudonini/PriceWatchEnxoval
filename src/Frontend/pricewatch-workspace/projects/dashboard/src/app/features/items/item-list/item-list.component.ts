import {
  Component, inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatTableModule,
  MatTableDataSource
} from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule }   from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink, RouterModule } from '@angular/router';

import { ItemService, Item } from '../item.service';
import { ItemEditDialogComponent } from '../item-edit-dialog/item-edit-dialog.component';

@Component({
  standalone: true,
  selector: 'pw-item-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule, 
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  template: `
<h2>Itens monitorados</h2>

<button mat-raised-button color="primary" (click)="openNew()">NOVO ITEM</button>

<table mat-table [dataSource]="ds" class="mat-elevation-z2 mt-3" *ngIf="ds.data.length">

  <!-- nome -->
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef>Nome</th>
    <td mat-cell        *matCellDef="let r">{{ r.name }}</td>
  </ng-container>

  <!-- categoria -->
  <ng-container matColumnDef="category">
    <th mat-header-cell *matHeaderCellDef>Cat.</th>
    <td mat-cell        *matCellDef="let r">{{ r.category }}</td>
  </ng-container>

  <!-- history link -->
  <ng-container matColumnDef="prices">
    <th mat-header-cell *matHeaderCellDef>Histórico</th>
    <td mat-cell *matCellDef="let r">
      <a [routerLink]="[r.id,'history']" mat-icon-button title="Ver gráfico">
        <mat-icon fontIcon="show_chart"></mat-icon>
      </a>
    </td>
  </ng-container>

  <!-- ações -->
  <ng-container matColumnDef="actions">
    <th mat-header-cell *matHeaderCellDef>Ações</th>
    <td mat-cell *matCellDef="let r">
      <button mat-icon-button color="primary" (click)="openEdit(r)">
        <mat-icon fontIcon="edit"></mat-icon>
      </button>
      <button mat-icon-button color="warn" (click)="delete(r)">
        <mat-icon fontIcon="delete"></mat-icon>
      </button>
    </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="cols"></tr>
  <tr mat-row        *matRowDef="let row; columns: cols; trackBy: trackId"></tr>
</table>

<p *ngIf="!ds.data.length" style="margin-top: 2rem; color: #888; font-size: 1.2rem;">
  Nenhum item cadastrado.
</p>

<router-outlet></router-outlet>
`,
  styles: [`table{width:100%}`]
})
export class ItemListComponent implements OnInit {
  private svc   = inject(ItemService);
  private dlg   = inject(MatDialog);
  private snack = inject(MatSnackBar);
  private cdr   = inject(ChangeDetectorRef);

  /** DataSource material */
  ds = new MatTableDataSource<Item>([]);
  readonly cols = ['name','category','prices','actions'];

  ngOnInit() {
    this.svc.items$.subscribe(d => {
      this.ds.data = d;
      this.cdr.markForCheck();
    });
    this.svc.refresh();
  }

  trackId = (_:number,r:Item) => r.id;

  async openNew() {
    const ref = this.dlg.open(ItemEditDialogComponent,{width:'420px'});
    const ok  = await ref.afterClosed().toPromise();
    if (ok) this.snack.open('Item criado','OK',{duration:1500});
  }

  async openEdit(it: Item) {
    const ref = this.dlg.open(ItemEditDialogComponent,{data:it,width:'420px'});
    const ok  = await ref.afterClosed().toPromise();
    if (ok) this.snack.open('Item atualizado','OK',{duration:1500});
  }

  async delete(it: Item) {
    if(!confirm(`Excluir "${it.name}"?`)) return;
    await this.svc.remove(it.id);
    this.snack.open('Excluído','OK',{duration:1500});
  }
}
