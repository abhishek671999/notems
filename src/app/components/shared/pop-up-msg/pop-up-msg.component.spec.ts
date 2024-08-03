import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpMsgComponent } from './pop-up-msg.component';

describe('PopUpMsgComponent', () => {
  let component: PopUpMsgComponent;
  let fixture: ComponentFixture<PopUpMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpMsgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
