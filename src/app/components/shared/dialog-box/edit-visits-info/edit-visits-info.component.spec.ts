import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVisitsInfoComponent } from './edit-visits-info.component';

describe('EditVisitsInfoComponent', () => {
  let component: EditVisitsInfoComponent;
  let fixture: ComponentFixture<EditVisitsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVisitsInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVisitsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
