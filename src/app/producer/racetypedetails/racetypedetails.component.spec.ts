import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RacetypedetailsComponent } from './racetypedetails.component';

describe('RacetypedetailsComponent', () => {
  let component: RacetypedetailsComponent;
  let fixture: ComponentFixture<RacetypedetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RacetypedetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RacetypedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
