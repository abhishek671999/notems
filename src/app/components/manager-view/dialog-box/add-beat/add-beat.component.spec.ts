import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBeatComponent } from './add-beat.component';

describe('AddBeatComponent', () => {
  let component: AddBeatComponent;
  let fixture: ComponentFixture<AddBeatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBeatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBeatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
