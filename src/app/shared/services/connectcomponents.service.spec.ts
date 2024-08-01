import { TestBed } from '@angular/core/testing';

import { ConnectcomponentsService } from './connectcomponents.service';

describe('ConnectcomponentsService', () => {
  let service: ConnectcomponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectcomponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
