import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributorOptionsComponent } from './distributor-options.component';

describe('DistributorOptionsComponent', () => {
  let component: DistributorOptionsComponent;
  let fixture: ComponentFixture<DistributorOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributorOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributorOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
