import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HotelMapComponent } from './hotel-map.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('HotelMapComponent', () => {
  let component: HotelMapComponent;
  let fixture: ComponentFixture<HotelMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelMapComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NgbActiveModal,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}), // Simule les paramètres d'URL
            queryParams: of({}), // Simule les query params si utilisés
            snapshot: {
              paramMap: {
                get: () => null,
              },
              queryParamMap: {
                get: () => null,
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HotelMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
