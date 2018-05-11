import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupGuestUsersComponent } from './signup-guest-users.component';

describe('SignupGuestUsersComponent', () => {
  let component: SignupGuestUsersComponent;
  let fixture: ComponentFixture<SignupGuestUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupGuestUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupGuestUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
