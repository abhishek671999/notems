import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveStatusUpdateComponent } from './leave-status-update.component';

describe('LeaveStatusUpdateComponent', () => {
  let component: LeaveStatusUpdateComponent;
  let fixture: ComponentFixture<LeaveStatusUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveStatusUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveStatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
