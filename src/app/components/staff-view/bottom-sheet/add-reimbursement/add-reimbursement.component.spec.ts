import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReimbursementComponent } from './add-reimbursement.component';

describe('AddReimbursementComponent', () => {
  let component: AddReimbursementComponent;
  let fixture: ComponentFixture<AddReimbursementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReimbursementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReimbursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
