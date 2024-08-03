import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendenceTrackerComponent } from './attendence-tracker.component';

describe('AttendenceTrackerComponent', () => {
  let component: AttendenceTrackerComponent;
  let fixture: ComponentFixture<AttendenceTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendenceTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendenceTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
