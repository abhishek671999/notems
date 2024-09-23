import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePendingAmountComponent } from './update-pending-amount.component';

describe('UpdatePendingAmountComponent', () => {
  let component: UpdatePendingAmountComponent;
  let fixture: ComponentFixture<UpdatePendingAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePendingAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePendingAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
