import { TestBed } from '@angular/core/testing';

import { DataService } from './dataService.service';

describe('ConnectcomponentsService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
