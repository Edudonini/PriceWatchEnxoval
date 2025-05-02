import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListComponent } from './item-list.component';
import { MatDialog } from '@angular/material/dialog';
import { of }     from 'rxjs';

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemListComponent]
    })
    .compileComponents();
    
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('edit() deve abrir MatDialog', () => {
    spyOn(dialog,'open').and.returnValue({ afterClosed:()=>of(false) } as any);
    component.edit({
      id: '1', name: 'X', category: 0, defaultCurrency: 'BRL', latestPrice: undefined,
      priceHistory: []
    });
    expect(dialog.open).toHaveBeenCalled();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
