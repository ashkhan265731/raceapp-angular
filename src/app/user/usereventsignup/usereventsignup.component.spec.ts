import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsereventsignupComponent } from './usereventsignup.component';

describe('UsereventsignupComponent', () => {
  let component: UsereventsignupComponent;
  let fixture: ComponentFixture<UsereventsignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsereventsignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsereventsignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
