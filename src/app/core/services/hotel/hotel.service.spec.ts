import { TestBed } from '@angular/core/testing';

import { HotelService } from './hotel.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HotelService', () => {
  let service: HotelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
                    provideHttpClientTesting()]
    });
    service = TestBed.inject(HotelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
