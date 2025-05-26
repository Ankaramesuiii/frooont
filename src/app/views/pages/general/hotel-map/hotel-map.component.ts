// hotel-map.component.ts
import { Component, OnInit, OnDestroy, NO_ERRORS_SCHEMA, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import { SerpapiService } from '../../../../core/services/flights/serpapi.service';
import { Hotel } from '../../../../core/models/hotel.model';
import { CommonModule } from '@angular/common';
import { faStar, faMapMarkerAlt, faTag, faUtensils, faWifi, faCar, faSnowflake, faPaw, faDumbbell, faGlassMartiniAlt, faWheelchair, faChild, faCoffee, faCheck, faSmokingBan, faBed, faClock, faExpandAlt, faCompressAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ConvertPricePipe } from '../../../../core/pipes/convert-price.pipe';
import { TeamMember } from '../../../../core/models/team.member.model';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-hotel-map',
  standalone: true,
  templateUrl: './hotel-map.component.html',
  styleUrls: ['./hotel-map.component.scss'],
  imports: [CommonModule, LeafletModule, ReactiveFormsModule, NgSelectModule, FormsModule, FontAwesomeModule, RouterLink, ConvertPricePipe],
  schemas: [NO_ERRORS_SCHEMA]
})
export class HotelMapComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  hotels: Hotel[] = [];
  selectedHotel?: Hotel;
  map: any;
  markersLayer: any;
  // FontAwesome icons
  faClock = faClock;
  faBed = faBed;
  faSmokingBan = faSmokingBan;
  faUtensils = faUtensils;
  faWifi = faWifi;
  faCar = faCar;
  faSnowflake = faSnowflake;
  faPaw = faPaw;
  faDumbbell = faDumbbell;
  faGlassMartiniAlt = faGlassMartiniAlt;
  faWheelchair = faWheelchair;
  faChild = faChild;
  faCoffee = faCoffee;
  faStar = faStar;
  faMapMarkerAlt = faMapMarkerAlt;
  faTag = faTag;
  faCheck = faCheck;
  faExpandAlt = faExpandAlt;
  faCompressAlt = faCompressAlt;
  faExclamationTriangle = faExclamationTriangle;
  currencyValue: number;
  private frenchAmenityMap = [
    { french: 'Petit-déjeuner', english: 'Breakfast' },
    { french: 'Wi-Fi gratuit', english: 'Free Wi-Fi' },
    { french: 'Parking gratuit', english: 'Free parking' },
    { french: 'Climatisation', english: 'Air conditioning' },
    { french: 'Animaux acceptés', english: 'Pet-friendly' },
    { french: 'Bar', english: 'Bar' },
    { french: 'Restaurant', english: 'Restaurant' },
    { french: 'Accessible', english: 'Accessible' },
    { french: 'Adapté aux enfants', english: 'Child-friendly' },
    { french: 'Non-fumeur', english: 'Smoke-free' },
    { french: 'Salle de sport', english: 'Fitness centre' }
  ];
  orangeSites: { name: string, coords: [number, number] }[] = [
    { name: 'Orange Vélizy', coords: [48.7817, 2.2214] },
    { name: 'Orange Opéra', coords: [48.8708, 2.3314] },
    { name: 'Orange Châtillon', coords: [48.8027, 2.2921] },
    { name: 'Orange Issy-les-Moulineaux', coords: [48.8219, 2.2734] },
    { name: 'Orange Saint-Denis', coords: [48.9369, 2.3571] },
    { name: 'Orange Résonance', coords: [48.8033554, 2.3252304] },
    { name: 'Orange Marco Polo', coords: [43.6100158, 7.0166624] }
  ];
  orangeMarkers: L.Marker[] = []; // Pour garder une référence
  loading: boolean;
  isMapExpanded = false;
  error: boolean;
  teamMembers: TeamMember[] = [];
  selectTeamMembers: TeamMember[] = [];
  adress: any;

  constructor(private fb: FormBuilder, private hotelService: SerpapiService, private sanitize: DomSanitizer) {
    this.searchForm = this.fb.group({
      q: [],
      check_in_date: [new Date().toISOString().split('T')[0]],
      check_out_date: [new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]],
      teamMembers: [this.teamMembers.length]
    });
  }

  ngOnInit() {
    this.initMap();
    this.getCurrencyValueConverted();
    this.getTeamMembersName();
    //this.loadHotels();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  getCurrencyValueConverted() {
    this.hotelService.convertCurrency('EUR', 'TND').subscribe({
      next: (response) => {
        console.log('Converted amount:', response);
        this.currencyValue = response;
      },
      error: (err) => {
        this.error = true;
      }
    });
  }

  initMap() {
    this.map = L.map('map').setView([48.8033554, 2.3252304], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    this.markersLayer = L.layerGroup().addTo(this.map);
    this.markOrangeSites(); // Appelle la méthode de marquage
  }

  markOrangeSites() {
    this.orangeSites.forEach(site => {
      const marker = L.marker(site.coords, {
        icon: L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', // Tu peux changer cette icône
          iconSize: [25, 41],
          iconAnchor: [12, 41]
        })
      }).addTo(this.markersLayer).bindPopup(`<b>${site.name}</b>`);

      this.orangeMarkers.push(marker);
    });
  }


  loadHotels() {
    this.loading = true;
    this.error = false; // Reset error state on new request
    this.hotels = []; // Clear previous results

    const formValue = this.searchForm.value;
    const params = {
        q: formValue.q,
        check_in_date: formValue.check_in_date,
        check_out_date: formValue.check_out_date,
        adults: formValue.teamMembers?.length || 1
    };

    this.hotelService.searchHotels(params).subscribe({
        next: (response) => {
            this.loading = false;
            if (response?.length > 0) {
                this.hotels = response.filter(hotel => hotel.type === 'hotel');
                this.selectedHotel = this.hotels[0];
                this.updateMarkers();

                // Check if hotels[0] exists and has the property you need
                if (this.hotels[0]?.property_token) {
                    const secondParams = {
                        ...params, // Include original params
                        property_token: this.hotels[0].property_token // Add the property from the first hotel
                    };

                    this.hotelService.searchHotelsData(secondParams).subscribe({
                        next: (response) => {
                            this.adress = response.address;
                        },
                        error: (err) => {
                            console.log('Error in secondary request:', err);
                        }
                    });
                }
            } else {
                this.error = true;
                this.clearHotelMarkersOnly();
            }
        },
        error: (err) => {
            this.hotels = [];
            this.selectedHotel = undefined;
            this.loading = false;
            this.error = true;
            this.clearHotelMarkersOnly();
            console.error('Error loading hotels:', err);
        }
    });
}
  updateMarkers() {
    this.clearHotelMarkersOnly();
    this.hotels.forEach(hotel => {
      const coords: [number, number] = [hotel.gps_coordinates.latitude, hotel.gps_coordinates.longitude];

      // Créer un marqueur normal par défaut
      let marker: L.Marker;

      if (hotel === this.selectedHotel) {
        // Icône personnalisée noire seulement pour l'hôtel sélectionné
        const blackIcon = L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });
        marker = L.marker(coords, { icon: blackIcon });
      } else {
        // Utiliser l'icône par défaut de Leaflet pour les autres
        marker = L.marker(coords);
      }

      const popupContent = `
      <div class="popup-title">${hotel.name}</div>
      <div class="popup-price">${this.getConvertedPrice(hotel)} TND</div>
    `;

      marker.bindPopup(popupContent);
      marker.addTo(this.markersLayer).on('click', () => this.selectHotel(hotel));

      if (hotel === this.selectedHotel) {
        this.map.setView(coords);
        marker.openPopup();
      }
    });
  }

  onSearch() {
    this.loadHotels();
  }

  selectHotel(hotel: Hotel) {
    this.selectedHotel = hotel;
    const coords: [number, number] = [hotel.gps_coordinates.latitude, hotel.gps_coordinates.longitude];
    const formValue = this.searchForm.value;
    const params = {
      q: formValue.q,
      check_in_date: formValue.check_in_date,
      check_out_date: formValue.check_out_date,
      adults: formValue.teamMembers?.length,
      property_token: hotel.property_token
    };
    this.hotelService.searchHotelsData(params).subscribe({
      next: (response) => {
        this.adress = response.address
      },
      error: (err) => {
       console.log(err);
       
      }
    });
    this.map.setView(coords, 14);
    this.updateMarkers();
  }

  getStarsArray(stars: number): any[] {
    console.log(stars);

    return Array(stars).fill(0);
  }

  showPreview(event: MouseEvent) {
    const container = event.target as HTMLElement;
    const preview = container.closest('.image-container')?.querySelector('.image-preview') as HTMLElement;

    if (preview) {
      const rect = container.getBoundingClientRect();
      preview.style.left = `${rect.left + rect.width / 2 - 150}px`;
      preview.style.top = `${rect.top - 210}px`;
      preview.style.display = 'block';
    }
  }

  hidePreview(event: MouseEvent) {
    const container = event.target as HTMLElement;
    const preview = container.closest('.image-container')?.querySelector('.image-preview') as HTMLElement;

    if (preview) {
      setTimeout(() => {
        if (!preview.matches(':hover')) {
          preview.style.display = 'none';
        }
      }, 100);
    }
  }

  handleImageError(event: Event) {
    console.log(event);
  }


  getSafeImageUrl(url: string) {
    return this.sanitize.sanitize(SecurityContext.URL, url) || '';;
  }

  getAmenitiesList(): string[] {
    return this.selectedHotel?.amenities || [];
  }

  getAmenityIcon(amenity: string) {
    // First normalize the amenity string
    const normalizedAmenity = amenity.toLowerCase().trim();

    // Check French mappings
    const frenchMapping = this.frenchAmenityMap.find(m =>
      normalizedAmenity.includes(m.french.toLowerCase())
    );
    const englishAmenity = frenchMapping ? frenchMapping.english : amenity;

    // Icon mappings
    const iconMappings = [
      { match: ['breakfast', 'café', 'coffee'], icon: this.faCoffee },
      { match: ['wi-fi', 'wifi', 'internet'], icon: this.faWifi },
      { match: ['parking', 'car'], icon: this.faCar },
      { match: ['air conditioning', 'ac', 'climatisation'], icon: this.faSnowflake },
      { match: ['pet', 'animal', 'dog', 'cat'], icon: this.faPaw },
      { match: ['fitness', 'gym', 'sport'], icon: this.faDumbbell },
      { match: ['bar', 'pub', 'drink'], icon: this.faGlassMartiniAlt },
      { match: ['restaurant', 'food', 'dining'], icon: this.faUtensils },
      { match: ['accessible', 'handicap', 'wheelchair'], icon: this.faWheelchair },
      { match: ['child', 'kid', 'family', 'enfant'], icon: this.faChild },
      { match: ['smoke-free', 'non-smoking', 'no smoking'], icon: this.faSmokingBan }
    ];

    // Find matching icon
    const matchedIcon = iconMappings.find(mapping =>
      mapping.match.some(keyword =>
        englishAmenity.toLowerCase().includes(keyword)
      )
    );

    return matchedIcon ? matchedIcon.icon : this.faBed;
  }

  getCleanPrice(price: string): number {
    // Remove any non-numeric characters (except for the decimal point)
    return parseFloat(price.replace(/\$|\s/g, ''));
  }

  getConvertedPrice(hotel: Hotel): number {
    return parseFloat((this.getCleanPrice(hotel.total_rate.lowest) * this.currencyValue).toFixed(2));
  }

  clearHotelMarkersOnly() {
    this.markersLayer.eachLayer((layer: L.Layer) => {
      const popup = (layer as any)._popup;
      if (popup && popup.getContent() && !popup.getContent().includes('Orange')) {
        this.markersLayer.removeLayer(layer);
      }
    });
  }
  get filteredHotels(): Hotel[] {
    return this.hotels.filter(h => h.type === 'hotel');
  }

  toggleMapSize() {
    this.isMapExpanded = !this.isMapExpanded;
    setTimeout(() => {
      this.map.invalidateSize(); // important pour que Leaflet redessine correctement
    }, 300);
  }

  getTeamMembersName(): void {
    this.hotelService.getTeamMemberName().subscribe({
      next: (response) => {

        this.teamMembers = Array.isArray(response?.teamMembers)
          ? response?.teamMembers.map((member: TeamMember) => ({
            id: member.id,
            name: member.name,
            email: member.email,
          }))
          : [];
        console.log('Team members:', this.teamMembers);


      },
      error: (err) => {
        this.error = true;
      }
    });
  }
}

