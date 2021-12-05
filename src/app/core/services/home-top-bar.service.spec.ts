import { TestBed } from '@angular/core/testing';

import { HomeTopBarService } from './home-top-bar.service';

describe('HomeTopBarService', () => {
  let service: HomeTopBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeTopBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
