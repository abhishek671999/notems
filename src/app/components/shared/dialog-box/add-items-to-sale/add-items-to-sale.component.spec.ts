import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemsToSaleComponent } from './add-items-to-sale.component';

describe('AddItemsToSaleComponent', () => {
  let component: AddItemsToSaleComponent;
  let fixture: ComponentFixture<AddItemsToSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItemsToSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItemsToSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
