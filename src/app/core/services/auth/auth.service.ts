import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from '../../../../envs/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = environment.authUrl;

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<string> {
    return this.http.post(this.apiUrl + 'login', credentials, { responseType: 'text' }).pipe(
      tap((response: any) => {
        const token = response as string; 
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('isLoggedin', 'true');
          this.decodeTokenAndStoreRoles(token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('tokenExpiration');
    localStorage.setItem('isLoggedin', 'false');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token || this.isTokenExpired(token)) {
      return false;
    }
    return true;
  }

  showExpiryMessage() {
    Swal.fire({
      title: 'Session expirée',
      text: 'Veuillez vous reconnecter',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Login',
    }).then(() => {
      this.logout(); // Log the user out after showing the message
    });
  }

  public getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token || this.isTokenExpired(token)) {
      this.logout(); // Log out if token is expired or missing
      return new HttpHeaders(); // Return empty headers to prevent unauthorized requests
    }
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  private decodeTokenAndStoreRoles(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.roles) {
        localStorage.setItem('userRoles', JSON.stringify(payload.roles));
      }
      localStorage.setItem('tokenExpiration', payload.exp.toString()); // Store expiration timestamp
    } catch (error) {
      this.logout();
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      const expiration = tokenExpiration ? Number(tokenExpiration) * 1000 : 0; // Convert to milliseconds
      return Date.now() > expiration; // If current time is greater than expiration, return true
    } catch (error) {
      return true; // In case of error, assume token is invalid/expired
    }
  }

  hasRole(role: string): boolean {
    const roles = localStorage.getItem('userRoles');
    
    if (!roles) return false;
    return JSON.parse(roles).includes(role);
  }
}
