import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserEventDetailsComponent } from './edit-user-event-details.component';

describe('EditUserEventDetailsComponent', () => {
  let component: EditUserEventDetailsComponent;
  let fixture: ComponentFixture<EditUserEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
