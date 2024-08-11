import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMoreSalesInfoComponent } from './view-more-sales-info.component';

describe('ViewMoreSalesInfoComponent', () => {
  let component: ViewMoreSalesInfoComponent;
  let fixture: ComponentFixture<ViewMoreSalesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMoreSalesInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMoreSalesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
