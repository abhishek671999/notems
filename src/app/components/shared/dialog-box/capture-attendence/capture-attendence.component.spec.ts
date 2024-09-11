import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureAttendenceComponent } from './capture-attendence.component';

describe('CaptureAttendenceComponent', () => {
  let component: CaptureAttendenceComponent;
  let fixture: ComponentFixture<CaptureAttendenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptureAttendenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptureAttendenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
