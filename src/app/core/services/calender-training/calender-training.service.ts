import { Injectable } from '@angular/core';
import { environment } from '../../../../envs/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalenderTrainingService {
  private readonly apiUrl = environment.calendarTrainingUrl; // URL for the budget API

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTraining(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.authService.getHeaders()
    });
  }
}
