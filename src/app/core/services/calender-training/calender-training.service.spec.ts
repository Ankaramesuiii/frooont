import { TestBed } from '@angular/core/testing';

import { CalenderTrainingService } from './calender-training.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('CalenderTrainingService', () => {
  let service: CalenderTrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
              provideHttpClientTesting()]
    });
    service = TestBed.inject(CalenderTrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
