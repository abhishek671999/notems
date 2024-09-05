import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayLumpsumComponent } from './pay-lumpsum.component';

describe('PayLumpsumComponent', () => {
  let component: PayLumpsumComponent;
  let fixture: ComponentFixture<PayLumpsumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayLumpsumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayLumpsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
