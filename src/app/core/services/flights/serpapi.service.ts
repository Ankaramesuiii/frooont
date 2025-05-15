import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../../envs/environment';
import { FlightSearchParams } from '../../models/flight.search.params.model';
import { FlightSearchResponse } from '../../models/flight.search.response.model';
import { amadeus } from '../../../../envs/env.amadeus';
import { TeamMember } from '../../models/team.member.model';
@Injectable({
  providedIn: 'root'
})
export class SerpapiService {
  private readonly api = environment.serpApiUrl;
  private readonly teamMembersNameUrl = environment.teamMembersNameUrl;
  private readonly AMADEUS_API_URL = 'https://test.api.amadeus.com/v1/reference-data/locations';
  private accessToken: string | null = null;
  private clientId = amadeus.apiKey;
  private clientSecret = amadeus.apiSecret;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }


  getAccessToken(): Observable<any> {
    const body = new HttpParams()
      .set('grant_type', 'client_credentials')
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret);

    return this.http.post(amadeus.getTokenUrl, body);
  }
  searchFlights(params: FlightSearchParams): Observable<FlightSearchResponse> {
    let httpParams = new HttpParams()
      .set('engine', 'google_flights')
      .set('departure_id', params.departure_id)
      .set('arrival_id', params.arrival_id)
      .set('outbound_date', params.outbound_date)
      .set('adults', params.adults.toString())
      .set('type', params.type.toString())
      .set('currency', 'EUR')
      .set('gl', 'us')
      .set('hl', 'en');

    if (params.return_date) {
      httpParams = httpParams.set('return_date', params.return_date);
    }

    if (params.departure_token) {
      httpParams = httpParams.set('departure_token', params.departure_token);
    }

    return this.http.get<FlightSearchResponse>(this.api, {
      params: httpParams,
      headers: this.authService.getHeaders()
    });
  }

  searchAirports(token: string, query: string): Observable<any[]> {
    return this.http.get<any>(this.AMADEUS_API_URL, {
      params: {
        subType: 'AIRPORT',
        keyword: query,
        'page[limit]': '10'
      },
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map((response: any) => response.data || [])
    );
  }

  convertCurrency(from: string, to: string): Observable<number> {
    const url = `https://api.currencyapi.com/v3/latest?base_currency=${from}&currencies=${to}`;

    return this.http.get<any>(url, {
      headers: {
        'apikey': environment.exchangerateApiKey
      }
    }).pipe(
      map(response => {
        // Extract the exchange rate from response.data.TND.value
        const rate = response.data[to]?.value;

        if (!rate) {
          throw new Error(`Exchange rate for ${to} not found`);
        }

        // Calculate and return the converted amount
        return rate;
      }),
      catchError(error => {
        console.error('Currency conversion error:', error);
        throw new Error('Failed to convert currency. Please try again.');
      })
    );
  }


  getTeamMemberName(): Observable<any> {
    return this.http.get<any>(`${this.teamMembersNameUrl}`, {
      headers: this.authService.getHeaders()
    });
  }
}