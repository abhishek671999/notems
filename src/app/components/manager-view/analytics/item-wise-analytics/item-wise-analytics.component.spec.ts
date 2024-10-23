import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemWiseAnalyticsComponent } from './item-wise-analytics.component';

describe('ItemWiseAnalyticsComponent', () => {
  let component: ItemWiseAnalyticsComponent;
  let fixture: ComponentFixture<ItemWiseAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemWiseAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemWiseAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
