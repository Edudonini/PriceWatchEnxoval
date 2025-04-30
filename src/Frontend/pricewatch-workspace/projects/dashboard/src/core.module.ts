import { NgModule } from '@angular/core';
import { MatButtonModule }  from '@angular/material/button';
import { MatDialogModule }  from '@angular/material/dialog';
import { MatIconModule }    from '@angular/material/icon';
import { MatSnackBarModule }from '@angular/material/snack-bar';
import { MatTableModule }   from '@angular/material/table';
import { MatSelectModule }  from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }   from '@angular/material/input';

const mat = [
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatSnackBarModule,
  MatTableModule,
  MatSelectModule,
  MatFormFieldModule,
  MatInputModule,
];

@NgModule({ exports: mat })
export class CoreModule {}
