import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemHistoricStockComponent } from './item-historic-stock.component';

describe('ItemHistoricStockComponent', () => {
  let component: ItemHistoricStockComponent;
  let fixture: ComponentFixture<ItemHistoricStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemHistoricStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemHistoricStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
