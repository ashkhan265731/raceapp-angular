import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUsereventsignupComponent } from './edit-usereventsignup.component';

describe('EditUsereventsignupComponent', () => {
  let component: EditUsereventsignupComponent;
  let fixture: ComponentFixture<EditUsereventsignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUsereventsignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUsereventsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
