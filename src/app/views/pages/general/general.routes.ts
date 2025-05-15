import { Routes } from "@angular/router";
import { authGuard } from "../../../core/guards/auth.guard";

export default [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {
    path: 'formations',
    loadComponent: () => import('./blank/blank.component').then(c => c.BlankComponent),
    canActivate: [authGuard],
    data: { roles: ['ROLE_SUPER_MANAGER', 'ROLE_MANAGER'] } // Only allow Managers
  },
  {
    path: 'voyages',
    loadComponent: () => import('./flight/flight.component').then(c => c.FlightComponent),
    canActivate: [authGuard],
    data: { roles: ['ROLE_SUPER_MANAGER', 'ROLE_MANAGER'] } // Only allow Managers
  },
  {
    path: 'budget',
    loadComponent: () => import('./budget/budget.component').then(c => c.BudgetComponent),
    canActivate: [authGuard],
    data: { roles: ['ROLE_SUPER_MANAGER', 'ROLE_MANAGER'] } // Only allow Managers
  },
  {
    path: 'faq',
    loadComponent: () => import('./faq/faq.component').then(c => c.FaqComponent)
  },
  {
    path: 'invoice',
    loadComponent: () => import('./invoice/invoice.component').then(c => c.InvoiceComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pricing/pricing.component').then(c => c.PricingComponent)
  },
  {
    path: 'timeline',
    loadComponent: () => import('./timeline/timeline.component').then(c => c.TimelineComponent)
  }
] as Routes