import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { ItemService, CreateItemCommand } from '../item.service';

@Component({
  selector: 'pw-item-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
<h2 mat-dialog-title>Novo Item</h2>
<form [formGroup]="f" (ngSubmit)="save()" mat-dialog-content>
  <mat-form-field appearance="outline" class="w-100">
    <mat-label>Nome</mat-label>
    <input matInput formControlName="name" required>
  </mat-form-field>

  <mat-form-field appearance="outline" class="w-100">
    <mat-label>Categoria</mat-label>
    <mat-select formControlName="category" required>
      <mat-option *ngFor="let c of cats" [value]="c.id">{{ c.lbl }}</mat-option>
    </mat-select>
  </mat-form-field>

  <mat-form-field appearance="outline" class="w-100">
    <mat-label>Moeda</mat-label>
    <input matInput formControlName="currency" maxlength="3" required>
  </mat-form-field>

  <div mat-dialog-actions align="end">
    <button mat-button [mat-dialog-close]="false">Cancelar</button>
    <button mat-raised-button color="primary" type="submit" [disabled]="f.invalid">Salvar</button>
  </div>
</form>
`,
  styles:[`.w-100{width:100%}`]
})
export class ItemFormDialogComponent {
  private fb  = inject(FormBuilder);
  private svc = inject(ItemService);
  private ref = inject(MatDialogRef<ItemFormDialogComponent>);

  cats = [
    { id:0,lbl:'Kitchen' }, { id:1,lbl:'Bedroom' },
    { id:2,lbl:'LivingRoom' }, { id:3,lbl:'Bath' },
    { id:4,lbl:'Electronics' }, { id:5,lbl:'Other' }
  ];

  f = this.fb.group({
    name: ['', Validators.required],
    category: [0, Validators.required],
    currency: ['BRL',[Validators.required,Validators.minLength(3),Validators.maxLength(3)]]
  });

  save(){
    if(this.f.invalid) return;
    this.svc.create(this.f.value as CreateItemCommand)
      .subscribe({ next:()=> this.ref.close(true) });
  }
}
