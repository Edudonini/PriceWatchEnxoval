// projects/dashboard/src/app/features/items/item-list/item-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ItemListComponent } from './item-list.component';
import { ItemService, Item } from '../item.service';
import { ItemEditDialogComponent } from '../item-edit-dialog/item-edit-dialog.component';

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let svc: jasmine.SpyObj<ItemService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockItems: Item[] = [
    { id: '1', name: 'Item 1', category: 1, defaultCurrency: 'BRL' },
    { id: '2', name: 'Item 2', category: 2, defaultCurrency: 'BRL' }
  ];

  beforeEach(async () => {
    svc = jasmine.createSpyObj<ItemService>('ItemService', ['items$', 'refresh', 'remove']);
    svc.items$ = of(mockItems);
    svc.refresh.and.returnValue(Promise.resolve());
    svc.remove.and.returnValue(Promise.resolve());

    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    dialog.open.and.returnValue({ afterClosed: () => of(true) } as any);

    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ItemListComponent,
        HttpClientModule,
        NoopAnimationsModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatSnackBarModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ItemService, useValue: svc },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar uma linha para cada item', () => {
    const rows = fixture.nativeElement.querySelectorAll('tr[mat-row]');
    expect(rows.length).toBe(mockItems.length);
  });

  it('deve usar o trackBy para identificar itens', () => {
    const result = component.trackId(0, mockItems[0]);
    expect(result).toBe('1');
  });

  it('deve chamar openEdit quando o botão de editar é clicado', () => {
    const editButton = fixture.nativeElement.querySelector('button[color="primary"]');
    editButton.click();
    expect(dialog.open).toHaveBeenCalledWith(ItemEditDialogComponent, {
      data: mockItems[0],
      width: '420px'
    });
  });

  it('deve chamar remove quando o botão de excluir é clicado', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const deleteButton = fixture.nativeElement.querySelector('button[color="warn"]');
    deleteButton.click();
    expect(svc.remove).toHaveBeenCalledWith('1');
  });
});
