import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestUserPaymentComponent } from './guest-user-payment.component';

describe('GuestUserPaymentComponent', () => {
  let component: GuestUserPaymentComponent;
  let fixture: ComponentFixture<GuestUserPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestUserPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestUserPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
