import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule }   from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { ItemService, Item } from '../item.service';
import { ItemEditDialogComponent } from '../item-edit-dialog/item-edit-dialog.component';

@Component({
  selector: 'pw-item-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    ItemEditDialogComponent
  ],
  template: `
<h2>Itens monitorados</h2>
<button mat-raised-button color="primary" (click)="open()">NOVO ITEM</button>

<table mat-table [dataSource]="data ?? []" class="mat-elevation-z2 mt-3" *ngIf="items$ | async as data">
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef>Nome</th>
    <td mat-cell        *matCellDef="let r">{{ r.name }}</td>
  </ng-container>

  <ng-container matColumnDef="category">
    <th mat-header-cell *matHeaderCellDef>Cat.</th>
    <td mat-cell        *matCellDef="let r">{{ r.category }}</td>
  </ng-container>

  <ng-container matColumnDef="actions">
  <th mat-header-cell *matHeaderCellDef>Ações</th>
  <td  mat-cell        *matCellDef="let r">
    <button mat-icon-button color="primary" (click)="edit(r)">
      <mat-icon fontIcon="edit"></mat-icon>
    </button>
    
    <button mat-icon-button color="warn" (click)="confirmDelete(r)">
      <mat-icon fontIcon="delete"></mat-icon>
    </button>
  </td>
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
  private snack = inject(MatSnackBar);

  items$!: Observable<Item[]>;
  cols = ['name','category','actions'];

  ngOnInit(){ this.load(); }
  load(){ this.items$ = this.svc.list(); }

  open(){
    this.dlg.open(ItemEditDialogComponent,{width:'420px'})
        .afterClosed().subscribe(ok=>ok&&this.load());
  }
  edit(it: Item){
    this.dlg.open(ItemEditDialogComponent,{data: it, width:'420px'})
        .afterClosed().subscribe(ok => ok && this.load());
  }
  confirmDelete(it: Item){
    if(!confirm('Excluir "$(it.name)"?')) return;
    this.svc.remove(it.id).subscribe(()=>{
      this.snack.open('Excluído', 'OK',{duration:1500});
      this.load();
    })
  }
}
