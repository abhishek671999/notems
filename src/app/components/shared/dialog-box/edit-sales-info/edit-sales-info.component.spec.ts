import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSalesInfoComponent } from './edit-sales-info.component';

describe('EditSalesInfoComponent', () => {
  let component: EditSalesInfoComponent;
  let fixture: ComponentFixture<EditSalesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSalesInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSalesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
