import { TestBed, inject } from '@angular/core/testing';

import { SyncHttpService } from './sync-http.service';

describe('SyncHttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SyncHttpService]
    });
  });

  it('should be created', inject([SyncHttpService], (service: SyncHttpService) => {
    expect(service).toBeTruthy();
  }));
});
