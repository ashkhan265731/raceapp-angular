import { TestBed, inject } from '@angular/core/testing';

import { PostFormDataService } from './post-form-data.service';

describe('PostFormDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostFormDataService]
    });
  });

  it('should be created', inject([PostFormDataService], (service: PostFormDataService) => {
    expect(service).toBeTruthy();
  }));
});
