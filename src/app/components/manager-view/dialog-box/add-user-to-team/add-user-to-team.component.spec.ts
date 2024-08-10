import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToTeamComponent } from './add-user-to-team.component';

describe('AddUserToTeamComponent', () => {
  let component: AddUserToTeamComponent;
  let fixture: ComponentFixture<AddUserToTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserToTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserToTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
