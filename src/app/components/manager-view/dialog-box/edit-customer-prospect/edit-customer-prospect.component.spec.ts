import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCustomerProspectComponent } from './edit-customer-prospect.component';

describe('EditCustomerProspectComponent', () => {
  let component: EditCustomerProspectComponent;
  let fixture: ComponentFixture<EditCustomerProspectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCustomerProspectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCustomerProspectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
