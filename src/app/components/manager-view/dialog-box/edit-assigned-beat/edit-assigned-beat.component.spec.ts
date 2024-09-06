import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAssignedBeatComponent } from './edit-assigned-beat.component';

describe('EditAssignedBeatComponent', () => {
  let component: EditAssignedBeatComponent;
  let fixture: ComponentFixture<EditAssignedBeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAssignedBeatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAssignedBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
