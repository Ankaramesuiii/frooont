import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BudgetComponent } from './budget.component';
import { provideHttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

describe('BudgetComponent', () => {
  let component: BudgetComponent;
  let fixture: ComponentFixture<BudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetComponent, RouterModule.forRoot([])],
      providers: [provideHttpClient(), // Provide the HttpClient along with HttpClientTesting
      provideHttpClientTesting()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
