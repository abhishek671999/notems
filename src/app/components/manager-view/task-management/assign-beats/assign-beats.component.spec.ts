import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignBeatsComponent } from './assign-beats.component';

describe('AssignBeatsComponent', () => {
  let component: AssignBeatsComponent;
  let fixture: ComponentFixture<AssignBeatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignBeatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignBeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
