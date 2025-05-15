import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../envs/environment';
import { AuthService } from '../auth/auth.service';
import { Profile } from '../../models/prodile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileUrl = environment.profileUrl; // Replace with your backend endpoint

  constructor(private http: HttpClient,private authService: AuthService) { }

  // Fetch user profile data from the backend
  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(this.profileUrl,{
      headers: this.authService.getHeaders()
    });
  }
}
