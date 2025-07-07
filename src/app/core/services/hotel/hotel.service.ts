import { Injectable } from '@angular/core';
import { Hotel, HotelDto } from '../../models/hotel.model';
import { TeamMember } from '../../models/team.member.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HotelService {

  private nominatimUrl = 'https://nominatim.openstreetmap.org/reverse';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAddressFromCoords(lat: number, lon: number): Observable<string> {
    return this.http
      .get<any>(`${this.nominatimUrl}?format=json&lat=${lat}&lon=${lon}`)
      .pipe(
        map((response) => {
          return response.display_name || 'Address not found';
        })
      );
  }

  mapHotelToDTO(hotel: any, teamMembers: Array<TeamMember>, dateIn: string, dateOut: string): Observable<HotelDto> {
    return this.getAddressFromCoords(hotel.gps_coordinates.latitude, hotel.gps_coordinates.longitude).pipe(
      map(address => ({
        name: hotel.name,
        address: address,
        checkIn: dateIn,
        checkOut: dateOut,
        cost: this.getConvertedPrice(hotel),
        teamMemberIds: teamMembers.map(member => member.id).join(',')
      }))
    );
  }


  getConvertedPrice(hotel: Hotel): number {
    const currencyValueStr = localStorage.getItem("currencyValue");
    const currencyValue = currencyValueStr ? parseFloat(currencyValueStr) : 3.5;
    const cleanPrice = this.getCleanPrice(hotel?.total_rate?.lowest);
    return parseFloat((cleanPrice * currencyValue).toFixed(2));
  }

  getCleanPrice(price: string): number {
    // Remove any non-numeric characters (except for the decimal point)
    return parseFloat(price?.replace(/\$|\s/g, ''));
  }

  assignSharedHotel(request: HotelDto): Observable<any> {
    return this.http.post('/api/hotels', request, {
      headers: this.authService.getHeaders()
    });
  }

}
