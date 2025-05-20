import { TestBed } from '@angular/core/testing';

import { UploadService } from './upload.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
              provideHttpClientTesting()]
    });
    service = TestBed.inject(UploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
