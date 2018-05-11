import { TestBed, inject } from '@angular/core/testing';

import { UserCheckLogintypeService } from './user-check-logintype.service';

describe('UserCheckLogintypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserCheckLogintypeService]
    });
  });

  it('should be created', inject([UserCheckLogintypeService], (service: UserCheckLogintypeService) => {
    expect(service).toBeTruthy();
  }));
});
