import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptMoreInfoComponent } from './receipt-more-info.component';

describe('ReceiptMoreInfoComponent', () => {
  let component: ReceiptMoreInfoComponent;
  let fixture: ComponentFixture<ReceiptMoreInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceiptMoreInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
