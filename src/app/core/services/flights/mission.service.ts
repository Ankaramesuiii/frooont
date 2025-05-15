
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../envs/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private apiUrl = environment.missionUrl; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  createMission(mission: any): Observable<any> {
    return this.http.post(this.apiUrl,mission, {
      headers: this.authService.getHeaders()
    });
  }
}