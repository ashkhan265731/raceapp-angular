import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportByEventCategoryComponent } from './user-report-by-event-category.component';

describe('UserReportByEventCategoryComponent', () => {
  let component: UserReportByEventCategoryComponent;
  let fixture: ComponentFixture<UserReportByEventCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserReportByEventCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReportByEventCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
