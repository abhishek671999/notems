import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientManagementHomeComponent } from './client-management-home.component';

describe('ClientManagementHomeComponent', () => {
  let component: ClientManagementHomeComponent;
  let fixture: ComponentFixture<ClientManagementHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientManagementHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientManagementHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
