import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignBeatComponent } from './assign-beat.component';

describe('AssignBeatComponent', () => {
  let component: AssignBeatComponent;
  let fixture: ComponentFixture<AssignBeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignBeatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
