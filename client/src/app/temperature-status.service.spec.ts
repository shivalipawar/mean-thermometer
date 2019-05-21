import { TestBed, inject } from '@angular/core/testing';

import { TemperatureStatusService } from './temperature-status.service';

describe('TemperatureStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemperatureStatusService]
    });
  });

  it('should be created', inject([TemperatureStatusService], (service: TemperatureStatusService) => {
    expect(service).toBeTruthy();
  }));
});
