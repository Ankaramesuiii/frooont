import { TestBed } from '@angular/core/testing';

import { SerpapiService } from './serpapi.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SerpapiService', () => {
  let service: SerpapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
              provideHttpClientTesting()]
    });
    service = TestBed.inject(SerpapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
