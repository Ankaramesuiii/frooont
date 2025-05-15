import { TestBed } from '@angular/core/testing';

import { CalenderTrainingService } from './calender-training.service';

describe('CalenderTrainingService', () => {
  let service: CalenderTrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalenderTrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
