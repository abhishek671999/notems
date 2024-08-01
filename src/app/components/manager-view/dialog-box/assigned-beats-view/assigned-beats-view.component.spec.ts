import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedBeatsViewComponent } from './assigned-beats-view.component';

describe('AssignedBeatsViewComponent', () => {
  let component: AssignedBeatsViewComponent;
  let fixture: ComponentFixture<AssignedBeatsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedBeatsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedBeatsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
