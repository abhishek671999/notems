import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorStockComponent } from './distributor-stock.component';

describe('DistributorStockComponent', () => {
  let component: DistributorStockComponent;
  let fixture: ComponentFixture<DistributorStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributorStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributorStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
