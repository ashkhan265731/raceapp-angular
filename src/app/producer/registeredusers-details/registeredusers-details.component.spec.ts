import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteredusersDetailsComponent } from './registeredusers-details.component';

describe('RegisteredusersDetailsComponent', () => {
  let component: RegisteredusersDetailsComponent;
  let fixture: ComponentFixture<RegisteredusersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteredusersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredusersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
