import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRegistereduserDetailsComponent } from './single-registereduser-details.component';

describe('SingleRegistereduserDetailsComponent', () => {
  let component: SingleRegistereduserDetailsComponent;
  let fixture: ComponentFixture<SingleRegistereduserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleRegistereduserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRegistereduserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
