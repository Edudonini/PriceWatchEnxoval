import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatSelectModule }     from '@angular/material/select';
import { MatButtonModule }     from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { ItemService, Item, CreateItemCommand } from '../item.service';

@Component({
  selector: 'pw-item-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './item-edit-dialog.component.html'
})
export class ItemEditDialogComponent {
  categories = [
    { value: 0, label: 'Kitchen' },
    { value: 1, label: 'Electronics' },
    { value: 2, label: 'Furniture' },
  ];

  private fb    = inject(FormBuilder);
  private svc   = inject(ItemService);
  private ref   = inject(MatDialogRef<ItemEditDialogComponent>);
  private data  = inject(MAT_DIALOG_DATA) as Item | null;          
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    name:     [this.data?.name     || '',     Validators.required],
    category: [this.data?.category ?? 0,      Validators.required],
    currency: [this.data?.defaultCurrency || '', [
                  Validators.required,
                  Validators.minLength(3),
                  Validators.maxLength(3)
               ]]
  });

  save() {
    if (this.form.invalid) return;

    const cmd: CreateItemCommand = {
      name:     this.form.value.name!,
      category: this.form.value.category!,
      currency: this.form.value.currency!
    };

    const op$ = this.data?.id
      ? this.svc.update(this.data.id, cmd)
      : this.svc.create(cmd);

    op$.subscribe(() => {
      this.snack.open(
        this.data?.id ? 'Item atualizado' : 'Item criado',
        'OK',
        { duration: 2000 }
      );
      this.ref.close(true);
    });
  }
}
