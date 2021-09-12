import { TestBed } from '@angular/core/testing';

import { VersionFinderService } from './version-finder.service';

describe('VersionFinderServiceService', () => {
  let service: VersionFinderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionFinderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
