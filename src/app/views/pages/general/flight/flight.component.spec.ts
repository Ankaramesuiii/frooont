import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightComponent } from './flight.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

describe('FlightComponent', () => {
  let component: FlightComponent;
  let fixture: ComponentFixture<FlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightComponent,RouterModule.forRoot([]),
    ],
       providers: [provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
              provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
