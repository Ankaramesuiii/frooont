import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../envs/environment';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private apiUrlUpload = environment.uploadData; 

  constructor(private http: HttpClient, private authService: AuthService) {}


  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${this.apiUrlUpload}import`, formData, {
      headers: this.authService.getHeaders(),
    }).pipe(
      tap({
        error: (err) => {
          if (err.status === 401) {
            this.authService.logout(); // Logout if token is expired or invalid
          }
        }
      })
    );
  }
  
}
