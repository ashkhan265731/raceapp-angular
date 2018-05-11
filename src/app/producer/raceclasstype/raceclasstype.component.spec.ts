import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaceclasstypeComponent } from './raceclasstype.component';

describe('RaceclasstypeComponent', () => {
  let component: RaceclasstypeComponent;
  let fixture: ComponentFixture<RaceclasstypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaceclasstypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaceclasstypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
