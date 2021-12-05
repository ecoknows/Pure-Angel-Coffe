import { TestBed } from '@angular/core/testing';

import { HomeSideBarService } from './home-side-bar.service';

describe('HomeSideBarService', () => {
  let service: HomeSideBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeSideBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
