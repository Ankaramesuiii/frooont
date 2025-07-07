import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HotelMapModalComponent } from './hotel-map-modal.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Hotel } from '../../../../../core/models/hotel.model';
import { TeamMember } from '../../../../../core/models/team.member.model';

describe('HotelMapModalComponent', () => {
  let component: HotelMapModalComponent;
  let fixture: ComponentFixture<HotelMapModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelMapModalComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NgbActiveModal
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HotelMapModalComponent);
    component = fixture.componentInstance;

    // ✅ Objet `Hotel` complet avec données mock
    component.hotel = {
      name: 'Hotel Test',
      type: 'Luxury',
      gps_coordinates: {
        latitude: 48.8566,
        longitude: 2.3522
      },
      images: [
        {
          thumbnail: 'thumb.jpg',
          original_image: 'original.jpg'
        }
      ],
      rating: 4.5,
      amenities: ['WiFi', 'Spa', 'Gym'],
      check_in_time: '14:00',
      check_out_time: '12:00',
      address: '123 Avenue des Champs-Élysées',
      total_rate: {
        lowest: '$200',
        currency: 'USD'
      },
      rate_per_night: {
        lowest: '$200',
        currency: 'USD'
      }
    } as Hotel;

    // ✅ Liste de membres d'équipe conforme
    component.teamMembers = [
      {
        id: '1',
        name: 'Alice Dupont',
        email: 'alice@example.com'
      },
      {
        id: '2',
        name: 'Bob Martin',
        email: 'bob@example.com'
      }
    ] as TeamMember[];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
