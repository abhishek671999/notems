import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendenceMoreInfoComponent } from './attendence-more-info.component';

describe('AttendenceMoreInfoComponent', () => {
  let component: AttendenceMoreInfoComponent;
  let fixture: ComponentFixture<AttendenceMoreInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendenceMoreInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendenceMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
