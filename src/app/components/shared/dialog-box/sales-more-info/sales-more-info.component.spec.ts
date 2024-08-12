import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesMoreInfoComponent } from './sales-more-info.component';

describe('SalesMoreInfoComponent', () => {
  let component: SalesMoreInfoComponent;
  let fixture: ComponentFixture<SalesMoreInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesMoreInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
