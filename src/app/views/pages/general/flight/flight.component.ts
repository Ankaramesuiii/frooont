import { Component, OnInit } from '@angular/core';
import { SerpapiService } from '../../../../core/services/flights/serpapi.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Flight } from '../../../../core/models/flight.model';
import { FlightSearchParams } from '../../../../core/models/flight.search.params.model';
import { FlightSearchResponse } from '../../../../core/models/flight.search.response.model';
import { RouterLink } from '@angular/router';
import { forkJoin, Observable, switchMap } from 'rxjs';
import { TeamMember } from '../../../../core/models/team.member.model';
import { NgSelectModule } from '@ng-select/ng-select';
import { buildMissionFromFlightResponse } from '../../../../core/services/flights/build.mission.from.flight.response';
import { MissionService } from '../../../../core/services/flights/mission.service';
import Swal from 'sweetalert2';
import { MissionModalComponent } from './mission-modal/mission-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-flight',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NgSelectModule,
    MissionModalComponent,
    MatExpansionModule,
  ],
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.scss'],
  providers: [DatePipe]
})
export class FlightComponent implements OnInit {
  today: string;
  searchParams = {
    departureId: '',
    arrivalId: '',
    outboundDate: new Date().toISOString().split('T')[0],
    returnDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    adults: 1,
  };

  flights: Flight[] = [];
  returnFlights: Flight[] = [];
  loading = false;

  error: string | null = null;
  isOneWay = false;
  selectedOutboundFlight: Flight | null = null;
  combinedFlights: any[] = [];
  departureSuggestions: any[] = [];
  arrivalSuggestions: any[] = [];
  accessToken: any;
  teamMembers: TeamMember[] = [];
  selectTeamMembers: TeamMember[] = [];
  currencyValue: number;
  showModal: boolean;
  private readonly TUNISIAN_AIRPORTS = [
    { name: 'Tunis–Carthage International Airport', iataCode: 'TUN' },
    { name: 'Monastir Habib Bourguiba International Airport', iataCode: 'MIR' },
    { name: 'Enfidha–Hammamet International Airport', iataCode: 'NBE' },
    { name: 'Djerba–Zarzis International Airport', iataCode: 'DJE' },
  ];
  returnFlightsMap: Map<string, Flight[]> = new Map(); // Keyed by outbound.flight_id or some unique field
  selectedFlight: any;
isAccordionOpen: boolean = false;
  constructor(
    private flightService: SerpapiService,
    private datePipe: DatePipe,
    private missionService: MissionService
  ) { }

  ngOnInit(): void {
    this.getTeamMembersName();
    this.getCurrencyValueConverted();
    this.today = new Date().toISOString().split('T')[0];
  }

  getCurrencyValueConverted() {
    this.flightService.convertCurrency('EUR', 'TND').subscribe({
      next: (response) => {
        console.log('Converted amount:', response);
        this.currencyValue = response;
      },
      error: (err) => {
        this.error = 'Échec de la conversion de la devise. Veuillez réessayer.';
      }
    });
  }

  searchFlights(): void {
    if (!this.searchParams.departureId || !this.searchParams.arrivalId) {
      this.error = 'Veuillez sélectionner les aéroports de départ et d’arrivée.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.flights = [];
    this.returnFlights = [];
    this.combinedFlights = [];
    this.selectedOutboundFlight = null;

    const params: FlightSearchParams = {
      departure_id: this.searchParams.departureId,
      arrival_id: this.searchParams.arrivalId,
      outbound_date: this.searchParams.outboundDate,
      adults: this.selectTeamMembers.length,
      type: this.isOneWay ? 2 : 1
    };

    if (!this.isOneWay && this.searchParams.returnDate) {
      params.return_date = this.searchParams.returnDate;
    }

    this.flightService.searchFlights(params).subscribe({
      next: (response) => {
        this.processFlightResponse(response);
      },
      error: (err) => {
        this.handleFlightError(err);
      }
    });
  }

  private processFlightResponse(response: FlightSearchResponse): void {
    if ((!response.best_flights || response.best_flights.length === 0) &&
      (!response.other_flights || response.other_flights.length === 0)) {
      this.error = 'Aucun vol disponible...';
      this.flights = [];
      this.returnFlights = [];
      this.loading = false;
      return;
    }

    this.flights = this.getAllFlights(response);

    if (this.flights.length === 0) {
      this.error = 'Aucun vol ne correspond...';
      this.loading = false;
      return;
    }

    if (!this.isOneWay) {
      const flightsWithToken = this.flights.filter(f => f.departure_token);

      if (flightsWithToken.length === 0) {
        this.error = 'Aucune option de retour...';
        this.loading = false;
        return;
      }

      const requests = flightsWithToken
        .filter(flight => flight.departure_token)
        .map(flight => this.searchReturnFlights(flight.departure_token!));
      console.log('requests', requests);

      forkJoin(requests).subscribe({
        next: (responses) => {
          const flightsWithToken = this.flights.filter(f => f.departure_token);

          responses.forEach((resp, index) => {
            const outbound = flightsWithToken[index];
            const returns = this.getAllFlights(resp);
            this.returnFlightsMap.set(outbound.departure_token ?? '', returns); // assuming each outbound has a unique id
          });

          this.combineFlights();
          this.loading = false;
        },

        error: (err) => {
          this.handleReturnFlightError(err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  private searchReturnFlights(departureToken: string): Observable<FlightSearchResponse> {
    const params: FlightSearchParams = {
      departure_id: this.searchParams.departureId,
      arrival_id: this.searchParams.arrivalId,
      outbound_date: this.searchParams.outboundDate,
      adults: this.selectTeamMembers.length,
      departure_token: departureToken,
      type: this.isOneWay ? 2 : 1,
      return_date: this.searchParams.returnDate
    };

    return this.flightService.searchFlights(params);
  }


  private handleFlightError(err: any): void {
    this.error = 'Échec de la récupération des données de vol. Veuillez réessayer.';
    this.loading = false;
  }

  private handleReturnFlightError(err: any): void {
    this.error = 'Échec de la récupération des données de vol de retour. Veuillez réessayer.';
    this.loading = false;
  }

  private combineFlights(): void {
    this.combinedFlights = [];

    this.flights.forEach(outbound => {
      const matchedReturns = this.returnFlightsMap.get(outbound.departure_token ?? '') || [];

      matchedReturns.forEach(returnFlight => {
        this.combinedFlights.push({
          outbound,
          return: returnFlight,
          totalPrice: Math.max(outbound.price, returnFlight.price), // or Math.max() depending on use case
        });
      });
    });

    this.combinedFlights.sort((a, b) => a.totalPrice - b.totalPrice);
  }


  private getAllFlights(response: FlightSearchResponse): Flight[] {
    const flights = [
      ...(response.best_flights || []).map(f => ({ ...f, type: 'best' })),
      ...(response.other_flights || []).map(f => ({ ...f, type: 'other' }))
    ];
    flights.forEach(flight => {
      // multiply price by currency value
      flight.price = flight.price * this.currencyValue;
    });

    console.log('All flights:', flights);

    // Remove duplicates by flight number and price
    return flights.filter((flight, index, self) =>
      index === self.findIndex(f =>
        f.flights[0]?.flight_number === flight.flights[0]?.flight_number &&
        f.price === flight.price
      )
    );
  }

  onMissionCreated(mission: any): void {
    // Handle the created mission
    console.log('Mission created from parent:', mission);
    // You might want to navigate or update the UI
  }
  openMissionModal(flight: any): void {
    this.showModal = true;
    this.selectedFlight = flight;
  }

  onOneWayChange(): void {
    if (this.isOneWay) {
      this.searchParams.returnDate = '';
    } else {
      const returnDate = new Date(this.searchParams.outboundDate);
      returnDate.setDate(returnDate.getDate() + 7);
      this.searchParams.returnDate = this.getFormattedDate(returnDate);
    }
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'shortTime') || '';
  }

  private getFormattedDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getAccessToken() {
    this.flightService.getAccessToken().subscribe({
      next: (response) => {
        this.accessToken = response.access_token;

      },
      error: (err) => {
        this.error = 'Failed to connect to flight service. Please try again later.';
      }
    });
  }

  onSearch(query: string, type: 'departure' | 'arrival'): void {
    if (query.length < 3) return;

    const matchedAirports = this.TUNISIAN_AIRPORTS.filter(airport =>
      airport.name.toLowerCase().includes(query.toLowerCase()) ||
      airport.iataCode.toLowerCase().includes(query.toLowerCase())
    );

    if (matchedAirports.length > 0) {
      // Found local matches (e.g., Tunisian airports)
      if (type === 'departure') {
        this.departureSuggestions = matchedAirports;
      } else {
        this.arrivalSuggestions = matchedAirports;
      }
    } else {
      // Fetch token and then call the API
      this.flightService.getAccessToken().pipe(
        switchMap((response) => {
          const token = response.access_token;
          return this.flightService.searchAirports(token, query);
        })
      ).subscribe({
        next: (data) => {
          if (type === 'departure') {
            this.departureSuggestions = data;
          } else {
            this.arrivalSuggestions = data;
          }
        },
        error: (error) => {
          this.error = 'Failed to fetch airport suggestions. Please try again later.';
        }
      });
    }
  }

  getTeamMembersName(): void {
    this.flightService.getTeamMemberName().subscribe({
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
        this.error = 'Un erreur s\'est produite lors de la récupération des membres de l\'équipe.';
      }
    });
  }

  onSelectLocation(location: any, type: 'departure' | 'arrival'): void {
    if (type === 'departure') {
      this.searchParams.departureId = location.iataCode;
      this.departureSuggestions = [];
    } else {
      this.searchParams.arrivalId = location.iataCode;
      this.arrivalSuggestions = [];
    }
  }
}