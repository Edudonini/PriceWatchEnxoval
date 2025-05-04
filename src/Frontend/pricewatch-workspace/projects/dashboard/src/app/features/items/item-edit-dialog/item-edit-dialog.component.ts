// projects/dashboard/src/app/features/items/item-edit-dialog/item-edit-dialog.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatSelectModule }    from '@angular/material/select';
import { MatButtonModule }    from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ItemService, CreateItemCommand, Item } from '../item.service';

@Component({
  selector   : 'pw-item-edit-dialog',
  standalone : true,
  imports    : [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatSnackBarModule
  ],
  templateUrl: './item-edit-dialog.component.html'
})
export class ItemEditDialogComponent {

  /* injeções ----------------------------------------------------------- */
  private fb    = inject(FormBuilder);
  private svc   = inject(ItemService);
  private ref   = inject(MatDialogRef<ItemEditDialogComponent>);
  private data  = inject(MAT_DIALOG_DATA, { optional: true }) as Item | null;
  private snack = inject(MatSnackBar);

  /* categorias fixas --------------------------------------------------- */
  categories = [
    { value: 0, label: 'Kitchen'      },
    { value: 1, label: 'Electronics'  },
    { value: 2, label: 'Furniture'    },
  ];

  /* form reativo ------------------------------------------------------- */
  form = this.fb.group({
    name    : [this.data?.name            ?? '', Validators.required],
    category: [this.data?.category        ?? 0 , Validators.required],
    currency: [this.data?.defaultCurrency ?? '',
               [Validators.required, Validators.minLength(3)]]
  });

  /* botão Salvar ------------------------------------------------------- */
  async save(){
    const cmd = this.form.value as CreateItemCommand;
    const op  = this.data        // data injetado = item?
              ? this.svc.update(this.data.id,cmd)
              : this.svc.create(cmd);
  
    await op;                    // espera resolver
    this.ref.close(true);        // true = refresh / snackbar
  }
}
