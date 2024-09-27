import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementMoreInfoComponent } from './reimbursement-more-info.component';

describe('ReimbursementMoreInfoComponent', () => {
  let component: ReimbursementMoreInfoComponent;
  let fixture: ComponentFixture<ReimbursementMoreInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbursementMoreInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
