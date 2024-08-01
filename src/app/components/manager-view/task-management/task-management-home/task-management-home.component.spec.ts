import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskManagementHomeComponent } from './task-management-home.component';

describe('TaskManagementHomeComponent', () => {
  let component: TaskManagementHomeComponent;
  let fixture: ComponentFixture<TaskManagementHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskManagementHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskManagementHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
