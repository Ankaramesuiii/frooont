import { TestBed } from '@angular/core/testing';

import { MissionService } from './mission.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MissionService', () => {
  let service: MissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
              provideHttpClientTesting()]
    });
    service = TestBed.inject(MissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
