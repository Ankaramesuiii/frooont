import { HttpClient } from '@angular/common/http';
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

  uploadFileWithYear(file: File, year: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('year', year.toString());

    return this.http.post(`${this.apiUrlUpload}import`, formData, {
      headers: this.authService.getHeaders(), // Assumes these are NOT 'Content-Type': 'application/json'
    }).pipe(
      tap({
        error: (err) => {
          if (err.status === 401) {
            this.authService.logout();
          }
        }
      })
    );
  }
}
