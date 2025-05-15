import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../envs/environment';
import { AuthService } from '../auth/auth.service';
import { Budget } from '../../models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private readonly apiUrl = environment.uploadBudget;

  constructor(private http: HttpClient, private authService: AuthService) {}

  saveBudget(budget: Budget): Observable<Budget> {    
    return this.http.post<Budget>(this.apiUrl, budget,{
      headers: this.authService.getHeaders()
    });
  }

  getBudget(): Observable<Budget> {
    return this.http.get<Budget>(this.apiUrl);
  }
}
