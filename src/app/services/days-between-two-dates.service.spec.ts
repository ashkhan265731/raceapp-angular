import { TestBed, inject } from '@angular/core/testing';

import { DaysBetweenTwoDatesService } from './days-between-two-dates.service';

describe('DaysBetweenTwoDatesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DaysBetweenTwoDatesService]
    });
  });

  it('should be created', inject([DaysBetweenTwoDatesService], (service: DaysBetweenTwoDatesService) => {
    expect(service).toBeTruthy();
  }));
});
