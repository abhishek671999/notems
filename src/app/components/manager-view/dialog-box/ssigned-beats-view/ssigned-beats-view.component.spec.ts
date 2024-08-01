import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SsignedBeatsViewComponent } from './ssigned-beats-view.component';

describe('SsignedBeatsViewComponent', () => {
  let component: SsignedBeatsViewComponent;
  let fixture: ComponentFixture<SsignedBeatsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SsignedBeatsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SsignedBeatsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
