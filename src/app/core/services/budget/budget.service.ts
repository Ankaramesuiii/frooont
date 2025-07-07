import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../envs/environment';
import { AuthService } from '../auth/auth.service';
import { Budget } from '../../models/budget.model';
import { BudgetSubmissionDTO } from '../../models/BudgetSubmissionDTO.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private readonly apiUrl = environment.uploadBudget;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Upload budgets for a specific year
   * @param payload Budget submission data including year and budget amounts
   */
  uploadBudgets(payload: BudgetSubmissionDTO): Observable<any> {
    // Convert Map to plain object for JSON serialization
    const requestPayload = {
      year: payload.year,
      budgets: this.mapToObject(payload.budgets)
    };

    return this.http.post(`${this.apiUrl}`, requestPayload, {
      headers: this.authService.getHeaders()
    });
  }

  /**
   * Get budgets for the current user
   * @param year Optional year filter
   */
  getBudgets(year?: number): Observable<Budget[]> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year.toString());
    }

    return this.http.get<Budget[]>(this.apiUrl, {
      headers: this.authService.getHeaders(),
      params
    });
  }

  /**
   * Helper to convert Map to plain object
   */
  private mapToObject(map: Map<string, number>): { [key: string]: number } {
    const obj: { [key: string]: number } = {};
    map.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }
}
